// Object._extend(...objects)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_extend', () => {
  test('fills in keys missing from this', () => {
    expect({ a: 0, b: 0 }._extend({ a: 1, b: 1 }, { b: 2, c: 2 }))
      .toEqual({ a: 0, b: 0, c: 2 })
  })

  test('existing values take precedence over the arguments', () => {
    expect({ a: 'keep' }._extend({ a: 'ignored' })).toEqual({ a: 'keep' })
  })

  test('mutates and returns this', () => {
    const o = { a: 0 }
    expect(o._extend({ b: 2 })).toBe(o)
    expect(o).toEqual({ a: 0, b: 2 })
  })

  test('early arguments have priority over later ones', () => {
    expect({}._extend({ a: 1 }, { a: 2 })).toEqual({ a: 1 })
  })

  test('preserves falsy own values such as 0 and empty string', () => {
    expect({ a: 0, b: '' }._extend({ a: 9, b: 'x' })).toEqual({ a: 0, b: '' })
  })

  test('replaces null and undefined values', () => {
    expect({ a: null, b: undefined }._extend({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 })
  })

  test('with no arguments leaves this unchanged', () => {
    expect({ a: 1 }._extend()).toEqual({ a: 1 })
  })

  test('an empty argument adds nothing', () => {
    expect({ a: 1 }._extend({})).toEqual({ a: 1 })
  })

  test('extends an empty object with everything', () => {
    expect({}._extend({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 })
  })

  test('does not mutate the arguments', () => {
    const source = { a: 1 }
    const o = { a: 0 }
    o._extend(source)
    expect(source).toEqual({ a: 1 })
  })

  test('accepts several arguments at once', () => {
    expect({}._extend({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 })
  })
})
