// Object._at(path)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_at', () => {
  test('reads a direct property', () => {
    expect({ a: 1 }._at('a')).toBe(1)
  })

  test('traverses a dot-delimited path', () => {
    expect({ a: 1, b: { c: 3 } }._at('b.c')).toBe(3)
  })

  test('indexes into a nested array', () => {
    expect({ a: 1, b: [1, 2] }._at('b.1')).toBe(2)
  })

  test('traverses deeply nested paths', () => {
    expect({ a: { b: { c: { d: 'deep' } } } }._at('a.b.c.d')).toBe('deep')
  })

  test('returns falsy own values rather than falling through to traversal', () => {
    expect({ a: 0 }._at('a')).toBe(0)
    expect({ a: '' }._at('a')).toBe('')
    expect({ a: false }._at('a')).toBe(false)
  })

  test('returns undefined for a missing direct key', () => {
    expect({ a: 1 }._at('zz')).toBeUndefined()
  })

  test('returns undefined for a missing path instead of throwing', () => {
    expect({ a: 1 }._at('x.y')).toBeUndefined()
  })

  test('returns undefined when the path breaks part way', () => {
    expect({ a: { b: 1 } }._at('a.b.c.d')).toBeUndefined()
  })

  test('indexes arrays directly', () => {
    expect([1, 2]._at('1')).toBe(2)
  })

  test('accepts a numeric key', () => {
    expect([7, 8]._at(0)).toBe(7)
  })

  test('reads through a nested array of objects', () => {
    expect({ list: [{ id: 'x' }] }._at('list.0.id')).toBe('x')
  })

  test('reads inherited properties', () => {
    const child = Object.create({ a: 1 })
    expect(child._at('a')).toBe(1)
  })

  test('a literal dotted key is preferred over traversal', () => {
    // The direct lookup wins, so a key containing a dot is readable.
    expect({ 'a.b': 'literal', a: { b: 'nested' } }._at('a.b')).toBe('literal')
  })
})
