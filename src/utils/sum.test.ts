import { expect, test, it } from "vitest";
import { sum, add } from "./sum";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);

  expect(add()).toBe(0);
  expect(add(1)).toBe(1);
  expect(add(1, 2, 3)).toBe(6);
  it("test");
});
