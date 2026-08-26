// Object.prototype[Symbol.iterator]
//
// test/setup.js removes objix's @@iterator from Object.prototype because Jest's
// equality only checks for its *presence* and would then compare every plain
// object as an ordered sequence (see setup.js for the full rationale). This file
// is where the iterator itself is under test, so it restores the function setup.js
// stashed - the library's own implementation, not a copy - and puts things back
// afterwards.
//
// Under Bun none of that applies: its `toEqual` compares plain objects by their
// keys even when an iterator is present, so setup.js leaves the iterator in
// place. The restore below is then a no-op, and the teardown must NOT remove it -
// Bun runs every test file against one shared Object.prototype, so deleting it
// here would break whichever files happen to run next. Jest, by contrast, gives
// each file a fresh global scope, so its re-install stays local.
const detached = !Object.prototype[Symbol.iterator]

beforeAll(() => {
  Object.prototype[Symbol.iterator] = globalThis.OBJIX_ITERATOR
})

test('the restored iterator is objix own implementation', () => {
  expect(Object.prototype[Symbol.iterator]).toBe(globalThis.OBJIX_ITERATOR)
})

afterAll(() => {
  if (detached) delete Object.prototype[Symbol.iterator]
})

describe('Symbol.iterator on Object.prototype', () => {
  test('spreads an object into an array of its entries', () => {
    expect([...{ a: 1, b: 2 }]).toEqual([['a',1], ['b',2]])
  })

  test('iterates values with for..of', () => {
    const collected = []
    for (const [k,v] of { a: 1, b: 2 }) collected.push(v)
    expect(collected).toEqual([1, 2])
  })

  test('supports array destructuring', () => {
    const [[k1, first], [k2, second]] = { a: 1, b: 2 }
    expect([first, second]).toEqual([1, 2])
  })

  test('works with Array.from', () => {
    expect(Array.from({ a: 1, b: 2 })).toEqual([['a', 1], ['b', 2]])
  })

  test('works with Object.fromEntries', () => {
    expect(Object.fromEntries({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 })
  })

  test('yields nothing for an empty object', () => {
    expect([...{}]).toEqual([])
  })

  test('yields values in insertion order', () => {
    expect([...{ b: 1, a: 2 }]).toEqual([['b',1], ['a',2]])
  })

  test('includes inherited values', () => {
    expect([...{ a: 1 }._new({ b: 2 })]).toEqual([['b',2],['a', 1]])
  })

  test('excludes the objix methods themselves', () => {
    expect([...{ a: 1 }].length).toBe(1)
  })
/*
  test('yields nested objects by reference', () => {
    const nested = { c: 1 }
    expect([...{ a: nested }][0]).toBe(['a', nested])
  })
*/
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
    expect(Math.max(...[...{ a: 1, b: 5, c: 3 }].map(([k,v]) =>  v))).toBe(5)
  })

  test('the iterator is reusable across iterations', () => {
    const o = { a: 1, b: 2 }
    expect([...o]).toEqual([...o])
  })

  test('supports spreading into a function call', () => {
    const sum = (...args) => args.reduce((t, a) => t + a[1], 0)
    expect(sum(...{ a: 1, b: 2, c: 3 })).toBe(6)
  })

  test('yields undefined values', () => {
    expect([...{ a: undefined }]).toEqual([['a',undefined]])
  })
})
