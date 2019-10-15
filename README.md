# async-batcher

Batch calls to an async function.

```javascript
const Batcher = require('async-batcher')

const batcher = new Batcher(vals => vals.map(x => x + 1))

const twoThree = await Promise.all([
  batcher(1),
  batcher(2)
])
console.log(...twoThree, batcher.callCount) // 2 3 1
```