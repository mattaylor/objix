// Object._len()
// objix is loaded by test/setup.js (see jest.config.js).

describe('_len', () => {
  test('counts object entries', () => {
    expect({ a: 1, b: 2 }._len()).toBe(2)
  })

  test('is 0 for an empty object', () => {
    expect({}._len()).toBe(0)
  })

  test('counts array elements', () => {
    expect([1, 2, 3]._len()).toBe(3)
  })

  test('is 0 for an empty array', () => {
    expect([]._len()).toBe(0)
  })

  test('counts string characters', () => {
    expect('one'._len()).toBe(3)
  })

  test('is 0 for a number, which has no own keys', () => {
    expect((5)._len()).toBe(0)
  })

  test('is 0 for a boolean', () => {
    expect((true)._len()).toBe(0)
  })

  test('counts own keys only, not inherited ones', () => {
    const child = Object.create({ inherited: 1 })
    child.own = 2
    expect(child._len()).toBe(1)
  })

  test('counts keys holding falsy values', () => {
    expect({ a: 0, b: null, c: undefined }._len()).toBe(3)
  })

  test('excludes non-enumerable properties', () => {
    const o = { a: 1 }
    Object.defineProperty(o, 'hidden', { value: 2, enumerable: false })
    expect(o._len()).toBe(1)
  })

  test('excludes symbol keys', () => {
    expect({ a: 1, [Symbol('s')]: 2 }._len()).toBe(1)
  })
})
