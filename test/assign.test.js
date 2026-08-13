// Object._assign(...sources) - delegates to Object.assign(this, ...sources)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_assign', () => {
  test('copies source keys onto this', () => {
    expect({ a: 1 }._assign({ b: 2 })).toEqual({ a: 1, b: 2 })
  })

  test('mutates this rather than returning a copy', () => {
    const target = { a: 1 }
    target._assign({ b: 2 })
    expect(target).toEqual({ a: 1, b: 2 })
  })

  test('returns this', () => {
    const target = { a: 1 }
    expect(target._assign({ b: 2 })).toBe(target)
  })

  test('later sources overwrite earlier ones', () => {
    expect({ a: 1 }._assign({ a: 2 }, { a: 3 })).toEqual({ a: 3 })
  })

  test('accepts several sources', () => {
    expect({}._assign({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
  })

  test('with no sources returns this unchanged', () => {
    expect({ a: 1 }._assign()).toEqual({ a: 1 })
  })

  test('copies undefined values over existing ones', () => {
    expect({ a: 1 }._assign({ a: undefined })).toEqual({ a: undefined })
  })

  test('does not copy inherited keys from the source', () => {
    expect({}._assign({ a: 1 }._new({ b: 2 }))).toEqual({ b: 2 })
  })

  test('copies nested values by reference', () => {
    const nested = { c: 1 }
    expect({}._assign({ a: nested }).a).toBe(nested)
  })

  test('matches Object.assign', () => {
    expect({ a: 1 }._assign({ b: 2 })).toEqual(Object.assign({ a: 1 }, { b: 2 }))
  })

  test('assigns onto an array', () => {
    expect([1, 2]._assign({ 0: 9 })).toEqual([9, 2])
  })

  test('ignores null and undefined sources', () => {
    expect({ a: 1 }._assign(null, undefined, { b: 2 })).toEqual({ a: 1, b: 2 })
  })
})
