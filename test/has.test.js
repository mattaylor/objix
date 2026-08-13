// Object._has(value)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_has', () => {
  test('true when the value is present', () => {
    expect({ a: 1, b: 2, c: 3 }._has(3)).toBe(true)
  })

  test('false when the value is absent', () => {
    expect({ a: 1 }._has(2)).toBe(false)
  })

  test('works on arrays', () => {
    expect([1, 2, 3]._has(2)).toBe(true)
    expect([1, 2, 3]._has(9)).toBe(false)
  })

  test('works on strings by character', () => {
    expect('abc'._has('a')).toBe(true)
    expect('abc'._has('z')).toBe(false)
  })

  test('compares by identity, so equal-but-distinct objects are absent', () => {
    expect({ a: 1, b: { x: 3 } }._has({ x: 3 })).toBe(false)
  })

  test('finds an object value by reference', () => {
    const nested = { x: 3 }
    expect({ a: nested }._has(nested)).toBe(true)
  })

  test('false for an empty object', () => {
    expect({}._has(undefined)).toBe(false)
  })

  test('finds falsy values', () => {
    expect({ a: 0 }._has(0)).toBe(true)
    expect({ a: null }._has(null)).toBe(true)
    expect({ a: false }._has(false)).toBe(true)
  })

  test('does not match across types (strict equality)', () => {
    expect({ a: 1 }._has('1')).toBe(false)
  })

  test('considers own values only, not inherited ones', () => {
    const child = Object.create({ inherited: 9 })
    child.own = 1
    expect(child._has(9)).toBe(false)
    expect(child._has(1)).toBe(true)
  })
})
