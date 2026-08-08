import { describe, expect, it } from "vitest";
import { parsePage } from "./parsePage";
import {
  repoUrl,
  searchUsersUrl,
  userReposUrl,
  usersUrl,
} from "./githubUrls";

/**
 * The highest-value assertions in this file are the security ones. Every URL
 * the client builds used to be a template string, and
 * `https://api.github.com/users/${"x/../../orgs/github"}` is normalised by the
 * URL parser into a *different endpoint* — one that still carried the
 * Authorization header. Without these two tests a later refactor can reopen
 * report/vulnerabilities/03 silently.
 */
describe("githubUrls", () => {
  it("sends every parameter in the query string, never in the path", () => {
    expect(usersUrl("torvalds").pathname).toBe("/api/users");
    expect(usersUrl("torvalds").searchParams.get("login")).toBe("torvalds");
  });

  it("does not let a login escape its parameter", () => {
    const url = usersUrl("x/../../orgs/github");
    expect(url.pathname).toBe("/api/users");
    expect(url.toString()).toContain("%2F");
    expect(url.toString()).not.toContain("/orgs/github");
    // Round-trips exactly: the server sees the string, not a path.
    expect(url.searchParams.get("login")).toBe("x/../../orgs/github");
  });

  it("keeps a smuggled parameter inside the q value", () => {
    const url = searchUsersUrl("a&per_page=100", 1);
    expect(url.searchParams.get("q")).toBe("a&per_page=100");
    expect(url.searchParams.get("per_page")).toBe("20");
  });

  it("keeps GitHub's search qualifiers intact", () => {
    const url = searchUsersUrl("location:india followers:>100", 1);
    expect(url.searchParams.get("q")).toBe("location:india followers:>100");
  });

  it("encodes both segments of a repo request", () => {
    const url = repoUrl("facebook", "react");
    expect(url.searchParams.get("owner")).toBe("facebook");
    expect(url.searchParams.get("name")).toBe("react");
  });

  it("passes paging through as numbers", () => {
    const url = userReposUrl("torvalds", 3, 8);
    expect(url.searchParams.get("page")).toBe("3");
    expect(url.searchParams.get("per_page")).toBe("8");
  });
});

/**
 * `parseInt("abc", 10)` is NaN, and that NaN used to travel straight into the
 * request URL as `?page=NaN`.
 */
describe("parsePage", () => {
  it.each([
    ["2", 2],
    ["1", 1],
    ["abc", 1],
    ["0", 1],
    ["-3", 1],
    ["", 1],
    [null, 1],
    [undefined, 1],
  ])("%s → %i", (raw, expected) => expect(parsePage(raw)).toBe(expected));

  it("never returns NaN", () => {
    expect(Number.isNaN(parsePage("NaN"))).toBe(false);
  });
});
