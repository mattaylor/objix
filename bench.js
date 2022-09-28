require('./objix')
const _ =  require('lodash')


let o1 = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, h: 7, h: 9 }

let max = 100000

let res = {}

let round = (v, p = 2) => Math.round(v * (10 ** p)) / (10 ** p)


function benchMark(name, loFn, obFn, iters=max) {
  for (let i = 0; i < iters; i++) loFn() // warm up
  for (let i = 0; i < iters; i++) obFn() // warm up
  let res = { function: name }
  let start = performance.now()
  console.assert(name + ' results equal', loFn().equals(obFn()))
  for (let i = 0; i < iters; i++) loFn()
  res.lodash = round(performance.now() - start)
  start = performance.now()
  for (let i = 0; i < iters; i++) obFn()
  res.objix = round(performance.now() - start)
  res['% Diff'] = round(100*(res.lodash - res.objix)/res.lodash)
  console.table(res)
}

benchMark('Map', 
  () => _.mapValues(o1, v => v+1),
  () => o1.map(v => v+1),
)

benchMark('Filter', 
  () => _.pickBy(o1, (v,k) => v == 1),
  () => o1.filter((v,k) => v == 1),
)

benchMark('Find', 
  () => _.findKey(o1, (v,k) => v == 1),
  () => o1.find((v,k) => v == 1),
)
