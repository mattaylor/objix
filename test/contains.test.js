// Object._contains(object, depth)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_contains', () => {
  test('true when all argument entries are present', () => {
    expect({ a: 1, b: 2 }._contains({ a: 1 })).toBe(true)
  })

  test('true when the objects match exactly', () => {
    expect({ a: 1 }._contains({ a: 1 })).toBe(true)
  })

  test('falsy when the argument has entries this lacks', () => {
    // The implementation returns `undefined` here rather than false.
    expect({ a: 1 }._contains({ a: 1, b: 2 })).toBeFalsy()
  })

  test('falsy when a shared key has a different value', () => {
    expect({ a: 1 }._contains({ a: 2 })).toBeFalsy()
  })

  test('true for an empty argument', () => {
    expect({ a: 1 }._contains({})).toBe(true)
  })

  test('matches falsy values', () => {
    expect({ a: 0 }._contains({ a: 0 })).toBe(true)
  })

  test('each value is compared with _eq, so one nesting level matches structurally', () => {
    expect({ a: { b: 1 } }._contains({ a: { b: 1 } })).toBe(true)
  })

  test('a second nesting level is compared by identity and so does not match', () => {
    expect({ a: { b: { c: 1 } } }._contains({ a: { b: { c: 1 } } })).toBeFalsy()
  })

  test('a shared nested reference matches without depth', () => {
    const shared = { b: 1 }
    expect({ a: shared }._contains({ a: shared })).toBe(true)
  })

  describe('with depth', () => {
    test('depth 1 finds the argument one level down', () => {
      expect({ a: 1, b: { c: 1 } }._contains({ c: 1 }, 1)).toBe(true)
    })

    test('depth 1 is not enough to reach inside a nested array', () => {
      expect({ a: 1, b: [{ c: 1 }] }._contains({ c: 1 }, 1)).toBe(false)
    })

    test('depth 2 reaches into a nested array', () => {
      expect({ a: 1, b: [{ c: 1 }] }._contains({ c: 1 }, 2)).toBe(true)
    })

    test('depth -1 searches to any depth', () => {
      expect({ a: 1, b: [{ c: 1 }] }._contains({ c: 1 }, -1)).toBe(true)
    })

    test('depth -1 still reports a genuinely absent entry', () => {
      expect({ a: 1, b: [{ c: 1 }] }._contains({ c: 2 }, -1)).toBeFalsy()
    })

    test('depth -1 finds a deeply buried match', () => {
      expect({ a: { b: { c: { d: 1 } } } }._contains({ d: 1 }, -1)).toBe(true)
    })

    test('a top level match short circuits before recursing', () => {
      expect({ c: 1, b: { c: 9 } }._contains({ c: 1 }, -1)).toBe(true)
    })
  })
})
