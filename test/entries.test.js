// Object._entries() - delegates to Object.entries(this)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_entries', () => {
  test('returns key value pairs', () => {
    expect({ a: 1, b: 2 }._entries()).toEqual([['a', 1], ['b', 2]])
  })

  test('returns an empty array for an empty object', () => {
    expect({}._entries()).toEqual([])
  })

  test('returns index value pairs for an array', () => {
    expect([9, 8]._entries()).toEqual([['0', 9], ['1', 8]])
  })

  test('does not include inherited entries', () => {
    expect({ a: 1 }._new({ b: 2 })._entries()).toEqual([['b', 2]])
  })

  test('includes entries whose value is undefined', () => {
    expect({ a: undefined }._entries()).toEqual([['a', undefined]])
  })

  test('matches Object.entries', () => {
    const o = { a: 1, b: 'two' }
    expect(o._entries()).toEqual(Object.entries(o))
  })

  test('round trips through Object.fromEntries', () => {
    const o = { a: 1, b: 2 }
    expect(Object.fromEntries(o._entries())).toEqual(o)
  })

  test('is usable in a for..of loop', () => {
    const collected = []
    for (const [k, v] of ({ a: 1, b: 2 })._entries()) collected.push(k + v)
    expect(collected).toEqual(['a1', 'b2'])
  })
})
