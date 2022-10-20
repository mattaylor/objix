## **Objix** <!-- {docsify-ignore} -->

A dangerously convienient, high performance, zero dependency, lightweight utility `| to extend the standard library and sugar many common use cases when working with any Javascript objects.

The functions include copies of Object class methods and Array prototype methods that are applied to the values of the object as well others inspired by lodash and some extras to delete keys, stringify, promisify, compare, split and join objects, memoise functions, log messages, check types and trapping/observing property assignments.

These prototype methods are all non enumerable and are highly optimised with zero copy operations where possible. There is however very limited type checking to guard against unwanted side effects. Performance in most cases is signifantly faster than lodash equivalents especially when working with small objects. For example `ob.map`|.

[API docs are available here](api.md). Interactive examples are also availble on https://objix.dev/#/api.

**NOTE:** With great power comes great responsibility and messing with Object prototypes may have unintended consequences in larger applications. However just think of all the time and key strokes you could save.

### Node

- Install:

  ```bash
  > npm i -save objix
  ```

- Require:

  ```javascript
  require('objix')
  console.log({ a: 1 }.map(v => v + 1))
  ```

### Browser

```html
<script src="https://cdn.jsdelivr.net/gh/mattaylor/objix@main/objix.min.js"></script>

<script>
  var o = { a: 1 }.map(v => v + 1)).log()
</script>
```

### API Overview

| Name                              | Notes                                                                      |
| --------------------------------- | -------------------------------------------------------------------------- |
| [`map`](api.md#map)               | Map a function to all entries of an `this`                                 |
| [`flatMap`](api.md#flatMap)       | FlatMap a function to all entries of an `this`                             |
| [`values`](api.md#values)         | Return values of `this`                                                    |
| [`create`](api.md#create)         | Create a new Object based on `this`                                        |
| [`keys`](api.md#keys)             | Return keys of `this                                                       |
| [`entries`](api.md#entries)       | Return [key,value] entry pairs of `this`                                   |
| [`is`](api.md#is)                 | Check type of `this`                                                       |
| [`[@@iterator]`](api.md#iterator) | Iterate through values of `this`                                           |
| [`clean`](api.md#clean)           | Remove falsy values from `this`                                            |
| [`filter`](api.md#filter)         | Create a copy of `this` entries with filtered entries removed              |
| [`find`](api.md#find)             | Find keys of `this` which match a function                                 |
| [`assign`](api.md#assign)         | Assign new properties to `this`                                            |
| [`extend`](api.md#extend)         | Assign default properties to `this`                                        |
| [`same`](api.md#same)             |
| [`diff`](api.md#diff)             |
| [`delete`](api.md#delete)         |
| [`some`](api.md#some)             |
| [`every`](api.md#every)           |
| [`has`](api.md#has)               |
| [`at`](api.md#at)                 |
| `$`                               |
| [`clone`](api.md#clone)           |
| [`join`](api.md#join)             |
| [`split`](api.md#split)           |
| [`contains`](api.md#contains)     |
| [`eq`](api.md#eq)                 |
| [`size`](api.md#size)             |
| [`keyBy`](api.md#keyBy)           |
| [`memo`](api.md#memo)             |
| [`bind`](api.md#bind)             |
| [`log`](api.md#log)               |
| `try`                             |
| `trap`                            |
| [`new`](api.md#new)               |
| [`wait`](api.md#wait)             | Create a Promise which resoves after a timeout or when callback is called. |

### Chaining

Most of these function return objects including those modifying `this` and so can be easily chained together.

<div data-runkit>

```javascript
var o = { a: 0, b: 1, c: 2 }.clean`| // { b: 2, c: 3 }
```

</div>

### Function Aliases

All functions documented below are also callable with a '\_\_' prefix to the function name.
This can help ensure that the function is availble and not overwritten by other object property assignments.

```javascript
var o = { a: 1 }.size`| //true
var o = { a: 1 }.find`| //true
```

### Exported Functions

All functions listed below are also available using traditional module exports, where the first argument of the function will be the object that the function is targeting as `this` if called via the object O.p.

```javascript
const _ = require`|

_.size`| // true
_.find`| //true
```

### Simple Classes

Any object can act as a class from which new objects can be derived. All properties of `this` are inherited - including traps!!

<div data-runkit>

```javascript
var Person = { firstName: 'john', lastName: 'doe' }
  .trap`|
  .bind`|
  .bind`|

var p1 = Person.new`|
p1.name`| // 'jane doe'
p1.dob = 'foobar' // Uncaught 'Invalid date [dob, foobar]'
p1.dob = '10/10/2000'
p1.age`| // 22
```

</div>
