const
  O = Object,
  K = O.keys,
  A = O.assign,
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
    for (let k in this) r[k] = f(this[k],k)
    return r
  },

	has(o,d) {
    return this.find(v => v.eq(o))
  },

	filter(f, r={}) {
    for (let k in this) if (f(this[k],k)) r[k] = this[k]
    return r
  },

	flatMap(f) {
    return O.fromEntries(K(this).flatMap(k => f(k,this[k])))
  },

	clean() {
    return this.filter(v => v)
  },

	is(t, i) {
    return t == O ? !i && ![Number,String,Boolean,Function,Symbol].includes(this.constructor)
      : this.constructor == t || !i && this instanceof t
  },

	find(f) {
    for (let k in this) if (f(this[k],k)) return k
  },

	extend(...a) {
    return A({}, ...a).map((v,k) => this[k] ?? v, this)
  },

	delete(...a) {
    for (let k of a) delete this[k]
    return this
  },

  clone(d) {
    return !this.is(O) ? this.valueOf()
      : this.constructor == Array ? this.map(v => (d && v) ? v.clone(d-1) : v)
      : this.size() ? this.map(v => (d && v) ? v.clone(d-1) : v, new this.constructor)
      : new this.constructor(this)
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

	same(o) {
    return this.filter((v,k) => v.eq(o[k]))
  },

  diff(o) {
    return this.filter((v,k) => !v.eq(o[k]))
  },

	contains(o, d) {
    return o.every((v,k) => this[k]?.eq(v)) || d && this.some(v => v.contains(o, d-1))
  },

	eq(o, d) {
    return this == o || o
      && this.constructor == o.constructor
      && this.size() == o.size()
      && !(this-o)
      && this.every((v,k) => v == o[k] || d && v?.eq(o[k],d-1))
  },

	size() {
    return K(this).length
  },

	keyBy(a, k) {
    a.map(o => this[o[k]] = this[o[k]] ? [o].concat(this[o[k]]) : o)
    return this
  },
  
  at(p) {
    return p.split('.').reduce((v,c) => v[c], this)
  },

  $(s) {
    return s ? s.is(String) ? s.replace(/\${?([\w\.]+)}?/g, (m,p) => this.at(p).$()) 
      : (s.stringify || s)(this)
      : this.$(JSON).replace(/["\\]/g,'')
  },
  
  memo(e) {
    return e ? (...a) => this[a.$()] ??= (this.wait(e).then(t => delete t[a.$()]),this(...a)) : this
  },
  
  bind(k, f, e) {
    def(this, k, (function(...a) { return f(...a, this)}).memo(e))
    return this
  },

	log(m='', f, c='log') {
    (!f || f(this)) && console[c](new Date().$().slice(0,-8), m, this.clone())
    return this
  },

  try(f,c) {
    try { return f(this) ?? this } catch(e) { return (!c || c(e,this)) || this } 
  },

	new (o) {
    return this._t ? new Proxy(this._t.new(o), this._h) : A(this.create(),o)
  },

  wait(d) {
    return new Promise((s,f) => d.is(Number) ? setTimeout(() => s(this), s*1000) : (d = d(this,s,f)) && s(d))
  },

	trap(f, e, ...p) {
    return new Proxy(this, {
      set(t,k,v) {
        if ((!p[0] || p.has(k)) && !f(v,k,t) && e) throw(e+' '+[k,v].$())
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

let def = (o,k,v) => (O.defineProperty(o, k, { writable:true, value:v }),v)

O.prototype[Symbol.iterator] = function() { return this.values()[Symbol.iterator]() }

for (let m in M) {
  [m,'__'+m].map(k => def(O.prototype,k,M[m]))
  try { module.exports[m] = (o, ...a) => o['__'+m](...a) } catch {}
}
