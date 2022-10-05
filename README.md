## Objix

A dangerously convienient utility, high performance, lightweight utility (2kb min) that injects usefull functions into the Object prototype to sugar many common use cases for working with native Javascript objects.

The functions include copies of Object class methods and Array prototype methods that are applied to the values of the object as well others inspired by lodash and some extras to delete keys, clean entries, printing, comparing, spliting and joining object togther.

The methods are highly optimised with zero copy operations where possible. There is however very limited type checking to guard against unwanted side effects. As a result, combined with the faster startup times for using prototypes, performance in most cases is signifantly faster than lodash equivalents. (eg `ob.map(fn)` can be up to 100% faster than `_.mapValues(ob, fn)` when working with small objects accortding to simple ops/sec [benchmarks](bench.js)
`node bench 1000 10 10`

| Function | Objix   | Lodash  | % Imp  |
| -------- | ------- | ------- | ------ |
| Map      | 2134.02 | 1083.66 | 96.93  |
| Filter   | 992.06  | 95.16   | 942.52 |
| Find     | 7045.56 | 2940.56 | 139.6  |
| KeyBy    | 2941.39 | 1744.72 | 68.59  |
| Equals   | 745.86  | 424.24  | 75.81  |
| Clone    | 1028.14 | 840.28  | 22.36  |
| Some     | 2507.86 | 1366.36 | 83.54  |
| Every    | 3352.14 | 2721.61 | 23.17  |

**NOTE:** Messing with Object prototypes may have unintended consequences in larger applications, on the upside however just think of all the fun key strokes you could save by typing something like
`ob.map(fun)` instead of `for (let key in Object.keys(ob) ob[key] = fun(ob[key], key))`

## Usage

### Node

Install:

```
npm i -save objix
```

Require:

```
require('objix')

console.log({a:1}.map(v => v+1 ))
```

### Browser:

```
<script src="https://cdn.jsdelivr.net/gh/mattaylor/objix@main/objix.min.js"/>

<script>
console.log({a:1}.map(v => v+1 ))
</script>
```

### Chaining

Most of these function return objects including those modifying thid and so can be easily chained together.

```javascript
{a: 0, b: 1, c: 2}.clean().map(v => v+1) // {b: 2, c: 3}
```

### Function Aliases

All functions documented below are also callable with a '\_' prefix to the function name.
This can help ensure that the function is availble and not overwritten by other object property assignments.

```javascript
{a: 1}.size() == {a: 1}._size() //true
{a: 1}.find(v => v) == {a: 1}._find(v => v) //true
```

### Exported Functions

All functions listed below are also availble using traditional module exports, where the first argument of the function will be the object that the function is targeting as `this` if called via the object prototype

```javascript
const = _ = require('objix')

_.size({a: 1}) == {a: 1}.size() // true
_.find({a: 1}, v => v) == {a: 1}.find(v => v) //true
```

## API

### Object.prototype.map(function)

Create a clone of this with function applied to each value.
Function takes value and key as arguments.

```javascript
{ a: 1 }.map(v => v+1) // { a: 2 }
{ a: 1, b: 2 }.map((v,k) => (k == 'b') ? v+1 : v) // { a: 1, b:3 }
```

### Object.prototype.flatMap(function)

Return new object with function applied to each entry return 0 or more new entry pairs
Function takes value and key as arguments.

```javascript
{ a: 1 }.flatMap((k,v) => [[k+1, v+1],[k+2, v+2]]) // { a1: 2, a2: 3 }
{ a: 1, b: 0 }.flatMap((k,v) => v ? [[k, v+1]] : []) // { a: 2 }
```

### Object.prototype.values()

Object.values(this)

```javascript
{ a: 1 }.values // [1]
```

### Object.prototype.keys()

Object.keys(this)

```javascript
{ a: 1 }.keys // ['a']
```

### Object.prototype.entries()

Object.entries(this)

```javascript
{ a: 1 }.entries // [[a, 1]]
```

### Object.prototype.isArray()

True if this is an array

```javascript
[].isArray() // true
{}.isArray() // false
```

### Object.prototype.isString()

True if this is a string

```javascript
''.isString() // true
{}.isString() // false
```

### Object.prototype.clean()

Return new object with falsy entry values removed

```javascript
{ a: 1, b: null, c: false, d: 0, e: '' }.clean() // { a: 1 }
```

### Object.prototype.filter(function)

Return new object with only values that pass function.
Function takes value and key as arguments.

```javascript
{ a: 1, b: 2 }.filter(v => v > 1) // { b: 2 }
{ a: 1, b: 2 }.filter((v,k) => k == 'b') // { b: 2 }
{ a: 1, b: 2 }.filter(v => v > 2) // {}
```

### Object.prototype.find(function)

Return first key where value passes function
Function takes value and key as arguments.

```javascript
{ a: 1, b: 2 }.find(v => v > 1) // 'b'
{ a: 1, b: 2 }.find(v => v > 2) // null

```

### Object.prototype.assign(...objects)

Assign and overwrite entries from arguments into this and return this.

```javascript
{ a: 1, b: 1 }.assign({ b: 2, c: 2 }, {c: 3 }) // { a: 1, b: 2, c: 3 }
```

### Object.prototype.merge(...objects)

Assign without overwriting entries from arguments into this and return this.

```javascript
{ a: 1, b: 1 }.merge({ b: 2, c: 2 }, {c: 3 }) // { a: 1, b: 1, c: 3 }
```

### Object.prototype.common(object)

Return new object with common entries intersecting with supplied object

```javascript
{ a: 1, b: 2 }.common({ a: 2, b: 2 }) // { b: 2 }
```

### Object.prototype.delete(...keys)

Return this with keys in arguments removed

```javascript
{ a: 1, b: 2, c: 3 }.delete('a','b') // { c: 3 }
```

### Object.prototype.some(function)

True is any entry passes function

```javascript
{ a: 1, b: 2 }.find(v => v > 1) // true
{ a: 1, b: 2 }.find(v => v > 2) // false
```

### Object.prototype.every(function)

True of all entries pass function
Function takes value and key as arguments.

```javascript
{ a: 1, b: 2 }.find(v => v > 0) // true
{ a: 1, b: 2 }.find(v => v > 1) // false
```

### Object.prototype.json()

JSON.stringfy(this)

```javascript
{ a: 1 }.json() // '{ "a": 1 }'
```

### Object.prototype.clone(depth)

Return new object with entries cloned from this.
Nested objects are also cloned to specified depth (-1 = any depth)

```javascript
let o1 = { a: 1, b: { c: 1 } }
let o2 = o1.clone()
let o3 = o1.clone(1)
o1.b.c = 2
o1.a = 2
o1 // { a: 2, b: { c: 2 } }
o2 // { a: 1, b: { c: 2 } }
o3 // { a: 1, b: { c: 1 } }
```

### Object.prototype.join(...objects)

Return new Object with values concatenated from arguments having the common keys

```javascript
{ a: 1 }.join({ a: 2 }, { a: 3 }) // { a: [1, 2, 3] }
```

### Object.prototype.split()

Return Array of new objects for each value in each entry of this with a value array

```javascript
{ a: [1,2] }.split() // [ { a: 1 }, { a: 2 } ]
```

### Object.prototype.contains(object)

True if all entries of argument are also in this

```javascript
{ a: 1, b: 2 }.contains({ a: 1 }) // true
{ a: 1 }.contains({ a: 1, b: 2 }) // false
```

### Object.prototype.equals(object, depth)

True if all entries of this equal the argument and argument has no other entries
May recurse to a given depth (-1 for any depth)

```javascript
{ a: 1 }.equals({ a: 1 }) // true
{ a: 1 }.equals({ a: 2 }) // false
{ a: 1, b: { c: 1 }}.equals({ a: 1, b: { c: 1 }}) // false
{ a: 1, b: { c: 1 }}.equals({ a: 1, b: { c: 1 }}, 1) // true

```

### Object.prototype.size()

Return number of entries of this.

```javascript
{}.size() // 0
{ a: 1, b: 2 }.size() // 2
```

### Object.prototype.keyBy(array, key)

Index an array of objects into this using the given key, and return this.

```javascript
o = {}
o.keyBy([{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }], 'a')
o // { o1: { a: 'o1' }, o2: [ { a: 'o2', b: 1 }, { a: 'o2' } ]
```

### Object.prototype.bind(key, function)

Binds a function to this object using the given key and applies this as its first argument.

```javascript
o = { a: 1, b: 2, c: 3 }
o.bind('max', m => m.values().sort((a, b) => b - a)[0])
// o.max = function() { return this.values().sort((a, b) => b - a)[0]) }
o.max() // 3
```
