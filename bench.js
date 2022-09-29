require('./objix')
const _ =  require('lodash')
const assert = require('assert')

const iters = process.argv[2] || 10000
const round = (v, p = 2) => Math.round(v * (10 ** p)) / (10 ** p)

function compare(funcs) {
  let res = { }, start
  for (let i = 0; i < 100; i++) assert.deepEqual(funcs.objix(), funcs.lodash(), funcs.objix)
  for (let key of funcs.keys()) {
    start = performance.now()
    for (let i = 0; i < iters; i++) funcs[key]()
    res[key] = round(performance.now() - start)
  }
  res['% Diff'] = round(100*(res.lodash - res.objix)/res.lodash)
  return res
}

function report(name, ob) {
  let funcs = {
    Map: {
      lodash: () => _.mapValues(ob, v => v+1),
      objix : () => ob.map(v => v+1),
    },
    Filter: {
      lodash: () => _.pickBy(ob, v => v == 1),
      objix:  () => ob.filter(v => v == 1),
    },
    Find: {
      lodash: () => _.findKey(ob, v => v == 1),
      objix: () => ob.find(v => v == 1),
    },
    KeyBy: {
      lodash: () => _.keyBy([{a:1},{a:2},{a:3}], 'a'),
      objix:  () => ({}.keyBy([{a:1},{a:2},{a:3}], 'a')),
    },
    Equals: {
      lodash: () => _.isEqual(ob, ob.clone()),
      objix: () => ob.equals(ob.clone()),
    },
    Clone: {
      lodash: () => _.clone(ob),
      objix:  () => ob.clone(),
    },
    Some: {
      lodash: () => _.some(_.values(ob), v => v == 'x'),
      objix: () => ob.some(v => v == 'x'),
    },
    Every: {
      lodash:  () => _.every(_.values(ob), v => v),
      objix: () => ob.every(v => v),
    }
  }
  console.log(name)
  console.table(funcs.map(compare))
}

const deep =  { a: 1, b: { b: 1 }, c: { c: { c: 1 }}, d: { d: [1,2,3,4]}}
const small = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, h: 7, h: 9 }
const large = { }
for (let i=1; i < 1900; i++) large['k'+i] = i

report('Small Object Test', small)
report('Large Object Test', large)
//report('Deep  Object Test', deep)
