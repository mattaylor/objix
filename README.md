# Objix <!-- {docsify-ignore} -->

Objix is a dangerously convienient, high performance, zero dependency lightweight utility to extend the javascript standard library and sugar many common use cases when working with native object.

The functions are all non enumerable and include copies of Object class methods and Array prototype methods that are applied to the values of the object as well others inspired by lodash and some extras to delete keys, stringify, promisify, compare, split and join objects, memoise functions, log messages, check types and trapping/observing property assignments.

These protoype methods are highly optimised with zero copy operations where possible. The unminified source is only 3.6kb (2.8kb minified) which allows for fast loading and easy integration without additonal compilation or tree shaking steps. There is however only limited type checking to guard against unwanted side effects. Performance in most cases is signifantly faster than lodash equivalents especially when working with small objects. For example `ob.map(fn)` is typically over 65% faster than `_.mapValues(ob, fn)` and some operations such as `filter` can be several thousand times quicker `according to simple [benchmarks](bench.md).

[API docs are available here](api.md). Interactive examples are also availble on https://objix.dev/#/api.

**NOTE:** With great power comes great responsibility and messing with Object prototypes may have unintended consequences in larger applications. However just think of all the time and key strokes you could save.

## Getting Started - Node

- Install:

  ```bash
  > npm i -save objix
  ```

- Require:

  ```javascript
  require('objix')
  console.log({ a: 1 }.map(v => v + 1))
  ```

## Getting Started - Browser

```html
<script src="https://cdn.jsdelivr.net/gh/mattaylor/objix@main/objix.min.js"></script>

<script>
  var o = { a: 1 }.map(v => v + 1)).log()
</script>
```

## Prototype Methods

The following methods are availble to all Objects via protoype inheritence, unless overwritten by a sub class.

| Method                            | Notes                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------- |
| [`map`](api.md#map)               | Map a function to all entries of an `this`                                                        |
| [`flatMap`](api.md#flatMap)       | FlatMap a function to all entries of an `this`                                                    |
| [`values`](api.md#values)         | Return values of `this`                                                                           |
| [`create`](api.md#create)         | Create a new Object based on `this`                                                               |
| [`keys`](api.md#keys)             | Return keys of `this                                                                              |
| [`entries`](api.md#entries)       | Return `[key,value]` entry pairs of `this`                                                        |
| [`is`](api.md#is)                 | Check type of `this`                                                                              |
| [`[@@iterator]`](api.md#iterator) | Iterate through values of `this`                                                                  |
| [`clean`](api.md#clean)           | Remove falsy values from `this`                                                                   |
| [`filter`](api.md#filter)         | Create a copy of `this` entries with filtered entries removed                                     |
| [`find`](api.md#find)             | Find keys of `this` which match a function                                                        |
| [`assign`](api.md#assign)         | Assign new properties to `this`                                                                   |
| [`extend`](api.md#extend)         | Assign default properties to `this`                                                               |
| [`same`](api.md#same)             | Return new object like `this` with properties shared with another                                 |
| [`diff`](api.md#diff)             | Return new object like `this` with properties not shared with another                             |
| [`delete`](api.md#delete)         | Remove keys from `this`                                                                           |
| [`some`](api.md#some)             | Test a function against at least one entry of `this`                                              |
| [`every`](api.md#every)           | Test a function against all entries of `this`                                                     |
| [`has`](api.md#has)               | Lookup key of `this` by value                                                                     |
| [`at`](api.md#at)                 | Lookup value by key path                                                                          |
| [`$`](api.md#fmt)                 | Coerce `this` into a string with configurable formatting                                          |
| [`clone`](api.md#clone)           | Clone `this` with configurable depths                                                             |
| [`join`](api.md#join)             | Join objects together with `this` with array property values                                      |
| [`split`](api.md#split)           | Split `this` into multiple objects from array property values                                     |
| [`contains`](api.md#contains)     | Check if `this` contains all entries from another object at a configurable depth.                 |
| [`eq`](api.md#eq)                 | Compare key and value identity between `this` and other objects at a configurable depth           |
| [`size`](api.md#size)             | Return number of entres in `this`.                                                                |
| [`keyBy`](api.md#keyBy)           | Index an array of objects into `this` using a given key                                           |
| [`memo`](api.md#memo)             | Memoize `this` as a function with configurable result cache expiration                            |
| [`bind`](api.md#bind)             | Assign a function as a method of `this` with optional memoization                                 |
| [`log`](api.md#log)               | Conditionally Write `this` to the console with an optional message                                |
| [`try`](api.md#try)               | Call a function against `this` and catch any exceptions                                           |
| [`trap`](trap.md#trap)            | Create a proxy around `this` to intercept property assignments                                    |
| [`new`](api.md#new)               | Create a new object using `this` as a prototype.                                                  |
| [`wait`](api.md#wait)             | Create a Promise around `this` which resolves after a timeout or when called by another function. |

## Fluent Method Chaining

Most of these function return objects including those modifying `this` and so can be easily chained together.

<div data-runkit>

```javascript
var o = { a: 0, b: 1, c: 2 }.clean() // { b: 2, c: 3 }
```

</div>

## Function Aliases

All functions documented below are also callable with a '\_\_' prefix to the function name.
This can help ensure that the function is availble and not overwritten by other object property assignments.

```javascript
var o = { a: 1 }.size() == { a: 1 }.__size() //true
var o = { a: 1 }.find(v => v) == { a: 1 }.__find(v => v) //true
```

## Simple Classes

Any object can act as a class from which new objects can be derived. All properties of `this` are inherited - including traps!!

<div data-runkit>

```javascript
var Person = { firstName: 'john', lastName: 'doe' }
  .trap(v => new Date(v).getDate(), 'Invalid date', 'dob')
  .bind('age', t => Math.floor((Date.now() - new Date(t.dob)) / 31536000000))
  .bind('name', t => t.firstName + ' ' + t.lastName)

var p1 = Person.new({ firstName: 'jane' })
p1.name() // 'jane doe'
p1.dob = 'foobar' // Uncaught 'Invalid date [dob, foobar]'
p1.dob = '10/10/2000'
p1.age() // 22
```

</div>

## Module Exports

All functions listed below are also available using traditional module exports, where the first argument of the function will be the object that the function is targeting as `this` if called via the object O.p.

```javascript
const _ = require('objix')

_.size({ a: 1 }) == { a: 1 }.size() // true
_.find({ a: 1 }, v => v) == { a: 1 }.find(v => v) //true
```
