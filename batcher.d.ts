type BatcherOptions = {
  /** Interval in milliseconds to wait for additional input before batching. Default: 0 */
  delay?: number;

  /** To run simultaneously, or not to run simultaneously. Default: false */
  parallel?: boolean;

  /** Max number of requests per call. Default: Infinity */
  limit?: number;
};

type BatcherFunction<T, R> = {
  (arg: T): Promise<R>;
  /** Tracks the number of times the batcher function has been called */
  callCount: number;
};

/**
 * Creates a batching function.
 * @param fn Function that given an array of arguments, returns or resolves an array of results.
 * @param options Configuration options for the batcher.
 * @returns A function to call with an argument that will resolve with a result.
 */
declare function Batcher<T, R>(
  fn: (args: T[]) => R[] | Promise<R[]>,
  options?: BatcherOptions
): BatcherFunction<T, R>;

export = Batcher;