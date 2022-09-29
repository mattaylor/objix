require('./objix')
const _ =  require('lodash')
const assert = require('assert')

const iters = process.argv[2] || 10000
const round = (v, p = 2) => Math.round(v * (10 ** p)) / (10 ** p)
function compare(funcs) {
  let res = { }, start
  for (let r = 0; r < 10; r++) for (let [key,fun] of _.shuffle(funcs.entries())) {
      for (let i = 0; i < 10; i++) assert.deepEqual(funcs.objix(), fun(), fun)
    start = performance.now()
    for (let i = 0; i < iters; i++) fun()
    res[key] = round((res[key] || 0) + performance.now() - start)
  }
  res['% Diff'] = round(100*(res.lodash - res.objix)/res.lodash)
  return res
}

function report(name, ob) {
  console.log(name)
  console.table({
    Map: {
      lodash: () => _.mapValues(ob, v => v+1),
      objix : () => ob.map(v => v+1),
    },
    Filter: {
      vanilla: () => Object.fromEntries(Object.entries(ob).flatMap(([k,v]) => v == 1 ? [[k,v]] : [])),
      lodash: () => _.pickBy(ob, v => v == 1),
      objix:  () => ob.filter(v => v == 1),
    },
    Find: {
      vanilla: () => { for (let [k,v] of Object.entries(ob)) if (v == 1) return k },
      lodash: () => _.findKey(ob, v => v == 1),
      objix: () => ob.find(v => v == 1),
    },
    KeyBy: {
      lodash: () => _.keyBy([{a:1},{a:2},{a:3}], 'a'),
      objix:  () => ({}.keyBy([{a:1},{a:2},{a:3}], 'a')),
    },
    Equals: {
      vanilla: () => {
        try { 
          assert.deepEqual(ob, ob.clone())
          return true 
        } catch (e) { 
          return false
        }
      },
      lodash: () => _.isEqual(ob, ob.clone()),
      objix: () => ob.equals(ob.clone()),
    },
    Clone: {
      vanilla: () => Object.assign({}, ob),
      lodash: () => _.clone(ob),
      objix:  () => ob.clone(),
    },
    Some: {
      vanilla: () => Object.values(ob).some(v => v == 'x'),
      lodash: () => _.some(_.values(ob), v => v == 'x'),
      objix: () => ob.some(v => v == 'x'),
    },
    Every: {
      vanilla: () => Object.values(ob).every(v => v),
      lodash:  () => _.every(_.values(ob), v => v),
      objix: () => ob.every(v => v),
    }
  }.map(compare))
}

const deep =  { a: 1, b: { b: 1 }, c: { c: { c: 1 }}, d: { d: [1,2,3,4]}}
const small = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, h: 7, h: 9 }
const large = { }
for (let i=1; i < 500; i++) large['k'+i] = i

report('Small Object Test', small)
report('Large Object Test', large)
//report('Deep  Object Test', deep)
