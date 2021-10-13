// Modified version of https://gist.github.com/chrismilson/e6549023bdca1fa9c263973b8f7a713b
// SeeAlso: https://dev.to/chrismilson/zip-iterator-in-typescript-ldm
// SeeAlso: https://github.com/joeltg/ziterable

export type Zipped<T, U = never> = { [k in keyof T]: T[k] extends Iterable<infer V> ? V | U : never };

/**
 * Returns a generator that aggregates elements from each of the iterables.
 */
export function* zip<T extends Iterable<unknown>[]>(
  ...iterables: T
): Generator<Zipped<T>, void, undefined> {
  // Get iterators from the passed iterables.
  const iterators = iterables.map((i) => i[Symbol.iterator]());

  for (;;) {
    const results = iterators.map((i) => i.next());
    if (results.some(({ done }) => done)) {
      break;
    }
    yield results.map(({ value }) => value) as Zipped<T>;
  }
}

export type ZippedWithFiller<T, U> = T extends Iterable<unknown>[]
  ? U extends Iterable<unknown> ? Zipped<[...T, U], undefined> : Zipped<T, U>
  : never;

/**
 * Returns a generator that aggregates elements from each of the iterables.
 * If the iterables are of uneven length, missing values are filled-in with
 * fillvalue.  If the last argument is not `Iterable`, use it for fillvalue,
 * otherwise use `undefined`.  Iteration continues until the longest iterable is
 * exhausted.
 */
export function* zipLongest<T extends Iterable<unknown>[], U>(
  ...iterablesOrFiller: [...T, U]
): Generator<ZippedWithFiller<T, U>, void, undefined> {
  const isIterable = (obj: unknown): obj is Iterable<unknown> =>
    obj != undefined && !!((obj as Iterable<unknown>)[Symbol.iterator]);
  const iterators = iterablesOrFiller.filter(isIterable).map((i) => i[Symbol.iterator]());
  const filler = iterablesOrFiller.find((i) => !isIterable(i));

  for (;;) {
    const results = iterators.map((i) => i.next());
    if (results.every(({ done }) => done)) {
      break;
    }
    yield results.map(({ value }) => value ?? filler) as ZippedWithFiller<T, U>;
  }
}
