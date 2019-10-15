const Batcher = require('.')

;(async function simple () {
  const batcher = new Batcher(vals => vals.map(x => x + 1))

  const two = await batcher(1)
  const three = await batcher(2)
  console.log(two, three, batcher.callCount) // 2 3 2
})()

;(async function array () {
  const batcher = new Batcher(vals => vals.map(x => x + 1))

  const twoThree = await Promise.all([
    batcher(1),
    batcher(2)
  ])
  console.log(...twoThree, batcher.callCount) // 2 3 1
})()

;(async function asFunction () {
  const batcher = Batcher(vals => vals.map(x => x + 1))

  const two = await batcher(1)
  const three = await batcher(2)
  console.log(two, three, batcher.callCount) // 2 3 2
})()
