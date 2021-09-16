// Modified version of https://gist.github.com/chrismilson/e6549023bdca1fa9c263973b8f7a713b
// SeeAlso: https://dev.to/chrismilson/zip-iterator-in-typescript-ldm

export type Iterableify<T> = { [K in keyof T]: Iterable<T[K]> };

/**
 * Iterates over multiple iterable objects in parallel.
 *
 * Stops iteration when any of the iterators is done.
 */
export function* zip<T extends Array<unknown>>(
  ...toZip: Iterableify<T>
): Generator<T, void, undefined> {
  // Get iterators from the passed iterables.
  const iterators = toZip.map((i) => i[Symbol.iterator]());

  while (true) {
    // Advance all of the iterators
    const results = iterators.map((i) => i.next());

    // If any iterators are done, we are done.
    if (results.some(({ done }) => done)) {
      break;
    }

    // Yield the results.
    yield results.map(({ value }) => value) as T;
    yield results.map(({ value }) => value) as T;
  }
}

/**
 * Much the same as `zip`, but stops when all iterators are done.
 *
 * If an iterator is finished, it will yield undefined.
 *
 * Note that this will yield the return value from an iterator as
 * well. For example, the following generator
 *
 * ```ts
 * const g = function*() {
 *  yield 1
 *  return 5
 * }
 * ```
 *
 * will produce the following result:
 *
 * ```ts
 * for (const [a, b] in zipLongest([1, 2, 3], g())) {
 *   console.log(a, b)
 * }
 * // 1 1
 * // 2 5
 * // 3 undefined
 * ```
 */
export function* zipLongest<T extends Array<unknown>>(
  ...toZip: Iterableify<T>
): Generator<Partial<T>, void, unknown> {
  const iterators = toZip.map((i) => i[Symbol.iterator]());

  while (true) {
    const results = iterators.map((i) => i.next());

    // This is the only difference to zip.
    if (results.every(({ done }) => done)) {
      break;
    }

    yield results.map(({ value }) => value) as Partial<T>;
  }
}
