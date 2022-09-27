## Objix

A dangerously convienient utility (2kb) that injects usfull functions into the Object prototype to sugar many common use cases when working with native Javascript objects.

The functions are primarily copies of Object class methods and Array prototype methods that are applied to the values of the object.

There are also some usefull methds for deleting keys, cleaning, printing, comparing, spliting and joining object togther.

**NOTE:** Messing with Object prototypes is rarely a good idea and using this library may have unintended consequences in larger applications, however just think of all the key strokes you could save...

```
npm i -save objix
```

## API

### Object.prototype.map(function)

Create a clone of this with function applied to each value.

```javascript
{ a: 1 }.map(v => v+1) // { a: 2 }
{ a: 1, b: 2 }.map((v,k) => (k == 'b') ? v+1 : v) // { a: 1, b:3 }

```

### Object.prototype.apply(function)

Apply function to values of this and return this

```javascript
let o = { a: 1 }
o.apply(v => v + 1) // { a: 2 }
o // { a: 2 }
```

### Object.prototype.flatMap(functoin)

Return new object with function applied to each entry return 0 or more new entry pairs

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
{}.isArray() // false
[].isArray() // true
```

### Object.prototype.clean()

Return new object with falsy entry values removed

```javascript
{ a: 1, b: null, c: false, d: 0, e: '' }.clean() // { a: 1 }
```

### Object.prototype.filter(function)

Return new object with only values that pass function.

```javascript
{ a: 1, b: 2 }.filter(v => v > 1) // { b: 2 }
{ a: 1, b: 2 }.filter((v,k) => k == 'b') // { b: 2 }
{ a: 1, b: 2 }.filter(v => v > 2) // {}
```

### Object.prototype.find(function)

Return first key where value passes function

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

```javascript
{ a: 1, b: 2 }.find(v => v > 0) // true
{ a: 1, b: 2 }.find(v => v > 1) // false
```

### Object.prototype.json()

JSON.stringfy(this)

```javascript
{ a: 1 }.json() // '{ "a": 1 }'
```

### Object.prototype.clone()

Return new object with entries copied from this

```javascript
let o1 = { a: 1 }
let o2 = o1.clone() // { a: 1 }
o1.a = 2
o2 // { a: a}
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

### Object.prototype.index(key, array)

Index an array of objects into this using the given key

```javascript
o = {}
o.from('a', [{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }])
o // { o1: { a: 'o1' }, o2: [ { a: 'o2', b: 1 }, { a: 'o2' } ]
```
