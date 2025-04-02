const { createBatcher, createSeries } = require('./batcher');
const FIFO = require('./fifo');

describe('createBatcher', () => {
  test('should batch calls and return correct results', async () => {
    const batcher = createBatcher(vals => vals.map(x => x + 1));

    const results = await Promise.all([batcher(1), batcher(2)]);
    expect(results).toEqual([2, 3]);
    expect(batcher.callCount).toBe(1);
  });

  test('should handle single calls correctly', async () => {
    const batcher = createBatcher(vals => vals.map(x => x + 1));

    const result = await batcher(1);
    expect(result).toBe(2);
    expect(batcher.callCount).toBe(1);
  });

  test('should respect the limit option', async () => {
    const batcher = createBatcher(vals => vals.map(x => x + 1), { limit: 2 });

    const results = await Promise.all([batcher(1), batcher(2), batcher(3)]);
    expect(results).toEqual([2, 3, 4]);
    expect(batcher.callCount).toBe(2);
  });

  test('should throw an error if callback does not return an array', async () => {
    const batcher = createBatcher(() => 42);

    await expect(batcher(1)).rejects.toThrow('Callback must return an array');
  });

  test('should throw an error if callback returns array of incorrect length', async () => {
    const batcher = createBatcher(() => [42, 34]);

    await expect(batcher(1)).rejects.toThrow('Callback must return array of same length as input');
  });
});

describe('FIFO', () => {
  test('should add and remove elements in FIFO order', () => {
    const queue = new FIFO();

    queue.push(1);
    queue.push(2);
    queue.push(3);

    expect(queue.shift()).toBe(1);
    expect(queue.shift()).toBe(2);
    expect(queue.shift()).toBe(3);
    expect(queue.isEmpty()).toBe(true);
  });

  test('should correctly handle unshift and pop', () => {
    const queue = new FIFO();

    queue.unshift(1);
    queue.unshift(2);
    queue.unshift(3);

    expect(queue.pop()).toBe(1);
    expect(queue.pop()).toBe(2);
    expect(queue.pop()).toBe(3);
    expect(queue.isEmpty()).toBe(true);
  });

  test('should clear all elements', () => {
    const queue = new FIFO();

    queue.push(1);
    queue.push(2);
    queue.push(3);

    queue.clear();
    expect(queue.isEmpty()).toBe(true);
  });

  test('should iterate over elements with forEach', () => {
    const queue = new FIFO();

    queue.push(1);
    queue.push(2);
    queue.push(3);

    const elements = [];
    queue.forEach(value => elements.push(value));

    expect(elements).toEqual([1, 2, 3]);
  });

  test('should convert to array', () => {
    const queue = new FIFO();

    queue.push(1);
    queue.push(2);
    queue.push(3);

    expect(queue.toArray()).toEqual([1, 2, 3]);
  });
});

describe('createSeries', () => {
  test('should process calls one at a time and return correct results', async () => {
    const series = createSeries(async (val) => val + 1);

    const result1 = await series(1);
    const result2 = await series(2);
    const result3 = await series(3);

    expect(result1).toBe(2);
    expect(result2).toBe(3);
    expect(result3).toBe(4);
  });

  test('should process calls one at a time with sleep and return correct results', async () => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let runnning = 0;
    const series = createSeries(async (val) => {
      runnning++;
      if (runnning > 1) throw new Error('Only one call should be processed at a time');
      await sleep(100); // Simulate async delay
      runnning--;
      return val + 1;
    });

    const [result1, result2, result3] = await Promise.all([
      series(1),
      series(2),
      series(3)
    ]);

    expect(result1).toBe(2);
    expect(result2).toBe(3);
    expect(result3).toBe(4);
  });

  test('should handle errors correctly', async () => {
    const series = createSeries(async (val) => {
      if (val === 2) throw new Error('Test error');
      return val + 1;
    });

    const result1 = await series(1);
    await expect(series(2)).rejects.toThrow('Test error');
    const result3 = await series(3);

    expect(result1).toBe(2);
    expect(result3).toBe(4);
  });

  test('should maintain call order', async () => {
    const results = [];
    const series = createSeries(async (val) => {
      results.push(val);
      return val + 1;
    });

    await Promise.all([series(1), series(2), series(3)]);

    expect(results).toEqual([1, 2, 3]); // Ensures calls are processed in order
  });
});