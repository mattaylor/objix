// Object._eq(object, depth)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_eq', () => {
  describe('shallow (no depth)', () => {
    test('true for equal flat objects', () => {
      expect({ a: 1 }._eq({ a: 1 })).toBe(true)
    })

    test('false when a value differs', () => {
      expect({ a: 1 }._eq({ a: 2 })).toBe(false)
    })

    test('false when the argument has extra keys', () => {
      expect({ a: 1 }._eq({ a: 1, b: 2 })).toBe(false)
    })

    test('false when the argument is missing keys', () => {
      expect({ a: 1, b: 2 }._eq({ a: 1 })).toBe(false)
    })

    test('true for the same reference', () => {
      const o = { a: 1 }
      expect(o._eq(o)).toBe(true)
    })

    test('true for equal empty objects', () => {
      expect({}._eq({})).toBe(true)
    })

    test('nested objects compare by identity, so equal literals differ', () => {
      expect({ a: 1, b: { c: 1 } }._eq({ a: 1, b: { c: 1 } })).toBe(false)
    })

    test('a shared nested reference is equal without depth', () => {
      const shared = { c: 1 }
      expect({ b: shared }._eq({ b: shared })).toBe(true)
    })

    test('falsy values compare correctly', () => {
      expect({ a: 0 }._eq({ a: 0 })).toBe(true)
      expect({ a: 0 }._eq({ a: 1 })).toBe(false)
    })

    test('NaN is not equal to itself', () => {
      expect({ a: NaN }._eq({ a: NaN })).toBe(false)
    })
  })

  describe('with depth', () => {
    test('depth 1 compares one nested level', () => {
      expect({ a: 1, b: { c: 1 } }._eq({ a: 1, b: { c: 1 } }, 1)).toBe(true)
    })

    test('depth 1 detects a nested difference', () => {
      expect({ a: 1, b: { c: 1 } }._eq({ a: 1, b: { c: 2 } }, 1)).toBe(false)
    })

    test('depth 1 compares nested arrays', () => {
      expect({ a: 1, b: [1, 2] }._eq({ a: 1, b: [1, 2] }, 1)).toBe(true)
    })

    test('depth accepts true as a synonym for one level', () => {
      expect({ a: { b: 1 } }._eq({ a: { b: 1 } }, true)).toBe(true)
    })

    test('depth 1 preserves falsy nested values', () => {
      expect({ a: { b: 0 } }._eq({ a: { b: 0 } }, 1)).toBe(true)
    })

    test('depth -1 recurses to any depth', () => {
      expect({ a: 1, b: { c: { d: 1 } } }._eq({ a: 1, b: { c: { d: 1 } } }, -1)).toBe(true)
    })

    test('depth -1 detects a deep difference', () => {
      expect({ a: { b: { c: 1 } } }._eq({ a: { b: { c: 2 } } }, -1)).toBe(false)
    })

    test('depth -1 handles arrays of objects', () => {
      expect({ a: 1, b: [{ c: 1 }, { c: 2 }] }._eq({ a: 1, b: [{ c: 1 }, { c: 2 }] }, -1))
        .toBe(true)
    })

    test('depth 2 compares nested arrays of objects', () => {
      expect([[{}]]._eq([[{}]], 2)).toBe(true)
    })

    test('insufficient depth leaves the deepest level compared by identity', () => {
      expect({ a: { b: { c: 1 } } }._eq({ a: { b: { c: 1 } } }, 1)).toBe(false)
    })
  })

  describe('non-objects', () => {
    test('compares numbers', () => {
      expect((123)._eq(123)).toBe(true)
      expect((1234)._eq(123)).toBe(false)
    })

    test('compares strings', () => {
      expect('123'._eq('123')).toBe(true)
      expect('123'._eq('1234')).toBe(false)
    })

    test('compares booleans', () => {
      expect((true)._eq(true)).toBe(true)
    })

    test('a string is not equal to an object', () => {
      expect('string'._eq({})).toBe(false)
    })

    test('a non-empty string is not equal to an empty one', () => {
      // The argument is falsy, so `o && ...` yields '' rather than false.
      expect('string'._eq('')).toBeFalsy()
    })

    test('an object is not equal to a number', () => {
      expect({ a: 1 }._eq(1)).toBe(false)
      expect({}._eq(1)).toBe(false)
    })

    test('returns the falsy argument when it is null or undefined', () => {
      // `this == o || o && ...` yields the argument itself when falsy.
      expect({ a: 1 }._eq(null)).toBeFalsy()
      expect({ a: 1 }._eq(undefined)).toBeFalsy()
    })
  })

  describe('arrays', () => {
    test('true for equal arrays', () => {
      expect([1]._eq([1])).toBe(true)
      expect([1, 2]._eq([1, 2])).toBe(true)
    })

    test('false when elements differ', () => {
      expect([1]._eq([0])).toBe(false)
      expect([1234]._eq([123])).toBe(false)
    })

    test('false when lengths differ', () => {
      expect([123]._eq([123, 0])).toBe(false)
      expect([]._eq([0])).toBe(false)
    })

    test('true for two empty arrays', () => {
      expect([]._eq([])).toBe(true)
    })

    test('nested empty arrays are equal at depth 1', () => {
      expect({ a: [] }._eq({ a: [] }, 1)).toBe(true)
    })

    test('a nested array differing in length is unequal', () => {
      expect({ a: [1] }._eq({ a: [] }, 1)).toBe(false)
    })

    test('an array is equal to an object with matching indices', () => {
      // _is compares against the *argument's* constructor and an array is an
      // instanceof Object, so comparison is structural rather than by type.
      expect([1]._eq({ 0: 1 })).toBe(true)
    })

    test('but an object is not equal to an array, as Object is not an Array', () => {
      expect(({ 0: 1 })._eq([1])).toBe(false)
    })
  })
})
