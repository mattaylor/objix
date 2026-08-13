// Object._diff(object)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_diff', () => {
  test('keeps entries whose values differ from the argument', () => {
    expect({ a: 1, b: 2 }._diff({ a: 2, b: 2 })).toEqual({ a: 1 })
  })

  test('returns an empty object when everything matches', () => {
    expect({ a: 1 }._diff({ a: 1 })).toEqual({})
  })

  test('keys absent from the argument count as different', () => {
    expect({ a: 1 }._diff({})).toEqual({ a: 1 })
  })

  test('extra keys in the argument are ignored', () => {
    expect({ a: 1 }._diff({ a: 1, z: 9 })).toEqual({})
  })

  test('is the complement of _same', () => {
    const left = { a: 1, b: 2 }
    const right = { a: 2, b: 2 }
    expect(left._same(right)._len() + left._diff(right)._len()).toBe(left._len())
  })

  test('a differing falsy value is kept', () => {
    expect({ a: 0 }._diff({ a: 1 })).toEqual({ a: 0 })
  })

  test('a second nesting level differs by identity', () => {
    expect({ a: { b: { c: 1 } } }._diff({ a: { b: { c: 1 } } }))
      .toEqual({ a: { b: { c: 1 } } })
  })

  test('does not mutate the source', () => {
    const source = { a: 1, b: 2 }
    source._diff({ a: 1 })
    expect(source).toEqual({ a: 1, b: 2 })
  })

  test('returns a new object', () => {
    const source = { a: 1 }
    expect(source._diff({})).not.toBe(source)
  })

  test('an empty source yields an empty result', () => {
    expect({}._diff({ a: 1 })).toEqual({})
  })
})
