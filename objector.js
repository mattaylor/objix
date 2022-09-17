const P = Object.prototype
P.map = function(fn) { 
  return Object.fromEntries(Object.entries(this).map(([k,v]) => [k,fn(v,k)])) 
}

P.apply = function(fn) {
  Object.entries(this).map(([k,v]) => this[k] = fn(v,k))
  return this
}

P.values = function(fn) {
  return Object.values(this)
}

P.keys = function() {
  return Object.keys(this)
}

P.entries = function() {
  return Object.entries(this)
}

P.filter = function(fn) {
  return Object.fromEntries(Object.entries(this).flatMap(([k,v]) => fn(v,k) ? [[k,v]] : []))
}

P.flatMap = function(fn) {
  return Object.fromEntries(Object.entries(this).flatMap(([k,v]) => fn(k,v)))
}

P.clean = function() {
  return Object.fromEntries(Object.entries(this).flatMap(([k,v]) => v ? [[k,v]] : []))
}

P.isArray = function() {
  return this instanceof Array
}

P.find = function(fn) {
  for (const [k,v] of Object.entries(this)) if (fn(v,k)) return k
}

P.assign = function(...obs) {
  return Object.assign({}, this, ...obs)
}

P.merge = function(...obs) {
  return Object.assign({}, ...obs, this)
}

P.patch = function(...obs) {
  return Object.assign(this, ...obs)
}

P.delete = function(...keys) {
  for (const k of keys) delete this[k]
  return this
}

P.some = function(fn) {
  return Object.values(this).some(fn)
}

P.every = function(fn) {
  return Object.values(this).every(fn)
}

P.toString = function(fn) {
  return JSON.stringify(this)
}

P.json = function(fn) {
  return JSON.stringify(this)
}

P.clone = function() { 
  return Object.assign({},this)
}

P.join = function(...obs) {
  const res = Object.assign({}, this)
  for(const o of obs) Object.entries(o).forEach(([k,v]) => res[k] &&= [].concat(res[k], v))
  return res
}

P.split = function() {
  const res = []
  for (const [k,v] of Object.entries(this)) v.forEach((v,i) => res[i] ? res[i][k] = v : res[i] = {[k] : v})
  return res
}

P.common = function(ob) {
  return Object.fromEntries(Object.entries(this).flatMap(([k,v]) => (ob[k] == v) ? [[k,v]] : []))
}

P.contains = function(ob) {
  for (const [k,v] of Object.entries(ob)) if (this[k] != v) return false
  return true
}

P.within = function(ob) {
  for (const [k,v] of Object.entries(this)) if (ob[k] != v) return false
  return true
}

P.equals = function(ob) {
  const entries = Object.entries(this)
  if (entries.length != Object.keys(ob).length) return false
  for (const [k,v] of entries) if (ob[k] != v) return false
  return true
}

P.size = function() {
  return Object.keys(this).length
}