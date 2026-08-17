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

    test('inherited properties are in scope', () => {
      expect({ a: 1 }._new({ b: 2 })._eval('a + b')).toBe(3)
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

    test('works on a string', () => {
      expect('abc'._eval('length')).toBe(3)
    })

    test('objix methods are generic enough for a primitive receiver', () => {
      expect('abc'._eval('_len()')).toBe(3)
    })

    // The scope is a Proxy around `this`, and a bare method call uses that proxy
    // as its receiver. Methods needing an internal slot reject it - documented in
    // docs/api.md#eval.
    test.each([
      ['a string', 'abc', 'toUpperCase()'],
      ['a number', 5, 'toFixed(2)'],
      ['a date', new Date(0), 'getTime()']
    ])('a method of %s needing an internal slot throws', (_label, receiver, src) => {
      expect(() => receiver._eval(src)).toThrow(TypeError)
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

    test.each(['constructor', '__proto__'])('%s reads as undefined', key => {
      expect({ a: 1 }._eval(key)).toBeUndefined()
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

    test('an assignment writes through to this', () => {
      const o = { a: 1 }
      expect([o._eval('a = 5'), o]).toEqual([5, { a: 5 }])
    })

    test('an assignment can add a key', () => {
      const o = {}
      o._eval('z = 9')
      expect(o).toEqual({ z: 9 })
    })

    test('delete removes a key', () => {
      const o = { a: 1, b: 2 }
      expect([o._eval('delete a'), o]).toEqual([true, { b: 2 }])
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

  describe('the import guard', () => {
    test.each([
      'import("fs")',
      '"the word import here"',
      '1 /* import */'
    ])('refuses %s', src => {
      expect({}._eval(src)).toBe('invalid')
    })

    test('a key named import is refused too', () => {
      expect({ import: 5 }._eval('import')).toBe('invalid')
    })

    test.each(['"important".length', '"unimportant".length'])(
      'the match is whole-word, so %s is allowed', src => {
        expect({}._eval(src)).not.toBe('invalid')
      }
    )
  })

  // _eval hides the globals but does not sandbox: any value reachable from the
  // expression exposes .constructor, and Function is enough to run anything.
  // Documented in docs/api.md#eval so callers do not mistake it for safe.
  describe('is not a security boundary', () => {
    test('a literal reaches its own constructor', () => {
      expect({}._eval('[].constructor')).toBe(Array)
    })

    test('a property value reaches Function', () => {
      expect({ f: () => 1 }._eval('f.constructor')).toBe(Function)
    })

    test('Function reached that way runs arbitrary code', () => {
      expect({}._eval('(() => {}).constructor("return 1 + 1")()')).toBe(2)
    })
  })

  describe('module export', () => {
    test('is exported as eval', () => {
      const objix = require('../objix')
      expect(objix.eval({ a: 1, b: 2 }, 'a + b')).toBe(3)
    })
  })
})
