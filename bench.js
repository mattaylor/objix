// Runs under both `node bench.js` and `bun bench.js`. Keep this file CommonJS:
// an ESM `import` here is what previously forced a per-interpreter edit. Both
// runtimes resolve `node:assert` via require, and both expose `performance` as
// a global, so no perf_hooks import is needed.
//
// assert must be required BEFORE objix. Bun builds its node:assert shim by
// probing prototype methods and branching on `Symbol.iterator in result`, which
// objix's @@iterator on Object.prototype sends down a path that throws. Loading
// it first sidesteps that; lodash and hdr-histogram-js are not order sensitive.
const assert = require('node:assert')

require('./objix')
const _ = require('lodash')
const hdr = require('hdr-histogram-js')

const size = +(process.argv[2] || 10)    // test object size and complexity - see build()
const iters = +(process.argv[3] || 100) // executions per timed batch
const heats = +(process.argv[4] || 100)   // randomised batches per implementation

const round = (v, p = 2) => Math.round(v * (10 ** p)) / (10 ** p)
const pct = (a, b) => a && b ? round(100 * (a - b) / b) : undefined

// ---------------------------------------------------------------------------
// The test object
// ---------------------------------------------------------------------------

// `size` is the single knob for both dimensions. It is exactly the number of own
// keys at the top level, so breadth grows linearly, while nesting depth is
// derived from it as log4(size), so complexity grows logarithmically. At most
// four of the keys at each level hold a nested object a quarter the size, spread
// evenly across the level. Bounding the nested count is what keeps the total
// node count near size * depth rather than exponential in size:
//
//   size     1     10    100    1000    5000
//   depth    0      2      3       5       6
//   nodes    1     14    276    4380   27580
//
// Leaves cycle through a spread of types so the deep operations have something
// other than integers to walk. No functions: structuredClone throws on them,
// which would silently drop the vanilla column of the Deep rows.
const LEAVES = [
  i => i,
  i => 's' + i,
  i => i % 4 === 0,
  i => null,
  i => new Date(i * 86400000),
  i => [i, i + 1, i + 2]
]

const depthFor = size => Math.max(0, Math.round(Math.log2(size) / 2))

function build (size, depth = depthFor(size), state = { n: 0 }) {
  const r = {}
  const stride = Math.max(2, Math.ceil(size / 4)) // at most 4 nested keys per level
  for (let i = 0; i < size; i++) {
    r['k' + i] = depth > 0 && i % stride === 0
      ? build(Math.max(1, size >> 2), depth - 1, state)
      : LEAVES[state.n % LEAVES.length](state.n++)
  }
  return r
}

// Only plain objects are recursed into: a Date reads as an object but holds no
// enumerable keys, so walking into it would count it as nothing.
const nodes = ob => ob._values().reduce((t, v) => t + (v?.constructor === Object ? nodes(v) : 1), 0)

const ot = build(size)
let ob = ot._clone()

// Probe values are derived from the object rather than hardcoded, so every row
// keeps its hit/miss behaviour as `size` changes. HIT is the last value, making
// every lookup a full scan - the honest worst case for a linear search.
const KEYS = ob._keys()
const HIT = ob[KEYS.at(-1)]
const MISS = { absent: true } // a fresh reference, so === and SameValueZero both miss
const LIST = KEYS.filter((_k, i) => i % 3 === 0)
const SRC = { x: 1, y: 2, z: 3 } // keys chosen not to collide with ob's

// _clean drops null and undefined. _same, _diff and _contains reach for
// value._eq(...) without a null guard, so they need a null-free operand.
//
// `other` is a shallow copy of clean with one key replaced, for the Same and
// Diff rows. Every other value stays the same reference, so a shallow _eq and a
// deep _.isEqual reach the same verdict on it; the replacement is an object, so
// it compares unequal to a leaf of any of the types above.
const clean = ob._clean()
const ODD = clean._keys().at(-1)
const other = clean._map((v, k) => k === ODD ? { odd: 1 } : v)
const sub = clean._pick(LIST)

// The deepest first-key path that exists in this object, for _at / _.get.
const PATH = (() => {
  const p = []
  for (let v = ob; v?._is(Object) && !v.map && v._len(); v = v[p.at(-1)]) p.push(v._keys()[0])
  return p.join('.')
})()

// Hand written equivalents of the two operations lodash and objix both provide
// and a reader would otherwise reach for a library to get.
const deepClone = v =>
  v === null || typeof v !== 'object' ? v
    : v instanceof Date ? new Date(v)
      : Array.isArray(v) ? v.map(deepClone)
        : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deepClone(x)]))

const deepEq = (a, b) => {
  if (a === b) return true
  if (a instanceof Date && b instanceof Date) return +a === +b
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false
  const ka = Object.keys(a)
  return ka.length === Object.keys(b).length && ka.every(k => deepEq(a[k], b[k]))
}

const twin = deepClone(ob)
const joined = clean._join(other)
const recs = Array.from({ length: size }, (_v, i) => ({ g: i % 4, i }))

// ---------------------------------------------------------------------------
// Harness
// ---------------------------------------------------------------------------

// objix assigns Symbol.iterator onto Object.prototype as an *enumerable* own
// property - the one method not installed with defineProperty - and lodash's
// pickBy family collects inherited symbols via getAllKeysIn. So _.omitBy hands
// back a stray Symbol.iterator entry no caller asked for. node's
// assert.deepEqual ignores symbol keys and bun's does not, which would make this
// gate mean different things in the two runtimes. Rebuilding from own string
// keys drops it, and drops nothing else: Object.entries never sees symbols.
//
// Rebuilding also settles the prototype, which matters for the same reason:
// Object.groupBy returns a null-prototype object, and bun's deepEqual compares
// prototypes where node's legacy one does not.
const own = v => {
  const proto = v == null ? 0 : Object.getPrototypeOf(v)
  return proto === Object.prototype || proto === null
    ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, own(x)]))
    : Array.isArray(v) ? v.map(own) : v
}

// Every implementation is verified against objix once, before any timing. That
// single assertion is the correctness gate for the whole row: if three
// independent implementations agree on the result, the numbers below are
// measuring the same work three ways.
function verify (name, funcs) {
  const expected = own(funcs.objix())
  for (const [key, fun] of funcs._entries()) {
    if (!fun || key === 'objix') continue
    assert.deepEqual(expected, own(fun()), `${name}: ${key} disagrees with objix`)
  }
}

// heats batches of iters executions each, in a fresh random order per batch, so
// no implementation keeps the cache or the JIT warm for the next one. Each batch
// is preceded by an untimed warmup and recorded as an ops/sec sample.
function compare (funcs, name) {
  verify(name, funcs)
  const warm = Math.min(iters, 100)
  // 5 significant digits, so the printed figure carries the precision it looks
  // like it does. The default 3 would bucket 22_519_808 and 22_400_000 together.
  const hist = funcs._map(f => f && hdr.build({ numberOfSignificantValueDigits: 5 }))
  for (let r = 0; r < heats; r++) {
    for (const [key, fun] of _.shuffle(funcs._entries())) {
      if (!fun) continue
      ob = ot._clone()
      for (let i = 0; i < warm; i++) fun()
      const start = performance.now()
      for (let i = 0; i < iters; i++) fun()
      const secs = (performance.now() - start) / 1000
      hist[key].recordValue(Math.max(1, Math.round(iters / (secs || 1e-9))))
    }
  }
  const res = hist._map(v => v && Math.round(v.mean))
  // _clean drops the entries for a skipped implementation. console.table unions
  // the keys across rows, so an absent one renders as a blank cell - where a
  // present null or undefined would print as the word.
  return {
    ...res,
    '+% lodash': pct(res.objix, res.lodash),
    '+% vanilla': pct(res.objix, res.vanilla)
  }._clean()
}

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

// A null comparator means no fair equivalent exists and the column is skipped.
// Rows marked * start from a shallow copy in all three columns because the
// objix method mutates its receiver; read them against the Clone row, which
// measures that copy on its own.
const OPS = {
  // -- iteration ------------------------------------------------------------
  Map: {
    objix: () => ob._map(v => v),
    lodash: () => _.mapValues(ob, v => v),
    vanilla: () => Object.fromEntries(Object.entries(ob).map(([k, v]) => [k, v]))
  },
  Keys: {
    objix: () => ob._keys(),
    lodash: () => _.keys(ob),
    vanilla: () => Object.keys(ob)
  },
  Values: {
    objix: () => ob._values(),
    lodash: () => _.values(ob),
    vanilla: () => Object.values(ob)
  },
  Entries: {
    objix: () => ob._entries(),
    lodash: () => _.toPairs(ob),
    vanilla: () => Object.entries(ob)
  },
  Len: {
    objix: () => ob._len(),
    lodash: () => _.size(ob),
    vanilla: () => Object.keys(ob).length
  },

  // -- search ---------------------------------------------------------------
  Has: {
    objix: () => ob._has(HIT),
    lodash: () => _.includes(ob, HIT),
    vanilla: () => Object.values(ob).includes(HIT)
  },
  Some: {
    objix: () => ob._some(v => v === HIT),
    lodash: () => _.some(ob, v => v === HIT),
    vanilla: () => Object.values(ob).some(v => v === HIT)
  },
  Every: {
    objix: () => ob._every(v => v !== MISS),
    lodash: () => _.every(ob, v => v !== MISS),
    vanilla: () => Object.values(ob).every(v => v !== MISS)
  },
  Find: {
    objix: () => ob._find(v => v === HIT),
    lodash: () => _.findKey(ob, v => v === HIT),
    vanilla: () => Object.keys(ob).find(k => ob[k] === HIT)
  },
  At: {
    objix: () => ob._at(PATH),
    lodash: () => _.get(ob, PATH),
    vanilla: () => PATH.split('.').reduce((v, k) => v?.[k], ob)
  },

  // -- selection ------------------------------------------------------------
  Pick: {
    objix: () => ob._pick(v => v === HIT),
    lodash: () => _.pickBy(ob, v => v === HIT),
    vanilla: () => Object.fromEntries(Object.entries(ob).filter(([, v]) => v === HIT))
  },
  'Pick (keys)': {
    objix: () => ob._pick(LIST),
    lodash: () => _.pick(ob, LIST),
    vanilla: () => Object.fromEntries(LIST.map(k => [k, ob[k]]))
  },
  Clean: {
    objix: () => ob._clean(),
    lodash: () => _.omitBy(ob, _.isNil),
    vanilla: () => Object.fromEntries(Object.entries(ob).filter(([, v]) => v != null))
  },

  // -- reshaping ------------------------------------------------------------
  FlatMap: {
    objix: () => ob._flatMap((k, v) => [[k, v], ['x' + k, v]]),
    lodash: () => Object.fromEntries(_.flatMap(ob, (v, k) => [[k, v], ['x' + k, v]])),
    vanilla: () => Object.fromEntries(Object.entries(ob).flatMap(([k, v]) => [[k, v], ['x' + k, v]]))
  },
  KeyBy: {
    objix: () => recs._keyBy('g'),
    lodash: () => _.groupBy(recs, 'g'),
    // Object.groupBy returns a null prototype object; see own() for why that
    // needs no setPrototypeOf here to make the row agree.
    vanilla: typeof Object.groupBy === 'function' ? () => Object.groupBy(recs, r => r.g) : null
  },
  Join: {
    objix: () => clean._join(other),
    // _join uses &&= so a falsy value is left alone rather than concatenated,
    // and a key missing from the operand keeps its original value.
    lodash: () => _.mergeWith(_.clone(clean), other, (a, b) => b === undefined || !a ? a : [].concat(a, b)),
    vanilla: () => {
      const r = { ...clean }
      for (const k in other) if (r[k] && k in other) r[k] = [].concat(r[k], other[k])
      return r
    }
  },
  Split: {
    objix: () => joined._split(),
    lodash: null, // no equivalent - unzipping an object of arrays is objix only
    vanilla: () => {
      const r = []
      for (const k in joined) {
        if (!Array.isArray(joined[k])) continue
        joined[k].forEach((v, i) => ((r[i] ??= {})[k] = v))
      }
      return r
    }
  },

  // -- copying --------------------------------------------------------------
  Clone: {
    objix: () => ob._clone(),
    lodash: () => _.clone(ob),
    vanilla: () => ({ ...ob })
  },
  'Deep (native)': {
    objix: () => ob._clone(-1), // structuredClone, with the recursive path as fallback
    lodash: () => _.cloneDeep(ob),
    vanilla: typeof structuredClone === 'function' ? () => structuredClone(ob) : null
  },
  'Deep (js)': {
    objix: () => ob._clone(9), // a depth forces the recursive path instead
    lodash: () => _.cloneDeep(ob),
    vanilla: () => deepClone(ob)
  },

  // -- comparison -----------------------------------------------------------
  Eq: {
    objix: () => ob._eq(twin, -1),
    lodash: () => _.isEqual(ob, twin),
    vanilla: () => deepEq(ob, twin)
  },
  Same: {
    objix: () => clean._same(other),
    lodash: () => _.pickBy(clean, (v, k) => _.isEqual(v, other[k])),
    vanilla: () => Object.fromEntries(Object.entries(clean).filter(([k, v]) => deepEq(v, other[k])))
  },
  Diff: {
    objix: () => clean._diff(other),
    lodash: () => _.omitBy(clean, (v, k) => _.isEqual(v, other[k])),
    vanilla: () => Object.fromEntries(Object.entries(clean).filter(([k, v]) => !deepEq(v, other[k])))
  },
  Contains: {
    objix: () => ob._contains(sub),
    lodash: () => _.isMatch(ob, sub),
    vanilla: () => Object.keys(sub).every(k => deepEq(ob[k], sub[k]))
  },
  Is: {
    objix: () => ob._is(Object),
    // _.isPlainObject is a different question: it is false for a Date, where
    // _is(Object) asks only whether the value is not a primitive wrapper.
    lodash: null,
    vanilla: () => !(ob instanceof Number || ob instanceof String ||
      ob instanceof Boolean || ob instanceof Function || ob instanceof Symbol)
  },

  // -- mutation (see the * note above) --------------------------------------
  'Assign *': {
    objix: () => ob._assign(SRC),
    lodash: () => _.assign(ob, SRC),
    vanilla: () => Object.assign({ ...ob }, SRC)
  },
  'Extend *': {
    objix: () => ob._extend(SRC),
    lodash: () => _.defaults(ob, SRC),
    vanilla: () => {
      const r = { ...ob }
      for (const k in SRC) r[k] ??= SRC[k]
      return r
    }
  },
  'Delete *': {
    objix: () => ob._del(...LIST),
    lodash: () => _.omit(ob, LIST), // already returns a copy, so no clone needed
    vanilla: () => {
      const r = { ...ob }
      for (const k of LIST) delete r[k]
      return r
    }
  },

  // -- misc -----------------------------------------------------------------
  Format: {
    objix: () => ob._$(),
    lodash: null, // _.template interpolates but does not serialise
    vanilla: () => JSON.stringify(ob).replace(/"(\w+)":/g, '$1:')
  },
  Try: {
    objix: () => ob._try(o => o.nope.deep, () => 'err'),
    // _.attempt returns the Error rather than calling a handler, so it needs
    // normalising to compare - which is part of what is being measured.
    lodash: () => _.isError(_.attempt(() => ob.nope.deep)) ? 'err' : 'ok',
    vanilla: () => { try { return ob.nope.deep } catch { return 'err' } }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log(`Ops/sec - size: ${size} (${KEYS.length} keys, ${nodes(ob)} nodes, ` +
  `depth ${depthFor(size)}), iters: ${iters}, heats: ${heats}`)

// Copied onto a null prototype so the rows are keyed by operation name. Bun's
// console.table treats anything carrying Symbol.iterator as array-like and would
// otherwise number the first column, and objix puts an @@iterator on
// Object.prototype. A null-prototype object inherits neither. Node's output is
// unchanged.
console.table(Object.assign(Object.create(null), OPS._map(compare)))

console.log('* starts from a shallow copy in every column, because the objix ' +
  'method mutates - compare against Clone.\n' +
  'A blank column means no fair equivalent exists; see the comment on that row.')
