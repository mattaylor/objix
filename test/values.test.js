// Object._values() - delegates to Object.values(this)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_values', () => {
  test('returns the own enumerable values', () => {
    expect({ a: 1, b: 2 }._values()).toEqual([1, 2])
  })

  test('returns an empty array for an empty object', () => {
    expect({}._values()).toEqual([])
  })

  test('returns the elements of an array', () => {
    expect([1, 2]._values()).toEqual([1, 2])
  })

  test('does not include inherited values', () => {
    expect({ a: 1 }._new({ b: 2 })._values()).toEqual([2])
  })

  test('includes undefined values', () => {
    expect({ a: undefined }._values()).toEqual([undefined])
  })

  test('preserves nested references', () => {
    const nested = { c: 1 }
    expect({ a: nested }._values()[0]).toBe(nested)
  })

  test('matches Object.values', () => {
    const o = { a: 1, b: 'two', c: null }
    expect(o._values()).toEqual(Object.values(o))
  })

  test('returns characters for a string', () => {
    expect('ab'._values()).toEqual(['a', 'b'])
  })
})
