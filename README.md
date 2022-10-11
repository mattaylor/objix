## Objix

A dangerously convienient, high performance, zero dependency, lightweight utility (2kb min) that injects usefull functions into the Object prototype to sugar many common use cases when working with native Javascript objects.

The functions include copies of Object class methods and Array prototype methods that are applied to the values of the object as well others inspired by lodash and some extras to delete keys, clean entries, stringify, compare, split and join objects as well as logging, trapping and observing changes.

The methods are highly optimised with zero copy operations where possible. There is however very limited type checking to guard against unwanted side effects. When combined with the faster startup times for using prototypes, performance in most cases is signifantly faster than lodash equivalents. (eg `ob.map(fn)` can be up to 50% faster than `_.mapValues(ob, fn)` when working with small objects according to simple ops/sec [benchmarks](bench.js)

### Ops/sec (iters: 1000, heats: 10 size: 10)

| Function | Objix   | Lodash | % Imp   | % Err |
| -------- | ------- | ------ | ------- | ----- |
| Map      | 2495.9  | 1702.7 | 46.58   | 42.64 |
| Filter   | 1096.4  | 94     | 1066.38 | 13.69 |
| Find     | 13985.6 | 3564.7 | 292.34  | 72.58 |
| KeyBy    | 5492.2  | 2762.3 | 98.83   | 57.02 |
| Equals   | 784.4   | 475.3  | 65.03   | 18.98 |
| Clone    | 997.5   | 941.3  | 5.97    | 15.83 |
| Some     | 2920.1  | 2024.6 | 44.23   | 37.38 |
| Every    | 5084.8  | 3236.8 | 57.09   | 41.47 |

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

Most of these function return objects including those modifying `this` and so can be easily chained together.

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

All functions listed below are also available using traditional module exports, where the first argument of the function will be the object that the function is targeting as `this` if called via the object prototype

```javascript
const _ = require('objix')

_.size({ a: 1 }) == { a: 1 }.size() // true
_.find({ a: 1 }, v => v) == { a: 1 }.find(v => v) //true
```

### Simple Classes

Any object can act as a class from which new objects can be derived. All propoerties of `this` are inherited - including traps!!

```javascript
let Person = { firstName: 'john', lastName: 'doe' }
  .trap(v => new Date(v).getDate(), 'Invalid date', 'dob')
  .bind('age', t => Math.abs(Date.now() - new Date(t.dob)) / 31536000000)
  .bind('name', t => t.firstName + ' ' + t.lastName)

let p1 = Person.new({ firstName: 'jane' })
p1.name() // 'jane doe'
p1.dob = 'foobar' // Uncaught [ 'Invalid date', 'dob', 'foobar' ]
p1.dob = '10/10/2000'
p1.age() // 22
```

## API

### Object.prototype.map(function)

Create a clone of `this` with function applied to each value.
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

Object.values(`this`)

```javascript
{ a: 1 }.values // [1]
```

### Object.prototype.create()

Object.create(this)

```javascript
let o = { a: 1 }.create() // {}
o.a // 1
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

True if `this` is an array

```javascript
[].isArray() // true
{}.isArray() // false
```

### Object.prototype.isString()

True if `this` is a string

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

Assign and overwrite entries from arguments into `this` and return `this`.

```javascript
{ a: 1, b: 1 }.assign({ b: 2, c: 2 }, {c: 3 }) // { a: 1, b: 2, c: 3 }
```

### Object.prototype.extend(...objects)

Return a new object with new entries assigned from arguments without overwriting `this`.

```javascript
{ a: 1, b: 1 }.extend({ b: 2, c: 2 }, {c: 3 }) // { a: 1, b: 1, c: 3 }
```

### Object.prototype.common(object)

Return new object with common entries intersecting with supplied object

```javascript
{ a: 1, b: 2 }.common({ a: 2, b: 2 }) // { b: 2 }
```

### Object.prototype.delete(...keys)

Return `this` with keys in arguments removed

```javascript
{ a: 1, b: 2, c: 3 }.delete('a','b') // { c: 3 }
```

### Object.prototype.some(function)

True is any entry passes function

```javascript
{ a: 1, b: 2 }.some(v => v > 1) // true
{ a: 1, b: 2 }.some(v => v > 2) // false
```

### Object.prototype.every(function)

True of all entries pass function
Function takes value and key as arguments.

```javascript
{ a: 1, b: 2 }.every(v => v > 0) // true
{ a: 1, b: 2 }.every(v => v > 1) // false
```

### Object.prototype.json()

JSON.stringfy(`this`)

```javascript
{ a: 1 }.json() // '{ "a": 1 }'
```

### Object.prototype.clone(depth)

Return new object with entries cloned from `this`.
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

Return Array of new objects for each value in each entry of `this` with a value array

```javascript
{ a: [1,2] }.split() // [ { a: 1 }, { a: 2 } ]
```

### Object.prototype.contains(object, depth)

True if all entries of argument are also in `this`. May recurse to a given depth (-1 = any depth)

```javascript
{ a: 1 }.contains({ a: 1, b: 2 }) // false
{ a: 1, b: 2 }.contains({ a: 1 }) // true
{ a: 1, b: [{ c: 1 }]}.contains({ c: 1 }, 1) // false
{ a: 1, b: [{ c: 1 }]}.contains({ c: 1 }, 2) // true

```

### Object.prototype.equals(object, depth)

True if all entries of `this` equal the argument and argument has no other entries
May recurse to a given depth (-1 for any depth)

```javascript
{ a: 1 }.equals({ a: 1 }) // true
{ a: 1 }.equals({ a: 2 }) // false
{ a: 1, b: { c: 1 }}.equals({ a: 1, b: { c: 1 }}) // false
{ a: 1, b: { c: 1 }}.equals({ a: 1, b: { c: 1 }}, 1) // true

```

### Object.prototype.size()

Return number of entries of `this`.

```javascript
{}.size() // 0
{ a: 1, b: 2 }.size() // 2
```

### Object.prototype.keyBy(array, key)

Index an array of objects into `this` using the given key, and return `this`.

```javascript
o = {}
o.keyBy([{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }], 'a')
o // { o1: { a: 'o1' }, o2: [ { a: 'o2', b: 1 }, { a: 'o2' } ]
```

### Object.prototype.bind(key, function)

Binds a function to `this` object using the given key and applies `this` as its first argument. Returns `this`.

```javascript
o = { a: 1, b: 2, c: 3 }
o.bind('max', m => m.values().sort((a, b) => b - a)[0])
// o.max = function() { return `this`.values().sort((a, b) => b - a)[0]) }
o.max() // 3
```

### Object.prototype.log(msg, type='log')

Prints a deep clone of `this` to the console together with a time stamp and an optional msg.
Alternative console methods such as 'trace', 'info', 'error' and 'debug' may also be specified. Returns `this`.

```javascript
let o = { a: 0, b: 1 }
  .clean()
  .log('CLEAN') // 2022-10-07T00:00 CLEAN { b: 1 }
  .map(v => v + 1)
  .log('MAP') // 2022-10-07T00:00 MAP { b: 2 }
  .log('STACK', 'trace')
/*
Trace: 2022-10-06T21:21 STACK { b: 2 }
  at Object.P.log (/Users/mat/extra/objix/objix.js:116:15)
  ...
*/
```

### Object.prototype.trap(function, error, key)

Returns a proxy of `this` which traps all property assignments using the supplied function. The function takes `val`, `key` and `this` as arguments.
If the function returns falsey and an error message is supplied then an exception will be thrown.
If no error message is provided the function just acts as an observer, although updates to `this` are still possible.
If `key` is defined then the trap function will only be called for assignments to the `key` property of `this`

```javascript
let o = { a: 1, sum: 1 }
  .trap((v, k, t) => v != t[k] && console.log(k + ' has changed'))
  .trap(v => v > 0, 'Values must be positive')
  .trap((v, k, t) => k != 'sum' && (t.sum += v - (t[k] || 0)))
  .trap(v => false, 'Sum is read only', 'sum')

o.b = 2 //  b has changed
o.c = 0 //  Uncaught [ 'Values must be positive', 'c', 0 ]
o.sum = 1 // Uncaught [ 'Sum is read only', 'sum', 1 ]
o // { a: 1, b: 2, sum: 3 }
```

### Object.prototype.new(object)

Create a new object using `this` as its protoype with additonal properties assigned from the argument. If traps have been defined for `this`, then the new object will also be a Proxy with the same trap handlers but will target a new object which uses `this` as its prototype.

```javascript
let P = { a: 1 }.trap(v => v > 0, 'Not Positive')
o1 = P.new({ b: 1 }) // { a: 1, b: 1 }
o2 = P.new({ a: 2 }) // { a: 2 }
o1.c = 0 // // Uncaught [ 'Not Positive', 'c', 0 ]
```
