// Object._split(array=[])
// objix is loaded by test/setup.js (see jest.config.js).

describe('_split', () => {
  test('splits parallel arrays into an array of objects', () => {
    expect({ a: [1, 2], b: [1, 3] }._split())
      .toEqual([{ a: 1, b: 1 }, { a: 2, b: 3 }])
  })

  test('splits a single array value', () => {
    expect({ a: [1, 2] }._split()).toEqual([{ a: 1 }, { a: 2 }])
  })

  test('ragged arrays yield entries only where values exist', () => {
    expect({ a: [1], b: [1, 2] }._split()).toEqual([{ a: 1, b: 1 }, { b: 2 }])
  })

  test('scalar values produce no output entries', () => {
    // _map over a number yields no indices, so nothing is placed.
    expect({ a: 1, b: 2 }._split()).toEqual([])
  })

  test('merges into a supplied array', () => {
    expect({ a: [1] }._split([{ z: 0 }])).toEqual([{ z: 0, a: 1 }])
  })

  test('returns the supplied array instance', () => {
    const target = []
    expect({ a: [1] }._split(target)).toBe(target)
  })

  test('an empty object yields an empty array', () => {
    expect({}._split()).toEqual([])
  })

  test('an empty array value yields nothing', () => {
    expect({ a: [] }._split()).toEqual([])
  })

  test('does not mutate the source', () => {
    const source = { a: [1, 2] }
    source._split()
    expect(source).toEqual({ a: [1, 2] })
  })

  test('splits string values by character', () => {
    expect({ a: 'xy' }._split()).toEqual([{ a: 'x' }, { a: 'y' }])
  })

  test('round trips with _join for equal length arrays', () => {
    const split = { a: [1, 2], b: [3, 4] }._split()
    expect(split.length).toBe(2)
    expect(split[0]).toEqual({ a: 1, b: 3 })
  })
})
