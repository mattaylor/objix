// The module export surface: require('objix').<name>(object, ...args)
//
// Every method installed on Object.prototype is also exported as a standalone
// function whose first argument is the receiver. This file checks the shape of
// that surface and spot-checks the delegation; per-method behaviour is covered
// by the individual test files.
//
// objix is loaded by test/setup.js (see jest.config.js).

const objix = require('../objix')

const NAMES = [
  'every', 'some', 'map', 'has', 'pick', 'flatMap', 'clean', 'is', 'find',
  'extend', 'delete', 'clone', 'join', 'split', 'same', 'diff', 'contains',
  'eq', 'len', 'keyBy', 'at', '$', 'memo', 'bind', 'log', 'try', 'new', 'wait',
  'trap', 'keys', 'values', 'entries', 'create', 'assign'
]

describe('module exports', () => {
  test('exports exactly the documented names', () => {
    expect(Object.keys(objix).sort()).toEqual([...NAMES].sort())
  })

  test('exports 34 functions', () => {
    expect(Object.keys(objix).length).toBe(34)
  })

  test.each(NAMES)('%s is a function', name => {
    expect(typeof objix[name]).toBe('function')
  })

  test.each(NAMES)('%s matches the _%s prototype method', name => {
    expect(Object.prototype['_' + name]).toBeInstanceOf(Function)
  })

  describe('delegation', () => {
    test('map passes the callback through', () => {
      expect(objix.map({ a: 1 }, v => v * 2)).toEqual({ a: 2 })
    })

    test('eq compares two objects', () => {
      expect(objix.eq({ a: 1 }, { a: 1 })).toBe(true)
    })

    test('len counts keys', () => {
      expect(objix.len({ a: 1, b: 2 })).toBe(2)
    })

    test('keys returns the key list', () => {
      expect(objix.keys({ a: 1 })).toEqual(['a'])
    })

    test('at reads a dotted path', () => {
      expect(objix.at({ a: { b: 2 } }, 'a.b')).toBe(2)
    })

    test('pick forwards a predicate', () => {
      expect(objix.pick({ a: 1, b: 2 }, v => v > 1)).toEqual({ b: 2 })
    })

    test('extend merges defaults', () => {
      expect(objix.extend({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
    })

    test('$ formats an object', () => {
      expect(objix.$({ a: 1 })).toBe('{a:1}')
    })

    test('clone copies an object', () => {
      const source = { a: 1 }
      expect(objix.clone(source)).not.toBe(source)
    })

    test('delete removes keys and returns the object', () => {
      const target = { a: 1, b: 2 }
      expect(objix.delete(target, 'a')).toBe(target)
      expect(target).toEqual({ b: 2 })
    })

    test('is checks the type', () => {
      expect(objix.is([], Array)).toBe(true)
    })

    test('contains checks a subset', () => {
      expect(objix.contains({ a: 1, b: 2 }, { a: 1 })).toBe(true)
    })

    test('has checks for a value', () => {
      expect(objix.has({ a: 1 }, 1)).toBe(true)
    })

    test('wait resolves with the object', async () => {
      const o = { a: 1 }
      await expect(objix.wait(o, 0)).resolves.toBe(o)
    })

    test('try runs the given function', () => {
      expect(objix.try({ a: 1 }, o => o.a)).toBe(1)
    })

    test('trap returns a guarded proxy', () => {
      const guarded = objix.trap({}, v => v > 0, 'bad')
      expect(() => { guarded.a = -1 }).toThrow(/bad/)
    })

    test('bind attaches a method', () => {
      const o = { a: 2 }
      objix.bind(o, 'double', self => self.a * 2)
      expect(o.double()).toBe(4)
    })

    test('memo returns a caching wrapper', () => {
      // _memo schedules a real setTimeout for the expiry; fake timers keep it
      // from outliving the suite.
      jest.useFakeTimers()
      try {
        let calls = 0
        const memoised = objix.memo(a => (calls++, a), 1)
        memoised(1)
        memoised(1)
        expect(calls).toBe(1)
      } finally {
        jest.useRealTimers()
      }
    })

    test('keyBy indexes a list', () => {
      expect(objix.keyBy([{ a: 'x' }], 'a')).toEqual({ x: [{ a: 'x' }] })
    })
  })

  test('requiring objix again returns the same exports object', () => {
    expect(require('../objix')).toBe(objix)
  })

  test('the prototype methods are non enumerable', () => {
    expect(Object.keys(Object.prototype)).toEqual([])
  })

  test('the prototype methods are writable', () => {
    expect(Object.getOwnPropertyDescriptor(Object.prototype, '_map').writable).toBe(true)
  })
})
