// Object._log(message, filter, channel)
// objix is loaded by test/setup.js (see jest.config.js).

const { captureConsole } = require('./helpers')

describe('_log', () => {
  test('writes the formatted object to console.log', () => {
    const records = captureConsole(() => ({ a: 1 })._log())
    expect(records.length).toBe(1)
    expect(records[0].method).toBe('log')
    expect(records[0].args).toContain('{a:1}')
  })

  test('includes the message before the object', () => {
    const [record] = captureConsole(() => ({ a: 1 })._log('label'))
    expect(record.args).toEqual([expect.any(String), '-', 'label', '{a:1}'])
  })

  test('the message defaults to an empty string', () => {
    const [record] = captureConsole(() => ({ a: 1 })._log())
    expect(record.args[2]).toBe('')
  })

  test('prefixes a timestamp', () => {
    const [record] = captureConsole(() => ({ a: 1 })._log())
    expect(record.args[0]).toMatch(/^\w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2}$/)
  })

  test('returns this so calls can be chained', () => {
    const o = { a: 1 }
    let returned
    captureConsole(() => { returned = o._log() })
    expect(returned).toBe(o)
  })

  test('logs when the filter passes', () => {
    const records = captureConsole(() => ({ a: 1 })._log('m', o => o.a === 1))
    expect(records.length).toBe(1)
  })

  test('stays silent when the filter fails', () => {
    const records = captureConsole(() => ({ a: 1 })._log('m', o => o.a === 2))
    expect(records).toEqual([])
  })

  test('the filter receives the object', () => {
    let seen
    captureConsole(() => ({ a: 1 })._log('m', o => (seen = o, true)))
    expect(seen).toEqual({ a: 1 })
  })

  test('writes to the named console channel', () => {
    const [record] = captureConsole(() => ({ a: 1 })._log('m', null, 'trace'))
    expect(record.method).toBe('trace')
  })

  test.each(['info', 'error', 'debug', 'warn'])('supports the %s channel', channel => {
    const [record] = captureConsole(() => ({ a: 1 })._log('m', null, channel))
    expect(record.method).toBe(channel)
  })

  test('logs an array', () => {
    const [record] = captureConsole(() => [1, 2]._log())
    expect(record.args).toContain('[1,2]')
  })

  test('chained logs each produce a line', () => {
    const records = captureConsole(() => ({ a: 1 })._log('one')._log('two'))
    expect(records.map(r => r.args[2])).toEqual(['one', 'two'])
  })
})
