const
  O = Object,
  C = 'constructor',
  F = Function,
  K = O.keys,
  A = O.assign,
  P = 'prototype',
  I = Symbol.iterator,
  M = {

    every(f) {
     for (let k in this) if (!f(this[k], k)) return false
      return true
    },

    some(f) {
      if (this.some) return this.some(f)
      for(let k in this) if(f(this[k], k)) return true
      return false
    },

    map(f, r = {}) {
      if (this.map) return this.map(f)
      for (let k in this) r[k] = f(this[k], k)
      return r
    },

    has(v) {
      for (let k in this) if (this[k] === v) return true
      return false
    },

    pick(f, r = {}) {
      for (let k in this) if (f.call ? f(this[k], k) : f._has(k)) r[k] = this[k]
      return r
    },

    flatMap(f, r = {}) {
      if (this.flatMap) return this.flatMap(f)
      for (let i of K(this)) for (let [k, v] of f(i, this[i])) r[k] = v
      return r
    },

    clean() {
      return this._pick(v => v || !(v ?? true))
    },

    is(t) {
      return (t == O)
        ? !(this instanceof Number || this instanceof String || this instanceof Boolean || this instanceof Function || this instanceof Symbol)
        : this instanceof t
      },

    extend(...a) {
      for (let v of a) for (let k in v) this[k] ??= v[k]
      return this
    },

    find(t) {
      for (let k in this) if (t.call ? t(this[k], k) : this[k]._eq(t)) return k
    },

    delete(...a) {
      for (let k of a) delete this[k]
      return this
    },

    clone(d, e) {
      return !this._is(O) ? this.valueOf()
        : (!e && d == -1) ? this._try(structuredClone, () => this._clone(d, 1))
          : this._len() ? this._map(v => v && d ? v._clone(d - 1) : v)
            : this.map ? this : new this[C](this)
    },

    join(...a) {
      let r = A({}, this)
      for (let o of a) K(o)._map(k => r[k] &&= [].concat(r[k], o[k]))
      return r
    },

    split(r = []) {
      for (let k in this) this[k]._map((v, i) => r[i] ? r[i][k] = v : r[i] = { [k]: v })
      return r
    },

    same(o) {
      return this._pick((v, k) => v._eq(o[k]))
    },

    diff(o) {
      return this._pick((v, k) => !v._eq(o[k]))
    },

    contains(o, d) {
      return o._every((v, k) => this[k]?._eq(v)) || d && this._some(v => v._contains(o, d - 1))
    },

    eq(o, d) {
      return this == o || o
        && !(this - o)
        && this._is(o[C])
        && this._len() == o._len()
        && this._every((v, k) => v == o[k] || d && v?._eq(o[k], d - 1))
    },

    len() {
      return K(this).length
    },

    keyBy(k, v, r = {}, a) {
      this._map(o => r[v = o._at(k)] = r[v]?.concat(o) || [o])
      return r
    },

    at(p) {
      return this[p] ?? String(p).split('.').reduce((v, c) => v?.[c], this)
    },

    $(s) {
      return s ? s._is(String) ? s.replace(/\${?([\w\.]+)}?/g, (m, p) => this._at(p)?._$() ?? '')
        : (s.stringify || s)(this)
        : this._len() ? this._$(JSON).replace(/"(\w+)":/g, '$1:') : this + ''
    },

    memo(e, f = this) {
      return e ? function (...a) { return f[a._$()] ??= (f._wait(e).then(t => delete t[a._$()]), f.apply(this, a)) } : this
    },

    bind(k, f, e) {
      def(this, k, { value: function (...a) { return f(...a, this) }._memo(e) })
      return this
    },

    log(m = '', f, c = 'log') {
      (!f || f(this)) && console[c](Date().slice(4, 24), '-', m, this._$())
      return this
    },

    try(t, c, r, _) {
      try { _ = t(this) } catch (e) { _ = (c && c(e, this)) } return r ? this : _
    },

    new(o) {
      return this._t ? new Proxy(this._t._new(o), this._h) : A(this._create(), o)
    },

    wait(d) {
      return new Promise((s, f) => d._is(Number) ? setTimeout(() => s(this), d * 1000) : (d = d(this, s, f)) && s(d))
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
        g = { Math, RegExp, Date, JSON, Number }._map(_ => O.freeze(_)),
        f = [F, (async function () {})[C], (function* () {})[C], (async function* () {})[C]],
        o = f.map(_ => O.getOwnPropertyDescriptor(_[P], C)),
        p = new Proxy(O(this._clone(-1)), {
          has() { return true },
          get(t, k) { return [Symbol.unscopables, C, '__proto__']._has(k) ? undefined : t[k] ?? g[k] }
        })
      f.map(v => def(v[P], C, { configurable: true, get() { return undefined } }))
      try { return /\b(import|await|async)\b/.test(s) ? 'invalid' : F('p', `with (p) { return ${s} }`).call(p, p) }
      finally { f.map((v,k) => def(v[P], C, o[k])) }
    }
  }

for (let m of ['keys','values','entries','create','assign']) M[m] = function(...a) {
  return O[m](this, ...a)
}

const def = (o,k,v) => O.defineProperty(o, k, v)

O[P][I] = function() { return this._values()[I]() }

for (let m in M) {
  def(O[P], '_' + m, { value: M[m] })
  try { module.exports[m] = (o, ...a) => o['_'+m](...a) } catch {}
}
