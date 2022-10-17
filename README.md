## Objix

A dangerously convienient, high performance, zero dependency, lightweight utility (2.7kb min) that injects usefull functions into the Object prototype to sugar many common use cases when working with native Javascript objects, and give you super powers in the process!

The functions include copies of Object class methods and Array prototype methods that are applied to the values of the object as well others inspired by lodash and some extras to delete keys, stringify, compare, split and join objects, log messages, check types and trapping and observing changes.

These protoype methods are all non enumerable and are highly optimised with zero copy operations where possible. There is however very limited type checking to guard against unwanted side effects. When combined with the faster startup times for using prototypes, performance in most cases is signifantly faster than lodash equivalents. (eg `ob.map(fn)` is typically over 60% faster than `_.mapValues(ob, fn)` when working with small objects according to simple [benchmarks](#benchmarks)

**NOTE:** Messing with Object prototypes may have unintended consequences in larger applications, on the upside however just think of all the fun key strokes you could save

## Usage

### Node

Install:

```bash
> npm i -save objix
```

Require:

```javascript
require('objix')

console.log({ a: 1 }.map(v => v + 1))
```

### Browser:

```html
<script src="https://cdn.jsdelivr.net/gh/mattaylor/objix@main/objix.min.js"></script>

<script>
  { a: 1 }.map(v => v + 1)).log()
</script>
```

### Chaining

Most of these function return objects including those modifying `this` and so can be easily chained together.

```javascript
{ a: 0, b: 1, c: 2 }.clean().map(v => v+1) // { b: 2, c: 3 }
```

### Function Aliases

All functions documented below are also callable with a '\_\_' prefix to the function name.
This can help ensure that the function is availble and not overwritten by other object property assignments.

```javascript
{ a: 1 }.size() == { a: 1 }.__size() //true
{ a: 1 }.find(v => v) == { a: 1 }.__find(v => v) //true
```

### Exported Functions

All functions listed below are also available using traditional module exports, where the first argument of the function will be the object that the function is targeting as `this` if called via the object prototype

```javascript
const _ = require('objix')

_.size({ a: 1 }) == { a: 1 }.size() // true
_.find({ a: 1 }, v => v) == { a: 1 }.find(v => v) //true
```

### Simple Classes

Any object can act as a class from which new objects can be derived. All properties of `this` are inherited - including traps!!

```javascript
let Person = { firstName: 'john', lastName: 'doe' }
  .trap(v => new Date(v).getDate(), 'Invalid date', 'dob')
  .memo('age', t => Math.abs((Date.now() - new Date(t.dob)) / 31536000000))
  .memo('name', t => t.firstName + ' ' + t.lastName)

let p1 = Person.new({ firstName: 'jane' })
p1.name() // 'jane doe'
p1.dob = 'foobar' // Uncaught 'Invalid date, dob, foobar'
p1.dob = '10/10/2000'
p1.age() // 22
```

## API

### Object.prototype.map(function)

Create a clone of `this` with function applied to each value.
Function takes value and key as arguments.

```javascript
{ a: 1 }.map(v => v+1) // { a: 2 }
{ a: 1, b: 2 }.map((v,k) => (k == 'b') ? v+1 : v) // { a: 1, b: 3 }
```

### Object.prototype.flatMap(function)

Return new object with function applied to each entry. Function takes value and kay as arguments and should return 0 or more new entry pairs

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

### Object.prototype.is(type)

True if `this` is an instance of `type`.

```javascript
let n = 1
let d = new Date()
let b = false
let f = () => 0
class Class1 {}
class Class2 extends Class1 {}
let c = new Class2()
''.is(String) // true
''.is(Object) // false
{}.is(Object) // true
[].is(Array)  // true
[].is(Object) // true
f.is(Function) // true
f.is(Object) // false
d.is(Date) // true
d.is(Object) // true
d.is(Number) // false
n.is(Number) // true
n.is(Object) // false
b.is(Boolean) // true
b.is(Object) // false
c.is(Class1) // true
c.is(Class2) // true
c.is(Object) // true
```

### Object.prototype[@@iterator]

Iterate through the values of `this`

```javascript
for (let v of { a: 1 }) console.log(v) // 1
```

### Object.prototype.clean()

Return a new object like `this` with falsy entry values removed

```javascript
{ a: 1, b: null, c: false, d: 0, e: '' }.clean() // { a: 1 }
```

### Object.prototype.filter(function)

Return new object like `this` with only entries for which the the supplied function returns truthy. Function takes value and key as arguments.

```javascript
{ a: 1, b: 2 }.filter(v => v > 1) // { b: 2 }
{ a: 1, b: 2 }.filter((v,k) => k == 'b') // { b: 2 }
{ a: 1, b: 2 }.filter(v => v > 2) // {}
```

### Object.prototype.find(function)

Return first key of `this` where value passes function
Function takes value and key as arguments.

```javascript
{ a: 1, b: 2 }.find(v => v > 1) // 'b'
{ a: 1, b: 2 }.find(v => v > 2) // null

```

### Object.prototype.assign(...objects)

Assign and overwrite entries of `this` from arguments in ascending priority and return `this`.

```javascript
{ a: 1, b: 1 }.assign({ b: 2, c: 2 }, { c: 3 }) // { a: 1, b: 2, c: 3 }
```

### Object.prototype.extend(...objects)

Assigns new properties into this from arguments in ascending priority without overwriting `this`.
Returns `this`

```javascript
{ a: 1, b: 1 }.extend({ b: 2, c: 2 }, {c: 3 }) // { a: 1, b: 1, c: 3 }
```

### Object.prototype.common(object)

Return new object with entries of `this` that are also present in the supplied object

```javascript
{ a: 1, b: 2 }.common({ a: 2, b: 2 }) // { b: 2 }
```

### Object.prototype.delete(...keys)

Return `this` with keys in arguments removed

```javascript
{ a: 1, b: 2, c: 3 }.delete('a','b') // { c: 3 }
```

### Object.prototype.some(function)

True if any entry of `this` passes function.
Function takes value and key as arguments.

```javascript
{ a: 1, b: 2 }.some(v => v > 1) // true
{ a: 1, b: 2 }.some(v => v > 2) // false
```

### Object.prototype.every(function)

True if all entries pass function.
Function takes value and key as arguments.

```javascript
{ a: 1, b: 2 }.every(v => v > 0) // true
{ a: 1, b: 2 }.every(v => v > 1) // false
```

### Object.prototype.has(value)

Returns first key of `this` where the value equals the argument, otherwise undefined.

```javascript
{ a: 1, b: 2 }.has(2) // b
{ a: 1, b: 2 }.has(0) // undefined
[1].has(1) // 1
[].has(1)  // undefined
```

### Object.prototype.at(path)

Return the property of this at `path`. If `path` is string `.` delimited keys then the the `this` will be traversed accordingly. ie `o.at('k1.k)` will return `o.k1.k2`

```javascript
{a:1}.at('a') // 1
{a:1, b:{c:3}}.at('b.c') // 3
{a:1, b:[1,2]}.at('b.1') // 2
```

### Object.prototype.\$(Formatter)

Convert `this` to a formatted string. If `Formatter` is not specified it will return a a compact representation of `this` based on `JSON.stringify` with all double quotes and escape characters removed.

If `Formatter` is a string, then that string will be returned with all occurances of `${key}` or `$key` substituted with `this.at(key).$()`

If `Formatter` is not a string then the `stringify` method of the `Formatter` will be called with `this` as an argument, allowing alternative standard formatters such as `JSON` to be used.

```javascript
{ a: 1 }.$() // '{a:1}'
{ a: 1, b: [2, 3], c: { d: 'four,five' }}.$() // '{a:1,b:[2,3],c:{d:four,five}}'
{ a: 1}.$(JSON) // '{"a":1}'
{ a: 1, b: { c: 2 }}.$('b is $b', b.c is ${b.c}) // 'b is {c:2} and b.c is 2'
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
o1 // { a: 2, b: { c: 2 }}
o2 // { a: 1, b: { c: 2 }}
o3 // { a: 1, b: { c: 1 }}
```

### Object.prototype.join(...objects)

Return a new Object with the same keys as `this` and some values as arrays which concatenate the original value of `this` with values from all of the arguments having the same key.

```javascript
{ a: 1 }.join({ a: 2 }, { a: 3 }) // { a: [ 1, 2, 3 ]}
```

### Object.prototype.split()

Return Array of new objects for each value in each entry of `this` with a value array

```javascript
{ a: [ 1, 2 ]}.split() // [{ a: 1 }, { a: 2 }]
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
[1,2,3].size() // 3
{ a: 1, b: 2 }.size() // 2
`one`.size() // 3
```

### Object.prototype.keyBy(array, key)

Index an array of objects into `this` using the given key, and return `this`.

```javascript
o = {}
o.keyBy([{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }], 'a')
o // { o1: { a: 'o1' }, o2: [{ a: 'o2', b: 1 }, { a: 'o2' }]
```

### Object.prototype.memo(key, function, expires=1)

Binds a function to `this` as a non enumerable property using the given key. When called `this` will be applied as the **first** argument.

If `expires` is defined then the function will be memoized such that any successive calls to the function with same arguments within `expires` seconds will return the previously cached result, without re-executing the function. Cached results are non enumerably indexed by the `$()` representation of the arguments the function was called with and are automatically removed after `expires` seconds have elapsed.

Always returns `this`

```javascript
let o = { a: 1, b: 2, c: 3 }
o.memo('max', m => m.values().sort((a, b) => b - a)[0])
o.max() // 3

o.memo('now', () => new Date(), 1)
o.now() // 2022-10-17T00:01:00.364Z
o.now() // 2022-10-17T00:01:00.364Z
setTimeout(() => o.now(), 1000) // 2022-10-17T00:01:01.565Z
```

### Object.prototype.log(msg, type='log')

Prints a shallow clone of `this` to the console together with a minute timestamp and an optional msg.
Alternative console methods such as 'trace', 'info', 'error' and 'debug' may also be specified. Returns `this`.

```javascript
let o = { a: 0, b: 1 }
  .clean()
  .log('CLEANING') // 2022-10-07T00:00 CLEANNING { b: 1 }
  .map(v => v + 1)
  .log('MAPPING') // 2022-10-07T00:00 MAPPING { b: 2 }
  .log('STACK', 'trace')
/*
Trace: 2022-10-06T21:21 STACK { b: 2 }
  at Object.P.log (/Users/mat/extra/objix/objix.js:116:15)
  ...
*/
```

### Object.protoype.try(function, catch)

Call function with `this` as argument and always return `this`.
If `catch` is defined and an exception is thrown then the catch function will be called with the error and `this` as arguments. If the catch function is not defined then exceptions will be ignored.

```javascript
{ a: 1 }.try(o => o.a++) // { a: 2 }
{ a: 1 }.try(o => o.a.b++) // { a: 1 }
{ a: 1 }.try(o => o.a.b++, e => e.log()) // 2022-10-07T00:00 TypeError: Cannot read properties of undefined (reading 'b')
```

### Object.prototype.trap(function, error, ...keys)

Returns a proxy of `this` which traps property assignments using the supplied function. The function takes `val`, `key` and `this` as arguments.
If the function returns falsey and an error message is supplied then an exception will be thrown.
If no error message is provided the function just acts as an observer, although the trap may also update `this` if needed.
When `keys` are defined then the trap function will only be called for assignments to properties where the key is included in `keys`

```javascript
let o = { a: 1, sum: 1 }
  .trap((v, k, t) => v != t[k] && console.log(k + ' has changed'))
  .trap(v => v > 0, 'Values must be positive', 'a', 'b', 'c')
  .trap((v, k, t) => k != 'sum' && (t.sum += t[k] ? v - t[k] : v))
  .trap(v => false, 'Read only', 'sum')

o.b = 2 //  b has changed
o.c = 0 //  Uncaught 'Values must be positive, c, 0'
o.sum = 1 // Uncaught 'Read only, sum, 1'
o // { a: 1, b: 2, sum: 3 }
```

### Object.prototype.new(object)

Create a new object using `this` as its protoype with additonal properties assigned from the argument. If traps have been defined for `this`, then the new object will also be a Proxy with the same trap handlers but will target a new object which uses `this` as its prototype.

```javascript
let P = { a: 1 }.trap(v => v > 0, 'Not Positive')
let o1 = P.new({ b: 1 }) // { a: 1, b: 1 }
let o2 = P.new({ a: 2 }) // { a: 2 }
o1.c = 0 // // Uncaught 'Not Positive, c, 0'
```

## Benchmarks

Performance of some common operations can be compared to lodash using the [benchmarks](bench.js) script.

```bash
> node bench <iterations=1000> <heats=100> <simple=10> <complex=1>
```

|              |                                              |
| ------------ | -------------------------------------------- |
| `iterations` | Number of iterations per heat                |
| `heats`      | Number of randomised heats                   |
| `simple`     | Number of simpled properties per test object |
| `complex`    | Number of complex properties per test object |

This script prints out a table of average operations per secs for each test function
for lodash, objix and a basic vanilla alternative together with the mean error coefficient accross the heats and the % performance improvments of objix against lodash.

For simple object objix performs insanely well, but this drops off quickly when more complex objects are tested.

### Ops/sec (iters: 1000, heats: 100, simple: 10, complex: 0)

| (index) | objix    | lodash   | vanilla  | % Inc   | % Err |
| ------- | -------- | -------- | -------- | ------- | ----- |
| Map     | 7134.03  | 4352.4   | 1061.13  | 63.91   | 13.99 |
| Filter  | 38638.51 | 1968.79  | 1567.19  | 1862.55 | 20.55 |
| Find    | 75862.74 | 21036.16 | 16961.27 | 260.63  | 24.11 |
| KeyBy   | 9642.97  | 6482.49  |          | 48.75   | 18.78 |
| Equals  | 2211.27  | 1375.69  | 1411.85  | 60.74   | 11.1  |
| Clone   | 6134.17  | 2087.05  | 8217.1   | 193.92  | 9.84  |
| Deep    | 2663.58  | 1404.26  |          | 89.68   | 11.5  |
| Some    | 6720.74  | 3960.36  | 5809.37  | 69.7    | 11.3  |
| Every   | 89994.04 | 8713.43  | 29993.12 | 932.82  | 22.21 |

### Ops/sec (iters: 1000, heats: 100, simple: 10, complex: 1)

| (index) | objix    | lodash   | vanilla  | % Inc   | % Err |
| ------- | -------- | -------- | -------- | ------- | ----- |
| Map     | 4276.64  | 3024.43  | 903.29   | 41.4    | 12.86 |
| Filter  | 8139.32  | 1602.77  | 1299.11  | 407.83  | 10.89 |
| Find    | 75342.96 | 21485.29 | 15850.22 | 250.67  | 23.88 |
| KeyBy   | 9055.53  | 6340.41  |          | 42.82   | 21.23 |
| Equals  | 2016.31  | 1224.62  | 1170.45  | 64.65   | 9.1   |
| Clone   | 5255.18  | 1833.74  | 6763.65  | 186.58  | 9.88  |
| Deep    | 358.13   | 313.97   |          | 14.07   | 6.85  |
| Some    | 4623.3   | 3072.75  | 4293.07  | 50.46   | 9.99  |
| Every   | 89895.68 | 7942.8   | 27554.3  | 1031.79 | 22.17 |

### Ops/sec (iters: 1000, heats: 100, simple: 10, complex: 10)

| (index) | objix   | lodash  | vanilla | % Inc  | % Err |
| ------- | ------- | ------- | ------- | ------ | ----- |
| Map     | 691.9   | 720.28  | 225     | -3.94  | 6.29  |
| Filter  | 834.12  | 534.85  | 278.67  | 55.95  | 4.5   |
| Find    | 3762.86 | 3694.28 | 534.93  | 1.86   | 8.54  |
| KeyBy   | 9011.13 | 6374.19 |         | 41.37  | 20.28 |
| Equals  | 511.47  | 474.53  | 490.35  | 7.78   | 6.63  |
| Clone   | 1235.59 | 804.24  | 298.42  | 53.63  | 4.58  |
| Deep    | 58.94   | 199.98  |         | -70.53 | 6.21  |
| Some    | 821.75  | 853.98  | 456.67  | -3.77  | 4.98  |
| Every   | 3826.04 | 2446.63 | 701.7   | 56.38  | 7.46  |
