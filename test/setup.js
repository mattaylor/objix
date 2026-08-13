// Jest setup: load objix, then detach its @@iterator from Object.prototype.
//
// Why: objix assigns Symbol.iterator to Object.prototype so any object can be
// spread and for..of'd. Jest's `iterableEquality` checks only for the *presence*
// of an iterator (`!!object[Symbol.iterator]`), so with objix loaded every plain
// object is compared as an ordered sequence of values. That makes
// `expect({b:2,a:1}).toEqual({a:1,b:2})` fail and reports the useless
// "serializes to the same string" — even for objects objix never touched.
//
// Rather than reimplement Jest's equality (a custom tester cannot distinguish
// toEqual from toStrictEqual, so undefined-key handling breaks), we stash the
// real iterator on `globalThis.OBJIX_ITERATOR` and remove it here.
// test/iterator.test.js — where the behaviour is actually under test — puts that
// same function back, so the library's own implementation is exercised and
// counted for coverage. Jest gives each test file a fresh module registry and
// global scope, so that re-install stays local to it.
require('../objix')

globalThis.OBJIX_ITERATOR = Object.prototype[Symbol.iterator]

delete Object.prototype[Symbol.iterator]
