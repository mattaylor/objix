const
  O = Object,
  C = 'constructor',
  K = O.keys,
  A = O.assign,
  I = Symbol.iterator,
  M = {

  every(f) {
    for (let k in this) if (!f(this[k], k)) return false
    return true
  },

  some(f) {
    for (let k in this) if (f(this[k], k)) return true
    return false
  },

  map(f, r={}) {
    if (this.map) return this.map(f)
    for (let k in this) r[k] = f(this[k],k)
    return r
  },

  has(v) {
    return this._some(x => v == x)
  },

  pick(f, r={}) {
    for (let k in this) if (f.call ? f(this[k],k) : f._has(k)) r[k] = this[k]
    return r
  },

  flatMap(f, r={}) {
    for (let i of K(this)) for (let [k,v] of f(i,this[i])) r[k] = v
    return r
  },

  clean() {
    return this._pick(v => v)
  },

  is(t, i) {
    return (!i && t == O) ? ![Number,String,Boolean,Function,Symbol]._has(this[C])
      : this[C] == t || !i && this instanceof t
  },

  find(t) {
    for (let k in this) if (t.call ? t(this[k],k) : this[k]._eq(t)) return k
  },

  extend(...a) {
    return A({}, ...a)._map((v,k) => this[k] ?? v, this)
  },

  delete(...a) {
    for (let k of a) delete this[k]
    return this
  },
  
  clone(d, e) {
    return !this._is(O) ? this.valueOf()
      : (!e && d == -1 && this._len() > 10) ? this._try(global.structuredClone, () => this._clone(d,1))
      : this._len() ? this._map(v => v && d ? v._clone(d-1) : v) 
      : this.map ? this : new this[C](this)
  },
  
  join(...a) {
    let r = A({}, this)
    for(let o of a) K(o)._map(k => r[k] &&= [].concat(r[k], o[k]))
    return r
  },

  split(r=[]) {
    for (let k in this) this[k]._map((v,i) => r[i] ? r[i][k] = v : r[i] = {[k]: v})
    return r
  },

  same(o) {
    return this._pick((v,k) => v._eq(o[k]))
  },

  diff(o) {
    return this._pick((v,k) => !v._eq(o[k]))
  },

  contains(o, d) {
    return o._every((v,k) => this[k]?._eq(v)) || d && this._some(v => v._contains(o, d-1))
  },

  eq(o, d) {
    return this == o || o
      && this._is(o[C])
      && this._len() == o._len()
      && !(this-o)
      && this._every((v,k) => v == o[k] || d && v?._eq(o[k],d-1))
  },

  len() {
    return K(this).length
  },

  keyBy(k, v, r={}) {
    this.map(o => r[v=o._at(k)] = r[v] ? [o].concat(r[v]) : o)
    return r
  },

  at(p) {
    return this[p] || p._split('.')._reduce((v,c) => v[c], this)
  },

  $(s) {
    return s ? s._is(String) ? s.replace(/\${?([\w\.]+)}?/g, (m,p) => this._at(p).$())
      : (s.stringify || s)(this)
      : this._$(JSON).replace(/"(\w+)":/g,'$1:')
  },

  memo(e) {
    return e ? (...a) => this[a._$()] ??= (this._wait(e).then(t => delete t[a._$()]),this(...a)) : this
  },

  bind(k, f, e) {
    def(this, k, (function(...a) { return f(...a, this)})._memo(e))
    return this
  },

  log(m='', f, c='log') {
    (!f || f(this)) && console[c](Date().slice(4,24),'-',m,this._$())
    return this
  },

  try(t,c,r,_) {
    try { _ = t(this) } catch(e) { _ = (c && c(e,this)) } return r ? this : _
  },

  new(o) {
    return this._t ? new Proxy(this._t._new(o), this._h) : A(this._create(),o)
  },

  wait(d) {
    return new Promise((s,f) => d._is(Number) ? setTimeout(() => s(this), d*1000) : (d = d(this,s,f)) && s(d))
  },

  trap(f, e, ...p) {
    return new Proxy(this, {
      set(t,k,v) {
        if ((!p[0] || p._find(k)) && !f(v,k,t) && e) throw(e+' '+[k,v].$())
        return t[k] = v
      },
      get(t,k) {
        return {_t:t, _h:this}[k] || t[k]
      }
    })
  }
}

for (let m of ['keys','values','entries','create','assign']) M[m] = function(...a) {
  return O[m](this, ...a)
}

let def = (o,k,v) => o[k] || (O.defineProperty(o, k, { writable:true, value:v }),v)

O.prototype[I] = function() { return this._values()[I]() }

for (let m in M) {
  def(O.prototype,'_'+m,M[m])
  try { module.exports[m] = (o, ...a) => o['_'+m](...a) } catch {}
}