import type { ModeType } from "../constants/common.types";
import { isValidLogin } from "./validateLogin";

/**
 * Every `localStorage` read and write the app makes, validated at the boundary.
 *
 * `localStorage` is not internal state. It is writable by the visitor, by any
 * browser extension, and by every past version of this app — so a value coming
 * out of it is untrusted input, exactly like a URL parameter.
 * report/vulnerabilities/06.
 *
 * Two live failures this closes:
 *   - `JSON.parse(localStorage.getItem("staredProfiles") || "[]")` ran
 *     unguarded **during render**. Malformed JSON threw on the home page's
 *     first paint; a value that parses but is not an array (`"5"`) threw later
 *     at `.map`. Since S5 there is a root error boundary, so that would now be
 *     a themed "Something went wrong" rather than a white screen — still a
 *     dead app, on a bad byte nobody can see.
 *   - `localStorage.getItem("mode") as ModeType` is an assertion, not a check.
 *     A stored `"purple"` produced an incoherent half-dark theme, because the
 *     codebase compares against `"dark"` in some places and `"light"` in
 *     others.
 *
 * The starred list also flows into route params and from there into requests,
 * which makes storage a second, *persistent* source for the injection P07/P08
 * closed. `isValidLogin` is the same predicate guarding the route boundary and
 * the proxy — one definition, three consumers.
 */

/**
 * ⚠️ The misspelling is deliberate and load-bearing. This key is what every
 * existing visitor's list is stored under; renaming it silently discards their
 * data. The *code* spelling is fixed in P19 — this string is not.
 */
const STARRED_KEY = "staredProfiles";
const MODE_KEY = "mode";

export const readStarred = (): string[] => {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STARRED_KEY) ?? "[]"
    );
    if (!Array.isArray(parsed)) return [];
    // `isValidLogin` is a type predicate, so this filter produces `string[]`
    // with no cast. Entries that fail it are dropped — they could never have
    // resolved to a GitHub profile anyway.
    return [...new Set(parsed.filter(isValidLogin))];
  } catch {
    return [];
  }
};

export const writeStarred = (list: string[]): void => {
  try {
    window.localStorage.setItem(STARRED_KEY, JSON.stringify(list));
  } catch {
    // `setItem` genuinely throws: QuotaExceededError, and Safari's private
    // mode. Losing the persisted list is survivable; crashing is not.
  }
};

/**
 * Falls back to the system preference rather than to light. A first-time
 * visitor on a dark desktop now gets dark.
 */
export const readMode = (): ModeType => {
  const stored = window.localStorage.getItem(MODE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const writeMode = (mode: ModeType): void => {
  try {
    window.localStorage.setItem(MODE_KEY, mode);
  } catch {
    // See writeStarred.
  }
};
