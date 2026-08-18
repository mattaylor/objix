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

    // _clone returns valueOf() for a non-object, and a primitive cannot be the
    // target of a Proxy - documented in docs/api.md#eval. The wording of the
    // TypeError is engine-specific, so only its name is asserted.
    test.each([['a string', 'abc'], ['a number', 5], ['a boolean', true]])(
      '%s receiver throws, having nothing to proxy', (_label, receiver) => {
        expect({}._try(() => receiver._eval('1 + 1'), e => e.name)).toBe('TypeError')
      }
    )

    // The scope is a Proxy around the clone, and a bare method call uses that
    // proxy as its receiver. Methods needing an internal slot reject it.
    test('a method needing an internal slot throws', () => {
      expect(new Date(0)._try(t => t._eval('getTime()'), e => e.name)).toBe('TypeError')
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

  // _eval hides the globals but does not sandbox: the scope only governs bare
  // identifiers, so a value the expression builds still reaches its own
  // prototype chain. Function.prototype.constructor is swapped out for the
  // duration of the call, which is not the whole story - documented in
  // docs/api.md#eval so callers do not mistake it for safe. Written with
  // computed access so the assertions are about reachability, not any one
  // spelling.
  describe('the constructor swap', () => {
    test('a function value no longer reaches Function', () => {
      expect({ f: () => 1 }._eval('f["constr" + "uctor"]')).toBeUndefined()
    })

    test('Function cannot be reached to compile code', () => {
      expect(() => ({})._eval('(() => {})["constr" + "uctor"]("return 1")'))
        .toThrow(TypeError)
    })

    test.each([
      ['restores Function.prototype.constructor', '1'],
      ['restores it even when the expression throws', 'a.b']
    ])('%s', (_label, src) => {
      ({})._try(t => t._eval(src))
      expect(Function.prototype.constructor).toBe(Function)
      expect(Object.getOwnPropertyDescriptor(Function.prototype, 'constructor'))
        .toEqual({ value: Function, writable: true, enumerable: false, configurable: true })
    })

    // Only Function.prototype is swapped, so this is not a security boundary.
    test('a non-function literal still reaches its own constructor', () => {
      expect({}._eval('[]["constr" + "uctor"]')).toBe(Array)
    })

    test('the generator function constructor still compiles code', () => {
      expect({}._eval('(function * () {})["constr" + "uctor"]("return 1 + 1")().next()'))
        .toEqual({ value: 2, done: true })
    })

    test('the async function constructor still compiles code', async () => {
      expect(await ({})._eval('(async () => {})["constr" + "uctor"]("return 1 + 1")()'))
        .toBe(2)
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
