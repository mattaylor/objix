// Function._memo(expiry)
// objix is loaded by test/setup.js (see jest.config.js).
//
// _memo schedules a real setTimeout for the expiry, so tests use fake timers to
// keep pending timers from outliving the suite and to advance expiry instantly.
//
// Advancing is split into a synchronous `advanceTimersByTime` plus two microtask
// ticks rather than `advanceTimersByTimeAsync`, which Bun does not implement.
// The expiry fires `_wait(e).then(...)`, so one tick settles the timer's promise
// and the second runs the `delete` in its `then`.
const advance = async ms => {
  jest.advanceTimersByTime(ms)
  await Promise.resolve()
  await Promise.resolve()
}

describe('_memo', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  test('caches the result of a call by its arguments', () => {
    let calls = 0
    const add = (a, b) => (calls++, a + b)
    const memoised = add._memo(1)
    expect(memoised(1, 2)).toBe(3)
    expect(memoised(1, 2)).toBe(3)
    expect(calls).toBe(1)
  })

  test('different arguments are cached separately', () => {
    let calls = 0
    const double = a => (calls++, a * 2)
    const memoised = double._memo(1)
    expect(memoised(1)).toBe(2)
    expect(memoised(2)).toBe(4)
    expect(memoised(1)).toBe(2)
    expect(calls).toBe(2)
  })

  test('without an expiry the original function is returned unchanged', () => {
    const add = (a, b) => a + b
    expect(add._memo()).toBe(add)
  })

  test('an expiry of 0 also returns the original function', () => {
    const add = (a, b) => a + b
    expect(add._memo(0)).toBe(add)
  })

  test('the cache expires after the given number of seconds', async () => {
    let calls = 0
    const double = a => (calls++, a * 2)
    const memoised = double._memo(1)
    memoised(1)
    memoised(1)
    expect(calls).toBe(1)
    await advance(1001)
    memoised(1)
    expect(calls).toBe(2)
  })

  test('the cache is still warm just before the expiry', async () => {
    let calls = 0
    const double = a => (calls++, a * 2)
    const memoised = double._memo(1)
    memoised(1)
    await advance(900)
    memoised(1)
    expect(calls).toBe(1)
  })

  test('cached values are keyed by the formatted argument list', () => {
    const identity = a => a
    identity._memo(1)(5)
    expect(Object.keys(identity)).toEqual(['[5]'])
  })

  test('caches on the original function, so two wrappers share results', () => {
    let calls = 0
    const double = a => (calls++, a * 2)
    double._memo(1)(3)
    double._memo(1)(3)
    expect(calls).toBe(1)
  })

  test('caches a call with no arguments', () => {
    let calls = 0
    const now = () => (calls++, 'value')
    const memoised = now._memo(1)
    expect(memoised()).toBe('value')
    expect(memoised()).toBe('value')
    expect(calls).toBe(1)
  })

  test('object arguments are keyed by their formatted value', () => {
    let calls = 0
    const read = o => (calls++, o.a)
    const memoised = read._memo(1)
    expect(memoised({ a: 1 })).toBe(1)
    expect(memoised({ a: 1 })).toBe(1)
    expect(calls).toBe(1)
  })

  test('a falsy result is recomputed, since the cache uses ??=', () => {
    let calls = 0
    const zero = () => (calls++, 0)
    const memoised = zero._memo(1)
    expect(memoised()).toBe(0)
    expect(memoised()).toBe(0)
    expect(calls).toBe(1)
  })

  test('the memoised function is not the original', () => {
    const add = (a, b) => a + b
    expect(add._memo(1)).not.toBe(add)
  })

  test('the receiver is forwarded to the wrapped function', () => {
    const o = { a: 7, getA: function () { return this.a }._memo(1) }
    expect(o.getA()).toBe(7)
  })

  test('the cache is keyed by arguments only, not by receiver', () => {
    // Sharing one memoised function across objects shares one cache, so a call
    // with the same arguments returns the first receiver's result. _bind avoids
    // this by creating a fresh wrapper per call.
    const shared = function () { return this.a }._memo(1)
    const first = { a: 1, get: shared }
    const second = { a: 2, get: shared }
    expect([first.get(), second.get()]).toEqual([1, 1])
  })
})
