# Objix API <!-- {docsify-ignore} -->

All the methods below are assigned as members to the `Object.prototype`

<div id="map"></div>

## `Object..map(function, target={})`

Returns `target` including all the keys of `this` with `function` applied to each value. Function takes value and key as arguments.

<div data-runkit>

```javascript
var o = { a: 1 }.map(v => v + 1) // { a: 2 }
var o = { a: 1, b: 2 }.map((v, k) => (k == 'b' ? v + 1 : v)) // { a: 1, b: 3 }
```

</div>

<div id="flatmap"></div>

## `Object..flatMap(function)`

Returns a new object based on `this` but which may have a different set of properties. The `function` is applied to each entry of `this` and is expected to return an array of zero or more key,value entry pairs (eg `[[k1,v1],[k2,v2],..]`) which are then used to build the new object which is returned.

<div data-runkit>

```javascript
var o = { a: 1 }.flatMap((k, v) => [
  [k + 1, v + 1],
  [k + 2, v + 2]
]) // { a1: 2, a2: 3 }
var o = { a: 1, b: 0 }.flatMap((k, v) => (v ? [[k, v + 1]] : [])) // { a: 2 }
```

</div>

<div id="values"></div>

## `Object..values()`

Object.values(`this`)

<div data-runkit>

```javascript
var o = { a: 1 }.values() // [1]
```

</div>

<div id="create"></div>

## `Object..create()`

Object.create(`this`)

<div data-runkit>

```javascript
var o = { a: 1 }.create() // {}
o.a // 1
```

</div>

<div id="keys"></div>

## `Object..keys()`

Object.keys(`this`)

<div data-runkit>

```javascript
var o = { a: 1 }.keys() // ['a']
```

</div>

<div id="entries"></div>

## `Object..entries()`

Object.entries(`this`)

<div data-runkit>

```javascript
var o = { a: 1 }.entries() // [[a, 1]]
```

</div>

<div id="is"></div>

## `Object..is(type)`

True if `this` is an instance of `type`.

<div data-runkit>

```javascript
var a = []
var s = ''
var n = 1
var o = {}
var d = new Date()
var b = false
var f = () => 0
class Class1 {}
class Class2 extends Class1 {}
var c = new Class2()
s.is(String) // true
a.is(Array) // true
a.is(Object) // true
f.is(Function) // true
f.is(Object) // false
d.is(Date) // true
d.is(Object) // true
n.is(Number) // true
b.is(Boolean) // true
c.is(Class1) // true
c.is(Class2) // true
c.is(Object) // true
o.is(Object) // true
```

</div>

## `Object..[@@iterator]`

Iterate through the values of `this`

<div data-runkit>

```javascript
for (var v of { a: 1 }) console.log(v) // 1
```

</div>

<div id="clean"></div>

## `Object..clean()`

Return a new object like `this` with falsy entry values removed

<div data-runkit>

```javascript
var o = { a: 1, b: null, c: false, d: 0, e: '' }.clean() // { a: 1 }
```

</div>

<div id="filter"></div>

## `Object..filter(function, target={})`

Returns `target` including all entries of `this` for which the the supplied function returns truthy. Function takes value and key as arguments.

<div data-runkit>

```javascript
var o = { a: 1, b: 2 }.filter(v => v > 1) // { b: 2 }
var o = { a: 1, b: 2 }.filter((v, k) => k == 'b') // { b: 2 }
var o = { a: 1, b: 2 }.filter(v => v > 2) // {}
```

</div>

<div id="find"></div>

## `Object..find(function)`

Return first key of `this` where value passes function
Function takes value and key as arguments.

<div data-runkit>

```javascript
var o = { a: 1, b: 2 }.find(v => v > 1) // 'b'
var o = { a: 1, b: 2 }.find(v => v > 2) // null
```

</div>

<div id="assign"></div>

## `Object..assign(...objects)`

Assign and overwrite entries of `this` from arguments in ascending priority and return `this`.

<div data-runkit>

```javascript
var o = { a: 0, b: 0 }.assign({ a: 1, b: 1 }, { b: 2, c: 2 }) // { a: 1, b: 2, c: 2 }
```

</div>

<div id="extend"></div>

## `Object..extend(...objects)`

Assigns properties into `this` from the arguments in ascending priority order. Properties of `this` are assigned only if null or undefined in `this`.
Returns `this`

<div data-runkit>

```javascript
var o = { a: 0, b: 0 }.extend({ a: 1, b: 1 }, { b: 2, c: 2 }) // { a: 0, b: 0, c: 2 }
```

</div>

<div id="same"></div>

## `Object..same(object)`

Return a new object with entries of `this` that are present in the supplied object with equal value

<div data-runkit>

```javascript
var o = { a: 1, b: 2 }.same({ a: 2, b: 2 }) // { b: 2 }
```

</div>

<div id="diff"></div>

## `Object..diff(object)`

Return new object with entries of `this` that are not present in the supplied object with equal value

<div data-runkit>

```javascript
var o = { a: 1, b: 2 }.diff({ a: 2, b: 2 }) // { a: 1 }
```

</div>

<div id="delete"></div>

## `Object..delete(...keys)` <!--:id=hello -->

Return `this` with entries deleted where the key is included in arguemnts.

<div data-runkit>

```javascript
var o = { a: 1, b: 2, c: 3 }.delete('a', 'b') // { c: 3 }
```

</div>

<div id="some"></div>

## `Object..some(function)`

True if any entry of `this` passes function.
Function takes value and key as arguments.

<div data-runkit>

```javascript
var o = { a: 1, b: 2 }.some(v => v > 1) // true
var o = { a: 1, b: 2 }.some(v => v > 2) // false
```

</div>

<div id="every"></div>

## `Object..every(function)`

True if all entries pass function.
Function takes value and key as arguments.

<div data-runkit>

```javascript
var o = { a: 1, b: 2 }.every(v => v > 0) // true
var o = { a: 1, b: 2 }.every(v => v > 1) // false
```

</div>

<div id="has"></div>

## `Object..has(value)`

Returns first key of `this` where the value equals the argument, otherwise undefined.

<div data-runkit>

```javascript
var o = { a: 1, b: 2 }.has(2) // b
var o = { a: 1, b: 2 }.has(0) // undefined
;[1].has(1) // 1
;[].has(1) // undefined
```

</div>

<div id="at"></div>

## `Object..at(path)`

Return the property of `this` at `path`. If `path` is string containing `.` delimited keys then the `this` will be traversed accordingly. E.G `o.at('k1.k2')` will return `o.k1.k2`

<div data-runkit>

```javascript
var o = { a: 1 }.at('a') // 1
var o = { a: 1, b: [1, 2] }.at('b.1') // 2
var o = { a: 1, b: { c: 3 } }.at('b.c') // 3
```

</div>

<div id="fmt"></div>

## `Object..$(formatter)`

Returns a string representation of `this`. If `formatter` is not specified it will return a a string based on `JSON.stringify(this)` with all double quote and escape characters removed.

If `formatter` is a string, then that string will be returned with all occurances of `${key}` or `$key` substituted with `this.at(key).$()`

If `formatter` is not a string then the `stringify` method of the `Formatter` will be called with `this` as an argument, allowing alternative standard formatters such as `JSON` to be used. If there the formatter does not have a stringify method then `formatter` will be called as a function with `this` as its argument.

<div data-runkit>

```javascript
var o = { a: 1 }.$() // '{a:1}'
var o = { a: 1, b: [2, 3], c: { d: 'four,five' } }.$() // '{a:1,b:[2,3],c:{d:four,five}}'
var o = { a: 1 }.$(JSON) // '{"a":1}'
var o = { a: 1 }.$(JSON.stringify) // '{"a":1}'
var o = { a: 1, b: { c: 2 } }.$('b is $b and b.c is ${b.c}') // 'b is {c:2} and b.c is 2'
```

</div>

<div id="clone"></div>

## `Object..clone(depth)`

Return new object with entries cloned from `this`.
Nested objects are also cloned to specified depth (-1 = any depth)

<div data-runkit>

```javascript
var o1 = { a: 1, b: { c: 1 } }
var o2 = o1.clone()
var o3 = o1.clone(1)
o1.b.c = 2
o1.a = 2
o1 // { a: 2, b: { c: 2 }}
o2 // { a: 1, b: { c: 2 }}
o3 // { a: 1, b: { c: 1 }}
```

</div>

<div id="join"></div>

## `Object..join(...objects)`

Return a new Object with the same keys as `this` and some values as arrays which concatenate the original value of `this` with values from all of the arguments having the same key.

<div data-runkit>

```javascript
var o = { a: 1 }.join({ a: 2 }, { a: 3 }) // { a: [ 1, 2, 3 ]}
```

</div>

<div id="split"></div>

## `Object..split(array=[])`

Split `this` into an array of similar objects containing values corresponding to same indexed entry `this` if the entry is an array.

<div data-runkit>

```javascript
var o = { a: [1, 2], b: [1, 3] }.split() // [{ a: 1, b: 1 }, { a: 2, b: 2 }]
```

</div>

<div id="contains"></div>

## `Object..contains(object, depth)`

True if all entries of argument are also in `this`. May recurse to a given depth (-1 = any depth)

<div data-runkit>

```javascript
var o = { a: 1 }.contains({ a: 1, b: 2 }) // false
var o = { a: 1, b: 2 }.contains({ a: 1 }) // true
var o = { a: 1, b: [{ c: 1 }] }.contains({ c: 1 }, 1) // false
var o = { a: 1, b: [{ c: 1 }] }.contains({ c: 1 }, 2) // true
```

</div>

<div id="eq"></div>

## `Object..eq(object, depth)`

True if all entries of `this` equal the argument and argument has no other entries
May recurse to a given depth (-1 for any depth)

<div data-runkit>

```javascript
var o = { a: 1 }.eq({ a: 1 }) // true
var o = { a: 1 }.eq({ a: 2 }) // false
var o = { a: 1, b: { c: 1 } }.eq({ a: 1, b: { c: 1 } }) // false
var o = { a: 1, b: { c: 1 } }.eq({ a: 1, b: { c: 1 } }, 1) // true
```

</div>

<div id="size"></div>

## `Object..size()`

Return number of entries of `this`.

<div data-runkit>

```javascript
;[1, 2, 3].size() // 3
var o = { a: 1, b: 2 }.size() // 2
'one'.size() // 3
```

</div>

<div id="keyBy"></div>

## `Object..keyBy(array, key)`

Index an array of objects into `this` using the given key, and return `this`.

<div data-runkit>

```javascript
o = {}
o.keyBy([{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }], 'a')
o // { o1: { a: 'o1' }, o2: [{ a: 'o2', b: 1 }, { a: 'o2' }]
```

</div>

<div id="memo"></div>

## `Object..memo(expires)`

Returns a memoized wrapper around `this` as a function such that any calls to `this` with the same set of arguments within `expires` seconds will return the first cached result, without re-executing the function. Cached results are indexed by the `$()` representation of the arguments the function was orignally called with and are automatically removed after `expires` seconds have elapsed.

<div data-runkit>

```javascript
var nowish = (() => new Date()).memo(1)
var logNow = i => console.log(i + ' time is ' + nowish().toLocaleTimeString())
logNow(1) // "1 time is 1:5:07:06 PM"
logNow(2) // "2 time is 1:5:07:06 PM"
setTimeout(() => logNow(3), 1000) // "3 time is 1:5:07:07 PM"
```

</div>

<div id="bind"></div>

## `Object..bind(key, function, expires)`

Binds a function to `this` as a non enumerable property using the given key. When called `this` will be applied as the **last** argument.

If `expires` is defined then the function will be memoized with the given expiration time in seconds.
Always returns `this`

<div data-runkit>

```javascript
var o = { a: 1, b: 2, c: 3 }
o.bind('max', m => m.values().sort((a, b) => b - a)[0])
o.max() // 3

o.bind('nowish', () => new Date(), 1)
o.nowish() // 2022-10-17T00:01:00.364Z
o.nowish() // 2022-10-17T00:01:00.364Z
setTimeout(() => o.nowish(), 1000) // 2022-10-17T00:01:01.565Z
```

</div>

<div id="log"></div>

## `Object..log(msg, test, type='log')`

Prints a shallow clone of `this` to the console together with a minute timestamp and an optional msg.
If a `test` function is provided then logging will only be triggered if the test function returns truthy when called with with `this` as its first argument.
Alternative console methods such as 'trace', 'info', 'error' and 'debug' may also be specified. Returns `this`.

<div data-runkit>

```javascript
var WARN = () => false
var INFO = () => true

var o = { a: 0, b: 1 }
  .clean()
  .log('CLEANING') // 2022-10-07T00:00 CLEANNING { b: 1 }
  .map(v => v + 1)
  .log('MAPPING', WARN) // ..
  .log('TRACING', INFO, 'trace') // Trace: 2022-10-06T21:21 TRACING { b: 2 } at  log ..
```

</div>

<div id="try"></div>

## `Object..try(function, catch, return)`

Calls `function` with `this` as its argument in a try catch block.

If `catch` is defined and an exception is thrown the `catch` function will be called the error and `this` as arguments. Otherwise all exceptions will be ignored.

If `return` is truthy, then `this` will always be returned, otherwise the results of `function` or `catch` will be returned.

<div data-runkit>

```javascript
var o = { a: 1 }.try(t => (t.a += 1)) // 2
var o = { a: 1 }.try(t => (t.b += 1)) // NaN
var o = { a: 1 }.try(t => (t.b.c += 1)) // Undefined
var o = { a: 1 }.try(t => (t.a++, t)) // { a: 2 }
var o = { a: 1 }.try(t => (t.a += 1), null, true) // { a : 2 }
var o = { a: 1 }.try(t => (t.b.c += 1), null, true) // { a: 1 }
var o = { a: 1 }.try(
  t => (t.b.c += 1),
  e => e.log()
) // 2022-10-07T00:00 TypeError: Cannot read properties of undefined (reading 'c')
```

</div>

<div id="trap"></div>

## `Object..trap(function, error, ...keys)`

Returns a proxy of `this` which traps property assignments using the supplied function. The function takes `val`, `key` and `this` as arguments.
If the function returns falsey and an error message is supplied then an exception will be thrown.
If no error message is provided the function just acts as an observer, although the trap may also update `this` if needed.
When `keys` are defined then the trap function will only be called for assignments to properties where the key is included in `keys`

<div data-runkit>

```javascript
var o = { a: 1, sum: 1 }
  .trap((v, k, t) => v != t[k] && console.log(k + ' has changed'))
  .trap(v => v > 0, 'Values must be positive', 'a', 'b', 'c')
  .trap((v, k, t) => k != 'sum' && (t.sum += t[k] ? v - t[k] : v))
  .trap(v => false, 'Read only', 'sum')

o.b = 2 //  b has changed
o.c = 0 //  Uncaught 'Values must be positive, c, 0'
o.sum = 1 // Uncaught 'Read only, sum, 1'
o // { a: 1, b: 2, sum: 3 }
```

</div>

<div id="new"></div>

## `Object..new(object)`

Create a new object using `this` as its protoype with additonal properties assigned from the argument. If traps have been defined for `this`, then the new object will also be a Proxy with the same trap handlers but will target a new object which uses `this` as its Object..

<div data-runkit>

```javascript
var P = { a: 1 }.trap(v => v > 0, 'Not Positive')
var o1 = P.new({ b: 1 }) // { a: 1, b: 1 }
var o2 = P.new({ a: 2 }) // { a: 2 }
o1.c = 0 // // Uncaught 'Not Positive, c, 0'
```

</div>

<div id="wait"></div>

## `Object..wait(defer)`

Returns a new promise wrapped around `this`.
If `defer` is a number then the promise will resolve with `this` when `defer` seconds have elapsed.
Otherwise `defer` will be treated as a function that takes `this`, and functions to `resolve` and optionally `reject` the promise. Any uncaught exceptions will reject the promise.
If `defer` is async or otherwsie returns a truthy value then the promise will be resolved with that result, regardless of whether the the `resolve` function is called.

<div data-runkit>

```javascript
var o = { a: 1 }.wait(1).then(t => t.log('PROMISED')) // ...(1 second later)... 2022-10-19T21:55 PROMISED {a:1}
var o = (await { a: 1 }.wait(1)).log('AWAITED') // ...(1 second later)... 2022-10-19T21:55 AWAITED {a:1}

var f = o =>
  o
    .wait((t, r) => r(t.b.$()))
    .then(o => o.log('SUCCESS'))
    .catch(e => e.log('ERROR'))

f({ a: 1, b: 2 }) // 2022-10-19T21:55 SUCCESS 2
f({ a: 1 }) // 2022-10-19T21:55 ERROR TypeError: Cannot read properties of undefined

var s = (await 'https://objix.dev'.wait(fetch)).status // 200
```

</div>
````

## `Object..isEx()`

Returns true if `this` is an exotic objext which extends the standard object prototype, otherwise false if `this` is an ordinary object or primitive

<div data-runkit>

```javascript
var n = 1
var s = ''
var o = {}
var a = []
var d = new Date()
n.isEx() // false
s.isEx() // false
o.isEx() // false
a.isEx() // true
d.isEx() // true
```

</div>
