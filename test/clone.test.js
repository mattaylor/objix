// Object._clone(depth)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_clone', () => {
  describe('shallow (no depth)', () => {
    test('copies own entries into a new object', () => {
      const source = { a: 1, b: 2 }
      const copy = source._clone()
      expect(copy).toEqual({ a: 1, b: 2 })
      expect(copy).not.toBe(source)
    })

    test('top level edits do not affect the copy', () => {
      const source = { a: 1 }
      const copy = source._clone()
      source.a = 2
      expect(copy.a).toBe(1)
    })

    test('nested objects stay shared', () => {
      const source = { a: 1, b: { c: 1 } }
      const copy = source._clone()
      source.b.c = 2
      expect(copy.b.c).toBe(2)
    })

    test('nested arrays stay shared', () => {
      const source = { d: [1, 2] }
      const copy = source._clone()
      source.d.pop()
      expect(copy.d).toEqual([1])
    })

    test('an empty object is returned as-is', () => {
      // With no keys there is nothing to copy, so the same reference is used.
      const source = {}
      expect(source._clone()).toBe(source)
    })
  })

  describe('with depth', () => {
    test('depth 1 detaches one nested level', () => {
      const source = { a: 1, b: { c: 1 } }
      const copy = source._clone(1)
      source.b.c = 2
      expect(copy.b.c).toBe(1)
    })

    test('depth 1 detaches a nested array', () => {
      const source = { d: [1, 2] }
      const copy = source._clone(1)
      source.d.pop()
      expect(copy.d).toEqual([1, 2])
    })

    test('depth 1 is not enough for two levels', () => {
      const source = { a: { b: { c: 1 } } }
      const copy = source._clone(1)
      source.a.b.c = 2
      expect(copy.a.b.c).toBe(2)
    })

    test('depth -1 detaches to any depth', () => {
      const source = { a: 1, b: { c: { d: 1 } } }
      const copy = source._clone(-1)
      source.b.c.d = 9
      expect(copy).toEqual({ a: 1, b: { c: { d: 1 } } })
    })

    test('depth 2 detaches two levels', () => {
      const source = { a: { b: { c: 1 } } }
      const copy = source._clone(2)
      source.a.b.c = 2
      expect(copy.a.b.c).toBe(1)
    })
  })

  describe('non plain objects', () => {
    test('a string is returned by value', () => {
      expect('asdf'._clone()).toBe('asdf')
    })

    test('a number is returned by value', () => {
      expect((42)._clone()).toBe(42)
    })

    test('a boolean is returned by value', () => {
      expect((true)._clone()).toBe(true)
    })

    test('an array is copied', () => {
      const source = [1, 2, 3]
      const copy = source._clone()
      expect(copy).toEqual([1, 2, 3])
      source.pop()
      expect(copy).toEqual([1, 2, 3])
    })

    test('an empty array is returned as-is', () => {
      const source = []
      expect(source._clone()).toBe(source)
    })

    test('a Date is cloned into an independent Date', () => {
      const source = new Date(0)
      const copy = source._clone()
      expect(copy).toBeInstanceOf(Date)
      expect(copy.getTime()).toBe(0)
      source.setFullYear(1999)
      expect(copy.getTime()).toBe(0)
    })

    test('a nested Date is detached at depth 1', () => {
      const source = { d: new Date(0) }
      const copy = source._clone(1)
      source.d.setFullYear(1999)
      expect(copy.d.getTime()).toBe(0)
    })
  })

  describe('functions', () => {
    test('a shallow clone shares nested function references', () => {
      const source = { a: () => 0, b: { c: () => 0 } }
      const copy = source._clone()
      source.b.c = () => 1
      expect(copy.b.c()).toBe(1)
    })

    test('a shallow clone detaches top level function references', () => {
      const source = { a: () => 0 }
      const copy = source._clone()
      source.a = () => 1
      expect(copy.a()).toBe(0)
    })

    test('a deep clone detaches nested functions', () => {
      const source = { a: () => 0, b: { c: () => 0 } }
      const copy = source._clone(-1)
      source.a = () => 1
      source.b.c = () => 1
      expect(copy.a()).toBe(0)
      expect(copy.b.c()).toBe(0)
    })
  })

  test('deep cloning a mixed structure preserves all values', () => {
    const source = { a: 1, b: { c: 1 }, d: [1], e: 's', f: null }
    const copy = source._clone(2)
    source.b.c = 2
    source.a = 2
    source.d.pop()
    expect(copy._eq({ a: 1, b: { c: 1 }, d: [1], e: 's', f: null }, -1)).toBe(true)
  })
})
