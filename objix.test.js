
require('./objix')
const lo = require('lodash')
let o1 = { a: 1 }
let o2 = { a: 1, b: 2 }
let o3 = { a: 2, b: 2, c: 3}
let o4 = { a: 2, b: 2, c: 3, d: 4}


console.assert(o1.eq({a: 1}), 'Equals')
console.assert(o1._eq({a: 1}), '_Equals')
console.assert(!o1.eq({a: 2}), '!Equals')

console.assert({a:1}.eq({a: 1}), 'Equals')
console.assert(!{a:1}.eq(1), '!Equals 0 (Number)')
console.assert(!{}.eq(1), '!Equals 1 (Number)')

console.assert({a:[1]}.eq({a:[1]}, 1), 'Equals (Array)')
console.assert({a:[]}.eq({a:[]}, 1), 'Equals ([])')
console.assert(!{a:[1]}.eq({a:[]}, 1), '!Equals ([])')
console.assert([1].eq([1]), 'Equals (Array)')
console.assert(![1].eq([0]), '!Equals (Array)')
console.assert('string'.eq('string'), 'Equals (String)')
console.assert(!'string'.eq({}), '!Equals (String)')
console.assert(!'string'.eq(''), '!Equals (String)')



console.assert(o2.contains(o1), 'Contains')
console.assert(o2._contains(o1), '_Contains')
console.assert(!o1.contains(o2), '!Contains')

console.assert(o1.map(_ => _+1).a === 2, 'Map')
console.assert(o1._map(_ => _+1).a === 2, '_Map')
console.assert(o1.map(_ => _+1).a != o1.a, '!Map')

//console.assert(o1.apply(_ => _-1) && o1.a === 0, 'Apply')

console.assert(o2.find(_ => _ > 1) === 'b', 'Find')
console.assert(o2._find(_ => _ > 1) === 'b', '_Find')
console.assert(!o2.find(_ => _ > 3), '!Find')

console.assert(o3.pick(_ => _ < 3).eq({ a: 2, b: 2 }), 'Only')
console.assert(o3._pick(_ => _ < 3).eq({ a: 2, b: 2 }), '_Only')
console.assert(o3.pick(_ => _ < 0).eq({}), '!Only')

console.assert({a:1,b:2}.same({b:2,c:3}).eq({b:2}), 'Common')
console.assert({a:1,b:2}._same({b:2,c:3}).eq({b:2}), '_Common')
console.assert({a:1,b:2}.same({b:3}).eq({}), '!Common')

console.assert({a:1}.size() == 1, 'Size')
console.assert({a:1}._size() == 1, '_Size')
console.assert(!{}.size(), '!Size')

console.assert(o3.assign({d:4}).eq(o4) && o3.eq(o4), 'Assign')
console.assert(o3._assign({d:4}).eq(o4) && o3.eq(o4), '_Assign')

//console.assert(o3.patch({d:4}) && o3.eq(o4), 'Patch')
//console.assert(o3._patch({d:4}) && o3.eq(o4), '_Patch')

console.assert(o3.delete('d','c','b') && o3.eq({a:2}), 'Delete')
console.assert(o3._delete('d','c','b') && o3.eq({a:2}), '_Delete')
console.assert(o3.delete('d','c','b') && !o3.eq({d:2}), '!Delete')

console.assert(o4.clone().eq(o4), 'Clone 1', o4)
let c0 = {a:1, b:{c:{d:1}}}.clone(-1)
console.assert(c0.eq({a:1,b:{c:{ d:1}}}, -1), 'Clone 2', c0)
console.assert(o4._clone().eq(o4), '_Clone')

console.assert(o4.clone() != o4, '!Clone', o4)

console.assert({a:1}.join({a:2}).a[1] == 2, 'Join')
console.assert({a:1}._join({a:2}).a[1] == 2, '_Join')

console.assert({a: [1,2]}.split(), 'Split')
console.assert({a: [1,2]}._split(), '_Split')

let r = {a: 1}.flatMap((k,v) => [[k+1, v+1],[k+2, v+2]])
console.assert(r.eq({a1: 2, a2: 3}), 'FlatMap', r)

let _r = {a: 1}._flatMap((k,v) => [[k+1, v+1],[k+2, v+2]])
console.assert(_r.eq({a1: 2, a2: 3}), '_FlatMap', _r)

console.assert({a: 0, b: 2, c: null}.clean().eq({b:2}), 'Clean')
console.assert({a: 0, b: 2, c: null}._clean().eq({b:2}), '_Clean')

console.assert([].is(Array), 'isArray')
console.assert([]._is(Array), '_isArray')
console.assert(!{}.is(Array), '!isArray')

console.assert({a:1, b:1}.eq({a:1, b:[1]}), 'Equals Array')
console.assert(!{a:1, b:[1,2]}.eq({a:1, b:[1,2]}), '!Equals Array')
console.assert({a:1, b:[1,2]}.eq({a:1, b:[1,2]}, true), 'Deep Equals Array')
console.assert(!{a:1, b:{c:1}}.eq({a:1, b:{c:2}}, true), '!Deep Equals Object')
console.assert({a:1, b:{c:1}}.eq({a:1, b:{c:1}}, true), 'Deep Equals Object')
console.assert({a:1, b:[{c:1}, {c:2}]}.eq({a:1, b:[{c:1}, {c:2}]}, -1), 'Deep Equals Mixed')
console.assert({a:1, b:[{c:1}, {c:2}]}._eq({a:1, b:[{c:1}, {c:2}]}, -1), '_Deep Equals Mixed')

console.assert({a:1, b:2}.some(v => v > 1), 'Some')
console.assert({a:1, b:2}._some(v => v > 1), '_Some')
console.assert(!{a:1, b:2}.some(v => v > 2),'!Some')

console.assert({a:1, b:2}.every(v => v > 0), 'Every')
console.assert({a:1, b:2}._every(v => v > 0), '_Every')
console.assert(!{a:1, b:2}.every(v => v > 1),'!Every')

let x = [{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }].keyBy('a')
console.assert(x.eq({ o1: { a: 'o1' }, o2: [ { a: 'o2', b: 1 }, { a: 'o2' } ]}, -1), 'KeyBy')

let _x = [{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }]._keyBy('a')
console.assert(_x.eq({ o1: { a: 'o1' }, o2: [ { a: 'o2', b: 1 }, { a: 'o2' } ]}, -1), '_KeyBy')

let _y = { a: 1, b: 2 }
_y.bind('max', o => o.entries().sort((a,b) => b[1] - a[1])[0][0])

console.assert(_y.max() == 'b', 'Bind', _y.max())

console.assert({a:1, b:[{c:1}]}.contains({c:1},-1), 'Contains Deep')
console.assert({a:1, b:{c:1}}.contains({c:1},1), 'Contains Once')
console.assert(!{a:1, b:[{c:1}]}.contains({c:2},-1), '!Contains Deep')
console.assert(!{a:1, b:[{c:1}]}.contains({c:1},1), '!Contains Once')


let op = {sum:0, id:'Proto'}
  .trap((v,k,t) => t.sum += t[k] ? v - t[k] : v,null,'a','b','c')
  .trap(() => 0, 'Read pick', 'sum')

op.a = 1
op.b = 4
op.a = 2
console.assert(op.sum == 6, 'Trap', op)
try { console.assert(!op.sum++, '!Trap', op)} catch {}

let op1 = op.new({id:'Op1'})

op1.c = 10
// console.log(op, op1)
console.assert(op.sum == 6, 'New (Proto)', op.sum)
try { console.assert(!op1.sum++, 'New (!Trap)', op1)} catch {}
console.assert(op1.sum == 16, 'New (Trap)', op1.sum)

console.assert('123'.eq('123'), 'Equals (String)')
console.assert(!'123'.eq('1234'), '!Equals (String)')
console.assert((123).eq(123), 'Equals 3 (Number)')
console.assert(!(1234).eq(123), '!Equals 3 (Number)')
console.assert([123].eq([123]), 'Equals [Number]')
console.assert(![1234].eq([123]), '!Equals 2 [Number]')
console.assert(![123].eq([123,0]), '!Equals 2 [Number]')
console.assert({a:0}.eq({a:0}), 'Equals (Falsy)')
console.assert(!{a:{b:0}}.eq({a:{b:0}}), '!Equals (Deep Falsy)')
console.assert({a:{b:0}}.eq({a:{b:0}},1), 'Equals (Deep Falsy)')
console.assert([].eq([]), 'Equals (Array)')
console.assert(![].eq([0]), '!Equals (Array)')
console.assert([[{}]].eq([[{}]], 2), 'Equals (Deep Array)')





let c1 = { a: 1, b: { c: 1 }, d: [1], e: 's', f:null }
let c2 = c1.clone()
let c3 = c1.clone(1)
//let c2 = lo.clone(c1)
//let c3 = lo.cloneDeep(c1)
c1.b.c = 2
c1.a = 2
c1.d.pop()
console.assert(c1.eq({ a: 2, b: { c: 2 }, d:[], e: 's', f:null}, -1), 'Clone 1', c1)
console.assert(!c1.eq({ a: 2, b: { c: 2 }, d:[], e: '', f:null}, -1), '!Clone 1', c1)
console.assert(c2.eq({ a: 1, b: { c: 2 }, d:[], e: 's', f:null}, -1), 'Clone 2', c2)
console.assert(!c2.eq({ a: 1, b: { c: 2 }, d:[1], e: 's', f:null}, -1), '!Clone 2', c2)
console.assert(c3.eq({ a: 1, b: { c: 1 }, d:[1], e: 's',f:null}, -1), 'Clone 3', c3)
console.assert(!c3.eq({ a: 1, b: { c: 1 }, d:[1], e: 's',f:false}, -1), '!Clone 3', c3)
//o2.log('o2') // { a: 1, b: { c: 2 }}
//o3.log('o3') // { a: 1, b: { c: 1 }}

o1 = 'asdf'
c1 = o1.clone()
console.assert(o1 == c1, 'Clone (String)', c1)

o1 = ['asdf']
c1 = o1.clone()
console.assert(o1.eq(c1), 'Clone (Array)', c1)
o1.pop()
console.assert(!o1.eq(c1), '!Clone (Array)', c1)

console.assert([1,2,3].clone().eq([1,2,3]), 'Clone (Array)', [1,2,3].clone())
console.assert([].clone().eq([]), 'Clone (Array)', [].clone())

o1 = { d: new Date() }
o2 = o1.clone(1)
o1.d.setYear(1970)

console.assert(o1.d.getYear() != o2.d.getYear(), '!Clone 1 (Date)', o2)

o1 = new Date()
o2 = o1.clone()
o1.setYear(1970)

console.assert(o1.getYear() != o2.getYear(), '!Clone 2 (Date)', o2)

class C {}
let c = new C()
let n = 1
let d = new Date()
let s = ''
let o = {}
let a = []
let f = () => 1

console.assert(f.is(Function), 'is (Function,Function)', f)
console.assert(!f.is(Object), '!is (Function,Object)', f)

console.assert(c.is(C), 'is (Class,Class)', c)
console.assert(c.is(Object), 'is (Class,Object)', c)
console.assert(!c.is(Number), '!is (Class,Number)', c)
console.assert(n.is(Number), 'is (Number,Number)', n)
console.assert(!n.is(Object), '!is (Number,Object)', n)
console.assert(s.is(String), 'is (String,String)', s)
console.assert(!s.is(Object), '!is (String,Object)', s)
console.assert(d.is(Date), 'is (Date,Date)', d)
console.assert(d.is(Object), 'is (Date,Object)', d)
console.assert(!d.is(Number), '!is (Date,Number)', d)
console.assert(!d.is(String), '!is (Date,String)', d)

console.assert(a.is(Array), 'is (Array,Array)', a)
console.assert(a.is(Object), 'is (Array,Object)', a)
console.assert(!a.is(String), '!is (Array,String)', a)
console.assert(o.is(Object), 'is (Object,Object)', o)
console.assert(!o.is(Array), '!is (Object,Array)', o)

o1 = { a: () => 0 , b: { c: () => 0 }}
o2 = o1.clone()
o3 = o1.clone(-1)
o1.a = () => 1
o1.b.c = () => 1
console.assert(o1.a() == 1, 'Clone 1 (Funcion)', o1.a())
console.assert(o2.a() == 0, 'Clone 2 (Funcion)', o2.a())
console.assert(o2.b.c() == 1, 'Clone 3 (Funcion)', o2.b.c())
console.assert(o3.a() == 0, 'Clone 4 (Funcion)', o3.a())
console.assert(o3.b.c() == 0, 'Clone 5 (Funcion)', o3.b.c())






