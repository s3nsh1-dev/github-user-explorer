import { describe, expect, it } from "vitest";
import { mapGitHubResponse, NOT_PROVIDED } from "./simplifyGitHubResponse";
import type { GitHubApiUser } from "../constants/common.types";

const apiUser = (over: Partial<GitHubApiUser> = {}): GitHubApiUser =>
  ({
    login: "torvalds",
    node_id: "MDQ6VXNlcjEwMjQwMjU=",
    avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4",
    html_url: "https://github.com/torvalds",
    name: "Linus Torvalds",
    bio: null,
    company: null,
    location: null,
    blog: null,
    email: null,
    twitter_username: null,
    hireable: null,
    type: "User",
    created_at: "2011-09-03T15:26:22Z",
    updated_at: "2026-08-01T10:00:00Z",
    followers: 1,
    following: 0,
    public_repos: 12,
    public_gists: 0,
    repos_url: "https://api.github.com/users/torvalds/repos",
    followers_url: "https://api.github.com/users/torvalds/followers",
    following_url: "https://api.github.com/users/torvalds/following{/other_user}",
    starred_url: "https://api.github.com/users/torvalds/starred{/owner}{/repo}",
    ...over,
  }) as GitHubApiUser;

describe("mapGitHubResponse", () => {
  it("keeps the values GitHub provided", () => {
    const user = mapGitHubResponse(apiUser({ location: "Portland, OR" }));
    expect(user.username).toBe("torvalds");
    expect(user.name).toBe("Linus Torvalds");
    expect(user.location).toBe("Portland, OR");
    expect(user.public_repos).toBe(12);
  });

  it.each(["bio", "company", "location", "email", "x_handle"] as const)(
    "substitutes the sentinel for a null %s",
    (field) => expect(mapGitHubResponse(apiUser())[field]).toBe(NOT_PROVIDED)
  );

  /**
   * This documents real behaviour rather than asserting an opinion: GitHub
   * returns `null` for most accounts and `false` for the rest, and the app
   * says the same thing for both. ProfileInfo compares against NOT_PROVIDED,
   * so the sentinel and the mapper have to agree — they used to disagree, and
   * every account without an X handle got a live link to
   * https://x.com/🚫 Not Provided.
   */
  it.each([
    [null, "🧑‍💻 Busy Learning"],
    [false, "🧑‍💻 Busy Learning"],
    [true, "📨 Actively Applying"],
  ])("maps hireable %s", (hireable, expected) =>
    expect(mapGitHubResponse(apiUser({ hireable })).hireable).toBe(expected)
  );

  it("renames node_id and login onto the view model", () => {
    const user = mapGitHubResponse(apiUser());
    expect(user.id).toBe("MDQ6VXNlcjEwMjQwMjU=");
    expect(user.login).toBe("torvalds");
    expect(user.joined).toBe("2011-09-03T15:26:22Z");
    expect(user.lastActive).toBe("2026-08-01T10:00:00Z");
  });
});
