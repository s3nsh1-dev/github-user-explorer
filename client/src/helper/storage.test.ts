import { beforeEach, describe, expect, it, vi } from "vitest";
import { readMode, readStarred, writeMode, writeStarred } from "./storage";

/**
 * localStorage is untrusted input: the visitor can edit it, so can any
 * extension, and so could every past version of this app. Before
 * report/vulnerabilities/06 was closed, a malformed value threw during render
 * on the home page's first paint.
 */
describe("readStarred", () => {
  beforeEach(() => localStorage.clear());

  it("returns the stored logins", () => {
    localStorage.setItem("staredProfiles", '["torvalds","octocat"]');
    expect(readStarred()).toEqual(["torvalds", "octocat"]);
  });

  it("returns [] when nothing is stored", () => {
    expect(readStarred()).toEqual([]);
  });

  it.each(["{", "not json", "5", '"a string"', "null", "{}"])(
    "returns [] for %s instead of throwing",
    (raw) => {
      localStorage.setItem("staredProfiles", raw);
      expect(readStarred()).toEqual([]);
    }
  );

  it("drops entries that could never be a GitHub login", () => {
    localStorage.setItem(
      "staredProfiles",
      '[1,null,{},"-bad-","x/../../orgs/github","torvalds"]'
    );
    expect(readStarred()).toEqual(["torvalds"]);
  });

  it("dedupes", () => {
    localStorage.setItem("staredProfiles", '["torvalds","torvalds"]');
    expect(readStarred()).toEqual(["torvalds"]);
  });

  // The misspelling is deliberate and load-bearing — renaming the key discards
  // every existing visitor's list.
  it("still reads the staredProfiles key", () => {
    writeStarred(["torvalds"]);
    expect(localStorage.getItem("staredProfiles")).toBe('["torvalds"]');
  });
});

describe("readMode", () => {
  const withSystemDark = (matches: boolean) => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({ matches } as MediaQueryList)
    );
  };

  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it.each(["light", "dark"] as const)("returns the stored %s", (mode) => {
    writeMode(mode);
    withSystemDark(mode === "light");
    expect(readMode()).toBe(mode);
  });

  it("falls back to the system preference when nothing is stored", () => {
    withSystemDark(true);
    expect(readMode()).toBe("dark");
    withSystemDark(false);
    expect(readMode()).toBe("light");
  });

  it("falls back rather than trusting a junk value", () => {
    localStorage.setItem("mode", "purple");
    withSystemDark(true);
    expect(readMode()).toBe("dark");
  });
});
