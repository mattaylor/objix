require('./objix')
const _ =  require('lodash')
const assert = require('assert')
const ph = require('node:perf_hooks')


const iters = process.argv[2] || 1000 // Number of iterations per heat
const heats = process.argv[3] || 100   // Number of randomised heats
const oSize = process.argv[4] || 10   // Number of object entries
const round = (v, p = 2) => Math.round(v * (10 ** p)) / (10 ** p)

/*
Calculate run time for *heats* batches of *iters* executions of each function, with a randomised execution order for each batch. 
Each batch run also includes a 100 iteration warmup verifying the results of the function against objix
*/
function compare(funcs) {
  let hist = { }, start
  for (let r = 0; r < heats; r++) for (let [key,fun] of _.shuffle(funcs.entries())) {
    //for (let i = 0; i < 100; i++) assert.deepEqual(funcs.objix(), fun(), fun)
    for (let i = 0; i < 100; i++) assert(funcs.objix().equals(fun(),-1), fun)
    if (!hist[key]) hist[key] = ph.createHistogram()
    start = performance.now()
    for (let i = 0; i < iters; i++) fun()
    hist[key].record(Math.round(iters/(performance.now() - start)))
  }
  /*
  return hist.flatMap((k,v) => [
    [k + ' 75%', v.percentiles.get(75)],
    [k + ' avg', v.mean], 
    [k + ' Err', round(100*v.stddev/v.mean)],
    [k + ' Inc', round((100*v.mean/hist.lodash.mean)-100)],
  ])
  */
  let res = hist.map(v => v.mean)
  res['% Inc'] = round(100*(hist.objix.mean - hist.lodash.mean)/hist.lodash.mean)
  res['% Err'] = round(100*(hist.objix.stddev + hist.lodash.stddev)/(hist.objix.mean + hist.lodash.mean))
  return res
}

function report(title, ob) {
  console.log(title)
  console.table({
    Map: {
      vanilla: () => Object.fromEntries(Object.entries(ob).map(([k,v]) => [k, v+1])),
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
      vanilla: () => { try { return assert.deepEqual(ob,ob.clone()) || true } catch { return false }},
      lodash: () => _.isEqual(ob, ob.clone()),
      objix: () => ob.equals(ob.clone(), -1),
    },
    Clone: {
      vanilla: () => Object.assign({}, ob), //No Construcotrs!
      lodash: () => _.clone(ob),
      objix:  () => ob.clone(),
    },
    Deep: {
      lodash: () => _.cloneDeep(ob),
      objix:  () => ob.clone(-1),
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
const d1 = new Date()
const d2 = new Date()
const testOb = { }
const deepOb = { a: { b: [ 1,2,3,d1, { c: 0, d: d2 }], e:1, f:2, g: 3, h: 4, i: 5, j: 6}}
for (let i=1; i <= oSize; i++) testOb['k'+i] = i
for (let i=1; i <= oSize/10; i++) testOb['d'+i] = deepOb
report(`Ops/sec (iters: ${iters}, heats: ${heats} size: ${oSize})`, testOb)
