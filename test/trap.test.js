// Object._trap(validator, errorMessage, ...keys)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_trap', () => {
  test('allows an assignment the validator accepts', () => {
    const guarded = ({})._trap(v => v > 0, 'must be positive')
    guarded.a = 1
    expect(guarded.a).toBe(1)
  })

  test('throws the given message when the validator rejects', () => {
    const guarded = ({})._trap(v => v > 0, 'must be positive')
    expect(() => { guarded.b = -1 }).toThrow(/must be positive/)
  })

  test('the thrown message includes the key and value', () => {
    const guarded = ({})._trap(v => v > 0, 'bad')
    expect(() => { guarded.b = -1 }).toThrow('bad ["b",-1]')
  })

  test('a rejected assignment does not reach the target', () => {
    const guarded = ({})._trap(v => v > 0, 'bad')
    expect(() => { guarded.b = -1 }).toThrow()
    expect(guarded.b).toBeUndefined()
  })

  test('without an error message a rejected value is still assigned', () => {
    // The throw is guarded by the presence of a message, so a message-less trap
    // acts as an observer rather than a gate.
    const observed = ({})._trap(v => v > 0)
    observed.a = -1
    expect(observed.a).toBe(-1)
  })

  test('the validator receives the value, key and target', () => {
    const target = {}
    const seen = []
    // The target is captured by reference and is still empty when the validator
    // runs, so record identity rather than a snapshot of its contents.
    const guarded = target._trap((v, k, t) => (seen.push([v, k, t === target]), true))
    guarded.x = 5
    expect(seen).toEqual([[5, 'x', true]])
  })

  describe('with a key list', () => {
    test('a listed key is validated', () => {
      const guarded = ({})._trap(v => v > 0, 'bad', 'a')
      expect(() => { guarded.a = -1 }).toThrow(/bad/)
    })

    test('an unlisted key is not validated', () => {
      const guarded = ({})._trap(v => v > 0, 'bad', 'a')
      guarded.b = -1
      expect(guarded.b).toBe(-1)
    })

    test('several keys may be listed', () => {
      const guarded = ({})._trap(v => v > 0, 'bad', 'a', 'b')
      expect(() => { guarded.b = -1 }).toThrow(/bad/)
    })

    test('a listed key still accepts a valid value', () => {
      const guarded = ({})._trap(v => v > 0, 'bad', 'a')
      guarded.a = 1
      expect(guarded.a).toBe(1)
    })
  })

  describe('reads through the proxy', () => {
    test('existing values are readable', () => {
      expect({ a: 1 }._trap(() => true).a).toBe(1)
    })

    test('_t exposes the underlying target', () => {
      const target = { a: 1 }
      expect(target._trap(() => true)._t).toBe(target)
    })

    test('_h exposes the proxy handler', () => {
      const guarded = { a: 1 }._trap(() => true)
      expect(typeof guarded._h.set).toBe('function')
    })

    test('objix methods remain reachable', () => {
      expect({ a: 1, b: 2 }._trap(() => true)._len()).toBe(2)
    })

    test('a trapped array reports its real constructor', () => {
      expect([]._trap(() => true)._is(Array)).toBe(true)
    })

    test('a trapped object reports Object', () => {
      expect({}._trap(() => true)._is(Object)).toBe(true)
    })
  })

  test('the trap survives repeated assignments', () => {
    const guarded = ({})._trap(v => v > 0, 'bad')
    guarded.a = 1
    guarded.a = 2
    expect(() => { guarded.a = -1 }).toThrow()
    expect(guarded.a).toBe(2)
  })

  test('assignments write through to the original object', () => {
    const target = {}
    const guarded = target._trap(v => v > 0, 'bad')
    guarded.a = 1
    expect(target.a).toBe(1)
  })

  test('traps an array element assignment', () => {
    const guarded = []._trap(v => typeof v == 'number', 'numbers only')
    guarded[0] = 1
    expect(() => { guarded[1] = 'x' }).toThrow(/numbers only/)
  })

  test('the validator may inspect the target to enforce a relation', () => {
    const guarded = { min: 5 }._trap((v, k, target) => k == 'min' || v >= target.min, 'too small')
    guarded.value = 10
    expect(() => { guarded.value = 1 }).toThrow(/too small/)
  })
})
