require('./objix')

const o1 = { a: 1 }
const o2 = { a: 1, b: 2 }
const o3 = { a: 2, b: 2, c: 3}
const o4 = { a: 2, b: 2, c: 3, d: 4}

console.assert(o1.equals({a: 1}), 'Equals')
console.assert(!o1.equals({a: 2}), '!Equals')

console.assert(o2.contains(o1), 'Contains')
console.assert(!o1.contains(o2), '!Contains')

console.assert(o1.map(_ => _+1).a === 2, 'Map')
console.assert(o1.map(_ => _+1).a != o1.a, '!Map')

//console.assert(o1.apply(_ => _-1) && o1.a === 0, 'Apply')

console.assert(o2.find(_ => _ > 1) === 'b', 'Find')
console.assert(!o2.find(_ => _ > 3), '!Find')

console.assert(o3.filter(_ => _ < 3).equals({ a: 2, b: 2 }), 'Filter')
console.assert(o3.filter(_ => _ < 0).equals({}), '!Filter')

console.assert({a:1,b:2}.common({b:2,c:3}).equals({b:2}), 'Common')
console.assert({a:1,b:2}.common({b:3}).equals({}), '!Common')

console.assert({a:1}.size() == 1, 'Size')
console.assert(!{}.size(), '!Size')

console.assert(o3.assign({d:4}).equals(o4) && !o3.equals(o4), 'Assign')
console.assert(o3.patch({d:4}) && o3.equals(o4), 'Patch')

console.assert(o3.delete('d','c','b') && o3.equals({a:2}), 'Delete')
console.assert(o3.delete('d','c','b') && !o3.equals({d:2}), '!Delete')

console.assert(o4.clone().equals(o4), 'Clone')
console.assert(o4.clone() !== o4, '!Clone')

console.assert({a:1}.join({a:2}).a[1] == 2, 'Join')

console.assert({a: [1,2]}.split(), 'Split')

let r = {a: 1}.flatMap((k,v) => [[k+1, v+1],[k+2, v+2]])
console.assert(r.equals({a1: 2, a2: 3}), 'FlatMap', r)

console.assert({a: 0, b: 2, c: null}.clean().equals({b:2}), 'Clean')
console.assert([].isArray(), 'isArray')
console.assert(!{}.isArray(), '!isArray')

console.assert({a:1, b:1}.equals({a:1, b:[1]}), 'Equals Array')
console.assert(!{a:1, b:[1,2]}.equals({a:1, b:[1,2]}), '!Equals Array')
console.assert({a:1, b:[1,2]}.equals({a:1, b:[1,2]}, true), 'Deep Equals Array')
console.assert(!{a:1, b:{c:1}}.equals({a:1, b:{c:2}}, true), '!Deep Equals Object')
console.assert({a:1, b:{c:1}}.equals({a:1, b:{c:1}}, true), 'Deep Equals Object')
console.assert({a:1, b:[{c:1}, {c:2}]}.equals({a:1, b:[{c:1}, {c:2}]}, -1), 'Deep Equals Mixed')


let x = {}.keyBy([{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }], 'a')
// console.log(o)
console.assert(x.equals({ o1: { a: 'o1' }, o2: [ { a: 'o2', b: 1 }, { a: 'o2' } ]}, -1), 'From')
