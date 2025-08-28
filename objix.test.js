
require('./objix')
const lo = require('lodash')
//global.structuredClone = require('@ungap/structured-clone')

let o1 = { a: 1 }
let o2 = { a: 1, b: 2 }
let o3 = { a: 2, b: 2, c: 3}
let o4 = { a: 2, b: 2, c: 3, d: 4}
/*
describe('Not Equals', () => {
  test('Object', () => expect(o1._eq({a:1})).toBeTruthy())
  test('Object (-ve)', () => expect(o1._eq({a:2})).toBeTruthy())
})

describe('Equals', () => {
  test('Object', () => expect(o1._eq({a:1})).toBeTruthy())
  test('Object (NOT)', () => expect(o1._eq({a:2})).toBeTruthy())
})
*/

console.assert(o1._eq({a: 1}), 'Equals')
console.assert(o1._eq({a: 1}), '_Equals')
console.assert(!o1._eq({a: 2}), '!Equals')

console.assert({a:1}._eq({a: 1}), 'Equals')
console.assert(!{a:1}._eq(1), '!Equals 0 (Number)')
console.assert(!{}._eq(1), '!Equals 1 (Number)')

console.assert({a:[1]}._eq({a:[1]}, 1), 'Equals (Array)')
console.assert({a:[]}._eq({a:[]}, 1), 'Equals ([])')
console.assert(!{a:[1]}._eq({a:[]}, 1), '!Equals ([])')
console.assert([1]._eq([1]), 'Equals (Array)')
console.assert(![1]._eq([0]), '!Equals (Array)')
console.assert('string'._eq('string'), 'Equals (String)')
console.assert(!'string'._eq({}), '!Equals (String)')
console.assert(!'string'._eq(''), '!Equals (String)')



console.assert(o2._contains(o1), '_Contains')
console.assert(!o1._contains(o2), '!Contains')

console.assert(o1._map(_ => _+1).a === 2, '_Map')

//console.assert(o1.apply(_ => _-1) && o1.a === 0, 'Apply')

console.assert(o2._find(_ => _ > 1) === 'b', '_Find')
console.assert(!o2._find(_ => _ > 3), '!_Find')

console.assert(o3._pick(_ => _ < 3)._eq({ a: 2, b: 2 }), '_Only')
console.assert(o3._pick(_ => _ < 0)._eq({}), '!Only')

console.assert({a:1,b:2}._same({b:2,c:3})._eq({b:2}), '_Common')
console.assert({a:1,b:2}._same({b:3})._eq({}), '!Common')

console.assert({a:1}._len() == 1, '_Size')
console.assert(!{}._len(), '!Size')

console.assert(o3._assign({d:4})._eq(o4) && o3._eq(o4), '_Assign')

//console.assert(o3.patch({d:4}) && o3._eq(o4), 'Patch')
//console.assert(o3._patch({d:4}) && o3._eq(o4), '_Patch')

console.assert(o3._delete('d','c','b') && o3._eq({a:2}), '_Delete')
console.assert(o3._delete('d','c','b') && !o3._eq({d:2}), '!Delete')

let c0 = {a:1, b:{c:{d:1}}}._clone(-1)
console.assert(c0._eq({a:1,b:{c:{ d:1}}}, -1), 'Clone 2', c0)
console.assert(o4._clone()._eq(o4), '_Clone')

console.assert(o4._clone() != o4, '!Clone', o4)

console.assert({a:1}._join({a:2}).a[1] == 2, '_Join')

console.assert({a: [1,2]}._split(), '_Split')

let _r = {a: 1}._flatMap((k,v) => [[k+1, v+1],[k+2, v+2]])
console.assert(_r._eq({a1: 2, a2: 3}), '_FlatMap', _r)

console.assert({a: 0, b: 2, c: null}._clean()._eq({b:2}), '_Clean')

console.assert([]._is(Array), '_isArray')
console.assert(!{}._is(Array), '!isArray')

console.assert({a:1, b:1}._eq({a:1, b:[1]}), 'Equals Array')
console.assert(!{a:1, b:[1,2]}._eq({a:1, b:[1,2]}), '!Equals Array')
console.assert({a:1, b:[1,2]}._eq({a:1, b:[1,2]}, true), 'Deep Equals Array')
console.assert(!{a:1, b:{c:1}}._eq({a:1, b:{c:2}}, true), '!Deep Equals Object')
console.assert({a:1, b:{c:1}}._eq({a:1, b:{c:1}}, true), 'Deep Equals Object')
console.assert({a:1, b:[{c:1}, {c:2}]}._eq({a:1, b:[{c:1}, {c:2}]}, -1), 'Deep Equals Mixed')
console.assert({a:1, b:[{c:1}, {c:2}]}._eq({a:1, b:[{c:1}, {c:2}]}, -1), '_Deep Equals Mixed')

console.assert({a:1, b:2}._some(v => v > 1), '_Some')
console.assert(!{a:1, b:2}._some(v => v > 2),'!Some')

console.assert({a:1, b:2}._every(v => v > 0), '_Every')
console.assert(!{a:1, b:2}._every(v => v > 1),'!Every')


let _x = [{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }]._keyBy('a')
console.assert(_x._eq({ o1: { a: 'o1' }, o2: [ { a: 'o2', b: 1 }, { a: 'o2' } ]}, -1), '_KeyBy')

let _y = { a: 1, b: 2 }
_y._bind('max', o => o._entries().sort((a,b) => b[1] - a[1])[0][0])

console.assert(_y.max() == 'b', 'Bind', _y.max())

console.assert({a:1, b:[{c:1}]}._contains({c:1},-1), 'Contains Deep')
console.assert({a:1, b:{c:1}}._contains({c:1},1), 'Contains Once')
console.assert(!{a:1, b:[{c:1}]}._contains({c:2},-1), '!Contains Deep')
console.assert(!{a:1, b:[{c:1}]}._contains({c:1},1), '!Contains Once')


let op = {sum:0, id:'Proto'}
  ._trap((v,k,t) => t.sum += t[k] ? v - t[k] : v,null,'a','b','c')
  ._trap(() => 0, 'Read pick', 'sum')

op.a = 1
op.b = 4
op.a = 2
console.assert(op.sum == 6, 'Trap', op)
try { console.assert(!op.sum++, '!Trap', op)} catch {}

let op1 = op._new({id:'Op1'})

op1.c = 10
// console.log(op, op1)
console.assert(op.sum == 6, 'New (Proto)', op.sum)
try { console.assert(!op1.sum++, 'New (!Trap)', op1)} catch {}
console.assert(op1.sum == 16, 'New (Trap)', op1.sum)

console.assert('123'._eq('123'), 'Equals (String)')
console.assert(!'123'._eq('1234'), '!Equals (String)')
console.assert((123)._eq(123), 'Equals 3 (Number)')
console.assert(!(1234)._eq(123), '!Equals 3 (Number)')
console.assert([123]._eq([123]), 'Equals [Number]')
console.assert(![1234]._eq([123]), '!Equals 2 [Number]')
console.assert(![123]._eq([123,0]), '!Equals 2 [Number]')
console.assert({a:0}._eq({a:0}), 'Equals (Falsy)')
console.assert(!{a:{b:0}}._eq({a:{b:0}}), '!Equals (Deep Falsy)')
console.assert({a:{b:0}}._eq({a:{b:0}},1), 'Equals (Deep Falsy)')
console.assert([]._eq([]), 'Equals (Array)')
console.assert(![]._eq([0]), '!Equals (Array)')
console.assert([[{}]]._eq([[{}]], 2), 'Equals (Deep Array)')



//console.assert({ a: 2, b: { c: 2 }, d: [0], e: 's', f: 'null' }._eq({ a: 1, b: { c: 2 }, d:[0], e: 's', f:'null'}, -1), 'EQ Mat')

let c1 = { a: 1, b: { c: 1 }, d: [1], e: 's', f:null }
let c2 = c1._clone()
let c3 = c1._clone(2)
//let c2 = lo._clone(c1)
//let c3 = lo._cloneDeep(c1)
c1.b.c = 2
c1.a = 2
c1.d.pop()
//console.log({c1,c2,c3})
console.assert(c1._eq({ a: 2, b: { c: 2 }, d:[], e: 's', f:null}, -1), 'Clone 1', c1)
console.assert(!c1._eq({ a: 2, b: { c: 2 }, d:[], e: '', f:null}, -1), '!Clone 1', c1)
console.assert(c2._eq({ a: 1, b: { c: 2 }, d:[], e: 's', f:null}, -1), 'Clone 2', c2)
console.assert(!c2._eq({ a: 1, b: { c: 2 }, d:[1], e: 's', f:null}, -1), '!Clone 2', c2)
console.assert(c3._eq({ a: 1, b: { c: 1 }, d:[1], e: 's',f:null}, -1), 'Clone 3', c3)
console.assert(!c3._eq({ a: 1, b: { c: 1 }, d:[1], e: 's',f:false}, -1), '!Clone 3', c3)
//o2.log('o2') // { a: 1, b: { c: 2 }}
//o3.log('o3') // { a: 1, b: { c: 1 }}

o1 = 'asdf'
c1 = o1._clone()
console.assert(o1 == c1, 'Clone (String)', c1)

o1 = ['asdf']
c1 = o1._clone()
console.assert(o1._eq(c1), 'Clone (Array)', c1)
o1.pop()
console.assert(!o1._eq(c1), '!Clone (Array)', c1)

console.assert([1,2,3]._clone()._eq([1,2,3]), 'Clone (Array) 2', [1,2,3]._clone())
console.assert([]._clone()._eq([]), 'Clone (Array) 3', []._clone())

o1 = { d: new Date() }
o2 = o1._clone(1)
o1.d.setYear(1970)

console.assert(o1.d.getYear() != o2.d.getYear(), '!Clone 1 (Date)', o2)

o1 = new Date()
o2 = o1._clone()
o1.setYear(1970)

//console.log(o1,o2)
//process.exit(1)

console.assert(o1.getYear() != o2.getYear(), '!Clone 2 (Date)', o2)

class C {}
let c = new C()
let n = 1
let d = new Date()
let s = ''
let o = {}
let a = []
let f = () => 1

console.assert(f._is(Function), 'is (Function,Function)', f)
console.assert(!f._is(Object), '!is (Function,Object)', f)

console.assert(c._is(C), 'is (Class,Class)', c)
console.assert(c._is(Object), 'is (Class,Object)', c)
console.assert(!c._is(Number), '!is (Class,Number)', c)
console.assert(n._is(Number), 'is (Number,Number)', n)
console.assert(!n._is(Object), '!is (Number,Object)', n)
console.assert(s._is(String), 'is (String,String)', s)
console.assert(!s._is(Object), '!is (String,Object)', s)
console.assert(d._is(Date), 'is (Date,Date)', d)
console.assert(d._is(Object), 'is (Date,Object)', d)
console.assert(!d._is(Number), '!is (Date,Number)', d)
console.assert(!d._is(String), '!is (Date,String)', d)

console.assert(a._is(Array), 'is (Array,Array)', a)
console.assert(a._is(Object), 'is (Array,Object)', a)
console.assert(!a._is(String), '!is (Array,String)', a)
console.assert(o._is(Object), 'is (Object,Object)', o)
console.assert(!o._is(Array), '!is (Object,Array)', o)

o1 = { a: () => 0 , b: { c: () => 0 }}
o2 = o1._clone()
o3 = o1._clone(-1)
o1.a = () => 1
o1.b.c = () => 1
console.assert(o1.a() == 1, 'Clone 1 (Funcion)', o1.a())
console.assert(o2.a() == 0, 'Clone 2 (Funcion)', o2.a())
console.assert(o2.b.c() == 1, 'Clone 3 (Funcion)', o2.b.c())
console.assert(o3.a() == 0, 'Clone 4 (Funcion)', o3.a())
console.assert(o3.b.c() == 0, 'Clone 5 (Funcion)', o3.b.c())






