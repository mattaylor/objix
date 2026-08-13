// Object._$(formatter)
// objix is loaded by test/setup.js (see jest.config.js).

describe('_$', () => {
  describe('default formatting (no argument)', () => {
    test('renders an object without quoting keys', () => {
      expect({ a: 1 }._$()).toBe('{a:1}')
    })

    test('renders nested structures', () => {
      expect({ a: 1, b: [2, 3], c: { d: 'four,five' } }._$())
        .toBe('{a:1,b:[2,3],c:{d:"four,five"}}')
    })

    test('renders an empty object', () => {
      expect({}._$()).toBe('{}')
    })

    test('renders an array', () => {
      expect([1, 2]._$()).toBe('[1,2]')
    })

    test('quotes string values', () => {
      expect({ a: 'x' }._$()).toBe('{a:"x"}')
    })

    test('renders null values', () => {
      expect({ a: null }._$()).toBe('{a:null}')
    })

    test('omits undefined values, as JSON.stringify does', () => {
      expect({ a: undefined, b: 1 }._$()).toBe('{b:1}')
    })
  })

  describe('with a formatter object', () => {
    test('JSON keeps standard quoting', () => {
      expect({ a: 1 }._$(JSON)).toBe('{"a":1}')
    })

    test('a bare stringify function is called with this', () => {
      expect({ a: 1 }._$(JSON.stringify)).toBe('{"a":1}')
    })

    test('any function may be used as a formatter', () => {
      expect({ a: 1 }._$(o => 'custom:' + o.a)).toBe('custom:1')
    })
  })

  describe('with a template string', () => {
    test('substitutes a braced placeholder', () => {
      expect({ a: 1 }._$('a is ${a}')).toBe('a is 1')
    })

    test('substitutes a bare placeholder', () => {
      expect({ a: 1 }._$('a is $a')).toBe('a is 1')
    })

    test('substitutes a dotted path', () => {
      expect({ a: 1, b: { c: 2 } }._$('b is $b and b.c is ${b.c}'))
        .toBe('b is {c:2} and b.c is 2')
    })

    test('renders string values with quotes, as _$ does', () => {
      expect({ name: 'Bob' }._$('hi ${name}')).toBe('hi "Bob"')
    })

    test('substitutes several placeholders', () => {
      expect({ a: 1, b: 2 }._$('$a then $b')).toBe('1 then 2')
    })

    test('a missing key becomes an empty string', () => {
      expect({ a: 1 }._$('x is ${zz}')).toBe('x is ')
    })

    test('text without placeholders is returned unchanged', () => {
      expect({ a: 1 }._$('no placeholders')).toBe('no placeholders')
    })

    test('substitutes a falsy value', () => {
      expect({ a: 0 }._$('a is ${a}')).toBe('a is 0')
    })
  })
})
