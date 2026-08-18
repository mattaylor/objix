# Objix <!-- {docsify-ignore} -->

Objix is a delightfully convienient, high performance, zero dependency and super lightweight utility which extends the javascript standard library to sugar many common use cases for working with any objects.

The functions are all non enumerable and include copies of Object class methods and Array prototype methods applied to the values of the object as well others to delete keys, stringify, promisify, memoize, compare, split/join objects, check types, log messages and trapping/observing property assignments.

This library is highly optimised with zero copy operations where possible. The source is under 5kb (3.2kb minified) which allows for fast loading and easy integration without additional compilation or tree shaking. Performance in most cases is significantly faster than `lodash` equivalents especially when working with small objects. For example `ob._map(fn)` is typically over 65% faster than `_.mapValues(ob, fn)` and some operations such as `pick` can be several thousand times quicker according to simple [benchmarks](docs/bench.md).

Interactive docs and demos are availble on https://objix.dev/#/docs/api, where
every example is runnable and editable in the page.

## Upgrading from 1.0

Objix 2.0 now prefixes all prototype methods with '_'. This avoids name clashes with built in methods and reduces unwanted side effects and compatibility issues inherent in the 1.x releases. 

The `_size()` method is now renamied to `_len()`.

## Getting Started - Node

- Install:

  ```bash
  > npm i -save objix
  ```

- Require:

  ```javascript
  require('objix')
  var o = { a: 1 }._map(v => v + 1)._log()
  ```

## Getting Started - Browser

```html
<script src="https://cdn.jsdelivr.net/gh/mattaylor/objix@main/objix.min.js"></script>

<script>
  var o = { a: 1 }._map(v => v + 1)._log()
</script>
```

## Prototype Methods

The following methods are availble to all Objects via protoype inheritence, unless overwritten by a subclass.

|                                        |                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| [`_map`](docs/api.md#map)               | Return a copy of `this` with all entries mapped by a function                               |
| [`_flatMap`](docs/api.md#flatMap)       | FlatMap a function to all entries of an `this`                                              |
| [`_values`](docs/api.md#values)         | Return values of `this`                                                                     |
| [`_create`](docs/api.md#create)         | Create a new Object based on `this` as a prototoype                                         |
| [`_keys`](docs/api.md#keys)             | Return keys of `this`                                                                       |
| [`_entries`](docs/api.md#entries)       | Return `[key,value]` entry pairs of `this`                                                  |
| [`_is`](docs/api.md#is)                 | Check type of `this`                                                                        |
| [`_has`](docs/api.md#has)               | Check if `this` includes some value                                                         |
| [`_[@@iterator]`](docs/api.md#iterator) | Iterate through values of `this`                                                            |
| [`_clean`](docs/api.md#clean)           | Return a copy of `this` without falsey entries                                              |
| [`_pick`](docs/api.md#pick)         | Create a copy of `this` with only entries with specific keys or values that that match a filter function                    |
| [`_find`](docs/api.md#find)             | Find keys of `this` which match a function or value                                                  |
| [`_assign`](docs/api.md#assign)         | Assign new properties to `this`                                                             |
| [`_extend`](docs/api.md#extend)         | Assign default properties to `this`                                                         |
| [`_same`](docs/api.md#same)             | Return new object like `this` with properties shared with another                           |
| [`_diff`](docs/api.md#diff)             | Return new object like `this` with properties not shared with another                       |
| [`_delete`](docs/api.md#delete)         | Remove keys from `this`                                                                     |
| [`_some`](docs/api.md#some)             | Test a function against at least one entry of `this`                                        |
| [`_every`](docs/api.md#every)           | Test a function against all entries of `this`                                               |
| [`_at`](docs/api.md#at)                 | Lookup value by key path                                                                    |
| [`_$`](docs/api.md#fmt)                 | Coerce `this` into a string with configurable formatting                                    |
| [`_clone`](docs/api.md#clone)           | Clone `this` with configurable depths                                                       |
| [`_join`](docs/api.md#join)             | Join objects together with `this` with array property values                                |
| [`_split`](docs/api.md#split)           | Split `this` into multiple objects from array property values                               |
| [`_contains`](docs/api.md#contains)     | Check if `this` contains all entries from another object to a given depth.                  |
| [`_eq`](docs/api.md#eq)                 | Compare key and value identity between `this` and other objects to a given depth            |
| [`_len`](docs/api.md#len)             | Return number of entres in `this`.                                                          |
| [`_keyBy`](docs/api.md#keyBy)           | Re-index values of this `this` using a given key path                                    |
| [`_memo`](docs/api.md#memo)             | Memoize `this` as a function with configurable result cache expiration                      |
| [`_bind`](docs/api.md#bind)             | Assign a function as a method of `this` with optional memoization                           |
| [`_log`](docs/api.md#log)               | Conditionally write `this` to the console with an optional message                          |
| [`_try`](docs/api.md#try)               | Call a function against `this` and catch any exceptions                                     |
| [`_trap`](docs/api.md#trap)            | Create a proxy around `this` to intercept property assignments                              |
| [`_new`](docs/api.md#new)               | Create a new object from another using `this` as a prototype, including traps               |
| [`_wait`](docs/api.md#wait)             | Create a Promise which resolves `this` after a timeout or as determined by another function |
| [`_eval`](docs/api.md#eval)             | Evaluate an expression with the properties of `this` in scope                                |

## Fluent Method Chaining

Most of these function return objects including those modifying `this` and so can be fluently chained together.

```javascript
var o = { a: 0, b: 1, c: 2 }
  ._pick(v => v > 0)
  ._log('POSITIVE') // 2022-10-07T00:00 POSITIVE { b: 1, c: 2 }
  ._map(v => v + 1)
  ._log('INCREMENT') // 2022-10-07T00:00 INCREMENT { b: 2, c: 3 }
```

## Function Aliases

All functions documented below are also callable with a '\_' prefix to the function name.
This can help ensure that the function is callable when overwritten by other object property assignments.

```javascript
var o = { a: 1 }._len() == { a: 1 }._len() //true
var o = { a: 1 }._find(v => v) == { a: 1 }._find(v => v) //true
```

## Simple Classes

Any object can act as a class from which new objects can be derived. All properties of `this` are inherited - including traps!!

```javascript
var Person = { firstName: 'john', lastName: 'doe' }
  ._trap(v => new Date(v).getDate(), 'Invalid date', 'dob')
  ._bind('age', t => Math.floor((Date.now() - new Date(t.dob)) / 31536000000))
  ._bind('name', t => t.firstName + ' ' + t.lastName)

var p1 = Person._new({ firstName: 'jane' })
p1.name() // 'jane doe'
p1._try(p => (p.dob = 'foobar'), console.log) // 'Invalid date ["dob","foobar"]' - the trap rejected it
p1.dob = '10/10/2000'
p1.age() // age in years since the dob above
```

## Module Exports

All functions listed below are also available using traditional module exports, where the first argument of the function will be the object that the function is targeting as `this` if called via the object O.p.

```javascript
const _ = require('objix')

_.len({ a: 1 }) == { a: 1 }._len() // true
_.find({ a: 1 }, v => v) == { a: 1 }._find(v => v) //true
```

## Testing

The unit test suite has one test file per API function under `test/`, and runs
both on [Jest](https://jestjs.io) under Node and directly under
[Bun](https://bun.sh).

```bash
npm install
npm test              # run the suite on Jest
npm run test:coverage # run with a coverage report
npm run test:watch    # re-run on change
npm run test:bun      # run the same suite under `bun test`
npm run test:legacy   # the original console.assert script (silent on success)
```

Coverage is enforced at 100% of statements, branches, functions and lines for
`objix.js`.

Notes for contributors:

- `test/setup.js` loads objix for every test file. Jest picks it up through
  `setupFiles` in `jest.config.js`; Bun ignores that and reads `preload` from
  `bunfig.toml` instead. Both need to stay in step.
- Under Jest that setup also **detaches** `Object.prototype[Symbol.iterator]`.
  objix installs it so any object can be spread, but Jest's equality treats *any*
  object carrying an iterator as an ordered sequence, which breaks `toEqual` on
  key order. Bun's `toEqual` compares by keys regardless, so it keeps the iterator
  installed. `test/iterator.test.js` restores it where the behaviour is under
  test — read the comments in both files before changing them.
- Bun shares one module registry and one `Object.prototype` across all test
  files, where Jest isolates each. Tests must therefore not rely on prototype
  state set up by another file, and must not tear down shared state that other
  files depend on.
- Prefer `jest.advanceTimersByTime` plus awaited microtask ticks over
  `advanceTimersByTimeAsync`, which Bun does not implement.
