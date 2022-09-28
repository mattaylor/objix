const
  P = Object.prototype,
  V = Object.values,
  F = Object.fromEntries,
  K = Object.keys,
  A = Object.assign

for (let f of ['keys', 'values', 'entries']) P[f] = function() {
  return Object[f](this) 
}

for (let f of ['some', 'every']) P[f] = function(fn) {
  return V(this)[f](fn)
}

P.map = function(fn) {
  let r = {}
  K(this).map(k => r[k] = fn(this[k],k))
  return r
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

P.find = function(fn) {
  for (let k of K(this)) if (fn(this[k],k)) return k
}

P.assign = function(...obs) {
  return A({}, this, ...obs)
}

P.merge = function(...obs) {
  return A({}, ...obs, this)
}

P.patch = function(...obs) {
  return A(this, ...obs)
}

P.delete = function(...keys) {
  for (let k of keys) delete this[k]
  return this
}

P.json = function(fn) {
  return JSON.stringify(this)
}

P.clone = function() {
  return A({},this)
}

P.join = function(...obs) {
  let res = A({}, this)
  for(let o of obs) K(o).map(k => res[k] &&= [].concat(res[k], o[k]))
  return res
}

P.split = function() {
  let res = []
  for (let k of K(this)) this[k].map((v,i) => res[i] ? res[i][k] = v : res[i] = {[k]: v})
  return res
}

P.common = function(ob) {
  return F(K(this).flatMap(k => (ob[k] == this[k]) ? [[k,this[k]]] : []))
}

P.contains = function(ob) {
  for (let k of K(ob)) if (this[k] != ob[k]) return false
  return true
}

P.equals = function(ob, d) {
  if (K(this).length != K(ob).length) return false
  for (let k of K(this)) if (this[k] != ob[k] && !(d && this[k].equals(ob[k],d-1))) return false
  return true
}

P.size = function() {
  return K(this).length
}

P.keyBy = function(ar, k) {
  ar.map(o => this[o[k]] = this[o[k]] ? [o].concat(this[o[k]]) : o)
  return this
}