// Object._eval(expression)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_eval', () => {
  describe('scope from this', () => {
    test('resolves own keys as bare identifiers', () => {
      expect({ a: 1, b: 2 }._eval('a + b')).toBe(3)
    })

    test('resolves a nested path', () => {
      expect({ a: { b: { c: 3 } } }._eval('a.b.c')).toBe(3)
    })

    test('evaluates an expression using no keys at all', () => {
      expect({}._eval('1 + 1')).toBe(2)
    })

    test('supports template literals', () => {
      expect({ a: 1 }._eval('`a is ${a}`')).toBe('a is 1')
    })

    test('supports conditional expressions', () => {
      expect({ a: 1 }._eval('a > 0 ? "positive" : "negative"')).toBe('positive')
    })

    test('calls a function held in a property', () => {
      expect({ f: n => n * 3 }._eval('f(4)')).toBe(12)
    })

    test('an undefined key is undefined rather than a ReferenceError', () => {
      expect({}._eval('typeof nope')).toBe('undefined')
    })

    test('reads a falsy value as itself', () => {
      expect({ a: 0 }._eval('a')).toBe(0)
    })

    test('inherited properties are not in scope - the clone copies own keys', () => {
      const o = { a: 1 }._new({ b: 2 })
      expect([o._eval('typeof a'), o._eval('b')]).toEqual(['undefined', 2])
    })

    test('objix methods are callable', () => {
      expect({ a: 1 }._eval('_map(v => v + 1)')).toEqual({ a: 2 })
    })

    test('an arrow parameter shadows a key of the same name', () => {
      expect({ a: 1 }._eval('[10, 20].map(a => a)')).toEqual([10, 20])
    })
  })

  describe('receivers', () => {
    test('works on an array', () => {
      expect([1, 2, 3]._eval('length')).toBe(3)
    })

    test('array methods are callable', () => {
      expect([1, 2, 3]._eval('map(v => v * 2)')).toEqual([2, 4, 6])
    })

    // _clone returns valueOf() for a primitive, and the Object() wrapper around
    // it gives the Proxy something to target.
    test.each([['a string', 'abc', 'length', 3], ['a number', 5, '1 + 1', 2]])(
      '%s receiver works, wrapped', (_label, receiver, src, expected) => {
        expect(receiver._eval(src)).toBe(expected)
      }
    )

    test('objix methods are generic enough for a primitive receiver', () => {
      expect('abc'._eval('_len()')).toBe(3)
    })

    // The scope is a Proxy around the wrapped clone, and a bare method call uses
    // that proxy as its receiver. Methods needing an internal slot reject it -
    // documented in docs/api.md#eval. The wording is engine-specific, so only
    // the error's name is asserted.
    test.each([
      ['a string', 'abc', 'toUpperCase()'],
      ['a number', 5, 'toFixed(2)'],
      ['a date', new Date(0), 'getTime()']
    ])('a method of %s needing an internal slot throws', (_label, receiver, src) => {
      expect(receiver._try(t => t._eval(src), e => e.name)).toBe('TypeError')
    })

    test('the same method works when reached through a property', () => {
      expect({ s: 'abc' }._eval('s.toUpperCase()')).toBe('ABC')
    })
  })

  describe('built-ins', () => {
    test.each([
      ['Math', 'Math.sqrt(4)', 2],
      ['Number', 'Number("42")', 42],
      ['RegExp', 'new RegExp("a").test("cat")', true],
      ['Date', 'new Date(0).getUTCFullYear()', 1970],
      ['JSON', 'JSON.stringify([1])', '[1]']
    ])('%s is in scope', (_name, src, expected) => {
      expect({}._eval(src)).toBe(expected)
    })

    test.each([
      'process', 'require', 'globalThis', 'console', 'Function',
      'eval', 'Array', 'Object', 'Symbol', 'Promise', 'setTimeout'
    ])('%s is not in scope', global => {
      expect({}._eval('typeof ' + global)).toBe('undefined')
    })

    test('__proto__ reads as undefined', () => {
      expect({ a: 1 }._eval('__proto__')).toBeUndefined()
    })

    test('an own key shadows a built-in of the same name', () => {
      expect({ Math: 9 }._eval('Math')).toBe(9)
    })

    test('a falsy own key still shadows a built-in', () => {
      expect({ Math: 0 }._eval('Math')).toBe(0)
    })

    test.each([
      ['null', null],
      ['undefined', undefined]
    ])('a key holding %s falls through to the built-in', (_label, value) => {
      expect({ Math: value }._eval('Math')).toBe(Math)
    })

    // The built-ins are frozen in place rather than copied, so this is a
    // process-wide side effect of calling _eval at all - see docs/api.md#eval.
    test('freezes the built-ins it exposes', () => {
      ({})._eval('1')
      expect([Math, RegExp, Date, JSON, Number].map(Object.isFrozen))
        .toEqual([true, true, true, true, true])
    })

    test('the frozen built-ins still work', () => {
      expect({ a: 4 }._eval('[Math.sqrt(a), Number.parseInt("7"), typeof Date.now()]'))
        .toEqual([2, 7, 'number'])
    })
  })

  describe('expressions only', () => {
    test.each(['var x = 1', 'return 1', 'throw 1', 'if (1) 2'])(
      '%s is a SyntaxError', src => {
        expect(() => ({})._eval(src)).toThrow(SyntaxError)
      }
    )

    // Evaluation is against this._clone(-1), so a write lands on the copy.
    test('an assignment returns its value but leaves the receiver alone', () => {
      const o = { a: 1 }
      expect([o._eval('a = 5'), o]).toEqual([5, { a: 1 }])
    })

    test('an assignment does not add a key', () => {
      const o = {}
      o._eval('z = 9')
      expect(o).toEqual({})
    })

    test('delete does not remove a key', () => {
      const o = { a: 1, b: 2 }
      expect([o._eval('delete a'), o]).toEqual([true, { a: 1, b: 2 }])
    })

    test('a nested write does not reach the original either', () => {
      const inner = { x: 1 }
      ;({ inner })._eval('inner.x = 99')
      expect(inner).toEqual({ x: 1 })
    })

    test('a sequence expression returns its first value', () => {
      // `with (p) { return 1; 2 }` — the trailing statement is unreachable.
      expect({}._eval('1; 2')).toBe(1)
    })
  })

  describe('errors', () => {
    test('an error from the expression propagates', () => {
      expect(() => ({})._eval('a.b')).toThrow(TypeError)
    })

    test('calling a non-function throws', () => {
      expect(() => ({})._eval('nope()')).toThrow(TypeError)
    })

    test('a malformed expression throws a SyntaxError', () => {
      expect(() => ({})._eval('a +')).toThrow(SyntaxError)
    })

    test('_try converts a throw into a value', () => {
      expect({}._try(t => t._eval('a.b'), () => 'bad')).toBe('bad')
    })

    test.each([
      ['an empty string', '', undefined],
      ['null', null, null],
      ['undefined', undefined, undefined]
    ])('%s evaluates to %s', (_label, src, expected) => {
      expect({}._eval(src)).toBe(expected)
    })
  })

  describe('the import, await and async guard', () => {
    test.each([
      'import("fs")',
      '"the word import here"',
      '1 /* import */',
      'await x',
      '"the word await here"',
      '(async () => 1)()',
      '(async function * () {})()',
      '1 /* async */'
    ])('refuses %s', src => {
      expect({}._eval(src)).toBe('invalid')
    })

    test.each([
      ['import', { import: 5 }],
      ['await', { await: 5 }],
      ['async', { async: 5 }]
    ])('a key named %s is refused too', (name, o) => {
      expect(o._eval(name)).toBe('invalid')
    })

    test.each([
      '"important".length', '"unimportant".length',
      '"awaited".length', '"asynchronous".length'
    ])('the match is whole-word, so %s is allowed', src => {
      expect({}._eval(src)).not.toBe('invalid')
    })

    // The guard only sees the source text, so it cannot stop an async function
    // that arrives as a value. The constructor swap below is what covers that
    // route - see docs/api.md#eval.
    test('an async function reached through a property still returns a Promise', async () => {
      await expect({ f: async () => 1 }._eval('f()')).resolves.toBe(1)
    })
  })

  // _eval hides the globals but does not sandbox: the scope only governs bare
  // identifiers, so a value the expression builds still reaches its own
  // prototype chain. The constructors of every primitive wrapper and every
  // function kind are swapped out for the duration of the call, which is still
  // not a boundary - documented in docs/api.md#eval so callers do not mistake
  // it for safe. Written with computed access so the assertions are about
  // reachability, not any one spelling.
  describe('the constructor swap', () => {
    // The async kinds are reached through a property rather than written as a
    // literal: `async` in the source is refused by the guard above, so a
    // literal would never get as far as the swap. A value arriving this way is
    // exactly the route the text guard cannot see.
    test.each([
      ['Function', { f: () => {} }],
      ['AsyncFunction', { f: async () => {} }],
      ['GeneratorFunction', { f: function * () {} }],
      ['AsyncGeneratorFunction', { f: async function * () {} }]
    ])('%s is not reachable from a value of its kind', (_name, o) => {
      expect(o._eval('f["constr" + "uctor"]')).toBeUndefined()
    })

    test.each([
      ['Number', { v: 5 }],
      ['String', { v: 'x' }],
      ['Boolean', { v: true }],
      ['Symbol', { v: Symbol('s') }]
    ])('the %s wrapper is swapped out as well', (_name, o) => {
      expect(o._eval('v["constr" + "uctor"]')).toBeUndefined()
    })

    test('so none of them can be called to compile code', () => {
      expect(() => ({})._eval('(() => {})["constr" + "uctor"]("return 1")'))
        .toThrow(TypeError)
    })

    // Captured before any _eval below runs, so the comparison is against the
    // untouched descriptors. Function's is writable, the function kinds' are
    // not, so each has to be compared against its own.
    const CTORS = [Number, String, Boolean, Function, Symbol].concat(
      [async function () {}, function * () {}, async function * () {}]
        .map(f => Object.getPrototypeOf(f).constructor)
    )
    const DESCRIPTORS = CTORS.map(c => Object.getOwnPropertyDescriptor(c.prototype, 'constructor'))

    test.each([
      ['restores every descriptor it replaced', '1'],
      ['restores them even when the expression throws', 'a.b']
    ])('%s', (_label, src) => {
      ({})._try(t => t._eval(src))
      CTORS.forEach((ctor, i) => {
        expect(ctor.prototype.constructor).toBe(ctor)
        expect(Object.getOwnPropertyDescriptor(ctor.prototype, 'constructor'))
          .toEqual(DESCRIPTORS[i])
      })
    })

    // Only the code-compiling constructors are swapped, and a returned closure
    // outlives the swap, so this is not a security boundary.
    test('a constructor that does not compile code is still reachable', () => {
      expect({}._eval('[]["constr" + "uctor"]')).toBe(Array)
    })

    test('a closure called after the call gets Function back', () => {
      expect({}._eval('() => (() => {})["constr" + "uctor"]')()).toBe(Function)
    })
  })

  describe('this', () => {
    test('is the scope, so this.key matches a bare identifier', () => {
      expect({ a: 1 }._eval('[this.a, a]')).toEqual([1, 1])
    })

    test('does not expose the host global', () => {
      expect({}._eval('typeof this.process')).toBe('undefined')
    })

    test('is not the receiver itself', () => {
      const o = { a: 1 }
      expect(o._eval('this')).not.toBe(o)
    })

    test('objix methods are callable through it', () => {
      expect({ a: 1, b: 2 }._eval('this._len()')).toBe(2)
    })
  })

  describe('module export', () => {
    test('is exported as eval', () => {
      const objix = require('../objix')
      expect(objix.eval({ a: 1, b: 2 }, 'a + b')).toBe(3)
    })
  })
})
