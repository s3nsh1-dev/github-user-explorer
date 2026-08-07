# Project Audit — GitHub User Explorer

Full read of `client/`, `server/`, and the build/deploy setup as of commit
`1fa3e0f` (branch `rework/2026`). 10 vulnerabilities, 13 suggestions.

Every finding lists the exact files it touches and — where a fix conflicts with
another fix or with an existing feature — a **Contradictions & trade-offs**
section. Those conflicts are real; several fixes break each other if applied in
the wrong order.

---

## 📌 Current status — 2026-08-07

Six of eleven implementation sessions have landed (**S1–S6**, plans P00–P19 plus
P28/P34/P35). Every finding below now carries its own **Current status** section
with a per-item breakdown; this is the roll-up.

| Finding | Status |
|---|---|
| **V01** PAT in the bundle | ✅ **Finished** — proxy shipped *and* the exposed token revoked |
| **V02** GraphQL injection | ✅ Finished |
| **V03** URL tampering | ✅ Finished |
| **V04** Security headers | ✅ Finished |
| **V05** Unhandled API errors | ✅ Finished |
| **V06** Untrusted localStorage | ✅ Finished |
| **V07** Rate-limit exhaustion | 🟡 Partial — everything except request throttling (7a) |
| **V08** Reverse tabnabbing | ✅ Finished in code; the lint guard is pending |
| **V09** Error-message disclosure | ✅ Finished |
| **V10** Secret & dependency hygiene | 🟡 Partial — secrets done, dependency automation not |
| **S01** Backend proxy | ✅ Finished (as Netlify Functions, not Express) |
| **S02** Cache-key collisions | ✅ Finished |
| **S03** Loading/error ordering | ✅ Finished |
| **S04** Fetch-boundary types | ✅ Finished (Zod) |
| **S05** Search UX | ⏳ Pending — S7 |
| **S06** Starred-users state | ✅ Finished |
| **S07** Assets & bundle | ⏳ Pending — S9 |
| **S08** README & portfolio | ⏳ Pending — S11 |
| **S09** Accessibility | ⏳ Pending — S8 |
| **S10** Empty & 404 states | ✅ Finished (bar the shared search box, deferred to S7) |
| **S11** Tests & CI | ⏳ Pending — S10 |
| **S12** Dead code & hygiene | 🟡 Partial — code clean, repo root not yet |
| **S13** Deployment config | ✅ Mostly — the anti-flash script (13d) is open |

**Seven of the eight "confirmed bugs found along the way" below are fixed** —
the repo-detail cache key, the blank profile page, the pagination `NaN`, the
skeleton animation, the unreachable JSX, the duplicate profile request, and the
white screen on a non-existent user. The eighth, the search box validating an
untrimmed length, is **still open** and owned by S7.

**Not owned by any plan, and still open:** `npm audit`'s 13 advisories, the dead
`server/` stub, the offline/`navigator.onLine` state, and the repo's own GitHub
security settings.

The **"Suggested order"** section below was written before any of this and is
kept as the original reasoning. What actually happened is recorded in
[`branch-info.md`](branch-info.md) and
[`implementation_plans/00.INDEX.md`](implementation_plans/00.INDEX.md); steps 1,
2, 3 and 5 are done, step 4 is half done, and steps 6 and 7 are what remains.

---


## Vulnerabilities

| # | Finding | Severity |
|---|---|---|
| 01 | [GitHub PAT shipped inside the client bundle](vulnerabilities/01.exposed-github-token.md) | 🔴 Critical |
| 02 | [GraphQL query injection via URL-controlled `username`](vulnerabilities/02.graphql-query-injection.md) | 🟠 High |
| 03 | [Unencoded input in REST URLs → endpoint redirection](vulnerabilities/03.api-url-tampering.md) | 🟠 High |
| 04 | [No CSP or hardening headers on the deployed site](vulnerabilities/04.missing-security-headers.md) | 🟡 Medium |
| 05 | [Unhandled API error shapes crash the whole app](vulnerabilities/05.unhandled-api-errors.md) | 🟡 Medium |
| 06 | [Client storage treated as trusted input](vulnerabilities/06.untrusted-localstorage.md) | 🟡 Medium |
| 07 | [Uncontrolled request volume, no rate-limit handling](vulnerabilities/07.rate-limit-exhaustion.md) | 🟡 Medium |
| 08 | [`target="_blank"` without `rel="noopener noreferrer"`](vulnerabilities/08.reverse-tabnabbing.md) | 🟢 Low |
| 09 | [Raw error objects rendered to the user](vulnerabilities/09.error-message-disclosure.md) | 🟢 Low |
| 10 | [Secret & dependency hygiene](vulnerabilities/10.secret-and-dependency-hygiene.md) | 🔵 Info |

## Suggestions

| # | Suggestion | Impact |
|---|---|---|
| 01 | [Build the backend proxy `server/` is promising](suggestions/01.backend-api-proxy.md) | 🔴 High |
| 02 | [React Query cache keys are colliding](suggestions/02.query-key-collisions.md) | 🟠 High |
| 03 | [Loading and error guards are in the wrong order](suggestions/03.loading-error-state-ordering.md) | 🟠 High |
| 04 | [The type system stops at the fetch boundary](suggestions/04.api-response-type-safety.md) | 🟠 High |
| 05 | [Search UX: debounce, validation, in-profile search](suggestions/05.search-ux-and-debounce.md) | 🟡 Medium |
| 06 | [Starred-users context is mounted twice](suggestions/06.starred-users-state.md) | 🟡 Medium |
| 07 | [11 MB of images and a 1.4 MB favicon](suggestions/07.asset-and-bundle-weight.md) | 🔴 High |
| 08 | [The README is a single `<img>` tag](suggestions/08.readme-and-portfolio-polish.md) | 🔴 High |
| 09 | [Accessibility gaps](suggestions/09.accessibility.md) | 🟡 Medium |
| 10 | [Empty states, 404s, and `"demoUserName"`](suggestions/10.empty-and-notfound-states.md) | 🟡 Medium |
| 11 | [No tests, no CI](suggestions/11.testing-and-ci.md) | 🟡 Medium |
| 12 | [Dead code and repository hygiene](suggestions/12.repo-hygiene-and-dead-code.md) | 🟢 Low |
| 13 | [Deployment config, SPA fallback, social metadata](suggestions/13.deployment-config.md) | 🟠 High |

---

## Confirmed bugs found along the way

Not security issues, but wrong behaviour a visitor can hit:

| Bug | Location |
|---|---|
| Repo detail page shows another owner's repo (cache key omits `username`) | [`useShowIndividualRepo.ts:17`](../client/src/hooks/useShowIndividualRepo.ts#L17) |
| Profile page renders blank while loading **and** on error (guards ordered after `if (!userData) return null`) | [`ProfileInfo.tsx:49-52`](../client/src/page/ProfileInfo.tsx#L49) |
| `Math.ceil(undefined / 8)` → `NaN` → pagination renders no page numbers, "last page" links to `?page=NaN` | [`Pagination.tsx:15`](../client/src/components/Pagination.tsx#L15) |
| Search accepts `"  a  "` — validates the untrimmed length, navigates with the trimmed value | [`LowerHomeUI.tsx:27-33`](../client/src/components/LowerHomeUI.tsx#L27) |
| Skeleton animation never runs — `animation: "pulse …"` with no `@keyframes pulse` anywhere | [`LoadingSkeleton.tsx:39`](../client/src/components/LoadingSkeleton.tsx#L39) |
| Unreachable JSX: `{!hasNextPage && …}` nested inside `{hasNextPage && …}` | [`Explorer.tsx:110-114`](../client/src/page/Explorer.tsx#L110) |
| Two hooks fetch the identical URL under different keys → every profile load costs 2 requests | [`useFetchUserData.ts`](../client/src/hooks/useFetchUserData.ts) / [`useFetchRepositories.ts`](../client/src/hooks/useFetchRepositories.ts) |
| Non-existent GitHub user → GraphQL returns HTTP 200 with `data: null` → `TypeError` → white screen | [`ContributionChart.tsx:8`](../client/src/components/ContributionChart.tsx#L8) |

## What is already right

Worth saying, because it is not the norm:

- **No XSS sink anywhere.** No `dangerouslySetInnerHTML`, no `eval`, no
  `innerHTML`. All API and user strings go through JSX text nodes.
- **No secret ever committed.** Verified across all branches with
  `git log --all -p -S`. `.gitignore` is thorough and correct.
- **`tsconfig` is strict** — `strict`, `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch` all on. (It just can't see past `fetch`; see
  suggestion 04.)
- **`rel="noopener noreferrer"` is correct in 3 of 4 places** — only
  `ShowSelectedRepo` missed it.
- **Search fires on submit, not on keystroke** — better than the debounced
  search-as-you-type the project's own `guide.txt` planned.
- **`LoadingSkeleton` mirrors the real contribution-grid layout** rather than
  showing a generic spinner. Good instinct; it just needs its keyframes.

---

## Suggested order

The dependencies between fixes matter more than the severities.

**1 — Contain (today, ~30 min)**

Revoke the token, clear it from the host, check the security log.
[Vuln 01](vulnerabilities/01.exposed-github-token.md).
Nothing else matters until this is done.

**2 — Decide the architecture (blocks most of the rest)**

Backend proxy, or drop the token and lose the contribution graph?
[Suggestion 01](suggestions/01.backend-api-proxy.md) lays out both. Every hook
rewrite below depends on the answer.

**3 — One hook-layer pass**

Vulns [02](vulnerabilities/02.graphql-query-injection.md),
[03](vulnerabilities/03.api-url-tampering.md),
[05](vulnerabilities/05.unhandled-api-errors.md),
[07](vulnerabilities/07.rate-limit-exhaustion.md) and suggestions
[02](suggestions/02.query-key-collisions.md),
[04](suggestions/04.api-response-type-safety.md) all edit the same eight files.
Doing them separately means four conflicting refactors. Order within the pass:
URLs → keys → types → error handling → proxy.

**4 — Visible quality**

[Suggestion 03](suggestions/03.loading-error-state-ordering.md) (the blank
profile page), [07](suggestions/07.asset-and-bundle-weight.md) (11 MB of
images), [10](suggestions/10.empty-and-notfound-states.md) (404s and empty
states). These are what a reviewer actually experiences.

**5 — Deploy config**

Vuln [04](vulnerabilities/04.missing-security-headers.md) and suggestion
[13](suggestions/13.deployment-config.md) edit the same file — do them together,
and remember the CSP hash for the anti-flash inline script.

**6 — The README**

[Suggestion 08](suggestions/08.readme-and-portfolio-polish.md) is the highest
return per hour in this entire report. Do it once step 1 is done, and only link
back to this folder once the critical item is closed.

**7 — Everything else**

[06](suggestions/06.starred-users-state.md),
[09](suggestions/09.accessibility.md),
[11](suggestions/11.testing-and-ci.md),
[12](suggestions/12.repo-hygiene-and-dead-code.md), and vulns
[06](vulnerabilities/06.untrusted-localstorage.md),
[08](vulnerabilities/08.reverse-tabnabbing.md),
[09](vulnerabilities/09.error-message-disclosure.md),
[10](vulnerabilities/10.secret-and-dependency-hygiene.md).

---

## Cross-cutting contradictions

The conflicts most likely to cause wasted work:

| Conflict | Resolution |
|---|---|
| Fixing vuln 01 alone **raises** vuln 02's severity — the token becomes secret, and injection becomes the way to abuse it | Ship 01 and 02 together |
| Suggestion 05 wants to keep and fix `useFetchSearchUsers`; suggestion 12 wants to delete it as dead code | Decide whether search suggestions are on the roadmap, then do one or the other |
| Vuln 05 says "throw the detailed GraphQL error"; vuln 09 says "don't show it to the user" | Both: throw detail to logs, render a classified generic message |
| Suggestion 06's lazy `useState` fix breaks the star toggle unless `checkStared` switches to state in the same commit | Treat 6b and 6c as one change |
| Suggestion 13's anti-flash inline script violates vuln 04's `script-src` | Add a SHA-256 hash, never `'unsafe-inline'` |
| Suggestion 07 deletes `extra/`; suggestion 08 wants those images as README screenshots | Compress and move to `docs/screenshots/` |
| Suggestion 11 (tests) written against current code would lock in the bugs from suggestions 02 and 03 | Fix first, then test the corrected behaviour |
| Vuln 10's `.env.example` documents a variable vuln 01 says should stop existing | Add it now with a deprecation note; delete the entry when the proxy lands |
| Backend proxy centralises the rate limit into one shared token pool (vuln 07) | Ship proxy caching in the same change, not later |
