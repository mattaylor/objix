const
  P = Object.prototype,
  F = Object.fromEntries,
  K = Object.keys,
  A = Object.assign
  
for (let f of ['keys', 'values', 'entries', 'create', 'assign']) P[f] = function(...a) {
  return Object[f](this, ...a)
}

P.every = function(f) {
  for (let k of K(this)) if (!f(this[k], k)) return false
  return true
}

P.some = function(f) {
  for (let k of K(this)) if (f(this[k], k)) return true
  return false
}

P.map = function(f) {
  let r = {}
  for (let k of K(this)) r[k] = f(this[k],k)
  return r
}

P.has = function(v) {
  return this.find(_ => _.equals(v))
}

P.filter = function(f) {
  return F(K(this).flatMap(k => f(this[k],k) ? [[k,this[k]]] : []))
}

P.flatMap = function(f) {
  return F(K(this).flatMap(k => f(k,this[k])))
}

P.clean = function() {
  return F(K(this).flatMap(k => this[k] ? [[k,this[k]]] : []))
}

P.type = function() {
  return this.constructor.name
}

P.is = function(t) {
  return t == Object
    ? ![String,Boolean,Number,Function].includes(this.constructor)
    : this.constructor == t || this.is(Object) && this instanceof t
}

P.find = P.find = function(f) {
  for (let k of K(this)) if (f(this[k],k)) return k
}

P.extend = function(...a) {
  return A({}, ...a, this)
}

P.delete = function(...a) {
  for (let k of a) delete this[k]
  return this
}

P.json = function() {
  return JSON.stringify(this)
}

P.clone = function(d) {
  return !this.is(Object) ? this.valueOf() : this.valueOf().is(Object)
    ? A(this.constructor(), d ? this.map(v => v?.clone(d-1) || v) : this)
    : new this.constructor(this)
}

P.join = function(...a) {
  let r = A({}, this)
  for(let o of a) K(o).map(k => r[k] &&= [].concat(r[k], o[k]))
  return r
}

P.split = function() {
  let r = []
  for (let k of K(this)) this[k].map((v,i) => r[i] ? r[i][k] = v : r[i] = {[k]: v})
  return r
}

P.common = function(o) {
  return F(K(this).flatMap(k => (o[k] == this[k]) ? [[k,this[k]]] : []))
}

P.contains = function(o, d) {
  for (let k of K(o)) if (this[k] != o[k] && !(d && this.some(v => v.contains(o, d-1)))) return false
  return true
}

P.equals = function(o, d) {
  return this == o
    || this.type() == o.type()
    && this.size() == o.size()
    && !(this-o)
    && this.every((v,k) => v == o[k] || d && v?.equals(o[k],d-1))
}

P.size = function() {
  return K(this).length
}

P.keyBy = function(a, k) {
  a.map(o => this[o[k]] = this[o[k]] ? [o].concat(this[o[k]]) : o)
  return this
}

P.bind = function(k, f) {
  this[k] = function(...a) { return f(this, ...a) }
  return this
}

P.log = function(m='', c='log') {
  console[c](new Date().toISOString().slice(0,-8), m, this.clone(-1))
  return this
}

P.new = function(o) {
  return this._t ? new Proxy(this._t.new(o), this._h) : A(this.create(),o)
}

P.trap = function(f, e, ...p) {
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

for (let f of K(P)) if (f[0] != '_') {
  P['_'+f] = P[f]
  try { module.exports[f] = (o, ...args) => o['_'+f](...args) } catch {}
}