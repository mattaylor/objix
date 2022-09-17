## Objector

A dangerously convienient utility that injects useful functions into the Object prototype, for provide syntax sugar for many common use cases when working with notive Java script objects.

The functions are primarily copies of Object class methods as well as Array prototype methods that are applied to the values of the object.

Some usefull ones for delteing keys and comparing, spliting and joining objects from values are thrown in for good measure.

**NOTE:** Messing with Object prototypes is rarely a good idea and using this library may unintended consequences in larger application, however there are many situations where the enhanced readability and reducing on code size could make it worth it.

```
npm i -save objector
```

## API

### Object.prototype.map

Create a new object with function applied to each value of this.

```javascript
{a: 1}.map(v => v+1) // {a: 2}
```

### Object.prototype.apply

```javascript
let o = { a: 1 }
o.apply(v => v + 1) // { a: 2 }
o // {a: 2}
```

### Object.prototype.flatMap

```javascript
{a: 1}.flatMap([k,v] => [[k+1, v+1,[k+2, v+2]]) // { a1: 2, a2: 3 }
{a: 1, b: 0}.flatMap([k,v] => v ? [k, v+1 : []) // { a: 2 }
```

### Object.prototype.values

Object.values

```javascript
{a: 1}.values // [1]
```

### Object.prototype.keys

Object.keys

```javascript
{a: 1}.keys // ['a']
```

### Object.prototype.entries

```javascript
{a: 1}.entries // [[a,1]]
```

### Object.prototype.filter

```javascript
{a: 1, b: 2}.filter(v => v > 1) // {b: 2}
{a: 1, b: 2}.filter((v,k) => k == 'b') // {b: 2}
{a: 1, b: 2}.filter(v => v > 2) // {}
```

### Object.prototype.find

```javascript
{a: 1, b: 2}.find(v => v > 1) // 'b'
{a: 1, b: 2}.find(v => v > 2) // null

```

### Object.prototype.assign

```javascript
{ a: 1 }.assign({ a: 2, b: 2 }, { c: 3 }) // { a: 1, b: 2, c: 3}
```

### Object.prototype.merge

```javascript
let o = { a: 1 }
o.merge({ a: 2, b: 2 }, { c: 3 }) // { a: 1, b: 2, c: 3}
o // { a: 1, b: 2, c: 3}
```

### Object.prototype.patch

```javascript
let o = { a: 1, b: 2 }
o.patch({ a: 2 }) // { a: 2}, b: 2 }
```

### Object.prototype.delete

```javascript
{ a: 1, b: 2, c: 3}.delete('a','b') // {c: 3}
```

### Object.prototype.some

```javascript
{a: 1, b: 2}.find(v => v > 1) // true
{a: 1, b: 2}.find(v => v > 2) // false
```

### Object.prototype.every

```javascript
{a: 1, b: 2}.find(v => v > 0) // true
{a: 1, b: 2}.find(v => v > 1) // false
```

### Object.prototype.toString

```javascript
{a:1}.toString() // '{"a":1}'
```

### Object.prototype.json

```javascript
{a:1}.json() // '{"a":1}'
```

### Object.prototype.clone

```javascript
let o1 = { a: 1 }
let o2 = o1.clone() // {a: 1}
o1.a = 2
o2 // { a: a }
```

### Object.prototype.join

Return new Object with values concatenated from Array of objects for each value in values array

```javascript
let o = { a: 1 }
o.join({ a: 2 }, { a: 3 }) // { a: [1,2,3]}
```

### Object.prototype.split

Return Array of objects for each value in values array

```javascript
{a: [1,2]}.split() // [{ a: 1}, {a:2}]
```

### Object.prototype.contains

```javascript
{a: 1, b: 2}.contains({a: 1}) // true
{a: 1}.contains({a: 1, b: 2}) // false
```

### Object.prototype.within

```javascript
{a: 1}.within({a: 1, b: 2}) // true
{a: 1, b: 2}.within({a: 1}) // false
```

### Object.prototype.equals

```javascript
{a: 1}.equals({a: 1}) // true
{a: 1}.equals({a: 2}) // false

```

### Object.prototype.size

```javascript
{a: 1}.size() // 1
```
