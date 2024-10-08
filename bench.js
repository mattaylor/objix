require('./objix')
const _ =  require('lodash')
const assert = require('assert')
//const ph = require('node:perf_hooks')
const hdr = require('hdr-histogram-js')

const iters = process.argv[2] || 1000 // Number of iterations per heat
const heats = process.argv[3] || 100   // Number of randomised heats
const nSimp = process.argv[4] || 10   // Number of simple object entries
const nDeep = process.argv[5] || 1    // Number of complex object entries
const round = (v, p = 2) => Math.round(v * (10 ** p)) / (10 ** p)

/*
Calculate run time for *heats* batches of *iters* executions of each function, with a randomised execution order for each batch. 
Each batch run also includes a 100 iteration warmup verifying the results of the function against objix
*/
function compare(funcs) {
  let hist = funcs._map(v => null), start
  for (let r = 0; r < heats; r++) for (let [key,fun] of _.shuffle(funcs._entries())) if (fun) {
    for (let i = 0; i < 100; i++) assert.deepEqual(funcs.objix(), fun(), fun)
    if (!hist[key]) hist[key] = hdr.build()
    start = performance.now()
    for (let i = 0; i < iters; i++) fun()
    hist[key].recordValue(Math.round(iters/(performance.now() - start)))
  }
  /*
  return hist.flatMap((k,v) => [
    [k + ' 75%', v.percentiles.get(75)],
    [k + ' avg', v.mean], 
    [k + ' Err', round(100*v.stddev/v.mean)],
    [k + ' Inc', round((100*v.mean/hist.lodash.mean)-100)],
  ])
  */
  let res = hist._map(v => v?.mean)
  res['% Inc'] = round(100*(hist.objix.mean - hist.lodash.mean)/hist.lodash.mean)
  //res['% Err'] = round(100*(hist.objix.stddev + hist.lodash.stddev)/(hist.objix.mean + hist.lodash.mean))
  return res
}

function report(title, ob) {
  console.log(title)
  console.table({
    Map: {
      objix : () => ob._map(v => v+1),
      lodash: () => _.mapValues(ob, v => v+1),
      vanilla: () => Object.fromEntries(Object.entries(ob).map(([k,v]) => [k, v+1])),
    },
    Pick: {
      objix:  () => ob._pick(v => v == 1),
      lodash: () => _.pickBy(ob, v => v == 1),
      vanilla: () => Object.fromEntries(Object.entries(ob).flatMap(([k,v]) => v == 1 ? [[k,v]] : [])),
    },
    /*
    'Pick (list)': {
      objix:  () => ob.pick(['s1','s2','s3']),
      lodash: () => _.pick(ob,['s1','s2','s3']),
      vanilla: () => Object.fromEntries(Object.entries(ob).flatMap(([k,v]) => ['s1','s2','s3'].includes(k) ? [[k,v]] : [])),
    },
    */
    Find: {
      objix: () => ob._find(v => v == 1),
      lodash: () => _.findKey(ob, v => v == 1),
      vanilla: () => { for (let [k,v] of Object.entries(ob)) if (v == 1) return k },
    },
    FlatMap: {
      objix: () => ob._flatMap((k,v) => [[k,v],[k+1, v+1]]),
      lodash: () => Object.fromEntries(_.flatMap(ob, (v,k) => [[k,v],[k+1, v+1]])),
      /*
      _lodash: () => {
        let r = {}
        for (let [k,v] of _.flatMap(ob, (v,k) => [[k,v],[k+1, v+1]])) r[k] = v
        return r
      }
      */
      //vanilla: () => { for (let [k,v] of Object.entries(ob)) if (v == 1) return k },
    },
    Has: {
      objix:  () => ob._has(3),
      lodash: () => _.includes(ob, 3),
      vanilla: () => Object.values(ob).includes(3)
    },
    KeyBy: {
      objix:  () => [{a:1},{a:2},{a:3}]._keyBy('a'),
      lodash: () => _.keyBy([{a:1},{a:2},{a:3}], 'a'),
    },
    Equals: {
      objix: () => ob._eq(ob._clone(), -1),
      lodash: () => _.isEqual(ob, ob._clone()),
      vanilla: () => { try { return assert.deepEqual(ob,ob._clone()) || true } catch { return false }},
    },
    Clone: {
      objix:  () => ob._clone(),
      lodash: () => _.clone(ob),
      vanilla: () => Object.assign({}, ob), //No Construcotrs!
    },
    Deep: {
      objix:  () => ob._clone(-1),
      vanilla: typeof structuredClone !== 'undefined' ? () => structuredClone(ob) : null,
      lodash: () => _.cloneDeep(ob),
    },
    Extend: { 
      objix: () => ob._extend({a: 1, b: 2, c: 3}),
      lodash: () => _.defaults(ob, {a: 1, b:2, c: 2}),
      vanilla: () => Object.assign({}, {a: 1, b: 2, c: 3}, ob)
    },
    Some: {
      objix: () => ob._some(v => v == 'x'),
      vanilla: () => Object.values(ob).some(v => v == 'x'),
      lodash: () => _.some(_.values(ob), v => v == 'x'),
    },
    Every: {
      objix: () => ob._every(v => v), 
      lodash:  () => _.every(_.values(ob), v => v),
      vanilla: () => Object.values(ob).every(v => v),
    }
  }._map(compare))
}
const d1 = new Date()
const d2 = new Date()
const testOb = { }
//const deepOb = { a: { b: { c: [1, 2, 3], d: d1, e:[] }}}
const deepOb = { a: { b: [ 1,2,3,d1, { c: 0, d: d2 }], e:1, f:2, g: 3, h: 4, i: 5, j: []}}
for (let i=0; i < nSimp; i++) testOb['s'+i] = i
for (let i=0; i < nDeep; i++) testOb['d'+i] = deepOb
report(`Ops/sec (iters: ${iters}, heats: ${heats}, simple: ${nSimp}, complex: ${nDeep})`, testOb)
