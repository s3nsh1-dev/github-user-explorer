import { describe, expect, it } from "vitest";
import { PER_PAGE, pageWindow, repoPageLink, totalPageCount } from "./paginate";

/**
 * This is the arithmetic that was actually broken. `Math.ceil(undefined / 8)`
 * is NaN, and `NaN <= 3` and `NaN > 3` are *both* false — so neither branch
 * ran, no page numbers rendered, and the "last page" link pointed at
 * `?page=NaN`. The NaN cases below are the regression guard.
 */
describe("totalPageCount", () => {
  it.each([
    [0, 0],
    [1, 1],
    [PER_PAGE, 1],
    [PER_PAGE + 1, 2],
    [100, 13],
  ])("%i repos → %i pages", (repos, expected) =>
    expect(totalPageCount(repos)).toBe(expected)
  );

  it("returns 0 rather than NaN for a value that is not a count", () => {
    expect(totalPageCount(NaN)).toBe(0);
    expect(totalPageCount(undefined as unknown as number)).toBe(0);
    expect(totalPageCount(-5)).toBe(0);
  });
});

describe("pageWindow", () => {
  it.each([
    [1, 1, [1]],
    [1, 3, [1, 2, 3]],
    [1, 10, [1, 2, 3]],
    [5, 10, [5, 6, 7]],
    [9, 10, [8, 9, 10]],
    [10, 10, [8, 9, 10]],
  ])("page %i of %i → %j", (page, total, expected) =>
    expect(pageWindow(page, total)).toEqual(expected)
  );

  it("clamps a page number from outside the range", () => {
    expect(pageWindow(999, 10)).toEqual([8, 9, 10]);
    expect(pageWindow(-3, 10)).toEqual([1, 2, 3]);
  });

  it("returns nothing when there are no pages", () => {
    expect(pageWindow(1, 0)).toEqual([]);
    expect(pageWindow(1, NaN)).toEqual([]);
  });

  it("never returns more than three numbers", () => {
    for (let total = 1; total <= 40; total++) {
      for (let page = 1; page <= total; page++) {
        expect(pageWindow(page, total).length).toBeLessThanOrEqual(3);
      }
    }
  });
});

describe("repoPageLink", () => {
  it("builds the repositories URL", () => {
    expect(repoPageLink("torvalds", 2)).toBe(
      "/user/torvalds?tab=repositories&page=2"
    );
  });

  // The login arrives from a route param. A raw "/" would escape the segment
  // and point the link at a different route — the same class of bug as
  // vulnerabilities/03, one layer up.
  it("encodes the login", () => {
    const link = repoPageLink("x/../../orgs/github", 1);
    expect(link).toContain("%2F");
    expect(link).not.toContain("/orgs/github");
  });
});
