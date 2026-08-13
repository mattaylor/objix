// Object._same(object)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_same', () => {
  test('keeps entries whose values are equal in the argument', () => {
    expect({ a: 1, b: 2 }._same({ a: 2, b: 2 })).toEqual({ b: 2 })
  })

  test('returns an empty object when nothing matches', () => {
    expect({ a: 1, b: 2 }._same({ b: 3 })).toEqual({})
  })

  test('keys absent from the argument are dropped', () => {
    expect({ a: 1, b: 2 }._same({ b: 2, c: 3 })).toEqual({ b: 2 })
  })

  test('extra keys in the argument are ignored', () => {
    expect({ a: 1 }._same({ a: 1, z: 9 })).toEqual({ a: 1 })
  })

  test('matches falsy values that are equal', () => {
    expect({ a: 0, b: 1 }._same({ a: 0, b: 9 })).toEqual({ a: 0 })
  })

  test('compares each value with _eq, so one nesting level matches structurally', () => {
    expect({ a: { x: 1 } }._same({ a: { x: 1 } })).toEqual({ a: { x: 1 } })
  })

  test('but a second nesting level is compared by identity and so differs', () => {
    // The per-value _eq runs at depth 0, comparing {b:{c:1}} members with ==.
    expect({ a: { b: { c: 1 } } }._same({ a: { b: { c: 1 } } })).toEqual({})
  })

  test('a shared nested reference matches at any depth', () => {
    const shared = { b: { c: 1 } }
    expect({ a: shared }._same({ a: shared })).toEqual({ a: shared })
  })

  test('does not mutate the source', () => {
    const source = { a: 1, b: 2 }
    source._same({ b: 2 })
    expect(source).toEqual({ a: 1, b: 2 })
  })

  test('returns a new object', () => {
    const source = { a: 1 }
    expect(source._same({ a: 1 })).not.toBe(source)
  })

  test('an empty source yields an empty result', () => {
    expect({}._same({ a: 1 })).toEqual({})
  })
})
