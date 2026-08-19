// Object._is(type, exact)
// objix is loaded by test/setup.js (see jest.config.js).

class Class1 {}
class Class2 extends Class1 {}

describe('_is', () => {
  describe('primitives', () => {
    test('a string is a String but not an Object', () => {
      expect(''._is(String)).toBe(true)
      expect(''._is(Object)).toBe(false)
    })

    test('a number is a Number but not an Object', () => {
      expect((1)._is(Number)).toBe(true)
      expect((1)._is(Object)).toBe(false)
    })

    test('a boolean is a Boolean but not an Object', () => {
      expect((false)._is(Boolean)).toBe(true)
      expect((false)._is(Object)).toBe(false)
    })

    test('a symbol is a Symbol but not an Object', () => {
      expect(Symbol('x')._is(Symbol)).toBe(true)
      expect(Symbol('x')._is(Object)).toBe(false)
    })

    test('a number is not a String', () => {
      expect((1)._is(String)).toBe(false)
    })
  })

  describe('functions', () => {
    test('a function is a Function but not an Object', () => {
      const f = () => 1
      expect(f._is(Function)).toBe(true)
      expect(f._is(Object)).toBe(false)
    })
  })

  describe('objects and arrays', () => {
    test('a plain object is an Object', () => {
      expect({}._is(Object)).toBe(true)
    })

    test('a plain object is not an Array', () => {
      expect({}._is(Array)).toBe(false)
    })

    test('an array is both an Array and an Object', () => {
      expect([]._is(Array)).toBe(true)
      expect([]._is(Object)).toBe(true)
    })

    test('an array is not a String', () => {
      expect([]._is(String)).toBe(false)
    })
  })

  describe('dates', () => {
    test('a date is a Date and an Object', () => {
      expect(new Date()._is(Date)).toBe(true)
      expect(new Date()._is(Object)).toBe(true)
    })

    test('a date is neither a Number nor a String', () => {
      expect(new Date()._is(Number)).toBe(false)
      expect(new Date()._is(String)).toBe(false)
    })
  })

  describe('classes', () => {
    test('an instance matches its own class', () => {
      expect(new Class2()._is(Class2)).toBe(true)
    })

    test('an instance matches a base class', () => {
      expect(new Class2()._is(Class1)).toBe(true)
    })

    test('an instance is an Object', () => {
      expect(new Class2()._is(Object)).toBe(true)
    })

    test('an instance does not match an unrelated type', () => {
      expect(new Class2()._is(Number)).toBe(false)
    })

    test('a base instance does not match a derived class', () => {
      expect(new Class1()._is(Class2)).toBe(false)
    })
  })
/*
  describe('exact matching (second argument)', () => {
    test('exact matches the direct constructor', () => {
      expect(new Class2()._is(Class2, 1)).toBe(true)
    })

    test('exact rejects an inherited base class', () => {
      expect(new Class2()._is(Class1, 1)).toBe(false)
    })

    test('exact rejects Object for an array', () => {
      expect([]._is(Object, 1)).toBe(false)
      expect([]._is(Array, 1)).toBe(true)
    })

    test('exact still accepts a plain object as an Object', () => {
      expect({}._is(Object, 1)).toBe(true)
    })
  })
*/
})
