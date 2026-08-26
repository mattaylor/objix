# Objix API <!-- {docsify-ignore} -->

All the methods below are assigned as members to the `Object.prototype`

On [objix.dev](https://objix.dev) every example below is live: press **Run** to
execute it in the page, or edit the code first and run your own version. Results
are shown beneath each block, so the `// ...` comments can be checked against
what actually happens.

<a id="map"></a>
## `this._map(function, target={})`

Returns `target` including all the keys of `this` with `function` applied to each value. Function takes value and key as arguments.

```javascript
var o = { a: 1 }._map(v => v + 1) // { a: 2 }
var o = { a: 1, b: 2 }._map((v, k) => (k == 'b' ? v + 1 : v)) // { a: 1, b: 3 }
```

<a id="flatmap"></a>
## `this._flatMap(function)`

Returns a new object based on `this` but which may have a different set of properties. The `function` is applied to each entry of `this` and is expected to return an array of zero or more key,value entry pairs (eg `[[k1,v1],[k2,v2],._]`) which are then used to build the new object which is returned.

```javascript
var o = { a: 1 }._flatMap((k, v) => [
  [ k + 1, v + 1 ],
  [ k + 2, v + 2 ]
]) // { a1: 2, a2: 3 }
var o = { a: 1, b: 0 }._flatMap((k, v) => (v ? [[ k, v + 1 ]] : [])) // { a: 2 }
```

<a id="values"></a>
## `this._values()`

Object.values(`this`)

```javascript
var o = { a: 1 }._values() // [1]
```

<a id="create"></a>
## `this._create(descriptors)`

Object.create(`this`, `descriptors`) — returns a new object with `this` as its prototype and no own enumerable keys, unless property `descriptors` are supplied.

```javascript
var o = { a: 1 }._create() // {}
o.a // 1
var p = { a: 1 }._create({ b: { value: 2, enumerable: true } }) // { b: 2 }
```

<a id="keys"></a>
## `this._keys()`

Object.keys(`this`)

```javascript
var o = { a: 1 }._keys() // ['a']
```

<a id="entries"></a>
## `this._entries()`

Object.entries(`this`)

```javascript
var o = { a: 1 }._entries() // [[a, 1]]
```

<a id="is"></a>
## `this._is(type, exact)`

True if `this` is an instance of `type`. If `exact` is truthy, only an exact constructor match counts, so inherited types are excluded — `new Class2()._is(Class1, true)` is `false` while `._is(Class2, true)` is `true`.

```javascript
var t = { a: [], s: '', n: 1, o: {}, d: new Date(), b: false, f: () => 0 }
class Class1 {}
class Class2 extends Class1 {}
t.c = new Class2()
t.s._is(String) // true
t.s._is(Object) // false
t.a._is(Array) // true
t.a._is(Object) // true
t.f._is(Function) // true
t.f._is(Object) // false
t.o._is(Object) // true
t.d._is(Date) // true
t.d._is(Object) // true
t.n._is(Number) // true
t.b._is(Boolean) // true
t.c._is(Class1) // true
t.c._is(Class2) // true
t.c._is(Object) // true
```

<a id="has"></a>
## `this._has(value)`

Return true if `value` is a member of the values of `this`, otherwise `false`.

Values are compared with `===`, so objects match by reference and not by
structure. Use [`_contains`](#contains) or [`_find`](#find) to compare by value.

```javascript
;[ 1, 2, 3 ]._has(2) // true
;({ a: 1, b: 2, c: 3 })._has(3) // true

var inner = { x: 3 }
var outer = { a: 1, c: inner }
outer._has(inner) // true - the same object
outer._has({ x: 3 }) // false - an equal object, but not the same one
outer._contains({ c: { x: 3 } }, 1) // true - _contains compares values
outer._find({ x: 3 }) // 'c' - so does _find
```

<a id="iter"></a>
## `this._[@@iterator]`

Iterate through the entries of `this`.

objix installs `Symbol.iterator` on `Object.prototype`, so every object is
iterable and therefore spreadable — anywhere JavaScript accepts an iterable, it
now accepts a plain object, yielding its **entries** as [**key**, **value**]

```javascript
for (var v of { a: 1 }) console.log(v) // [a,1]
;[...{ a: 1, b: 2 }] // [[a,1], [b,2]]
Array.from({ a: 1, b: 2 }) // [[a,1], [b,2]]
Math.max(...{ a: 1, b: 5, c: 3 }) // 5
```

This is worth knowing about when objix shares a process with other tooling: a
library that branches on whether a value is iterable will treat every object as a
sequence. Some test runners compare iterables by order rather than by key for
this reason, so objix's own test setup detaches the iterator under Jest.

<a id="clean"></a>
## `this._clean()`

Return a new object like `this` with null or undefined property values removed

```javascript
var o = { a: 1, b: null, c: false, d: 0, e: '' }._clean() // { a: 1, c: false, d: 0 }
```

<a id="pick"></a>
## `this._pick(function||list, target={})`

If the first argument is a function, returns `target` including all entries of `this` for which the the supplied function returns truthy using value and key as arguments.
If the first argument is a list, return `target` with all entries of `this` where the key is included in the supplied list.

```javascript
var o = { a: 1, b: 2 }
o._pick(v => v > 1) // { b: 2 }
o._pick(v => v > 2) // {}
o._pick(['b']) // { b: 2 }
o._pick((v, k) => k == 'b') // { b: 2 }
```

<a id="find"></a>
## `this._find(test)`

If `test` is a function, Return first key of `this` which passes `test` where `test` takes each value and key as arguments. If `test` is not a function then return the first key of `this` where the value equals `test` (using `value._eq(test)`). Returns `undefined` if nothing matches.

```javascript
var o = { a: 1, b: 2 }
o._find(v => v > 1) // 'b'
o._find(v => v > 2) // undefined
o._find(2) // 'b'
o._find(0) // undefined

```

<a id="assign"></a>
## `this._assign(...objects)`

Assign and overwrite entries of `this` from arguments in ascending priority and return `this`.

```javascript
var o = { a: 0, b: 0 }._assign({ a: 1, b: 1 }, { b: 2, c: 2 }) // { a: 1, b: 2, c: 2 }
```

<a id="extend"></a>
## `this._extend(...objects)`

Assigns properties into `this` from the arguments in descending priority order. Properties of `this` are assigned only if null or undefined in `this`.
Returns `this`

```javascript
var o = { a: 0, b: 0 }._extend({ a: 1, b: 1 }, { b: 2, c: 2 }) // { a: 0, b: 0, c: 2 }
```

<a id="same"></a>
## `this._same(object)`

Return a new object with entries of `this` that are present in the supplied object with equal value

```javascript
var o = { a: 1, b: 2 }._same({ a: 2, b: 2 }) // { b: 2 }
```

<a id="diff"></a>
## `this._diff(object)`

Return new object with entries of `this` that are not present in the supplied object with equal value

```javascript
var o = { a: 1, b: 2 }._diff({ a: 2, b: 2 }) // { a: 1 }
```

<a id="delete"></a>
## `this._del(...keys)`

Return `this` with entries deleted where the key is included in arguemnts.

```javascript
var o = { a: 1, b: 2, c: 3 }._del('a', 'b') // { c: 3 }
```

<a id="some"></a>
## `this._some(function)`

True if any entry of `this` passes function.
Function takes value and key as arguments.

```javascript
var o = { a: 1, b: 2 }
o._some(v => v > 1) // true
o._some(v => v > 2) // false
```

<a id="every"></a>
## `this._every(function)`

True if all entries pass function.
Function takes value and key as arguments.

```javascript
var o = { a: 1, b: 2 }
o._every(v => v > 0) // true
o._every(v => v > 1) // false
```

<a id="at"></a>
## `this._at(path)` 

Return the property of `this` at `path`. If `path` is string containing `.` delimited keys then the `this` will be traversed accordingly. E.G `o.at('k1.k2')` will return `o.k1.k2`

```javascript
var o = { a: 1 }._at('a') // 1
var o = { a: 1, b: [ 1, 2 ] }._at('b.1') // 2
var o = { a: 1, b: { c: 3 } }._at('b.c') // 3
```

<a id="fmt"></a>
## `this._$(formatter)`

Returns a string representation of `this`. If `formatter` is not specified it will return a string based on `JSON.stringify(this)` with the quotes around keys removed. Quotes around string *values* are retained. If `this` contains no enumermable properties then `String(this)` will be returned, 

If `formatter` is a string, then that string will be returned with all occurances of `${key}` or `$key` substituted with `this._at(key)._$()`. A key that is not found substitutes an empty string.

If `formatter` is not a string then the `stringify` method of the `Formatter` will be called with `this` as an argument, allowing alternative standard formatters such as `JSON` to be used. If there the formatter does not have a stringify method then `formatter` will be called as a function with `this` as its argument.

```javascript

var o = { a: 1 }
o._$() // '{a:1}'
o._$(JSON) // '{"a":1}'
o._$(JSON.stringify) // '{"a":1}'
var o = { a: 1, b: [ 2, 3 ], c: { d: 'four,five' } }._$() // '{a:1,b:[2,3],c:{d:"four,five"}}'
var o = { a: 1, b: { c: 2 } }._$('b is $b and b.c is ${b.c}') // 'b is {c:2} and b.c is 2'
```

<a id="clone"></a>
## `this._clone(depth)`

Return new object with entries cloned from `this`.
Nested objects are also cloned to specified depth (-1 = any depth)

```javascript
var o1 = { a: 1, b: { c: 1 } }
var o2 = o1._clone()
var o3 = o1._clone(1)
o1.b.c = 2
o1.a = 2
o1 // { a: 2, b: { c: 2 }}
o2 // { a: 1, b: { c: 2 }}
o3 // { a: 1, b: { c: 1 }}
```

<a id='join'></a>
## `this._join(...objects)`

Return a new Object with the same keys as `this` and some values as arrays which concatenate the original value of `this` with values from all of the arguments having the same key. Keys present only in the arguments are ignored, and keys whose value in `this` is falsy are left untouched.

```javascript
var o = { a: 1 }._join({ a: 2 }, { a: 3 }) // { a: [ 1, 2, 3 ]}
var o = { a: 1, b: 2 }._join({ a: 9 }) // { a: [ 1, 9 ], b: 2 }
var o = { a: 0 }._join({ a: 1 }) // { a: 0 } — falsy values are skipped
```

<a id="split"></a>
## `this._split(array=[])`

Split `this` into an array of similar objects containing values corresponding to same indexed entry `this` if the entry is an array.

```javascript
var o = { a: [ 1, 2 ], b: [ 1, 3 ] }._split() // [{ a: 1, b: 1 }, { a: 2, b: 3 }]
```

<a id="contains"></a>
## `this._contains(object, depth)`

Truthy if all entries of argument are also in `this`. May recurse to a given depth (-1 = any depth). 

```javascript
var o = { a: 1 }._contains({ a: 1, b: 2 }) // false
var o = { a: 1, b: 2 }._contains({ a: 1 }) // true
var o = { a: 1, b: [{ c: 1 }] }._contains({ c: 1 }, 1) // false
var o = { a: 1, b: [{ c: 1 }] }._contains({ c: 1 }, 2) // true
```

<a id="eq"></a>
## `this._eq(object, depth)`

True if all entries of `this` equal the argument and argument has no other entries
May recurse to a given depth (-1 for any depth)

```javascript
var o = { a: 1 }._eq({ a: 1 }) // true
var o = { a: 1 }._eq({ a: 2 }) // false
var o = { a: 1, b: { c: 1 } }._eq({ a: 1, b: { c: 1 } }) // false
var o = { a: 1, b: { c: 1 } }._eq({ a: 1, b: { c: 1 } }, 1) // true
```

<a id="size"></a>
## `this._len()`

Return number of entries of `this`.

```javascript
;[1, 2, 3]._len() // 3
var o = { a: 1, b: 2 }._len() // 2
'one'._len() // 3
```

<a id="keyBy"></a>
## `this._keyBy(name||function)`

Re-Index values of `this` using the given name or function. If the argument is a function it is applied to each member of `this` and value returned is used to index it on the returned object. If the argument is a string the new index is the value of that property of each member. 
All values are collected into an array for each key in the returned object. 

```javascript
var o = [{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }]
o._keyBy('a') // { o1: [{ a: 'o1' }], o2: [{ a: 'o2', b: 1 }, { a: 'o2' }] }

var o = [{ a: { b: { c:'o1' }}}, { a: { b: { c: 'o2' }}}]
o._keyBy(_ => _.a.b.c) // { o1: [{ a: { b: { c:'o1' }}}], o2: [{ a: { b: { c: 'o2' }}}]}

var o = { o1: { a: 'a1', b: 'group1'}, o2: { a: 'o2', b: 'group1'}, o3: { a: 'o3', b: 'group2'} }
o._keyBy('b') // { group1: [ { a: 'a1', b: 'group1' }, { a: 'o2', b: 'group1' } ], group2: [ { a: 'o3', b: 'group2' } ] }
```

<a id="memo"></a>
## `this._memo(expires)`

Returns a memoized wrapper around `this` as a function such that any calls to `this` with the same set of arguments within `expires` seconds will return the first cached result, without re-executing the function. Cached results are indexed by the `$()` representation of the arguments the function was orignally called with and are automatically removed after `expires` seconds have elapsed.

```javascript
var nowish = (() => new Date())._memo(1)
var logNow = i => console.log(i + ' time is ' + nowish().toLocaleTimeString())
logNow(1) // "1 time is 1:5:07:06 PM"
logNow(2) // "2 time is 1:5:07:06 PM"
setTimeout(() => logNow(3), 1000) // "3 time is 1:5:07:07 PM"
```

The wrapper forwards its receiver, so `this` works inside a memoized method. Note that the cache is keyed by the arguments alone, so one wrapper shared between objects also shares its results:

```javascript
var get = function() { return this.a }._memo(1)
var x = { a: 1, get: get }, y = { a: 2, get: get }
x.get() // 1
y.get() // 1 - same arguments, so x's cached result is returned
```

Give each object its own wrapper — or use [`_bind`](#bind), which does so for you — when the result depends on `this`.

<a id="bind"></a>
## `this._bind(key, function, expires)`

Binds a function to `this` as a non enumerable property using the given key. When called `this` will be applied as the **last** argument.

If `expires` is defined then the function will be memoized with the given expiration time in seconds. `this` is still applied as the last argument, and each bound method gets its own cache, so memoizing here is safe for functions that read the object.

An existing key is never overwritten, and the bound property is non-enumerable.
Always returns `this`

```javascript
var o = { a: 1, b: 2, c: 3 }
o._bind('max', m => m._values().sort((a, b) => b - a)[0])
o.max() // 3

// The memoized form caches per bound method and still receives the object.
o._bind('nowish', () => new Date(), 1)
o.nowish() // 2022-10-17T00:01:00.364Z
o.nowish() // 2022-10-17T00:01:00.364Z
setTimeout(() => o.nowish(), 1000) // 2022-10-17T00:01:01.565Z
```

<a id="log"></a>
## `this._log(msg, test, type='log')`

Prints `this._$()` to the console together with a minute timestamp and an optional msg.
If a `test` function is provided then logging will only be triggered if the test function returns truthy when called with with `this` as its first argument.
Alternative console methods such as 'trace', 'info', 'error' and 'debug' may also be specified. Returns `this`.

```javascript
var WARN = () => false
var INFO = () => true

var o = { a: 0, b: 1 }
  ._clean()
  ._log('CLEANING') // 2022-10-07T00:00 CLEANNING { b: 1 }
  ._map(v => v + 1)
  ._log('MAPPING', WARN) // ._
  ._log('TRACING', INFO, 'trace') // Trace: 2022-10-06T21:21 TRACING { b: 2 } at  log ._
```

<a id="try"></a>
## `this._try(function, catch, final)`

Return `function` with `this` as its argument in a try catch block.

If `catch` is defined and an exception is thrown the `catch` function will be called wth error and `this` as arguments and returned. 
If `catch` is not defined and an error is thrown then undefined will be returned. 
If `final` is defined then call it with `this` as an argument and always return the result, and discard the result of the `try` or `catch`.

```javascript
var o = { a: 1 }
o._try(t => (t.a += 1)) // 2
o._try(t => (t.b += 1)) // NaN
o._try(t => (t.b.c += 1)) // Undefined
o._try(t => (t.a++, t)) // { a: 2 }
o._try(t => (t.b.c += 1), null, t => t) // { a: 1 }
o._try(
  t => (t.b.c += 1),
  e => e._log()
) // 'TypeError: Cannot read properties of undefined (reading 'c')'
```

<a id="trap"></a>
## `this._trap(function, error, ...keys)`

Returns a proxy of `this` which traps property assignments using the supplied function. The function takes `val`, `key` and `this` as arguments.
If the function returns falsey and an error message is supplied then an exception will be thrown.
If no error message is provided the function just acts as an observer, although the trap may also update `this` if needed.
When `keys` are defined then the trap function will only be called for assignments to properties where the key is included in `keys`

Each `_trap` wraps the proxy returned by the one before it, so assignments run
through the traps from the last one added to the first.

```javascript
var o = { a: 1, sum: 1 }
  ._trap((v, k, t) => v != t[k] && console.log(k + ' has changed'))
  ._trap(v => v > 0, 'Values must be positive', 'a', 'b', 'c')
  ._trap((v, k, t) => k != 'sum' && (t.sum += t[k] ? v - t[k] : v))
  ._trap(v => false, 'Read only', 'sum')

o.b = 2 // sum has changed, then b has changed
o._try(t => (t.c = 0), e => e) // 'Values must be positive ["c",0]'
o._try(t => (t.sum = 1), e => e) // 'Read only ["sum",1]'
o // { a: 1, sum: 3, b: 2 }
```

`o.b = 2` reports **two** changes. The third trap keeps `sum` up to date, and its
assignment to `t.sum` passes back through the observer, which logs `sum` before
`b`.

The failing assignments are wrapped in [`_try`](#try) so the whole example runs.
Written directly as `o.c = 0` they throw, which is the point of the trap — note
it throws a **string**, not an `Error`, so `catch (e)` gives you the message
itself.

<a id="new"></a>
## `this._new(object)`

Create a new object using `this` as its prototype, with additional properties assigned from the argument. Properties from the argument are *own* properties of the new object; everything else is inherited from `this`. If traps have been defined for `this`, then the new object will also be a Proxy with the same trap handlers, but will target a new object which uses `this` as its prototype.

```javascript
var P = { a: 1 }._trap(v => v > 0, 'Not Positive')
var o1 = P._new({ b: 1 }) // own { b: 1 }, and o1.a is 1 by inheritance
var o2 = P._new({ a: 2 }) // own { a: 2 }, shadowing the inherited a
o1.a // 1 - inherited from P
o2.a // 2 - its own
o1._try(t => (t.c = 0), e => e) // 'Not Positive ["c",0]' - P's trap came too
```

<a id="wait"></a>
## `this._wait(defer)`

Returns a new promise wrapped around `this`.
If `defer` is a number then the promise will resolve with `this` when `defer` seconds have elapsed.
Otherwise `defer` will be treated as a function that takes `this`, and functions to `resolve` and optionally `reject` the promise. Any uncaught exceptions will reject the promise.
If `defer` is async or otherwsie returns a truthy value then the promise will be resolved with that result, regardless of whether the the `resolve` function is called.

The result is an ordinary promise, so rejections are handled with the native
`.catch`, not with an objix method.

```javascript
var o = { a: 1 }._wait(1).then(t => t._log('PROMISED')) // ...(1 second later)... 2022-10-19T21:55 PROMISED {a:1}
var o = (await { a: 1 }._wait(1))._log('AWAITED') // ...(1 second later)... 2022-10-19T21:55 AWAITED {a:1}

var f = o => o
  ._wait((t, r) => r(t.b._$()))
  .then(o => o._log('SUCCESS'))
  .catch(e => e._log('ERROR'))

f({ a: 1, b: 2 }) // 2022-10-19T21:55 SUCCESS "2"
f({ a: 1 }) // ERROR TypeError: Cannot read properties of undefined (reading '_$')

var s = (await 'https://objix.dev'._wait(fetch)).status // 200
```

<a id="eval"></a>
## `this._eval(exp)`

Evaluates `exp` as a JavaScript expression in which the properties of
`this` are in scope as bare identifiers, and returns the result. It is the
expression counterpart to [`_$`](#fmt)'s `'$a'` interpolation: where `_$` builds a
string, `_eval` computes a value.

```javascript
var o = { a: 1, b: 2 }
o._eval('a + b') // 3
o._eval('a > 0 ? "positive" : "negative"') // 'positive'
o._eval('`a is ${a}`') // 'a is 1'
;({ a: { b: { c: 3 } } })._eval('a.b.c') // 3
```

Keys are resolved on `this`, so nested paths, method calls and objix's own
methods all work — including on an array receiver:

```javascript
;({ a: 1 })._eval('_map(v => v + 1)') // { a: 2 }
;[1, 2, 3]._eval('length') // 3
;[1, 2, 3]._eval('map(v => v * 2)') // [2, 4, 6]
```

### A copy, not the object

The expression runs against a deep [`_clone`](#clone) of `this`, so it cannot
modify the receiver. Assignment and `delete` are expressions and still return
their value, but the original is untouched:

```javascript
var o = { a: 1 }
o._eval('a = 5') // 5
o._eval('delete a') // true
o // { a: 1 } - unchanged either way
```

The scope is a `Proxy` around that copy, and a bare method call is made with the
proxy as its receiver. Generic methods do not mind — the array methods above only
read `length` and indexed properties, which the proxy forwards. Methods that need
an *internal slot* do mind, and throw:

```javascript
;'abc'._try(t => t._eval('toUpperCase()'), e => e.message)
// "String.prototype.toString requires that 'this' be a String"
new Date(0)._try(t => t._eval('getTime()'), e => e.message)
// "this is not a Date object."
```

The same applies to `Number` and `Map` methods. Pass the value in as a property
instead: `({ s: 'abc' })._eval('s.toUpperCase()')` works, because `s` is read off
the proxy and the call receiver is the real string.

### Scope

Identifiers resolve to properties of `this` first, then to a small set of
built-ins: `Math`, `RegExp`, `Date`, and `JSON`. Nothing else is
reachable by name — `process`, `require`, `globalThis`, `console`, `Function`,
`eval`, `Array`, `Object` and every other global read as `undefined`.

```javascript
;({ a: 4 })._eval('Math.sqrt(a)') // 2
;({})._eval('typeof process') // 'undefined'
;({})._eval('typeof require') // 'undefined'
;({ Math: 9 })._eval('Math') // 9 - an own key shadows the built-in
```

The fallback is `??`, so a key holding `null` or `undefined` falls through to the
built-in of the same name while a falsy-but-defined value like `0` shadows it.

`this` is the scope itself, so `this.a` and a bare `a` are equivalent, and the
host global is not reachable through it:

```javascript
;({ a: 1 })._eval('this.a') // 1
;({})._eval('typeof this.process') // 'undefined'
```

### Expressions only

The body is evaluated as a single expression, so statements are a `SyntaxError`:
`var x = 1`, `return 1` and `throw 1` all fail.

An expression that throws throws out of `_eval`; wrap the call in
[`_try`](#try) if you want a value instead:

```javascript
;({})._try(t => t._eval('a.b'), e => e.message)
// "Cannot read properties of undefined (reading 'b')" - it threw
;({})._try(t => t._eval('a.b'), e => 'bad expression') // 'bad expression'
```

Expressions containing the word `import`, `await` or `async` are refused,
returning the string `'invalid'` rather than throwing. The check is a plain text
match on whole words, so it also rejects one appearing in a string literal, a
comment or a key name.

```javascript
;({})._eval('import("fs")') // 'invalid'
;({})._eval('"the word import here"') // 'invalid' - matched anywhere
;({})._eval('"important".length') // 9 - only the whole word matches
;({})._eval('(async () => 1)()') // 'invalid'
```

The guard only reads the source text, so it stops asynchronous *syntax*, not
asynchronous values: a function held in a property still returns a `Promise`.
Prefer [`_wait`](#wait) for anything asynchronous.

```javascript
;({ f: async () => 1 })._eval('f()') // a Promise for 1 - the word never appears
```

### Not a security boundary

For the duration of the call, every constructor that can compile code — those of
`Function`, `AsyncFunction`, `GeneratorFunction` and `AsyncGeneratorFunction` —
is replaced with a getter returning `undefined`, and restored afterwards. That
closes the route the text guard above cannot see: a value reaching its own
prototype chain.

```javascript
;({})._eval('typeof (() => {})["constructor"]') // 'undefined' - swapped out
;({ f: async () => 1 })._eval('typeof f["constructor"]') // 'undefined'
```

It is still not a sandbox, so **do not pass untrusted input to `_eval`**. The
swap is process-wide but only lasts for the call, so a function the expression
*returns* sees the restored constructors, and constructors that merely coerce are
untouched:

```javascript
;({})._eval('() => (() => {})["constructor"]')().name // 'Function' - restored by then
;({})._eval('[]["constructor"]').name // 'Array' - it does not compile code
```

Treat `_eval` as a convenience for expressions you control — configuration,
rules and templates from your own codebase — and use a real sandbox (a worker, a
VM with its own realm, or a separate process) for anything user-supplied.
