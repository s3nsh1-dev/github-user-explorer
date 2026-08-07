# Branch & Session Plan

**One session = one branch = one batch of plans that touch the same files.**

Plans are grouped by *files touched*, not by severity. That is the whole
optimisation: a session reads a set of files into context once, changes them
several times, and verifies once. Splitting plans that share files across
sessions means re-reading the same code, re-deriving the same context, and
resolving conflicts with yourself.

37 plans → **11 sessions**.

---

## How to start a session

```
Implement session S3 (plans P06 → P09 → P10 → P11) from
report/implementation_plans/. Read 00.INDEX.md for the rules, then each
plan file in order. Branch: fix/data-layer, off fix/request-safety.
```

*(S1 and S2 have landed — see `00.INDEX.md` for their SHAs and for what they
changed that later sessions must account for.)*

Then, in order:

1. `git checkout -b <branch>` off the previous session's branch (or `rework/2026` for S1)
2. Work the plans **in the listed order** — the order encodes dependencies
3. **One commit per plan**, message referencing it: `fix(security): encode user input in GitHub API URLs (P07)`
4. Verification gate after **every** plan: `cd client && npm run lint && npx tsc -b --noEmit && npm run build`
5. At the end, update `00.INDEX.md` — add ✅ + commit SHA to each plan's row
6. Merge before starting the next session

**Sessions are sequential, not parallel.** Later sessions assume earlier ones
landed. Running two at once on shared files will conflict.

---

## ⚠️ The stale-information warning

Every plan file now carries this at the top. Repeating it here because it is the
single most likely way a session goes wrong:

> **Line numbers and code excerpts in the plans describe the repo as of the
> audit snapshot (commit `1fa3e0f`, 2026-08-07).** Later plans edit files that
> earlier plans already changed. By the time a plan runs, its coordinates may
> have moved and its quoted code may already look different.
>
> - **Re-read the target file before editing.** Never patch by line number.
> - **Intent, acceptance criteria, and the Do NOT list are authoritative. Line numbers and code snippets are not.**
> - If a referenced bug appears already fixed — verify, note it, move on. Do not re-fix.
> - If reality differs materially from the plan, adapt and **say so in the completion report**.

This matters most in **S3, S5, S7, S8**, which touch files that **S1** and **S2**
have already rewritten. S1 and S2 have both landed, so this is no longer
hypothetical: **every hook file, `common.types.ts`, `Repositories.tsx`,
`DisplayRepoList.tsx`, `UserProfileRepos.tsx`, `LowerHomeUI.tsx` and the three
GraphQL consumer components have changed since the audit snapshot.** Each
affected session below carries an "Inherited from S2" block listing what is
actually true now.

---

## The 11 sessions

### ✅ S1 — Quick wins & foundations — **landed**
**Branch:** `fix/quick-wins` (off `rework/2026`) · **Risk:** none · **~1.5 h**
**Plans:** P00 → P01 → P02 → P03 → P04 → P28

Scattered one-file edits plus two leaf modules nothing imports yet. Grouped
because none of them interact, all are trivially verifiable, and together they
shrink the files every later session has to read.

| Plan | Touches |
|---|---|
| P00 | *(setup: `npm ci`, baseline capture, branch)* |
| P01 | `ShowSelectedRepo.tsx` — 3 attributes |
| P02 | dead code across 8 files, deletes `useFetchSearchUsers.ts`, `react.svg`, `vite.svg` |
| P03 | `LoadingSkeleton.tsx` |
| P04 | **new** `helper/validateLogin.ts` (leaf — nothing imports it yet) |
| P28 | `.env.development`, **new** `.env.example`, `vite-env.d.ts`, `npm i zod` |

⚠️ **P28 is split.** Steps 1-3, 5, 6 run here — the `zod` install is what P09
(S3) depends on. **Step 4** (server env schema) is deferred to **S4**, because
`netlify/functions/` does not exist yet.

---

### ✅ S2 — Request safety *(hook layer, part 1)* — **landed 2026-08-07**
**Branch:** `fix/request-safety` (off `fix/quick-wins`, **not yet merged**) · **Risk:** medium
**Plans:** P05 `05f757e` → P07 `b22c5dc` → P08 `7dc2c03` · docs `d343bbe`

Fixed the two highest-severity issues reachable without the proxy: **GraphQL
injection (V02)** and **URL tampering (V03)**. Gate (`npm run lint && npx tsc -b
--noEmit && npm run build`) green before every commit.

#### What shipped

| Plan | Result |
|---|---|
| **P05** | **All 8 fetch hooks** migrated to new `helper/githubFetch.ts` (`githubFetch<T>` / `githubGraphQL<T>`) + `helper/githubErrors.ts` (`GitHubError`, `NotFoundError`, `RateLimitError`). Zero `fetch(` left in `hooks/`, exactly **one** `import.meta.env` read in all of `client/src`. `githubGraphQL` returns `data`, so `ContributionChart`, `UserContributions`, `OrganizationTopRepos` and the two envelope types in `common.types.ts` each lost a `.data` hop. |
| **P07** | New `helper/githubUrls.ts` (`usersUrl`, `userReposUrl`, `repoUrl`, `searchUsersUrl`) — all 5 REST hooks build `URL` objects, no interpolation. New `helper/parsePage.ts` used by `Repositories.tsx` + `DisplayRepoList.tsx`. `UserProfileRepos` navigates to `/user/:owner/:repoName` with encoded segments. `LowerHomeUI` uses `createSearchParams`. |
| **P08** | New `constants/graphqlQueries.ts` — 3 static named documents (`OwnerType`, `Contributions`, `OrgTopRepos`); the 3 GraphQL hooks pass `{ login }` as variables. No interpolation anywhere in `hooks/`. |

#### How it was verified

Beyond the gate: headless Chrome against the dev server, with `api.github.com`
remapped to a local TLS stand-in (`--host-resolver-rules` + a self-signed cert)
so outbound request bodies could be read. **No app code was modified to test.**
The same PoCs were replayed against a throwaway worktree at `ac4186a` (pre-S2)
for a real before/after:

| PoC | Before (`ac4186a`) | After (`7dc2c03`) |
|---|---|---|
| `/user/a%22)%20%7B__typename%7D%20viewer…` | POST body contained a live `viewer {login email}` block → resolves to the token owner | Static `query OwnerType($login: String!)`; attack string inert in `variables.login` |
| `/user/x%2F..%2F..%2Forgs%2Fgithub` | request went to `api.github.com/orgs/github` | requests `/users/x%2F..%2F..%2Forgs%2Fgithub` — live API returns 404 |
| `?query=a%26per_page=100` | smuggled `&per_page=100&sort=…` as real params | one param, `q=a%26per_page%3D100` |
| `?page=abc` | `page=NaN` in the request URL | `page=1` |
| GraphQL 200 + `{data: null, errors: […]}` | `#root` empty — **actual white screen** (V05) | profile renders normally |

#### ⚠️ Deviations from the plans — read before S3

1. **`erasableSyntaxOnly` is on in `tsconfig.app.json`.** P05's sketch used
   constructor parameter properties (`constructor(readonly status?: number)`);
   those do not compile. The classes use declared fields + assignment. **Any
   later plan writing a class must do the same.**
2. **The index undercounted the hooks — it is 8, not 7.** `useFetchLoginType`
   was missed. All 8 are migrated, so this now only matters as a reminder to
   re-grep rather than trust a number. Same applies to **P34**'s "9
   `Authorization` headers" — there is now **1**.
3. **P05 left two deliberate type assertions.** `Repositories.tsx` (`as number`
   on `public_repos`) and `DisplayRepoList.tsx` (`as Repo[]`). Typing the fetch
   boundary exposed optionality that `any` had hidden; the real fixes are P09
   and P15. Both are **zero runtime change** — in particular
   `Math.ceil(undefined / 8)` still produces `NaN`, on purpose, so P15 has its
   bug to fix and P30 does not test prematurely-corrected behaviour.
   **P09/P15 must delete these assertions, not preserve them.**
4. **One acceptance criterion is half-met.** P05 wanted
   `/user/zzzz-not-a-real-user-zzzz` to render *an error*. The **crash is gone**
   (proven above), but the page renders **blank**, because `ProfileInfo` runs
   `if (!userData) return null;` ahead of its error check. That is exactly
   **P14**'s bug — left for S5.
5. **"Contribution graph still renders" could not be checked against real
   GitHub.** GraphQL requires auth and the client's `VITE_` token is
   intentionally absent until **P34**. Verified against the stand-in that the
   failure path degrades gracefully instead of crashing.
6. **One in-file tidy beyond the plan:** `useInfiniteUsers`' hard-coded `20` is
   now a `USERS_PER_PAGE` constant shared by the request and the
   `getNextPageParam` arithmetic. Same value, no behaviour change.

#### Seen but deliberately NOT fixed (still open for their owning plan)

- `["contributionInfo", username]` is still shared by `useFetchContributionInfo`
  and `useFetchOrganizationRepos` → **P06**
- `Pagination`'s own `Math.ceil(totalRepos / 8)` `NaN` → **P15**
- `LowerHomeUI`'s `alert()` and the `searchTerm.length` vs trimmed-length bug → **P20**
- No `isValidLogin` gate at the route boundary → **P16** (variables + encoding
  are the real fixes; validation is defence-in-depth and lands with the 404 page)
- `OrganizationTopRepos` still interpolates into outbound `github.com` hrefs —
  a rendered link, not an authenticated request. Unowned; note it if it matters.

---

### 🔵 S3 — Data layer *(hook layer, part 2)*
**Branch:** `fix/data-layer` · **Risk:** medium · **~3 h**
**Plans:** P06 → P09 → P10 → P11

Same 8 hook files again, plus `common.types.ts` and `main.tsx`. Fixes both
confirmed cache bugs, adds Zod schemas, deletes the duplicate `/users/:login`
hook, and sets the QueryClient retry policy.

Split from S2 deliberately: S2 is "requests are safe", S3 is "data is correct".
Two coherent PRs instead of one 6-hour context.

⚠️ Needs `zod` from **P28** (S1).

#### ⚠️ Inherited from S2 — the hooks are not what the plans describe

- **The hooks no longer call `fetch`.** They call `githubFetch<T>(url)` /
  `githubGraphQL<T>(query, variables)` from `helper/githubFetch.ts`, with URLs
  from `helper/githubUrls.ts`. **P09**'s "generics at the fetch boundary" means
  wrapping/validating inside those two functions — one place, not eight.
- **`githubGraphQL` returns `data`, not the envelope.** `OrganizationTop10ReposType`
  and `ContributionCalendarResponse` in `common.types.ts` already dropped their
  outer `data:` wrapper, and `LoginTypeResponse` is new. Zod schemas must model
  the unwrapped shape.
- **P06's collision is still live and untouched:** `useFetchContributionInfo`
  and `useFetchOrganizationRepos` both use `["contributionInfo", username]`.
- **P10** deletes one of `useFetchUserData` / `useFetchRepositories`. Both now
  call `githubFetch<GitHubApiUser>(usersUrl(username))` — genuinely identical
  requests, differing only in query key and return shape.
- **P11** should build its retry predicate on `instanceof NotFoundError` /
  `RateLimitError` from `helper/githubErrors.ts` — not on message strings.
  `RateLimitError` carries `resetAt`. Today an error costs **4 requests**
  (3 default retries), which is worth fixing given V07.
- **Delete, do not preserve, P05's two placeholder assertions:**
  `Repositories.tsx` `as number` and `DisplayRepoList.tsx` `as Repo[]`.
- ⚠️ **`erasableSyntaxOnly` bans constructor parameter properties.** Bites any
  new class.

---

### 🔴 S4 — Proxy & deploy — **THE CRITICAL FIX**
**Branch:** `fix/token-proxy` · **Risk:** high · **~5 h**
**Plans:** P28 (step 4 only) → P34 → P35

Closes **V01**, the exposed token. Earliest possible point — P34 depends on
P05/P07/P08/P09, so it cannot run before S3.

New territory: `netlify/functions/**`, `netlify.toml`.

⚠️ **P34's scope shrank in S2.** The plan says "strip all 8 `VITE_*` reads and 9
`Authorization` headers". After P05 there is **one** of each, both in
`client/src/helper/githubFetch.ts` — re-grep, do not trust those numbers. The
client-side work is now:

1. `helper/githubFetch.ts` — drop `TOKEN` and `authHeaders`, point at the proxy.
2. `helper/githubUrls.ts` — repoint the 4 builders' origin off `api.github.com`.
3. `constants/graphqlQueries.ts` — **move the 3 documents server-side.** The
   file carries this note already. A proxy that forwards a client-supplied
   `query` string is exactly as vulnerable as the pre-P08 code, with a secret
   token behind it. The client must send only `{ login }`.

Keep the encoding contract when rewriting the builders: path segments get
`encodeURIComponent`, query params get `URLSearchParams` and must **not** be
pre-encoded. Re-run S2's PoCs (`/user/x%2F..%2F..%2Forgs%2Fgithub`,
`?query=a%26per_page=100`) against the proxy — a proxy that reassembles paths by
string concatenation reintroduces **V03** server-side.

**Your manual step, before deploying:** add `GITHUB_TOKEN` in Netlify → Site
settings → Environment variables. Revoke the old token *after* this ships.

⚠️ **P35 must not merge before P34.** Its `connect-src 'self'` breaks a client
still calling `api.github.com` directly.

---

### 🟡 S5 — Error & empty states
**Branch:** `fix/error-states` · **Risk:** medium · **~3 h**
**Plans:** P12 → P13 → P14 → P15 → P16

Render paths across `page/` and `components/`. Fixes the blank-profile-page bug
(P14) and the pagination `NaN` bug (P15). P13's `<ErrorState>` is consumed by
P14 and P16, so they belong together.

#### ⚠️ Inherited from S2

- **P14's bug is confirmed reproducible.** `/user/zzzz-not-a-real-user-zzzz`
  renders a blank body today: the request correctly throws `NotFoundError`, but
  `ProfileInfo`'s `if (!userData) return null;` runs before its error check, so
  nothing renders. S2 killed the *crash*, not the blank page.
- **P13 has real error types to render:** `GitHubError` / `NotFoundError` /
  `RateLimitError` (`helper/githubErrors.ts`). Branch on `instanceof`, and use
  `RateLimitError.resetAt` for the "try again at …" case. This is also what
  closes **V09** — never render a raw `error.message` again.
- **P15 must delete the two S2 placeholder assertions**, not work around them:
  `Repositories.tsx` (`as number`) and `DisplayRepoList.tsx` (`as Repo[]`).
  `Pagination`'s `Math.ceil(totalRepos / 8)` still yields `NaN` — untouched on
  purpose.
- **`?page=abc` no longer reaches the network as `NaN`** — `helper/parsePage.ts`
  clamps it to 1 in `Repositories.tsx` and `DisplayRepoList.tsx`. P15 owns what
  `Pagination` does with a missing `totalRepos`, which is a different bug.
- **P16:** the `"demoUserName"` fallbacks are all still present and still the
  reason a bad login silently becomes a request. `helper/validateLogin.ts`
  (P04) is still an unimported leaf — P16 is where it finally gets used.

---

### 🟡 S6 — Context & storage
**Branch:** `fix/context-storage` · **Risk:** medium · **~2 h**
**Plans:** P17 → P18 → P19

Self-contained: `context/`, `hooks/useStaredUserList.ts`, and the 4 components
that consume them.

⚠️ **P18 fixes three bugs that currently cancel each other out.** Fixing the
lazy-`useState` alone freezes the list and the star button stops toggling. Read
P18's "Why" before touching anything. P19 is a pure rename — **zero behaviour
change in that commit**.

---

### 🟡 S7 — Search & scroll
**Branch:** `feat/search` · **Risk:** medium · **~3 h**
**Plans:** P20 → P21 → P37

`LowerHomeUI.tsx`, `Explorer.tsx`, `Navbar.tsx`, plus the new shared
`SearchBar.tsx`. Batched because P37 extracts P20's fixed form into the shared
component, and both P21 and P37 touch `Explorer.tsx`.

Must run **after S5** — P37 fills the empty states P16 creates.

⚠️ **Inherited from S2:** `LowerHomeUI`'s submit handler already navigates via
`createSearchParams` — **P20 must keep that** and not regress to a template
string. Its two actual bugs are untouched and still P20's: the `alert()`, and
the guard testing `searchTerm.length` instead of the trimmed length. When P37
extracts the shared `<SearchBar>`, `createSearchParams` goes with it.

---

### 🟡 S8 — Accessibility
**Branch:** `fix/a11y` · **Risk:** low-medium · **~2.5 h**
**Plans:** P22 → P23 → P24 → P25

Heavily overlapping files: `PageButton.tsx` appears in P22, P23 and P25;
`UserProfileStats.tsx` in P23 and P24. Splitting these would mean editing the
same components three times.

P25 makes one deliberate visual change (contribution-grid numbers → tooltips).

⚠️ **Inherited from S2:** `UserProfileRepos` now navigates to
`/user/:owner/:repoName` with both segments `encodeURIComponent`-ed, instead of
letting `full_name`'s raw `/` split itself across the route. **P23 must preserve
that shape** when it turns pagination and repo buttons into real `<Link>`s —
a `to` built from `repo.full_name` would reintroduce the segment escape that
P07 closed.

---

### 🟢 S9 — Assets & performance
**Branch:** `perf/assets` · **Risk:** medium · **~1.5 h**
**Plans:** P26 → P27

`client/src/assets/`, `client/public/`, `index.html`, `App.tsx`. Batched because
both are measured against the same P00 bundle baseline — measure once.

⚠️ P26 uses `git mv`, **never `rm`**, for the image masters. After P26, re-check
that `netlify.toml`'s `/assets/*` cache header from P35 still matches.

---

### 🟢 S10 — Tooling & CI
**Branch:** `chore/tooling` · **Risk:** low · **~3 h**
**Plans:** P29 → P30 → P31 → P32

`eslint.config.js`, `vite.config.ts`, `package.json`, `.github/**`, new test
files. Config-only; touches almost no application code.

**Must run after S8** — P29 enables `jsx-a11y`, and it should land green rather
than producing a wall of violations to triage. Same for P30: it runs after P15
so the tests assert *corrected* pagination behaviour.

⚠️ **Inherited from S2 — P30 has more pure logic to test than the plan lists:**
`helper/parsePage.ts` (`"abc"`, `"0"`, `"-3"`, `null` → `1`), and
`helper/githubUrls.ts`, where the highest-value assertions are the security
ones — `usersUrl("x/../../orgs/github")` must contain `%2F` and must **not**
normalise to `/orgs/github`, and `searchUsersUrl("a&per_page=100", 1)` must
carry that as a single `q` value. Those two tests are the regression guard for
**V03**; without them a later refactor can silently reopen it.

---

### 🟢 S11 — Docs & licence
**Branch:** `docs/readme` · **Risk:** none · **~1.5 h**
**Plans:** P36 → P33

`docs/`, `LICENSE`, `client/package.json`, `server/package.json`. P36 first — it
creates `docs/` and the compressed screenshots that P33 references.

P33 writes `docs/README.draft.md` and **does not touch `README.md`**. `report/`
is never linked (B7).

---

## Dependency graph between sessions

```
rework/2026
    └── S1  quick-wins ────────────────┐
            └── S2  request-safety     │
                    └── S3  data-layer │
                            ├── S4  token-proxy  🔴 CRITICAL
                            └── S5  error-states
                                    ├── S7  feat/search
                                    ├── S8  a11y ── S10  tooling
                                    └── S9  perf/assets
    S6  context-storage  ← only needs S1
    S11 docs/readme      ← only needs S1
```

**Critical path to the security fix: S1 → S2 → S3 → S4.** Four sessions.

**S6 and S11 are independent** — they only need S1. Run them any time you want a
short, low-risk session, or in parallel if you are careful to merge cleanly.

---

## Standalone plans (own branch, if you prefer smaller units)

These share no files with anything else and can be split out of their session
into a single-plan branch at any time:

| Plan | Branch | Touches | Why it's safe alone |
|---|---|---|---|
| P01 | `fix/rel-noopener` | 1 file, 3 lines | Nothing else touches those attributes |
| P03 | `fix/skeleton-animation` | 1 file | Self-contained component |
| P04 | `chore/login-validation` | 1 new file | Leaf module — nothing imports it yet |
| P32 | `chore/dependabot` | 1 new config | No source code at all |
| P36 | `docs/relocate-and-license` | moves + LICENSE | No source code |

Everything else shares files with at least one sibling — splitting those costs
more than it saves.

---

## Rules that apply to every session

1. **One plan, one commit.** Never bundle plans into one commit.
2. **Verification gate after each plan.** Lint + tsc + build, all green. No exceptions.
3. **Re-read files before editing.** The plans' line numbers are from the audit snapshot.
4. **Never touch anything outside the session's plan list.** Note it, move on.
5. **Do not add dependencies** beyond those named in a plan. Pre-approved: `zod` (P28), dev deps in P29/P30.
6. **`git mv`, never `rm`,** for anything that might be an only copy.
7. **Never print an env value** — in logs, errors, or commit messages. Field names only.
8. **Update `00.INDEX.md`** at session end with ✅ + SHA per landed plan.
9. **Report honestly.** Half-landed = say which half. Build broken = say so, with output.
10. **Do not commit to `main`.**

---

## Outstanding action (blocks no plan)

🔴 **Revoke the exposed PAT.** Confirmed live in the deployed bundle
(`/assets/index-CnEJiIFO.js`, 4 occurrences). Sequence so the site never breaks:
new no-scope token → add as `GITHUB_TOKEN` in Netlify → ship **S4** → revoke the
old one at <https://github.com/settings/tokens>. Check
<https://github.com/settings/security-log> too.
