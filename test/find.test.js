// Object._find(test)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_find', () => {
  test('returns the first key passing a predicate', () => {
    expect({ a: 1, b: 2 }._find(v => v > 1)).toBe('b')
  })

  test('predicate receives value and key', () => {
    expect({ a: 1, b: 2 }._find((v, k) => k == 'b')).toBe('b')
  })

  test('returns undefined when nothing matches', () => {
    expect({ a: 1, b: 2 }._find(v => v > 2)).toBeUndefined()
  })

  test('returns the first of several matches', () => {
    expect({ a: 5, b: 5 }._find(v => v == 5)).toBe('a')
  })

  test('a non-function argument matches by _eq', () => {
    expect({ a: 1, b: 2 }._find(2)).toBe('b')
  })

  test('returns undefined when no value equals the argument', () => {
    expect({ a: 1, b: 2 }._find(0)).toBeUndefined()
  })

  test('matches nested objects structurally via _eq', () => {
    expect({ a: { x: 1 }, b: { y: 2 } }._find({ y: 2 })).toBe('b')
  })

  test('matches string values', () => {
    expect({ a: 'x', b: 'y' }._find('y')).toBe('b')
  })

  test('returns undefined for an empty object', () => {
    expect({}._find(() => true)).toBeUndefined()
  })

  test('returns an index key when used on an array', () => {
    expect([1, 2]._find(v => v > 1)).toBe('1')
  })

  test('includes inherited enumerable keys (for..in)', () => {
    const child = Object.create({ a: 9 })
    child.b = 1
    expect(child._find(v => v > 5)).toBe('a')
  })

  test('short circuits on the first match', () => {
    let calls = 0
    const o = { a: 1, b: 2, c: 3 }
    o._find(() => (calls++, true))
    expect(calls).toBe(1)
  })
})
