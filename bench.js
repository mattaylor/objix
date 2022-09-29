require('./objix')
const _ =  require('lodash')
const assert = require('assert')

const iters = process.argv[2] || 10000
const round = (v, p = 2) => Math.round(v * (10 ** p)) / (10 ** p)

function compare(loFn, obFn, max=iters) {
  let res = { }, start
  for (let i = 0; i < 100; i++) assert.deepEqual(obFn(), loFn())
  start = performance.now()
  for (let i = 0; i < max; i++) loFn()
  res.lodash = round(performance.now() - start)
  start = performance.now()
  for (let i = 0; i < max; i++) obFn()
  res.objix = round(performance.now() - start)
  res['% Diff'] = round(100*(res.lodash - res.objix)/res.lodash)
  return res
}

function report(name, ob) {
  console.log(name)
  console.table({
    map: compare(
      () => _.mapValues(ob, v => v+1),
      () => ob.map(v => v+1),
    ),
    filter: compare(
      () => _.pickBy(ob, v => v == 1),
      () => ob.filter(v => v == 1),
    ),
    find: compare(
      () => _.findKey(ob, v => v == 1),
      () => ob.find(v => v == 1),
    ),
    keyBy: compare(
      () => _.keyBy([{a:1},{a:2},{a:3}], 'a'),
      () => ({}.keyBy([{a:1},{a:2},{a:3}], 'a')),
    ),
    equals: compare(
      () => _.isEqual(ob, ob.clone()),
      () => ob.equals(ob.clone()),
    ),
    clone: compare(
      () => _.clone(ob),
      () => ob.clone(),
    ),
    some: compare(
      () => _.some(_.values(ob), v => v == 'x'),
      () => ob.some(v => v == 'x'),
    ),
    every: compare(
      () => _.every(_.values(ob), v => v),
      () => ob.every(v => v),
    )
  })
}
/*
let k1 = _.keyBy([{a:1},{a:2},{a:5}], 'a')
let k2 = {}.keyBy([{a:1},{a:2},{a:4}], 'a')
console.log(k1,k2,k1.equals(k2))
*/

const deep =  { a: 1, b: { b: 1 }, c: { c: { c: 1 }}, d: { d: [1,2,3,4]}}
const small = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, h: 7, h: 9 }
const large = { }
for (let i=0; i < 1000; i++) large['k'+i] = i

report('Small Object Test', small)
report('Large Object Test', large)
//report('Deep  Object Test', deep)

