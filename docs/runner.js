/*
  In-page runner for the objix docs.

  Replaces docsify-plugin-runkit, which stopped working when RunKit shut down
  its embed service. RunKit booted a remote Node VM and loaded objix into it;
  index.html already loads objix.min.js into this page, so the examples can just
  run here. No iframe, no network, no build step.

  Nothing is required in the markdown: cells are built from the `<pre>` elements
  docsify renders for ```javascript fences. If this file fails to load the docs
  still render as ordinary syntax-highlighted code.
*/
;(function () {
  const AsyncFn = Object.getPrototypeOf(async function () {}).constructor

  // Parse-check with the engine itself rather than counting brackets, which
  // gets strings, regexes and comments wrong.
  const compiles = src => {
    try { new AsyncFn(src); return true } catch { return false }
  }

  // An example starting with an object literal is not a valid *statement* — the
  // `{` opens a block — but instrument() emits it wrapped in parens, where it is
  // fine. Accept either, or one such line swallows the rest of the block into a
  // chunk that cannot parse at all.
  const parses = src => compiles(src) || compiles('(\n' + src + '\n)')

  const isComment = src => !src.replace(/\/\/.*$/gm, '').trim()

  /*
    Split a block into top-level statements by accumulating lines until they
    parse. A line opening a fluent chain parses on its own, so also require that
    the *next* line doesn't continue it — `._log('X')` after `{ a: 1 }` must stay
    part of the same statement.
  */
  const chunk = src => {
    const lines = src.split('\n')
    const out = []
    let cur = ''
    for (let i = 0; i < lines.length; i++) {
      cur = cur ? cur + '\n' + lines[i] : lines[i]
      if (!cur.trim()) { cur = ''; continue }
      const next = (lines[i + 1] || '').trim()
      if (parses(cur) && !/^[.?:)\]}]/.test(next)) { out.push(cur); cur = '' }
    }
    if (cur.trim()) out.push(cur)
    return out
  }

  /*
    Rebuild the block as one function body that reports each statement's value.
    One body, not one eval per statement, so `class`, `let`/`const` and top-level
    `await` all share a scope the way they do in the source.

    Most examples show their result in a trailing comment rather than logging, so
    without this echo they would appear to do nothing. Every injected `__report`
    call sits on its own line — appended to the end of a line it would land
    inside that trailing comment.
  */
  const instrument = chunks => chunks.map((src, i) => {
    if (isComment(src)) return src
    // A leading `;` only guards the parser against a line opening with `[` or
    // `{`; strip it so the expression underneath is still reported.
    const code = src.trim().replace(/^;+/, '').replace(/;\s*$/, '')
    if (!code) return src
    const declared = code.match(/^(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=/)
    if (declared) return src + '\n__report(' + i + ', ' + declared[1] + ')'
    // Statements have no value, and wrapping one in parens would not parse.
    if (/^(class|function|for|if|while|try|switch|do)\b/.test(code)) return src
    return '__report(' + i + ', (\n' + code + '\n))'
  }).join('\n')

  const format = v => {
    if (typeof v === 'string') return v
    if (v === null || v === undefined) return String(v)
    // _$ goes through JSON.stringify, which turns NaN and Infinity into null.
    if (typeof v !== 'object' && typeof v !== 'function') return String(v)
    // objix's own formatter is the notation the docs use, but it reads
    // enumerable keys only — an Error has none, so fall back to its message.
    if (v instanceof Error) return v.name + ': ' + v.message
    try { return v._$ ? v._$() : String(v) } catch { return String(v) }
  }

  // _log takes the console method as its third argument, and the docs use
  // 'trace' as well as the default 'log', so capture the whole family.
  const CONSOLE = ['log', 'info', 'warn', 'error', 'debug', 'trace']

  const isThenable = v => v && typeof v.then === 'function'

  const run = async (code, print) => {
    const saved = {}
    CONSOLE.forEach(name => {
      saved[name] = console[name]
      console[name] = (...args) => print(args.map(format).join(' '), 'log')
    })

    // Several examples settle after the block returns — `_wait(1)` takes a
    // second, and one uses setTimeout. Track the promises we hand out and stay
    // patched until they settle, so their output isn't lost.
    const pending = []
    const report = (_, value) => {
      // Nothing to show for a statement with no value, and printing the source
      // of a function that was merely defined is noise, not a result.
      if (value === undefined || typeof value === 'function') return
      if (isThenable(value)) {
        pending.push(value.then(
          v => print(format(v), 'value'),
          e => print(e instanceof Error ? e.name + ': ' + e.message : String(e), 'error')
        ))
        return
      }
      print(format(value), 'value')
    }

    try {
      const body = instrument(chunk(code))
      await new AsyncFn('__report', body)(report)
      await Promise.all(pending)
      // A bare setTimeout has nothing to await; give it a moment to land.
      if (/setTimeout|setInterval/.test(code)) {
        await new Promise(done => setTimeout(done, 1100))
      }
    } catch (e) {
      // objix's _trap throws strings, not Errors, so e.message may not exist.
      print(e instanceof Error ? e.name + ': ' + e.message : String(e), 'error')
    } finally {
      CONSOLE.forEach(name => { console[name] = saved[name] })
    }
  }

  // Some blocks show how to load objix under node. There is no `require` in a
  // page, and they are installation instructions rather than demonstrations, so
  // they stay as plain code.
  const isRunnable = src => !/\brequire\s*\(/.test(src)

  const build = pre => {
    const code = pre.querySelector('code')
    if (!code || pre.dataset.runnable || !isRunnable(code.textContent)) return
    pre.dataset.runnable = 'true'

    const cell = document.createElement('div')
    cell.className = 'runnable'

    const bar = document.createElement('div')
    bar.className = 'runnable-bar'

    const button = document.createElement('button')
    button.className = 'runnable-run'
    button.type = 'button'
    button.textContent = 'Run'

    const hint = document.createElement('span')
    hint.className = 'runnable-hint'
    hint.textContent = 'editable'

    const output = document.createElement('div')
    output.className = 'runnable-output'

    // Editing has to target the <code> element: docsify sets v-pre on the <pre>
    // and Prism's markup lives inside, so replacing it would drop highlighting.
    code.setAttribute('contenteditable', 'plaintext-only')
    code.setAttribute('spellcheck', 'false')

    const print = (text, kind) => {
      const line = document.createElement('div')
      line.className = 'runnable-line runnable-' + kind
      line.textContent = text
      output.appendChild(line)
    }

    button.addEventListener('click', async () => {
      output.textContent = ''
      output.classList.add('is-open')
      button.disabled = true
      button.textContent = 'Running'
      let printed = 0
      await run(code.textContent, (text, kind) => { printed++; print(text, kind) })
      if (!printed) print('(no value)', 'muted')
      button.disabled = false
      button.textContent = 'Run'
    })

    bar.appendChild(button)
    bar.appendChild(hint)
    pre.parentNode.insertBefore(cell, pre)
    cell.appendChild(pre)
    cell.appendChild(bar)
    cell.appendChild(output)
  }

  const style = `
    .runnable { margin: 1em 0; }
    .runnable pre[data-lang] { margin-bottom: 0; }
    .runnable code[contenteditable]:focus { outline: none; }
    .runnable-bar { display: flex; align-items: center; gap: 10px; padding: 6px 0; }
    .runnable-run {
      font: inherit; font-size: 13px; cursor: pointer; padding: 3px 14px;
      border: 1px solid currentColor; border-radius: 4px;
      background: none; color: inherit; opacity: .75;
    }
    .runnable-run:hover:enabled { opacity: 1; }
    .runnable-run:disabled { cursor: default; opacity: .4; }
    .runnable-hint { font-size: 12px; opacity: .45; }
    .runnable-output:empty { display: none; }
    .runnable-output {
      font-family: Roboto Mono, Monaco, courier, monospace; font-size: 13px;
      line-height: 1.5; padding: 8px 12px; border-left: 2px solid currentColor;
      opacity: .9; white-space: pre-wrap; word-break: break-word;
    }
    .runnable-error { color: #c33; }
    .runnable-muted, .runnable-log { opacity: .65; }
  `

  const install = () => {
    const tag = document.createElement('style')
    tag.textContent = style
    document.head.appendChild(tag)
  }

  if (window.$docsify) {
    install()
    const plugin = hook => {
      // doneEach, not ready: it fires again after every route change, and build()
      // skips any <pre> it has already wrapped.
      hook.doneEach(() => {
        document.querySelectorAll('pre[data-lang="javascript"]').forEach(build)
      })
    }
    window.$docsify.plugins = [].concat(window.$docsify.plugins || [], plugin)
  }
})()
