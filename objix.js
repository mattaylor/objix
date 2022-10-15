const
  O = Object,
  F = O.fromEntries,
  K = O.keys,
  A = O.assign,
  P = {

  every(f) {
    for (let k in this) if (!f(this[k], k)) return false
    return true
  },

	some(f) {
    for (let k in this) if (f(this[k], k)) return true
    return false
  },

	map(f) {
    let r = {}
    for (let k in this) r[k] = f(this[k],k)
    return r
  },

	has(o) {
    return this.find(v => v.equals(o))
  },

	filter(f) {
    let r = {}
    for (let k in this) if (f(this[k],k)) r[k] = this[k]
    return r
  },

	flatMap(f) {
    return F(K(this).flatMap(k => f(k,this[k])))
  },

	clean() {
    return this.filter(v => v) 
  },

	type() {
    return this.constructor.name
  },

	is(t, i) {
    return t == O
      ? ![String,Boolean,Number,Function].includes(this.constructor)
      : this.constructor == t || !i && this.is(O) && this instanceof t
  },

	find(f) {
    for (let k in this) if (f(this[k],k)) return k
  },

	extend(...a) {
    return A(this, ...a, this)
  },

	delete(...a) {
    for (let k of a) delete this[k]
    return this
  },

	json() {
    return JSON.stringify(this)
  },

	clone(d) {
    return !this.is(O) ? this.valueOf() : this.is(Array,1)
      ? this.map(v => d && v ? v.clone(d-1) : v)
      : new this.constructor(this.valueOf().is(O) ? this.map(v => d && v ? v.clone(d-1) : v) : this)
  },

  [Symbol.iterator]()  {
    return this.values()[Symbol.iterator]()
  },

	join(...a) {
    let r = A({}, this)
    for(let o of a) K(o).map(k => r[k] &&= [].concat(r[k], o[k]))
    return r
  },

	split() {
    let r = []
    for (let k in this) this[k].map((v,i) => r[i] ? r[i][k] = v : r[i] = {[k]: v})
    return r
  },

	common(o) {
    return F(K(this).flatMap(k => (o[k] == this[k]) ? [[k,this[k]]] : []))
  },

	contains(o, d) {
    for (let k in o) if (!this[k]?.equals(o[k]) && !(d && this.some(v => v.contains(o, d-1)))) return false
    return true
  },

	equals(o, d) {
    return this == o
      || this.type() == o.type()
      && this.size() == o.size()
      && !(this-o)
      && this.every((v,k) => v == o[k] || d && v?.equals(o[k],d-1))
  },

	size() {
    return K(this).length
  },

	keyBy(a, k) {
    a.map(o => this[o[k]] = this[o[k]] ? [o].concat(this[o[k]]) : o)
    return this
  },

	bind(k, f) {
    this[k] = function(...a) { return f(this, ...a) }
    return this
  },

	log(m='', f, c='log') {
    !f || f(this) && console[c](new Date().toISOString().slice(0,-8), m, this.clone())
    return this
  },

  try(f,c) {
    try { f(this) } catch { c && c(this) } finally { return this }
  },

	new (o) {
    return this._t ? new Proxy(this._t.new(o), this._h) : A(this.create(),o)
  },

	trap(f, e, ...p) {
    return new Proxy(this, {
      set(t,k,v) {
        if ((!p[0] || p.has(k)) && !f(v,k,t) && e) throw([e,k,v]+'')
        return t[k] = v
      },
      get(t,k) {
        return {_t:t, _h:this}[k] || t[k]
      }
    })
  }
}

for (let f of ['keys','values','entries','create','assign']) P[f] = function(...a) {
  return O[f](this, ...a)
}

for (let p in P) if (p[0] != '_') {
  O.prototype[p] = P[p]
  ;[p,'__'+p].map(k => O.defineProperty(O.prototype, k, { enumerable: false, value: P[p] }))
  try { module.exports[p] = (o, ...a) => o['__'+p](...a) } catch {}
}