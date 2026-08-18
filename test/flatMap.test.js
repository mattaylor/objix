// Object._flatMap(function, target={})
// objix is loaded by test/setup.js (see jest.config.js).

describe('_flatMap', () => {
  test('expands each entry into multiple entries', () => {
    expect({ a: 1 }._flatMap((k, v) => [[k + 1, v + 1], [k + 2, v + 2]]))
      .toEqual({ a1: 2, a2: 3 })
  })

  test('an empty result array drops the entry', () => {
    expect({ a: 1, b: 0 }._flatMap((k, v) => (v ? [[k, v + 1]] : []))).toEqual({ a: 2 })
  })

  test('receives key first and value second', () => {
    const seen = []
    const o = { a: 1 }
    o._flatMap((k, v) => (seen.push([k, v]), []))
    expect(seen).toEqual([['a', 1]])
  })

  test('merges into a supplied target', () => {
    expect({ a: 1 }._flatMap((k, v) => [[k, v]], { z: 0 })).toEqual({ z: 0, a: 1 })
  })

  test('returns the supplied target instance', () => {
    const target = {}
    expect({ a: 1 }._flatMap((k, v) => [[k, v]], target)).toBe(target)
  })

  test('later entries win on key collision', () => {
    expect({ a: 1, b: 2 }._flatMap(() => [['same', 1]])).toEqual({ same: 1 })
  })

  test('handles an empty object', () => {
    expect({}._flatMap(() => [['x', 1]])).toEqual({})
  })

  test('can rename keys while preserving values', () => {
    expect({ a: 1, b: 2 }._flatMap((k, v) => [[k.toUpperCase(), v]]))
      .toEqual({ A: 1, B: 2 })
  })

  test('does not mutate the source', () => {
    const source = { a: 1 }
    source._flatMap((k, v) => [[k + 'x', v]])
    expect(source).toEqual({ a: 1 })
  })

  test('iterates own keys only (Object.keys)', () => {
    const child = Object.create({ inherited: 9 })
    child.own = 1
    expect(child._flatMap((k, v) => [[k, v]])).toEqual({ own: 1 })
  })

  /*
  test('works over array indices', () => {
    expect([7, 8]._flatMap((k, v) => [[k, v]])).toEqual({ 0: 7, 1: 8 })
  })
  */
})
