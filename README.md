# `async-batcher`

Efficiently batch calls to an asynchronous function with configurable options.

## Installation

Install the package via npm:

```bash
npm install async-batcher
```

## Usage

`async-batcher` allows you to batch multiple calls to an asynchronous function, reducing overhead and improving performance.

### Example

```javascript
const Batcher = require('async-batcher');

// Create a batcher instance
const batcher = new Batcher((vals) => vals.map((x) => x + 1));

// Batch multiple calls
const results = await Promise.all([
  batcher(1),
  batcher(2),
]);

console.log(...results); // Output: 2 3
console.log(batcher.callCount); // Output: 1
```

## API

### `Batcher(fn, options)`

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

### Example with Options

```javascript
const Batcher = require('async-batcher');

const batcher = new Batcher(
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

## TypeScript Support

This package includes TypeScript type definitions. You can use it seamlessly in TypeScript projects:

```typescript
import Batcher from 'async-batcher';

const batcher = new Batcher<number, number>(
  async (vals) => vals.map((x) => x * 2),
  { delay: 50 }
);

const result = await batcher(5);
console.log(result); // Output: 10
```

## License

This project is licensed under the [ISC License](LICENSE).

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
