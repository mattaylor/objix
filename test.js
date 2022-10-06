require('./objix')

const o1 = { a: 1 }
const o2 = { a: 1, b: 2 }
const o3 = { a: 2, b: 2, c: 3}
const o4 = { a: 2, b: 2, c: 3, d: 4}

console.assert(o1.equals({a: 1}), 'Equals')
console.assert(o1._equals({a: 1}), '_Equals')
console.assert(!o1.equals({a: 2}), '!Equals')

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

console.assert(o3.filter(_ => _ < 3).equals({ a: 2, b: 2 }), 'Filter')
console.assert(o3._filter(_ => _ < 3).equals({ a: 2, b: 2 }), '_Filter')
console.assert(o3.filter(_ => _ < 0).equals({}), '!Filter')

console.assert({a:1,b:2}.common({b:2,c:3}).equals({b:2}), 'Common')
console.assert({a:1,b:2}._common({b:2,c:3}).equals({b:2}), '_Common')
console.assert({a:1,b:2}.common({b:3}).equals({}), '!Common')

console.assert({a:1}.size() == 1, 'Size')
console.assert({a:1}._size() == 1, '_Size')
console.assert(!{}.size(), '!Size')

console.assert(o3.assign({d:4}).equals(o4) && o3.equals(o4), 'Assign')
console.assert(o3._assign({d:4}).equals(o4) && o3.equals(o4), '_Assign')

//console.assert(o3.patch({d:4}) && o3.equals(o4), 'Patch')
//console.assert(o3._patch({d:4}) && o3.equals(o4), '_Patch')

console.assert(o3.delete('d','c','b') && o3.equals({a:2}), 'Delete')
console.assert(o3._delete('d','c','b') && o3.equals({a:2}), '_Delete')
console.assert(o3.delete('d','c','b') && !o3.equals({d:2}), '!Delete')

console.assert(o4.clone().equals(o4), 'Clone')
console.assert({a:1, b:{c:{d:1}}}.clone(-1).equals({a:1,b:{c:{ d:1}}}, -1), 'Clone')
console.assert(o4._clone().equals(o4), '_Clone')

console.assert(o4.clone() !== o4, '!Clone')

console.assert({a:1}.join({a:2}).a[1] == 2, 'Join')
console.assert({a:1}._join({a:2}).a[1] == 2, '_Join')

console.assert({a: [1,2]}.split(), 'Split')
console.assert({a: [1,2]}._split(), '_Split')

let r = {a: 1}.flatMap((k,v) => [[k+1, v+1],[k+2, v+2]])
console.assert(r.equals({a1: 2, a2: 3}), 'FlatMap', r)

let _r = {a: 1}._flatMap((k,v) => [[k+1, v+1],[k+2, v+2]])
console.assert(_r.equals({a1: 2, a2: 3}), '_FlatMap', _r)

console.assert({a: 0, b: 2, c: null}.clean().equals({b:2}), 'Clean')
console.assert({a: 0, b: 2, c: null}._clean().equals({b:2}), '_Clean')

console.assert([].isArray(), 'isArray')
console.assert([]._isArray(), '_isArray')
console.assert(!{}.isArray(), '!isArray')

console.assert({a:1, b:1}.equals({a:1, b:[1]}), 'Equals Array')
console.assert(!{a:1, b:[1,2]}.equals({a:1, b:[1,2]}), '!Equals Array')
console.assert({a:1, b:[1,2]}.equals({a:1, b:[1,2]}, true), 'Deep Equals Array')
console.assert(!{a:1, b:{c:1}}.equals({a:1, b:{c:2}}, true), '!Deep Equals Object')
console.assert({a:1, b:{c:1}}.equals({a:1, b:{c:1}}, true), 'Deep Equals Object')
console.assert({a:1, b:[{c:1}, {c:2}]}.equals({a:1, b:[{c:1}, {c:2}]}, -1), 'Deep Equals Mixed')
console.assert({a:1, b:[{c:1}, {c:2}]}._equals({a:1, b:[{c:1}, {c:2}]}, -1), '_Deep Equals Mixed')

console.assert({a:1, b:2}.some(v => v > 1), 'Some')
console.assert({a:1, b:2}._some(v => v > 1), '_Some')
console.assert(!{a:1, b:2}.some(v => v > 2),'!Some')

console.assert({a:1, b:2}.every(v => v > 0), 'Every')
console.assert({a:1, b:2}._every(v => v > 0), '_Every')
console.assert(!{a:1, b:2}.every(v => v > 1),'!Every')

let x = {}.keyBy([{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }], 'a')
console.assert(x.equals({ o1: { a: 'o1' }, o2: [ { a: 'o2', b: 1 }, { a: 'o2' } ]}, -1), 'KeyBy')

let _x = {}._keyBy([{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }], 'a')
console.assert(x.equals({ o1: { a: 'o1' }, o2: [ { a: 'o2', b: 1 }, { a: 'o2' } ]}, -1), '_KeyBy')

let _y = { a: 1, b: 2 }
//_y.bind('max', o => o.entries().sort((a,b) => b[1] - a[1])[0][0])
_y.bind('max', o => o.entries().sort((a,b) => b[1] - a[1])[0][0])

console.assert(_y.max() == 'b', 'Bind', _y.max())

console.assert({a:1, b:[{c:1}]}.contains({c:1},-1), 'Contains Deep')
console.assert({a:1, b:{c:1}}.contains({c:1},1), 'Contains Once')
console.assert(!{a:1, b:[{c:1}]}.contains({c:2},-1), '!Contains Deep')
console.assert(!{a:1, b:[{c:1}]}.contains({c:1},1), '!Contains Once')



//let a = { a: 1}
//a.update(v => v+1)
//console.assert(a.equals({a: 2}, 'Update'))
//let _a = { a: 1}
//_a._update(v => v+1)
//console.assert(_a.equals({a: 2}, '_Update'))