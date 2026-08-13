// Object.prototype[Symbol.iterator]
//
// test/setup.js removes objix's @@iterator from Object.prototype because Jest's
// equality only checks for its *presence* and would then compare every plain
// object as an ordered sequence (see setup.js for the full rationale). This file
// is where the iterator itself is under test, so it restores the function setup.js
// stashed - the library's own implementation, not a copy. Jest gives each test
// file a fresh global scope, so the re-install stays local to this file.

beforeAll(() => {
  Object.prototype[Symbol.iterator] = globalThis.OBJIX_ITERATOR
})

test('the restored iterator is objix own implementation', () => {
  expect(Object.prototype[Symbol.iterator]).toBe(globalThis.OBJIX_ITERATOR)
})

afterAll(() => {
  delete Object.prototype[Symbol.iterator]
})

describe('Symbol.iterator on Object.prototype', () => {
  test('spreads an object into an array of its values', () => {
    expect([...{ a: 1, b: 2 }]).toEqual([1, 2])
  })

  test('iterates values with for..of', () => {
    const collected = []
    for (const v of { a: 1, b: 2 }) collected.push(v)
    expect(collected).toEqual([1, 2])
  })

  test('supports array destructuring', () => {
    const [first, second] = { a: 1, b: 2 }
    expect([first, second]).toEqual([1, 2])
  })

  test('works with Array.from', () => {
    expect(Array.from({ a: 1, b: 2 })).toEqual([1, 2])
  })

  test('yields nothing for an empty object', () => {
    expect([...{}]).toEqual([])
  })

  test('yields values in insertion order', () => {
    expect([...{ b: 1, a: 2 }]).toEqual([1, 2])
  })

  test('excludes inherited values', () => {
    expect([...{ a: 1 }._new({ b: 2 })]).toEqual([2])
  })

  test('excludes the objix methods themselves', () => {
    expect([...{ a: 1 }].length).toBe(1)
  })

  test('yields nested objects by reference', () => {
    const nested = { c: 1 }
    expect([...{ a: nested }][0]).toBe(nested)
  })

  test('arrays keep their native iterator', () => {
    expect([...[1, 2]]).toEqual([1, 2])
  })

  test('strings keep their native iterator', () => {
    expect([...'ab']).toEqual(['a', 'b'])
  })

  test('a Map keeps its native iterator', () => {
    expect([...new Map([['a', 1]])]).toEqual([['a', 1]])
  })

  test('a Set keeps its native iterator', () => {
    expect([...new Set([1, 2])]).toEqual([1, 2])
  })

  test('works with Math.max applied to an object of numbers', () => {
    expect(Math.max(...{ a: 1, b: 5, c: 3 })).toBe(5)
  })

  test('the iterator is reusable across iterations', () => {
    const o = { a: 1, b: 2 }
    expect([...o]).toEqual([...o])
  })

  test('supports spreading into a function call', () => {
    const sum = (...args) => args.reduce((a, b) => a + b, 0)
    expect(sum(...{ a: 1, b: 2, c: 3 })).toBe(6)
  })

  test('yields undefined values', () => {
    expect([...{ a: undefined }]).toEqual([undefined])
  })
})
