import { describe, expect, it } from "vitest";
import { isValidLogin, isValidRepoName } from "./validateLogin";

/**
 * These two predicates guard three things at once: the browser route, the
 * proxy's upstream request, and what comes back out of localStorage. Loosening
 * them re-opens report/vulnerabilities/02 and 03; tightening them can make a
 * real GitHub account unreachable. Both directions are tested.
 */
describe("isValidLogin", () => {
  it.each(["torvalds", "s3nsh1-dev", "a", "x-y-z", "microsoft", "a".repeat(39)])(
    "accepts %s",
    (value) => expect(isValidLogin(value)).toBe(true)
  );

  it.each([
    "-lead",
    "trail-",
    "dou--ble",
    "a".repeat(40),
    "",
    "has space",
    "under_score",
  ])("rejects %s", (value) => expect(isValidLogin(value)).toBe(false));

  it("rejects undefined", () => {
    expect(isValidLogin(undefined)).toBe(false);
  });

  // vulnerabilities/02 — this string used to be interpolated into a GraphQL
  // document and executed as a second query against the token's own account.
  it("rejects a GraphQL injection payload", () => {
    expect(isValidLogin('a") { __typename } viewer { login email }')).toBe(
      false
    );
  });

  // vulnerabilities/03 — this used to be interpolated into an API URL, which
  // the URL parser then normalised into a different endpoint entirely.
  it("rejects path traversal", () => {
    expect(isValidLogin("x/../../orgs/github")).toBe(false);
    expect(isValidLogin("../admin")).toBe(false);
  });

  it("rejects smuggled query parameters", () => {
    expect(isValidLogin("a&per_page=100")).toBe(false);
  });
});

describe("isValidRepoName", () => {
  it.each(["react", "linux", "my_repo.js", "a-b.c_d", "a".repeat(100)])(
    "accepts %s",
    (value) => expect(isValidRepoName(value)).toBe(true)
  );

  it.each(["", "a".repeat(101), "with space", "a/b"])(
    "rejects %s",
    (value) => expect(isValidRepoName(value)).toBe(false)
  );

  // `.` and `..` match the character class but are path segments, not names.
  it("rejects the relative path segments", () => {
    expect(isValidRepoName(".")).toBe(false);
    expect(isValidRepoName("..")).toBe(false);
  });
});
