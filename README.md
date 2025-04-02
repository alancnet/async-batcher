# `async-batcher`

Efficiently batch calls to an asynchronous function with configurable options.

## Installation

Install the package via npm:

```bash
npm install async-batcher
```

## Usage

`async-batcher` provides two utilities: `createBatcher` and `createSeries`. These utilities allow you to manage asynchronous calls efficiently, either by batching them or enforcing sequential execution.

### Example: `createBatcher`

```javascript
const { createBatcher } = require('async-batcher');

// Create a batcher instance
const batcher = createBatcher((vals) => vals.map((x) => x + 1));

// Batch multiple calls
const results = await Promise.all([
  batcher(1),
  batcher(2),
]);

console.log(...results); // Output: 2 3
console.log(batcher.callCount); // Output: 1
```

### Example: `createSeries`

```javascript
const { createSeries } = require('async-batcher');

// Create a series instance
const series = createSeries(async (val) => val + 1);

// Process calls one at a time
const result1 = await series(1);
const result2 = await series(2);
const result3 = await series(3);

console.log(result1, result2, result3); // Output: 2 3 4
```

## API

### `createBatcher(fn, options)`

Creates a batching function.

#### Parameters

- **`fn`**: `(args: T[]) => R[] | Promise<R[]>`  
  A function that takes an array of arguments and returns (or resolves to) an array of results.

- **`options`**: `BatcherOptions` *(optional)*  
  Configuration options for the batcher.

  - **`delay`**: `number` *(default: `0`)*  
    Interval in milliseconds to wait for additional input before batching.

  - **`parallel`**: `boolean` *(default: `false`)*  
    Whether to allow multiple batches to run simultaneously.

  - **`limit`**: `number` *(default: `Infinity`)*  
    Maximum number of requests per batch.

#### Returns

A callable function `(arg: T) => Promise<R>` with the following property:

- **`callCount`**: `number`  
  Tracks the number of times the batcher function has been called.

### `createSeries(fn)`

Creates a function that enforces sequential execution of asynchronous calls.

#### Parameters

- **`fn`**: `(arg: T) => R | Promise<R>`  
  A function that takes a single argument and returns (or resolves to) a result.

#### Returns

A callable function `(arg: T) => Promise<R>`.

### Example with `createBatcher` Options

```javascript
const { createBatcher } = require('async-batcher');

const batcher = createBatcher(
  async (vals) => vals.map((x) => x * 2),
  { delay: 100, parallel: true, limit: 5 }
);

const results = await Promise.all([
  batcher(1),
  batcher(2),
  batcher(3),
]);

console.log(results); // Output: [2, 4, 6]
console.log(batcher.callCount); // Output: 1
```

### Example with `createSeries`

```javascript
const { createSeries } = require('async-batcher');

const series = createSeries(async (val) => {
  console.log(`Processing ${val}`);
  return val * 2;
});

const result1 = await series(1);
const result2 = await series(2);
const result3 = await series(3);

console.log(result1, result2, result3); // Output: 2 4 6
```

## TypeScript Support

This package includes TypeScript type definitions. You can use it seamlessly in TypeScript projects:

```typescript
import { createBatcher, createSeries } from 'async-batcher';

const batcher = createBatcher<number, number>(
  async (vals) => vals.map((x) => x * 2),
  { delay: 50 }
);

const result = await batcher(5);
console.log(result); // Output: 10

const series = createSeries<number, number>(async (val) => val * 2);
const seriesResult = await series(5);
console.log(seriesResult); // Output: 10
```

## License

This project is licensed under the [ISC License](LICENSE).

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
