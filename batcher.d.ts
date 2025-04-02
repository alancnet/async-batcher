interface IBatcherOptions {
  /** Interval in milliseconds to wait for additional input before batching. Default: 0 **/
  delay?: number

  /** To run simultaneously, or not to run simultaneously. That is the boolean. */
  parallel?: boolean

  /** Max number of requests per call. Default: Infinity **/
  limit?: number
}

// // AsyncBatcher should be callable as a function or as a constructor
interface BatcherInstance extends Function {
  callCount: number
}

type Batcher<T, U> = ((item: T) => Promise<U>) & BatcherInstance

declare const BatcherFactory: {
  new <T, U>(fn: (items: T[]) => (Promise<U[]> | U[]), options?:IBatcherOptions): Batcher<T, U>
} & {
  <T, U>(fn: (items: T[]) => (Promise<U[]> | U[]), options?:IBatcherOptions): Batcher<T, U>
}

export type { Batcher };
export default BatcherFactory;