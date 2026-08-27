const
  O = Object,
  S = String,
  F = Function,
  N = Number,
  K = O.keys,
  V = O.values,
  A = O.assign,
  P = 'prototype',
  C = 'constructor',
  D = O.defineProperty,
  M = {

  some(f, t=this) {
    if (t.some) return t.some(f)
    for (let k in t) if (f(t[k], k)) return true
    return false
  },

  every(f) {
    return !this._some((v, k) => !f(v, k))
  },

  map(f, r = {}, d, t=this) {
    if (!d && t.map) return t.map(f)
    for (let k in t) r[k] = d && t[k]._is(O) ? this[k]._map(f, {}, d - 1) : f(t[k], k)
    return r
  },

  has(v) {
    return V(this).includes(v)
  },

  pick(f, r = {}, t=this, k) {
    if (f.map) for (k of f) r[k] = t[k]
    else for (k in t) if (f(t[k], k)) r[k] = t[k]
    return r
  },

  flatMap(f, r = {}, t=this, i, k, v) {
    if (t.flatMap) return t.flatMap(f)
    for (i of K(t)) for ([k, v] of f(i, this[i])) r[k] = v
    return r
  },

  clean() {
    return this._pick(v => v || !(v ?? true))
  },

  is(c, t=this) {
    return c == O
      ? t[C] == O || !(t instanceof N || t instanceof S || t instanceof F || t instanceof Boolean || t instanceof Symbol)
      : t instanceof c
  },

  extend(...a) {
    for (let v of a) for (let k in v) this[k] ??= v[k]
    return this
  },

  find(f, t=this) {
    for (let k in t) if (f.call ? f(t[k], k) : t[k]._eq(f)) return k
  },

  del(...a) {
    while (a.length && delete this[a.pop()]);
    return this
  },

  clone(d, t=this) {
    return !t._is(O) ? t.valueOf()
      : !t._len() ? t.map ? [] : t[C] == O ? {} : new t[C](t)
      : d ? t._map(v => v?._clone(d - 1) ?? v)
      : t.map ? [...t] : { ...t }
  },

  join(...a) {
    let r,o,k
    r = { ...this }
    for (o of a) for (k in o) r[k] &&= [].concat(r[k], o[k])
    return r
  },

  split(r = [], t=this) {
    for (let k in t) t[k]._map((v, i) => r[i] ? r[i][k] = v : r[i] = { [k]: v })
    return r
  },

  same(o, d) {
    return o?._pick((v, k) => v._eq(this[k], d))
  },

  diff(o) {
    return this._pick((v, k) => !v._eq(o[k]))
  },

  contains(o, d, t=this) {
    for (let k in o) if (!t[k]?._eq(o[k])) return !!d && t._some(v => v._contains(o, d - 1))
    return true
  },

  eq(o, d, t=this) {
    return t == o || t._len() == o?._len()
      && !(t - o)
      && t._is(o[C])
      && !t._some((v, k) => !(v == o[k] || d && v?._eq(o[k], d - 1)))
  },

  len() {
    return K(this).length
  },

  keyBy(f, r={}, t=this, k, v) {
    for (v of t.map ? t : V(t)) r[k = f.call ? f(v) : v[f]] = r[k]?.concat(v) || [v]
    return r
  },

  at(p) {
    return this[p] ?? S(p).split('.').reduce((v, c) => v?.[c], this)
  },

  $(s, t=this) {
    return s
      ? s._is(S) ? s.replace(/\${?([\w\.]+)}?/g, (m, p) => t._at(p)?._$() ?? '') : (s.stringify || s)(t)
      : t._len() ? t._$(JSON).replace(/"(\w+)":/g, '$1:') : S(t)
  },

  memo(e, f = this) {
    return e ? function (...a) {
      return f[a._$()] ??= (f._wait(e).then(t => delete t[a._$()]), f.apply(this, a))
    } : this
  },

  bind(k, f, e) {
    return D(this, k, { value: function (...a) { return f(...a, this) }._memo(e) })
  },

  log(m = '', f, c = 'log',t=this) {
    (!f || f(t)) && console[c](Date().slice(4, 24), '-', m, t._$())
    return t
  },

  try(t, c, f, r) {
    try { r = t(this) } catch (e) { r = c?.(e, this) }
    return f ? f(this) : r
  },

  new(o) {
    return this._t ? new Proxy(this._t._new(o), this._h) : A(this._create(), o)
  },

  wait(d) {
    return new Promise((s, f) => d._is(N) ? setTimeout(() => s(this), d * 1000) : (d = d(this, s, f)) && s(d))
  },

  trap(f, e, ...p) {
    return new Proxy(this, {
      set(t, k, v) {
        if ((!p[0] || p._find(k)) && !f(v, k, t) && e) throw (e + ' ' + [k, v]._$())
        return (t[k] = v, true)
      },
      get(t, k) {
        return k == '_t' ? t : k == '_h' ? this : t[k]
      }
    })
  },

  eval(s) {
    const
      g = { Math, RegExp, Date, JSON, Number }._map(O.freeze),
      f = [F, (async function () {})[C], (function* () {})[C], (async function* () {})[C]],
      o = f.map(_ => O.getOwnPropertyDescriptor(_[P], C)),
      p = new Proxy(O(this._clone(-1)), {
        has() { return true },
        get(t, k) { return t[k] ?? g[k] }
      })
    if (/\b(import|await|async)\b/.test(s)) throw EvalError()
    f.map(v => D(v[P], C, { configurable: true, get() {} }))
    try {
      return F('p', `with (p) { return ${s} }`).call(p, p)
    } finally {
      f.map((v, k) => D(v[P], C, o[k]))
    }
  },

  assign(...a) { return A(this, ...a) },
  keys() { return K(this) }
}

for (let m of ['create', 'values', 'entries']) M[m] = function (a) { return O[m](this, a) }

D(O[P], Symbol.iterator, { writable: true, value: function* () { for (let k in this) yield [k, this[k]] }})

for (let m in M) {
  D(O[P], '_' + m, { value: M[m] })
  try { module.exports[m] = (o, ...a) => o['_' + m](...a) } catch { }
}
