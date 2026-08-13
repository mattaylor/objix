// Shared helpers for the objix test suite.
//
// objix itself is loaded by test/setup.js (see jest.config.js), so files that
// only need the prototype methods do not have to import anything.

/**
 * Capture console output produced while `fn` runs.
 *
 * Returns an array of `{ method, args }` records in call order. Every console
 * method _log can target is patched, and the originals are always restored, even
 * if `fn` throws.
 */
const captureConsole = fn => {
  const methods = ['log', 'trace', 'info', 'error', 'debug', 'warn']
  const saved = {}
  const calls = []

  for (const m of methods) {
    saved[m] = console[m]
    console[m] = (...args) => calls.push({ method: m, args })
  }

  try {
    fn()
  } finally {
    for (const m of methods) console[m] = saved[m]
  }

  return calls
}

module.exports = { captureConsole }
