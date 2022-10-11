const
  P = Object.prototype,
  F = Object.fromEntries,
  K = Object.keys,
  A = Object.assign

for (let f of ['keys', 'values', 'entries', 'create']) P[f] = function() {
  return Object[f](this)
}

P.every = function(fn) {
  for (let k of K(this)) if (!fn(this[k], k)) return false
  return true
}

P.some = function(fn) {
  for (let k of K(this)) if (fn(this[k], k)) return true
  return false
}

P.map = function(fn) {
  let r = {}
  for (let k of K(this)) r[k] = fn(this[k],k)
  return r
}

P.has = function(v) {
  return this.find(_ => _ == v)
}

P.filter = function(fn) {
  return F(K(this).flatMap(k => fn(this[k],k) ? [[k,this[k]]] : []))
}

P.flatMap = function(fn) {
  return F(K(this).flatMap(k => fn(k,this[k])))
}

P.clean = function() {
  return F(K(this).flatMap(k => this[k] ? [[k,this[k]]] : []))
}

P.isArray = function() {
  return this instanceof Array
}

P.type = function() { 
  return this.constructor.name
}

P.isString = function() {
  return this._type() == 'String'
}

P.find = P.find = function(fn) {
  for (let k of K(this)) if (fn(this[k],k)) return k
}

P.assign = function(...obs) {
  return A(this, ...obs)
}

P.extend = function(...obs) {
  return A({}, ...obs, this)
}

P.delete = function(...keys) {
  for (let k of keys) delete this[k]
  return this
}

P.json = function(fn) {
  return JSON.stringify(this)
}

P.clone = function(d) {
  let c = this.constructor()
  K(this).map(k => c[k] = (d && this[k].size()) ? this[k].clone(d-1) : this[k])
  return c
}

P.join = function(...obs) {
  let r = A({}, this)
  for(let o of obs) K(o).map(k => r[k] &&= [].concat(r[k], o[k]))
  return r
}

P.split = function() {
  let r = []
  for (let k of K(this)) this[k].map((v,i) => r[i] ? r[i][k] = v : r[i] = {[k]: v})
  return r
}

P.common = function(ob) {
  return F(K(this).flatMap(k => (ob[k] == this[k]) ? [[k,this[k]]] : []))
}

P.contains = function(ob, d) {
  for (let k of K(ob)) if (this[k] != ob[k] && !(d && this.some(v => v.contains(ob, d-1)))) return false
  return true
}

P.equals = function(ob, d) {
  return !(this.size() == ob.size() && this.some((v,k) => v != ob[k] && !(d && v.equals(ob[k],d-1))))
}

P.size = function() {
  return this.isString() ? 0 : K(this).length
}

P.keyBy = function(ar, k) {
  ar.map(o => this[o[k]] = this[o[k]] ? [o].concat(this[o[k]]) : o)
  return this
}

P.bind = function(key, fn) {
  this[key] = function(...args) { return fn(this, ...args) }
  return this
}

P.log = function(msg='', c='log') {
  console[c](new Date().toISOString().slice(0,-8), msg, this.clone(-1))
  return this
}

P.new = function(o) {
  return this._t ? new Proxy(this._t.new(o), this._h) : this.create().assign(o)
}

P.trap = function(fn, e, ...p) {
  return new Proxy(this, {
    set(t,k,v) {
      if ((!p[0] || p.has(k)) && !fn(v,k,t) && e) throw([e,k,v])
      return t[k] = v
    },
    get(t,k) {
      return {_t:t, _h:this}[k] || t[k]
    }
  })
}

for (let fn of K(P)) {
  if (fn[0] != '_') P['_'+fn] = P[fn]
  try { module.exports[fn] = (ob, ...args) => ob['_'+fn](...args) } catch {}
}
