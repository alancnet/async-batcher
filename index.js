/**
 * 
 * @param {function} fn Function that given an array of arguments, returns or resolves an array of results.
 * @param {Object} options
 * @param {Number} options.delay Interval in milliseconds to wait for additional input before batching. Default: 0
 * @param {Boolean} options.parallel To run simultaneously, or not to run simultaneously. That is the boolean.
 * @returns {Function} A function to call with an argument that will resolve with a result.
 */

function Batcher(fn, {
  delay = 0,
  parallel = false
} = {}) {
  let requests = new Map()

  let requesting = 0

  const check = () => {
    if ((!requesting || parallel) && requests.size) {
      requesting++
      const reqs = requests
      requests = new Map()
      const args = Array.from(reqs.keys())
      batcher.callCount++
      Promise.resolve(fn(args))
      .then(results => {
        if (!Array.isArray(results)) throw new Error('Callback must return an array')
        if (results.length !== args.length) throw new Error('Callback must return array of same length as input')
        results.forEach((result, index) => {
          reqs.get(args[index]).forEach(({resolve}) => resolve(result))
        })
      })
      .catch(error => {
        for (let req of reqs.values()) {
          for (let {reject} of req) {
            reject(error)
          }
        }
      })
      .then(() => {
        requesting--
        recheck()
      })
    }
  }

  const recheck = () => setTimeout(check, delay)

  const batcher = function(arg) {
    if (arguments.length !== 1) throw new Error('Expected one argument')
    recheck()
    return new Promise((resolve, reject) => {
      if (!requests.has(arg)) requests.set(arg, [])
      requests.get(arg).push({arg, resolve, reject})
    })
  }

  batcher.callCount = 0
  return batcher
}

module.exports = Batcher