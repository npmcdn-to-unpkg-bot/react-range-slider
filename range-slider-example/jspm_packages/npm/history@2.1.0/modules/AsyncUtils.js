/* */ 
"format cjs";
export function loopAsync(turns, work, callback) {
  let currentTurn = 0, isDone = false
  let sync = false, hasNext = false, doneArgs

  function done() {
    isDone = true
    if (sync) {
      // Iterate instead of recursing if possible.
      doneArgs = [ ...arguments ]
      return
    }

    callback.apply(this, arguments)
  }

  function next() {
    if (isDone) {
      return
    }

    hasNext = true
    if (sync) {
      // Iterate instead of recursing if possible.
      return
    }

    sync = true

    while (!isDone && currentTurn < turns && hasNext) {
      hasNext = false
      work.call(this, currentTurn++, next, done)
    }

    sync = false

    if (isDone) {
      // This means the loop finished synchronously.
      callback.apply(this, doneArgs)
      return
    }

    if (currentTurn >= turns && hasNext) {
      isDone = true
      callback()
    }
  }

  next()
}