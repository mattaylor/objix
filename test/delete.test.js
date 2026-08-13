// Object._delete(...keys)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_delete', () => {
  test('removes the listed keys', () => {
    expect({ a: 1, b: 2, c: 3 }._delete('a', 'b')).toEqual({ c: 3 })
  })

  test('mutates and returns the same object', () => {
    const o = { a: 1, b: 2 }
    expect(o._delete('a')).toBe(o)
    expect(o).toEqual({ b: 2 })
  })

  test('ignores keys that are not present', () => {
    expect({ a: 1 }._delete('zz')).toEqual({ a: 1 })
  })

  test('with no arguments leaves the object unchanged', () => {
    expect({ a: 1 }._delete()).toEqual({ a: 1 })
  })

  test('can empty an object entirely', () => {
    expect({ a: 1, b: 2 }._delete('a', 'b')._len()).toBe(0)
  })

  test('removes a key holding a falsy value', () => {
    expect({ a: 0, b: 1 }._delete('a')).toEqual({ b: 1 })
  })

  test('deletes array elements, leaving a hole', () => {
    const a = [1, 2, 3]._delete('1')
    expect(a.length).toBe(3)
    expect(a[1]).toBeUndefined()
  })

  test('only affects own keys, leaving the prototype intact', () => {
    const proto = { a: 1 }
    const child = Object.create(proto)
    child.a = 2
    child._delete('a')
    expect(child.a).toBe(1)
    expect(proto.a).toBe(1)
  })

  test('accepts duplicate keys idempotently', () => {
    expect({ a: 1, b: 2 }._delete('a', 'a')).toEqual({ b: 2 })
  })
})
