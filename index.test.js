const BatcherFactory = require('./batcher');
const FIFO = require('./fifo');

describe('Batcher', () => {
  test('should batch calls and return correct results', async () => {
    const batcher = new BatcherFactory(vals => vals.map(x => x + 1));

    const results = await Promise.all([batcher(1), batcher(2)]);
    expect(results).toEqual([2, 3]);
    expect(batcher.callCount).toBe(1);
  });

  test('should handle single calls correctly', async () => {
    const batcher = new BatcherFactory(vals => vals.map(x => x + 1));

    const result = await batcher(1);
    expect(result).toBe(2);
    expect(batcher.callCount).toBe(1);
  });

  test('should respect the limit option', async () => {
    const batcher = new BatcherFactory(vals => vals.map(x => x + 1), { limit: 2 });

    const results = await Promise.all([batcher(1), batcher(2), batcher(3)]);
    expect(results).toEqual([2, 3, 4]);
    expect(batcher.callCount).toBe(2);
  });

  test('should throw an error if callback does not return an array', async () => {
    const batcher = new BatcherFactory(() => 42);

    await expect(batcher(1)).rejects.toThrow('Callback must return an array');
  });

  test('should throw an error if callback returns array of incorrect length', async () => {
    const batcher = new BatcherFactory(() => [42, 34]);

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