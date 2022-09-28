require('./objix')
const _ =  require('lodash')

const o1 = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, h: 7, h: 9 }
const iters = 100000
const round = (v, p = 2) => Math.round(v * (10 ** p)) / (10 ** p)

function benchMark(loFn, obFn, max=iters) {
  for (let i = 0; i < max; i++) loFn() // warm up
  for (let i = 0; i < max; i++) obFn() // warm up
  let res = { }
  let start = performance.now()
  console.assert('Results equal', loFn().equals(obFn()))
  for (let i = 0; i < max; i++) loFn()
  res.lodash = round(performance.now() - start)
  start = performance.now()
  for (let i = 0; i < max; i++) obFn()
  res.objix = round(performance.now() - start)
  res['% Diff'] = round(100*(res.lodash - res.objix)/res.lodash)
  return res
}

let report = {
  map: benchMark(
    () => _.mapValues(o1, v => v+1),
    () => o1.map(v => v+1),
  ),
  filter: benchMark(
    () => _.pickBy(o1, v => v == 1),
    () => o1.filter(v => v == 1),
  ),
  find: benchMark(
    () => _.findKey(o1, v => v == 1),
    () => o1.find(v => v == 1),
  )
}

console.table(report)
