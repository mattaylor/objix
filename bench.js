require('./objix')
const _ =  require('lodash')


let o1 = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, h: 7, h: 9 }
let o2 = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, h: 7, h: 9 }

let max = 1000000

let res = {}

let round = (v, p = 2) => Math.round(v * (10 ** p)) / (10 ** p)

function mapBench() {
  let res = { function: 'Map' }
  let start = performance.now()
  for (let i = 0; i < max; i++) _.mapValues(o1, v => v+1)
  res.lodash = round(performance.now() - start)
  start = performance.now()
  for (let i = 0; i < max; i++) o2.map(v => v+1)
  res.objix = round(performance.now() - start)
  res['% Diff'] = round(100*(res.lodash - res.objix)/res.lodash)
  return res
}

console.table(mapBench())

