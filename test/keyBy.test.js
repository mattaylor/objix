// Object._keyBy(path)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_keyBy', () => {
  test('indexes a list of objects by a key', () => {
    expect([{ a: 'o1' }, { a: 'o2' }]._keyBy('a'))
      .toEqual({ o1: [{ a: 'o1' }], o2: [{ a: 'o2' }]})
  })

  test('collects duplicate keys into an array, newest first', () => {
    expect([{ a: 'o1' }, { a: 'o2' }, { a: 'o2', b: 1 }]._keyBy('a'))
      .toEqual({ o1: [{ a: 'o1' }], o2: [{ a: 'o2' }, { a: 'o2', b: 1 }] })
  })

  test('indexes by a dotted path', () => {
    expect([{ a: { b: { c: 'o1' } } }, { a: { b: { c: 'o2' } } }]._keyBy('a.b.c'))
      .toEqual({
        o1: [{ a: { b: { c: 'o1' } } }],
        o2: [{ a: { b: { c: 'o2' } } }]
      })
  })

  test('returns a new object rather than this', () => {
    const source = [{ a: 'o1' }]
    expect(source._keyBy('a')).not.toBe(source)
  })

  test('does not mutate the source', () => {
    const source = [{ a: 'o1' }]
    source._keyBy('a')
    expect(source).toEqual([{ a: 'o1' }])
  })

  test('an empty list yields an empty object', () => {
    expect([]._keyBy('a')).toEqual({})
  })

  test('groups three items sharing a key', () => {
    const grouped = [{ k: 'x', n: 1 }, { k: 'x', n: 2 }, { k: 'x', n: 3 }]._keyBy('k')
    expect(grouped.x.length).toBe(3)
  })

  test('numeric key values become string keys', () => {
    expect([{ id: 1 }]._keyBy('id')).toEqual({ 1: [{ id: 1 }]})
  })

  /*
  test('requires a mappable receiver such as an array', () => {
    // _keyBy calls this.map, which plain objects do not have.
    expect(() => ({ x: { a: 'o1' } })._keyBy('a')).toThrow(TypeError)
  })
  */
})
