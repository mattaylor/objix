// Object._create(descriptors) - delegates to Object.create(this, descriptors)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_create', () => {
  test('creates an object whose prototype is this', () => {
    const proto = { a: 1 }
    expect(Object.getPrototypeOf(proto._create())).toBe(proto)
  })

  test('the new object has no own keys', () => {
    expect({ a: 1 }._create()._keys()).toEqual([])
  })

  test('the new object inherits from this', () => {
    expect({ a: 1 }._create().a).toBe(1)
  })

  test('accepts property descriptors', () => {
    expect({ a: 1 }._create({ b: { value: 2, enumerable: true } }).b).toBe(2)
  })

  test('a descriptor without enumerable stays hidden from _keys', () => {
    expect({ a: 1 }._create({ b: { value: 2 } })._keys()).toEqual([])
  })

  test('a non writable descriptor cannot be reassigned', () => {
    const created = { a: 1 }._create({ b: { value: 2, writable: false } })
    expect(() => { 'use strict'; created.b = 3 }).toThrow(TypeError)
  })

  test('getter descriptors are honoured', () => {
    const created = { a: 1 }._create({ double: { get() { return this.a * 2 } } })
    expect(created.double).toBe(2)
  })

  test('does not mutate this', () => {
    const proto = { a: 1 }
    proto._create({ b: { value: 2 } })
    expect(proto._keys()).toEqual(['a'])
  })

  test('matches Object.create', () => {
    const proto = { a: 1 }
    expect(Object.getPrototypeOf(proto._create())).toBe(Object.getPrototypeOf(Object.create(proto)))
  })

  test('inherits methods that see the new receiver', () => {
    const proto = { name: 'proto', who() { return this.name } }
    const created = proto._create({ name: { value: 'child', enumerable: true } })
    expect(created.who()).toBe('child')
  })
})
