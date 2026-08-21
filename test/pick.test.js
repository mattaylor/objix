// Object._pick(function||list, target={})
// objix is loaded by test/setup.js (see jest.config.js).

describe('_pick', () => {
  test('selects entries passing a predicate', () => {
    expect({ a: 1, b: 2 }._pick(v => v > 1)).toEqual({ b: 2 })
  })

  test('predicate receives value and key', () => {
    expect({ a: 1, b: 2 }._pick((v, k) => k == 'b')).toEqual({ b: 2 })
  })

  test('returns an empty object when nothing matches', () => {
    expect({ a: 1, b: 2 }._pick(v => v > 2)).toEqual({})
  })

  test('selects by a list of keys', () => {
    expect({ a: 1, b: 2 }._pick(['b'])).toEqual({ b: 2 })
  })

  test('selects multiple keys from a list', () => {
    expect({ a: 1, b: 2, c: 3 }._pick(['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  test('a key list ignores keys absent from the source', () => {
    expect({ a: 1 }._pick(['a', 'zz'])).toEqual({ a: 1 })
  })

  test('an empty key list selects nothing', () => {
    expect({ a: 1 }._pick([])).toEqual({})
  })

  test('any non-function is matched by key membersship', () => {
    expect({ a: 1, b: 2, c: 3 }._pick(['a', 'b'])).toEqual({ a: 1, b: 2 })
  })

  test('merges into a supplied target', () => {
    expect({ a: 1, b: 2 }._pick(v => v > 1, { z: 0 })).toEqual({ z: 0, b: 2 })
  })

  test('returns the supplied target instance', () => {
    const target = {}
    expect({ a: 1 }._pick(() => true, target)).toBe(target)
  })

  test('does not mutate the source', () => {
    const source = { a: 1, b: 2 }
    source._pick(v => v > 1)
    expect(source).toEqual({ a: 1, b: 2 })
  })

  test('keeps falsy values that pass the predicate', () => {
    expect({ a: 0, b: 1 }._pick((v, k) => k == 'a')).toEqual({ a: 0 })
  })

  test('includes inherited enumerable keys (for..in)', () => {
    const child = Object.create({ a: 1 })
    child.b = 2
    expect(child._pick(() => true)).toEqual({ a: 1, b: 2 })
  })

  test('works on arrays, returning a plain object of indices', () => {
    expect([1, 2, 3]._pick(v => v > 1)).toEqual({ 1: 2, 2: 3 })
  })
})
