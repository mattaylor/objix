// Object._bind(key, function, expiry)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_bind', () => {
  // The expiry tests below go through _memo, which schedules a real setTimeout.
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  test('attaches a method that receives the object as its last argument', () => {
    const o = { a: 1 }
    o._bind('addToA', (x, self) => x + self.a)
    expect(o.addToA(5)).toBe(6)
  })

  test('returns this so calls can be chained', () => {
    const o = { a: 1 }
    expect(o._bind('noop', () => 0)).toBe(o)
  })

  test('chained binds both take effect', () => {
    const o = { a: 2 }
    o._bind('double', self => self.a * 2)._bind('triple', self => self.a * 3)
    expect([o.double(), o.triple()]).toEqual([4, 6])
  })

  test('the bound method is not enumerable', () => {
    const o = { a: 1 }
    o._bind('hidden', () => 0)
    expect(Object.keys(o)).toEqual(['a'])
  })

  test('an existing key is left untouched', () => {
    const o = { a: 1, greet: () => 'original' }
    o._bind('greet', () => 'replacement')
    expect(o.greet()).toBe('original')
  })

  test('passes several arguments through before this', () => {
    const o = { a: 10 }
    o._bind('sum', (x, y, self) => x + y + self.a)
    expect(o.sum(1, 2)).toBe(13)
  })

  test('works with no arguments beyond the object itself', () => {
    const o = { a: 7 }
    o._bind('getA', self => self.a)
    expect(o.getA()).toBe(7)
  })

  test('reads the current value of the object at call time', () => {
    const o = { a: 1 }
    o._bind('getA', self => self.a)
    o.a = 99
    expect(o.getA()).toBe(99)
  })

  test('an expiry memoises the bound method', () => {
    let calls = 0
    const o = { a: 1 }
    o._bind('count', () => calls++, 1)
    o.count()
    o.count()
    expect(calls).toBe(1)
  })

  test('an expiry still passes the object through as self', () => {
    const o = { a: 5 }
    o._bind('getA', self => self?.a ?? 'no receiver', 1)
    expect(o.getA()).toBe(5)
  })

  test('an expiry memoises without leaking results between objects', () => {
    // _bind builds a fresh wrapper per call, so each object gets its own cache
    // even though _memo keys purely on the argument list.
    const fn = self => self.a
    const first = { a: 1 }._bind('getA', fn, 1)
    const second = { a: 2 }._bind('getA', fn, 1)
    expect([first.getA(), second.getA()]).toEqual([1, 2])
  })

  test('without an expiry the bound method runs every call', () => {
    let calls = 0
    const o = { a: 1 }
    o._bind('count', () => calls++)
    o.count()
    o.count()
    expect(calls).toBe(2)
  })

  test('binds onto an array', () => {
    const list = [1, 2, 3]
    list._bind('total', self => self.reduce((a, b) => a + b, 0))
    expect(list.total()).toBe(6)
  })

  test('the bound property is writable', () => {
    const o = { a: 1 }
    o._bind('m', () => 'first')
    o.m = () => 'second'
    expect(o.m()).toBe('second')
  })
})
