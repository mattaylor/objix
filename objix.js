const
  P = Object.prototype,
  F = Object.fromEntries,
  K = Object.keys,
  A = Object.assign
  
for (let f of ['keys', 'values', 'entries', 'create']) P[f] = function() {
  return Object[f](this)
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

P.isArray = function() {
  return this instanceof Array
}

P.type = function() { 
  return this.constructor.name
}

P.isString = function() {
  return this._type() == 'String'
}

P.find = P.find = function(f) {
  for (let k of K(this)) if (f(this[k],k)) return k
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

P.json = function(f) {
  return JSON.stringify(this)
}

P.clone = function(d) {
  let c = this.constructor(this.size()?null:this)
  K(this).map(k => c[k] = (d && !(this[k]||'').isString()) ? this[k].clone(d-1) : this[k])
  return c
}

P.join = function(...ar) {
  let r = A({}, this)
  for(let o of ar) K(o).map(k => r[k] &&= [].concat(r[k], o[k]))
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
  return this == ob
    || this.type() == ob.type() 
    && this.size() == ob.size()
    && !(this-ob)
    && this.every((v,k) => v == ob[k] || d && v?.equals(ob[k],d-1))
  }

P.size = function() {
  return K(this).length
}

P.keyBy = function(ar, k) {
  ar.map(o => this[o[k]] = this[o[k]] ? [o].concat(this[o[k]]) : o)
  return this
}

P.bind = function(k, f) {
  this[k] = function(...args) { return f(this, ...args) }
  return this
}

P.log = function(m='', c='log') {
  console[c](new Date().toISOString().slice(0,-8), m, this.clone(-1))
  return this
}

P.new = function(o) {
  return this._t ? new Proxy(this._t.new(o), this._h) : this.create().assign(o)
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
  try { module.exports[f] = (ob, ...args) => ob['_'+f](...args) } catch {}
}