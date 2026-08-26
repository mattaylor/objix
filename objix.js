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
  I = Symbol.iterator,
  D = O.defineProperty,
  M = {

  some(f) {
    if (this.some) return this.some(f)
    for (let k in this) if (f(this[k], k)) return true
    return false
  },

  every(f) {
    return !this._some((v, k) => !f(v, k))
  },

  map(f, r = {}, d) {
    if (!d && this.map) return this.map(f)
    for (let k in this) r[k] = d && this[k]._is(O) ? this[k]._map(f, {}, d - 1) : f(this[k], k)
    return r
  },

  has(v) {
    return V(this).includes(v)
  },

  pick(f, r = {}, k) {
    if (f.map) for (k of f) r[k] = this[k]
    else for (k in this) if (f(this[k], k)) r[k] = this[k]
    return r
  },

  flatMap(f, r = {}, i, k, v) {
    if (this.flatMap) return this.flatMap(f)
    for (i of K(this)) for ([k, v] of f(i, this[i])) r[k] = v
    return r
  },

  clean() {
    return this._pick(v => v || !(v ?? true))
  },

  is(c) {
    let t = this
    return c == O
      ? t[C] == O || !(t instanceof N || t instanceof S || t instanceof F || t instanceof Boolean || t instanceof Symbol)
      : t instanceof c
  },

  extend(...a) {
    for (let v of a) for (let k in v) this[k] ??= v[k]
    return this
  },

  find(t) {
    for (let k in this) if (t.call ? t(this[k], k) : this[k]._eq(t)) return k
  },

  del(...a) {
    while (a.length && delete this[a.pop()]);
    return this
  },

  clone(d, e) {
    let t = this
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

  split(r = []) {
    for (let k in this) this[k]._map((v, i) => r[i] ? r[i][k] = v : r[i] = { [k]: v })
    return r
  },

  same(o, d) {
    return o?._pick((v, k) => v._eq(this[k], d))
  },

  diff(o) {
    return this._pick((v, k) => !v._eq(o[k]))
  },

  contains(o, d) {
    for (let k in o) if (!this[k]?._eq(o[k])) return d && this._some(v => v._contains(o, d - 1))
    return true
  },

  eq(o, d) {
    return this == o || this._len() == o?._len()
      && !(this - o)
      && this._is(o[C])
      && !this._some((v, k) => !(v == o[k] || d && v?._eq(o[k], d - 1)))
  },

  len() {
    return K(this).length
  },

  keyBy(k, r = {}, _) {
    for (let e of this) r[_ = k.call ? k(e) : e[k]] = r[_]?.concat(e) || [e]
    return r
  },

  at(p) {
    return this[p] ?? S(p).split('.').reduce((v, c) => v?.[c], this)
  },

  $(s) {
    return s
      ? s._is(S) ? s.replace(/\${?([\w\.]+)}?/g, (m, p) => this._at(p)?._$() ?? '') : (s.stringify || s)(this)
      : this._len() ? this._$(JSON).replace(/"(\w+)":/g, '$1:') : S(this)
  },

  memo(e, f = this) {
    return e ? function (...a) {
      return f[a._$()] ??= (f._wait(e).then(t => delete t[a._$()]), f.apply(this, a))
    } : this
  },

  bind(k, f, e) {
    return D(this, k, { value: function (...a) { return f(...a, this) }._memo(e) })
  },

  log(m = '', f, c = 'log') {
    (!f || f(this)) && console[c](Date().slice(4, 24), '-', m, this._$())
    return this
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
      f = [F, (async function () { })[C], (function* () { })[C], (async function* () { })[C]],
      o = f.map(_ => O.getOwnPropertyDescriptor(_[P], C)),
      p = new Proxy(O(this._clone(-1)), {
        has() { return true },
        get(t, k) { return t[k] ?? g[k] }
      })
    if (/\b(import|await|async)\b/.test(s)) throw EvalError()
    f.map(v => D(v[P], C, { configurable: true, get() { } }))
    try {
      return F('p', `with (p) { return ${s} }`).call(p, p)
    } finally {
      f.map((v, k) => D(v[P], C, o[k]))
    }
  },

  assign(...a) { return A(this, ...a) },
  keys() { return K(this) }
}

for (let m of ['create', 'values', 'entries']) M[m] = function (a) {
  return O[m](this, a)
}

O[P][I] = function () { return O.entries(this)[I]() }

for (let m in M) {
  D(O[P], '_'+m, { value: M[m] })
  try { module.exports[m] = (o, ...a) => o['_'+m](...a) } catch {}
}
