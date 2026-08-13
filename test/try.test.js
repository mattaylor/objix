// Object._try(tryFunction, catchFunction, returnThis)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_try', () => {
  test('returns the result of the try function', () => {
    expect({ a: 1 }._try(o => o.a)).toBe(1)
  })

  test('passes this to the try function', () => {
    expect({ a: 1 }._try(o => o)).toEqual({ a: 1 })
  })

  test('swallows a thrown error and returns undefined when there is no catch', () => {
    expect({ a: 1 }._try(() => { throw new Error('boom') })).toBeUndefined()
  })

  test('returns the result of the catch function', () => {
    expect({ a: 1 }._try(() => { throw new Error('boom') }, e => 'caught ' + e.message))
      .toBe('caught boom')
  })

  test('the catch function receives the error and this', () => {
    const seen = { a: 1 }._try(() => { throw new Error('x') }, (e, self) => [e.message, self])
    expect(seen).toEqual(['x', { a: 1 }])
  })

  test('a truthy third argument returns this instead of the result', () => {
    const o = { a: 1 }
    expect(o._try(() => 'ignored', null, true)).toBe(o)
  })

  test('returns this even when the try function throws', () => {
    const o = { a: 1 }
    expect(o._try(() => { throw new Error('x') }, null, true)).toBe(o)
  })

  test('a falsy result from the try function is returned as-is', () => {
    expect({ a: 0 }._try(o => o.a)).toBe(0)
  })

  test('the catch function may itself return undefined', () => {
    expect({ a: 1 }._try(() => { throw new Error('x') }, () => undefined)).toBeUndefined()
  })

  test('does not catch when nothing throws', () => {
    let caught = false
    const result = { a: 1 }._try(o => o.a, () => (caught = true))
    expect([result, caught]).toEqual([1, false])
  })

  test('works on an array receiver', () => {
    expect([1, 2, 3]._try(a => a.length)).toBe(3)
  })

  test('works on a primitive receiver', () => {
    expect('abc'._try(s => s.toUpperCase())).toBe('ABC')
  })

  test('an error thrown inside the catch function propagates', () => {
    expect(() => ({ a: 1 })._try(
      () => { throw new Error('first') },
      () => { throw new Error('second') }
    )).toThrow('second')
  })

  test('chains when returning this', () => {
    const o = { a: 1 }
    expect(o._try(() => 1, null, true)._try(() => 2, null, true)).toBe(o)
  })
})
