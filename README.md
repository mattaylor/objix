## Objix

A dangerously convienient utility (< 2kb!) that injects usefull functions into the Object prototype to sugar many common use cases when working with native Javascript objects.

The functions include copies of Object class methods and Array prototype methods that are applied to the values of the object as well others inspired by lodash and some extras to delete keys, clean entries, printing, comparing, spliting and joining object togther.

The methods are highly optimised with zero copy operations where possible. There is however very limited type checking to guard against unwanted side effects. As a result performance in most cases is signifantly faster than lodash equivalents. (eg `ob.map(fn)` can be upto 50% faster than `_.mapValues(ob, fn)` when working with small objects according to simple [benchmarks](bench.js)

| Function | lodash | objix | % Diff |
| -------- | ------ | ----- | ------ |
| Map      | 9.27   | 4.23  | 54.37  |
| Filter   | 108.03 | 8.15  | 92.46  |
| Find     | 3.96   | 2.54  | 35.86  |
| KeyBy    | 6.14   | 4.18  | 31.92  |
| Equals   | 21.6   | 10.25 | 52.55  |
| Clone    | 11.34  | 7.47  | 34.13  |
| Some     | 6.61   | 3.81  | 42.36  |
| Every    | 3.68   | 2.73  | 25.82  |

**NOTE:** Messing with Object prototypes is rarely a good idea and using this library may have unintended consequences in larger applications, however just think of all the key strokes you could save...

```
npm i -save objix
```

## API

All functions documented below are also callable with a '\_' prefix to the function name.
This can help ensure that the function is availble and not overwritten by other object property assignments.

```javascript
{}.size() == {}._size() //true
{a: 1}.find(v => v) == {}._find(v => v) //true
```

### Object.prototype.map(function)

Create a clone of this with function applied to each value.
Function takes value and key as arguments.

```javascript
{ a: 1 }.map(v => v+1) // { a: 2 }
{ a: 1, b: 2 }.map((v,k) => (k == 'b') ? v+1 : v) // { a: 1, b:3 }
```

### Object.prototype.update(function)

Update values of this using supplied function and return this
Function takes value and key as arguments.

```javascript
let o = { a: 1 }
o.update((v, k) => (k == 'b' ? v + 1 : v)) // { a: 1, b:3 }
o // // { a: 1, b:3 }
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

Return new object with keys assiged from arguments overwriting this

```javascript
{ a: 1 }.assign({ a: 2, b: 2 }, {c: 3 }) // { a: 2, b: 2, c: 3 }
```

### Object.prototype.merge(...objects)

Return new object with keys assiged from arguments pritotising this

```javascript
{ a: 1 }.merge({ a: 2, b: 2 }, {c: 3 }) // { a: 1, b: 2, c: 3 }
```

### Object.prototype.patch(...objects)

Assign entries from arguments to this and return this

```javascript
let o = { a: 1, b: 2 }
o.patch({ a: 2 }) // { a: 2, b: 2 }
o // { a: 2, b: 2 }
```

### Object.prototype.common(object)

Return new object with common entries intersecting with supplied object

```javascript
{ a: 1, b: 2 }.common({ a: 2, b: 2 }) // { b: 2 }
```

### Object.prototype.delete(...keys)

Return new object with keys in arguments removed

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
