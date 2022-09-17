Object.prototype.map = function(fn) { 
  return Object.fromEntries(Object.entries(this).map(([k,v]) => [k,fn(v,k)])) 
}

Object.prototype.apply = function(fn) {
  Object.entries(this).map(([k,v]) => this[k] = fn(v,k))
  return this
}

Object.prototype.values = function(fn) {
  return Object.values(this)
}

Object.prototype.keys = function() {
  return Object.keys(this)
}

Object.prototype.entries = function() {
  return Object.entries(this)
}

Object.prototype.filter = function(fn) {
  return Object.fromEntries(Object.entries(this).flatMap(([k,v]) => fn(v,k) ? [[k,v]] : []))
}

Object.prototype.flatMap = function(fn) {
  return Object.fromEntries(Object.entries(this).flatMap(([k,v]) => fn(k,v)))
}

Object.prototype.find = function(fn) {
  for (const [k,v] of Object.entries(this)) if (fn(v,k)) return k
}

Object.prototype.assign = function(...obs) {
  return Object.assign({}, this, ...obs)
}

Object.prototype.merge = function(...obs) {
  return Object.assign({}, ...obs, this)
}

Object.prototype.patch = function(...obs) {
  return Object.assign(this, ...obs)
}

Object.prototype.delete = function(...keys) {
  for (const k of keys) delete this[k]
  return this
}

Object.prototype.some = function(fn) {
  return Object.values(this).some(fn)
}

Object.prototype.every = function(fn) {
  return Object.values(this).every(fn)
}

Object.prototype.toString = function(fn) {
  return JSON.stringify(this)
}

Object.prototype.json = function(fn) {
  return JSON.stringify(this)
}

Object.prototype.clone = function() { 
  return Object.assign({},this)
}

Object.prototype.join = function(...obs) {
  const res = Object.assign({}, this)
  for(const o of obs) Object.entries(o).forEach(([k,v]) => res[k] &&= [].concat(res[k], v))
  return res
}

Object.prototype.split = function() {
  const res = []
  for (const [k,v] of Object.entries(this)) v.forEach((v,i) => res[i] ? res[i][k] = v : res[i] = {[k] : v})
  return res
}

Object.prototype.common = function(ob) {
  return Object.fromEntries(Object.entries(this).flatMap(([k,v]) => (ob[k] == v) ? [[k,v]] : []))
}

Object.prototype.contains = function(ob) {
  for (const [k,v] of Object.entries(ob)) if (this[k] != v) return false
  return true
}

Object.prototype.within = function(ob) {
  for (const [k,v] of Object.entries(this)) if (ob[k] != v) return false
  return true
}

Object.prototype.equals = function(ob) {
  const entries = Object.entries(this)
  if (entries.length != Object.keys(ob).length) return false
  for (const [k,v] of entries) if (ob[k] != v) return false
  return true
}

Object.prototype.size = function() {
  return Object.keys(this).length
}