// Object._keys() - delegates to Object.keys(this)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_keys', () => {
  test('returns the own enumerable keys', () => {
    expect({ a: 1, b: 2 }._keys()).toEqual(['a', 'b'])
  })

  test('returns an empty array for an empty object', () => {
    expect({}._keys()).toEqual([])
  })

  test('returns indices for an array', () => {
    expect([1, 2]._keys()).toEqual(['0', '1'])
  })

  test('does not include the objix methods', () => {
    expect({ a: 1 }._keys()).toEqual(['a'])
  })

  test('does not include inherited keys', () => {
    expect({ a: 1 }._new({ b: 2 })._keys()).toEqual(['b'])
  })

  test('includes keys whose value is undefined', () => {
    expect({ a: undefined }._keys()).toEqual(['a'])
  })

  test('matches Object.keys', () => {
    const o = { a: 1, b: 2, c: 3 }
    expect(o._keys()).toEqual(Object.keys(o))
  })

  test('returns character indices for a string', () => {
    expect('ab'._keys()).toEqual(['0', '1'])
  })
})
