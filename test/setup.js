// Shared test setup: load objix, and under Jest detach its @@iterator from
// Object.prototype.
//
// Loaded by Jest via `setupFiles` (jest.config.js) and by Bun via `preload`
// (bunfig.toml) - Bun does not read jest.config.js.
//
// Why the detach: objix assigns Symbol.iterator to Object.prototype so any object
// can be spread and for..of'd. Jest's `iterableEquality` checks only for the
// *presence* of an iterator (`!!object[Symbol.iterator]`), so with objix loaded
// every plain object is compared as an ordered sequence of values. That makes
// `expect({b:2,a:1}).toEqual({a:1,b:2})` fail and reports the useless
// "serializes to the same string" — even for objects objix never touched.
//
// Rather than reimplement Jest's equality (a custom tester cannot distinguish
// toEqual from toStrictEqual, so undefined-key handling breaks), we stash the
// real iterator on `globalThis.OBJIX_ITERATOR` and remove it.
// test/iterator.test.js — where the behaviour is actually under test — puts that
// same function back, so the library's own implementation is exercised and
// counted for coverage. Jest gives each test file a fresh module registry and
// global scope, so that re-install stays local to it.
//
// Bun needs none of this: its `toEqual` compares plain objects by their keys even
// when an iterator is present, so the iterator is left installed. That also
// matters because Bun shares one Object.prototype across every test file, where
// Jest does not.
require('../objix')

globalThis.OBJIX_ITERATOR = Object.prototype[Symbol.iterator]

if (typeof globalThis.Bun === 'undefined') delete Object.prototype[Symbol.iterator]
