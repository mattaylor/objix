// Object._clean()
// objix is loaded by test/setup.js (see jest.config.js).

describe('_clean', () => {
  test('removes all falsy values', () => {
    expect({ a: 1, b: null, c: false, d: 0, e: '' }._clean()).toEqual({ a: 1 })
  })

  test('keeps truthy values including objects and empty arrays', () => {
    expect({ a: {}, b: [], c: 'x' }._clean()).toEqual({ a: {}, b: [], c: 'x' })
  })

  test('returns an empty object when everything is falsy', () => {
    expect({ a: 0, b: null }._clean()).toEqual({})
  })

  test('removes undefined values', () => {
    expect({ a: undefined, b: 1 }._clean()).toEqual({ b: 1 })
  })

  test('NaN is falsy and removed', () => {
    expect({ a: NaN, b: 1 }._clean()).toEqual({ b: 1 })
  })

  test('does not mutate the source', () => {
    const source = { a: 1, b: 0 }
    source._clean()
    expect(source).toEqual({ a: 1, b: 0 })
  })

  test('returns a new object', () => {
    const source = { a: 1 }
    expect(source._clean()).not.toBe(source)
  })

  test('an empty object stays empty', () => {
    expect({}._clean()).toEqual({})
  })

  test('keeps the string "0" and other truthy strings', () => {
    expect({ a: '0', b: 'false' }._clean()).toEqual({ a: '0', b: 'false' })
  })
})
