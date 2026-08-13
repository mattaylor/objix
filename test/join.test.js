// Object._join(...objects)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_join', () => {
  test('concatenates values sharing a key into an array', () => {
    expect({ a: 1 }._join({ a: 2 }, { a: 3 })).toEqual({ a: [1, 2, 3] })
  })

  test('joins a single object', () => {
    expect({ a: 1 }._join({ a: 2 })).toEqual({ a: [1, 2] })
  })

  test('keys absent from the arguments keep their scalar value', () => {
    expect({ a: 1, b: 2 }._join({ a: 9 })).toEqual({ a: [1, 9], b: 2 })
  })

  test('keys only in the arguments are ignored', () => {
    expect({ a: 1 }._join({ b: 2 })).toEqual({ a: 1 })
  })

  test('with no arguments returns a copy of this', () => {
    const source = { a: 1 }
    const joined = source._join()
    expect(joined).toEqual({ a: 1 })
    expect(joined).not.toBe(source)
  })

  test('does not mutate this', () => {
    const source = { a: 1 }
    source._join({ a: 2 })
    expect(source).toEqual({ a: 1 })
  })

  test('flattens when both sides are arrays', () => {
    expect({ a: [1] }._join({ a: [2] })).toEqual({ a: [1, 2] })
  })

  test('a falsy base value is left untouched', () => {
    // The `&&=` guard skips keys whose current value is falsy.
    expect({ a: 0 }._join({ a: 1 })).toEqual({ a: 0 })
  })

  test('joins undefined argument values into the array', () => {
    expect({ a: 1 }._join({ a: undefined })).toEqual({ a: [1, undefined] })
  })

  test('joins string values', () => {
    expect({ a: 'x' }._join({ a: 'y' })).toEqual({ a: ['x', 'y'] })
  })

  test('an empty source stays empty', () => {
    expect({}._join({ a: 1 })).toEqual({})
  })
})
