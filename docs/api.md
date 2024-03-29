# Objix API <!-- {docsify-ignore} -->

All the methods below are assigned as members to the `Object.prototype`

<a id="map"></a>

## `Object..map(function, target={})`

Returns `target` including all the keys of `this` with `function` applied to each value. Function takes value and key as arguments.

<div data-runkit>

```javascript
var o = { a: 1 }.map(v => v + 1) // { a: 2 }
var o = { a: 1, b: 2 }.map((v, k) => (k == 'b' ? v + 1 : v)) // { a: 1, b: 3 }
```

</div>

<a id="flatmap"></a>

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

<a id="values"></a>

## `Object..values()`

Object.values(`this`)

<div data-runkit>

```javascript
var o = { a: 1 }.values() // [1]
```

</div>

<a id="create"></a>

## `Object..create()`

Object.create(`this`)

<div data-runkit>

```javascript
var o = { a: 1 }.create() // {}
o.a // 1
```

</div>

<a id="keys"></a>

## `Object..keys()`

Object.keys(`this`)

<div data-runkit>

```javascript
var o = { a: 1 }.keys() // ['a']
```

</div>

<a id="entries"></a>

## `Object..entries()`

Object.entries(`this`)

<div data-runkit>

```javascript
var o = { a: 1 }.entries() // [[a, 1]]
```

</div>

<a id="is"></a>

## `Object..is(type)`

True if `this` is an instance of `type`.

<div data-runkit>

```javascript
var t = { a: [], s: '', n: 1, o: {}, d: new Date(), b: false, f: () => 0 }
class Class1 {}
class Class2 extends Class1 {}
t.c = new Class2()
t.s.is(String) // true
t.s.is(Object) // false
t.a.is(Array) // true
t.a.is(Object) // true
t.f.is(Function) // true
t.f.is(Object) // false
t.o.is(Object) // true
t.d.is(Date) // true
t.d.is(Object) // false
t.n.is(Number) // true
t.b.is(Boolean) // true
t.c.is(Class1) // true
t.c.is(Class2) // true
t.c.is(Object) // true
```

</div>

<a id="has"></a>

## `Object..has(value)`

Return true of `value` is a member of the values of `this`, otherwise `false`

<div data-runkit>

```javascript
[1,2,3].has(2) // true
{a: 1, b: 2, c: 3}.has(3) // true
{a: 1, b: 2, c: { x: 3}}.has({x: 3}) // false
```

</div>

<a id="iter"></a>

## `Object..[@@iterator]`

Iterate through the values of `this`

<div data-runkit>

```javascript
for (var v of { a: 1 }) console.log(v) // 1
```

</div>

<a id="clean"></a>

## `Object..clean()`

Return a new object like `this` with falsy entry values removed

<div data-runkit>

```javascript
var o = { a: 1, b: null, c: false, d: 0, e: '' }.clean() // { a: 1 }
```

</div>

<a id="pick"></a>

## `Object..pick(function||list, target={})`

If the first argument is a function, returns `target` including all entries of `this` for which the the supplied function returns truthy using value and key as arguments.
If the first argument is a list, return `target` with all entries of `this` where the key is included in the supplied list.

<div data-runkit>

```javascript
var o = { a: 1, b: 2 }.pick(['b']) // { b: 2 }
var o = { a: 1, b: 2 }.pick(v => v > 1) // { b: 2 }
var o = { a: 1, b: 2 }.pick((v, k) => k == 'b') // { b: 2 }
var o = { a: 1, b: 2 }.pick(v => v > 2) // {}
```

</div>

<a id="find"></a>

## `Object..find(test)`

If `test` is a function, Return first key of `this` which passes `test` where `test` takes each value and key as arguments. If `test` is not a function then return the first key of `this` where the value equals `test` (using `value.eq(test)`)

<div data-runkit>

```javascript
var o = { a: 1, b: 2 }.find(v => v > 1) // 'b'
var o = { a: 1, b: 2 }.find(v => v > 2) // null
var o = { a: 1, b: 2 }.find(2) // b
var o = { a: 1, b: 2 }.find(0) // undefined

```

</div>

<a id="assign"></a>

## `Object..assign(...objects)`

Assign and overwrite entries of `this` from arguments in ascending priority and return `this`.

<div data-runkit>

```javascript
var o = { a: 0, b: 0 }.assign({ a: 1, b: 1 }, { b: 2, c: 2 }) // { a: 1, b: 2, c: 2 }
```

</div>

<a id="extend"></a>

## `Object..extend(...objects)`

Assigns properties into `this` from the arguments in ascending priority order. Properties of `this` are assigned only if null or undefined in `this`.
Returns `this`

<div data-runkit>

```javascript
var o = { a: 0, b: 0 }.extend({ a: 1, b: 1 }, { b: 2, c: 2 }) // { a: 0, b: 0, c: 2 }
```

</div>

<a id="same"></a>

## `Object..same(object)`

Return a new object with entries of `this` that are present in the supplied object with equal value

<div data-runkit>

```javascript
var o = { a: 1, b: 2 }.same({ a: 2, b: 2 }) // { b: 2 }
```

</div>

<a id="diff"></a>

## `Object..diff(object)`

Return new object with entries of `this` that are not present in the supplied object with equal value

<div data-runkit>

```javascript
var o = { a: 1, b: 2 }.diff({ a: 2, b: 2 }) // { a: 1 }
```

</div>

<a id="delete"></a>

## `Object..delete(...keys)`

Return `this` with entries deleted where the key is included in arguemnts.

<div data-runkit>

```javascript
var o = { a: 1, b: 2, c: 3 }.delete('a', 'b') // { c: 3 }
```

</div>

<a id="some"></a>

## `Object..some(function)`

True if any entry of `this` passes function.
Function takes value and key as arguments.

<div data-runkit>

```javascript
var o = { a: 1, b: 2 }.some(v => v > 1) // true
var o = { a: 1, b: 2 }.some(v => v > 2) // false
```

</div>

<a id="every"></a>

## `Object..every(function)`

True if all entries pass function.
Function takes value and key as arguments.

<div data-runkit>

```javascript
var o = { a: 1, b: 2 }.every(v => v > 0) // true
var o = { a: 1, b: 2 }.every(v => v > 1) // false
```

</div>

<a id="at"></a>

## `Object..at(path)`

Return the property of `this` at `path`. If `path` is string containing `.` delimited keys then the `this` will be traversed accordingly. E.G `o.at('k1.k2')` will return `o.k1.k2`

<div data-runkit>

```javascript
var o = { a: 1 }.at('a') // 1
var o = { a: 1, b: [1, 2] }.at('b.1') // 2
var o = { a: 1, b: { c: 3 } }.at('b.c') // 3
```

</div>

<a id="fmt"></a>

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

<a id="clone"></a>

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

<a id='join'></a>

## `Object..join(...objects)`

Return a new Object with the same keys as `this` and some values as arrays which concatenate the original value of `this` with values from all of the arguments having the same key.

<div data-runkit>

```javascript
var o = { a: 1 }.join({ a: 2 }, { a: 3 }) // { a: [ 1, 2, 3 ]}
```

</div>

<a id="split"></a>

## `Object..split(array=[])`

Split `this` into an array of similar objects containing values corresponding to same indexed entry `this` if the entry is an array.

<div data-runkit>

```javascript
var o = { a: [1, 2], b: [1, 3] }.split() // [{ a: 1, b: 1 }, { a: 2, b: 2 }]
```

</div>

<a id="contains"></a>

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

<a id="eq"></a>

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

<a id="size"></a>

## `Object..size()`

Return number of entries of `this`.

<div data-runkit>

```javascript
;[1, 2, 3].size() // 3
var o = { a: 1, b: 2 }.size() // 2
'one'.size() // 3
```

</div>

<a id="keyBy"></a>

## `Object..keyBy(path)`

Re-Index values of this `this` using the given key path, and return `this`.

<div data-runkit>

```javascript
var o = [{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }].keyBy('a')
o // { o1: { a: 'o1' }, o2: [{ a: 'o2', b: 1 }, { a: 'o2' }]
var o = [{ a: { b: { c:'o1' }}}, { a: { b: { c: 'o2' }}}].keyBy('a.b.c')
o // { o1: { a: { b: { c:'o1' }}}, o2: { a: { b: { c: 'o2' }}}}
```

</div>

<a id="memo"></a>

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

<a id="bind"></a>

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

<a id="log"></a>

## `Object..log(msg, test, type='log')`

Prints `this.$()` to the console together with a minute timestamp and an optional msg.
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

<a id="try"></a>

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

<a id="trap"></a>

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

<a id="new"></a>

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

<a id="wait"></a>

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

