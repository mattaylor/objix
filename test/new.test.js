// Object._new(properties)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_new', () => {
  test('creates an object whose prototype is this', () => {
    const proto = { a: 1 }
    expect(Object.getPrototypeOf(proto._new({ b: 2 }))).toBe(proto)
  })

  test('assigns the given properties as own keys', () => {
    expect({ a: 1 }._new({ b: 2 })._keys()).toEqual(['b'])
  })

  test('inherits values from the prototype', () => {
    expect({ a: 1 }._new({ b: 2 }).a).toBe(1)
  })

  test('with no argument creates an empty instance', () => {
    expect({ a: 1 }._new()._keys()).toEqual([])
  })

  test('an instance created with no argument still inherits', () => {
    expect({ a: 1 }._new().a).toBe(1)
  })

  test('own properties shadow the prototype', () => {
    expect({ a: 1 }._new({ a: 9 }).a).toBe(9)
  })

  test('inherited values track later changes to the prototype', () => {
    const proto = { a: 1 }
    const instance = proto._new()
    proto.a = 5
    expect(instance.a).toBe(5)
  })

  test('does not mutate the prototype', () => {
    const proto = { a: 1 }
    proto._new({ b: 2 })
    expect(proto._keys()).toEqual(['a'])
  })

  test('each instance is independent', () => {
    const proto = { a: 1 }
    const first = proto._new({ b: 1 })
    const second = proto._new({ b: 2 })
    expect([first.b, second.b]).toEqual([1, 2])
  })

  test('inherits methods from the prototype', () => {
    const proto = { greet() { return 'hi ' + this.name } }
    expect(proto._new({ name: 'Bob' }).greet()).toBe('hi Bob')
  })

  describe('through a trap', () => {
    test('the instance is validated by the trap', () => {
      const guarded = { a: 1 }._trap(v => v > 0, 'must be positive')
      const instance = guarded._new({ b: 2 })
      expect(() => { instance.c = -1 }).toThrow(/must be positive/)
    })

    test('a valid assignment on the instance succeeds', () => {
      const instance = { a: 1 }._trap(v => v > 0, 'bad')._new({ b: 2 })
      instance.c = 5
      expect(instance.c).toBe(5)
    })

    test('the instance still inherits from the trapped object', () => {
      expect({ a: 1 }._trap(v => v > 0, 'bad')._new({ b: 2 }).a).toBe(1)
    })

    test('the given properties are assigned', () => {
      expect({ a: 1 }._trap(v => v > 0, 'bad')._new({ b: 2 }).b).toBe(2)
    })
  })
})
