// Object._some(function)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_some', () => {
  test('true when any value passes', () => {
    expect({ a: 1, b: 2 }._some(v => v > 1)).toBe(true)
  })

  test('false when no value passes', () => {
    expect({ a: 1, b: 2 }._some(v => v > 2)).toBe(false)
  })

  test('false for an empty object', () => {
    expect({}._some(() => true)).toBe(false)
  })

  test('passes value and key to the predicate', () => {
    const seen = []
    const o = { a: 1 }
    o._some((v, k) => (seen.push([k, v]), false))
    expect(seen).toEqual([['a', 1]])
  })

  test('short circuits on the first pass', () => {
    let calls = 0
    const o = { a: 1, b: 2, c: 3 }
    o._some(() => (calls++, true))
    expect(calls).toBe(1)
  })
/*
  test('considers own keys only (Object.keys), unlike _every', () => {
    const child = Object.create({ a: 9 })
    child.b = 1
    // The inherited `a` would pass, but _some iterates Object.keys.
    expect(child._some(v => v > 5)).toBe(false)
  })
*/
  test('works on arrays', () => {
    expect([1, 2]._some(v => v > 1)).toBe(true)
    expect([1, 2]._some(v => v > 5)).toBe(false)
  })

  test('coerces the predicate result to a boolean', () => {
    expect({ a: 1 }._some(() => 'truthy')).toBe(true)
    expect({ a: 1 }._some(() => 0)).toBe(false)
  })
})
