// Object._map(function, target={})
// objix is loaded by test/setup.js (see jest.config.js).

describe('_map', () => {
  test('applies the function to every value', () => {
    expect({ a: 1 }._map(v => v + 1)).toEqual({ a: 2 })
  })

  test('passes value and key', () => {
    expect({ a: 1, b: 2 }._map((v, k) => (k == 'b' ? v + 1 : v))).toEqual({ a: 1, b: 3 })
  })

  test('returns a new object rather than mutating the source', () => {
    const source = { a: 1 }
    const mapped = source._map(v => v + 1)
    expect(source).toEqual({ a: 1 })
    expect(mapped).not.toBe(source)
  })

  test('merges into a supplied target', () => {
    expect({ a: 1 }._map(v => v + 1, { z: 9 })).toEqual({ z: 9, a: 2 })
  })

  test('returns the supplied target instance', () => {
    const target = {}
    expect({ a: 1 }._map(v => v, target)).toBe(target)
  })

  test('delegates to a native map when present (arrays)', () => {
    expect([1, 2]._map(v => v + 1)).toEqual([2, 3])
  })

  test('array delegation supplies the index as the second argument', () => {
    expect([10, 20]._map((v, i) => i)).toEqual([0, 1])
  })

  test('array delegation ignores the target argument', () => {
    expect([1]._map(v => v, { z: 9 })).toEqual([1])
  })

  test('handles an empty object', () => {
    expect({}._map(v => v)).toEqual({})
  })

  test('maps string values by character index', () => {
    expect('ab'._map(v => v)).toEqual({ 0: 'a', 1: 'b' })
  })

  test('includes inherited enumerable keys (for..in)', () => {
    const child = Object.create({ a: 1 })
    child.b = 2
    const mapped = child._map(v => v)
    expect(mapped.a).toEqual(1)
    expect(mapped.b).toEqual(2)

  })

  test('preserves undefined results as entries', () => {
    expect({ a: 1 }._map(() => undefined)).toEqual({ a: undefined })
  })
})
