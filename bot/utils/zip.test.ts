import { assertEquals } from "../../deps.ts";
import { zip, zipLongest } from "./zip.ts";

function* count() {
  let count = 0;
  for (;;) {
    yield count++;
  }
}
function* range(stop: number) {
  for (let i = 0; i < stop; i++) {
    yield i;
  }
}

function* take<T>(n: number, iterator: Iterable<T>) {
  let count = n;
  for (const value of iterator) {
    if (count-- > 0) {
      yield value;
    } else {
      break;
    }
  }
}

Deno.test("zip", () => {
  assertEquals([...zip("123", count())], [
    ["1", 0],
    ["2", 1],
    ["3", 2],
  ]);
  assertEquals([...zip("abc", range(6))], [
    ["a", 0],
    ["b", 1],
    ["c", 2],
  ]);
  assertEquals([...zip("abcdef", range(3))], [
    ["a", 0],
    ["b", 1],
    ["c", 2],
  ]);
  assertEquals([...zip("abcdef")], [["a"], ["b"], ["c"], ["d"], ["e"], ["f"]]);
  assertEquals([...zip("abcdef", range(5), range(3))], [
    ["a", 0, 0],
    ["b", 1, 1],
    ["c", 2, 2],
  ]);
});

Deno.test("zipLongest", () => {
  assertEquals([...take(5, zipLongest("123", count()))], [
    ["1", 0],
    ["2", 1],
    ["3", 2],
    [undefined, 3],
    [undefined, 4],
  ]);
  assertEquals([...zipLongest("abc", range(6))], [
    ["a", 0],
    ["b", 1],
    ["c", 2],
    [undefined, 3],
    [undefined, 4],
    [undefined, 5],
  ]);
  assertEquals([...zipLongest("abcdef", range(3))], [
    ["a", 0],
    ["b", 1],
    ["c", 2],
    ["d", undefined],
    ["e", undefined],
    ["f", undefined],
  ]);
  assertEquals([...zipLongest("abcdef")], [["a"], ["b"], ["c"], ["d"], ["e"], ["f"]]);
  assertEquals([...zipLongest("abcdef", range(5), range(3))], [
    ["a", 0, 0],
    ["b", 1, 1],
    ["c", 2, 2],
    ["d", 3, undefined],
    ["e", 4, undefined],
    ["f", undefined, undefined],
  ]);
  assertEquals([...zipLongest("abcdef", range(5), range(3), null)], [
    ["a", 0, 0],
    ["b", 1, 1],
    ["c", 2, 2],
    ["d", 3, null],
    ["e", 4, null],
    ["f", null, null],
  ]);
  assertEquals([...zipLongest("abcdef", range(5), range(3), undefined)], [
    ["a", 0, 0],
    ["b", 1, 1],
    ["c", 2, 2],
    ["d", 3, undefined],
    ["e", 4, undefined],
    ["f", undefined, undefined],
  ]);
  assertEquals([...zipLongest("abcdef", range(5), range(3), {})], [
    ["a", 0, 0],
    ["b", 1, 1],
    ["c", 2, 2],
    ["d", 3, {}],
    ["e", 4, {}],
    ["f", {}, {}],
  ]);
});
