// Object._wait(delayOrFunction)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_wait', () => {
  test('returns a promise', () => {
    expect({ a: 1 }._wait(0)).toBeInstanceOf(Promise)
  })

  describe('with a number of seconds', () => {
    test('resolves with this', async () => {
      const o = { a: 1 }
      await expect(o._wait(0)).resolves.toBe(o)
    })

    test('waits at least the requested time', async () => {
      const started = Date.now()
      await ({ a: 1 })._wait(0.05)
      expect(Date.now() - started).toBeGreaterThanOrEqual(40)
    })

    test('resolves with an array receiver', async () => {
      await expect([1, 2]._wait(0)).resolves.toEqual([1, 2])
    })

    test('a primitive receiver resolves to its boxed wrapper', async () => {
      // objix runs in sloppy mode, so `this` inside its methods is boxed. _wait
      // resolves with that wrapper rather than the primitive; use .valueOf() or
      // String() if you need the primitive back.
      const resolved = await 'abc'._wait(0)
      expect(resolved).toBeInstanceOf(String)
      expect(resolved.valueOf()).toBe('abc')
    })
  })

  describe('with a function', () => {
    test('resolves with the value the function returns', async () => {
      await expect({ a: 1 }._wait(o => o.a + 1)).resolves.toBe(2)
    })

    test('passes this to the function', async () => {
      await expect({ a: 1 }._wait(o => o)).resolves.toEqual({ a: 1 })
    })

    test('a function that returns nothing may resolve later', async () => {
      await expect({ a: 1 }._wait((o, resolve) => {
        setTimeout(() => resolve('later'), 10)
      })).resolves.toBe('later')
    })

    test('the function may reject', async () => {
      await expect({ a: 1 }._wait((o, resolve, reject) => reject(new Error('boom'))))
        .rejects.toThrow('boom')
    })

    test('a synchronous throw rejects the promise', async () => {
      await expect({ a: 1 }._wait(() => { throw new Error('sync') }))
        .rejects.toThrow('sync')
    })

    test('resolves with a value derived from a nested key', async () => {
      await expect({ a: { b: 2 } }._wait(o => o.a.b)).resolves.toBe(2)
    })

    test('receives resolve and reject as its second and third arguments', async () => {
      const arity = await ({ a: 1 })._wait((o, resolve, reject) =>
        [typeof resolve, typeof reject].join(','))
      expect(arity).toBe('function,function')
    })
  })

  test('can be awaited in sequence', async () => {
    const o = { a: 1 }
    await o._wait(0)
    await expect(o._wait(0)).resolves.toBe(o)
  })
})
