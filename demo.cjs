const Batcher = require('./batcher.js')

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

;(async function withLimit () {
  const batcher = new Batcher(vals => vals.map(x => x + 1), {limit: 2})

  const oneTwoThreeFour = await Promise.all([
    batcher(1),
    batcher(2),
    batcher(3),
    batcher(4)
  ])
  console.log(...oneTwoThreeFour, batcher.callCount) // 2 3 4 5 2
})()