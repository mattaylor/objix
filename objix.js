const
  P = Object.prototype,
  E = Object.entries,
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
  return F(E(this).map(([k,v]) => [k,fn(v,k)])) 
}

P.apply = function(fn) {
  E(this).map(([k,v]) => this[k] = fn(v,k))
  return this
}

P.filter = function(fn) {
  return F(E(this).flatMap(([k,v]) => fn(v,k) ? [[k,v]] : []))
}

P.flatMap = function(fn) {
  return F(E(this).flatMap(([k,v]) => fn(k,v)))
}

P.clean = function() {
  return F(E(this).flatMap(([k,v]) => v ? [[k,v]] : []))
}

P.isArray = function() {
  return this instanceof Array
}

P.find = function(fn) {
  for (let [k,v] of E(this)) if (fn(v,k)) return k
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
  for(let o of obs) E(o).forEach(([k,v]) => res[k] &&= [].concat(res[k], v))
  return res
}

P.split = function() {
  let res = []
  for (let [k,v] of E(this)) v.forEach((v,i) => res[i] ? res[i][k] = v : res[i] = {[k] : v})
  return res
}

P.common = function(ob) {
  return F(E(this).flatMap(([k,v]) => (ob[k] == v) ? [[k,v]] : []))
}

P.contains = function(ob) {
  for (let [k,v] of E(ob)) if (this[k] != v) return false
  return true
}

P.equals = function(ob, d) {
  if (K(this).length != K(ob).length) return false
  for (let [k,v] of E(this)) if ((v != ob[k] && !(d && v.equals(ob[k],d-1)))) return false
  return true
}

P.size = function() {
  return K(this).length
}

P.index = function(k, ar) { 
  ar.forEach(o => this[o[k]] = this[o[k]] ? [o].concat(this[o[k]]) : o)
  return this 
}