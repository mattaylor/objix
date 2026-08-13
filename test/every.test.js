// Object._every(function)
//
// Note: object literals are bound to a variable before use rather than opening
// a statement, since `{ a: 1 }._every(...)` parses the leading `{` as a block.
// objix is loaded by test/setup.js (see jest.config.js).

describe('_every', () => {
  test('true when all values pass', () => {
    expect({ a: 1, b: 2 }._every(v => v > 0)).toBe(true)
  })

  test('false when any value fails', () => {
    expect({ a: 1, b: 2 }._every(v => v > 1)).toBe(false)
  })

  test('passes value and key to the predicate', () => {
    const seen = []
    const o = { a: 1, b: 2 }
    o._every((v, k) => (seen.push([k, v]), true))
    expect(seen).toEqual([['a', 1], ['b', 2]])
  })

  test('vacuously true for an empty object', () => {
    expect({}._every(() => false)).toBe(true)
  })

  test('short circuits on the first failure', () => {
    let calls = 0
    const o = { a: 1, b: 2, c: 3 }
    o._every(() => (calls++, false))
    expect(calls).toBe(1)
  })

  test('walks inherited enumerable keys (for..in)', () => {
    const child = Object.create({ a: 1 })
    child.b = 2
    // `a` is inherited and fails the predicate, so _every still sees it.
    expect(child._every(v => v > 1)).toBe(false)
  })

  test('works on arrays', () => {
    expect([2, 4]._every(v => v % 2 == 0)).toBe(true)
    expect([2, 3]._every(v => v % 2 == 0)).toBe(false)
  })

  test('a falsy return value counts as failure', () => {
    expect({ a: 1 }._every(() => 0)).toBe(false)
    expect({ a: 1 }._every(() => '')).toBe(false)
  })
})
