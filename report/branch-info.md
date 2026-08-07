# Branch & Session Plan

**One session = one branch = one batch of plans that touch the same files.**

Plans are grouped by *files touched*, not by severity. That is the whole
optimisation: a session reads a set of files into context once, changes them
several times, and verifies once. Splitting plans that share files across
sessions means re-reading the same code, re-deriving the same context, and
resolving conflicts with yourself.

37 plans → **11 sessions**. Five have landed.

---

## How to start a session

```
Implement session S6 (plans P17 → P18 → P19) from
report/implementation_plans/. Read 00.INDEX.md for the rules, then each
plan file in order. Branch: fix/context-storage, off fix/error-states.
```

*(S1, S2, S3, S4 and S5 have landed — see `00.INDEX.md` for their SHAs and for
what they changed that later sessions must account for.)*

Then, in order:

1. `git checkout -b <branch>` **off the previous session's tip** (or `rework/2026` for S1). This is the step that actually matters — see [Branch topology & merge state](#branch-topology--merge-state--verified-2026-08-07).
2. Work the plans **in the listed order** — the order encodes dependencies
3. **One commit per plan**, message referencing it: `fix(security): encode user input in GitHub API URLs (P07)`
4. Verification gate after **every** plan: `cd client && npm run lint && npx tsc -b --noEmit && npm run build`
5. At the end, update `00.INDEX.md` — add ✅ + commit SHA to each plan's row
6. Merge down to `rework/2026` when convenient. **This is publishing, not a
   precondition.** As long as step 1 cut the branch from the previous session's
   tip, the next session already has everything it needs and can start
   immediately. Skipping the merge costs you a longer stacked PR, nothing more.

**Sessions are sequential, not parallel.** Later sessions assume earlier ones
landed. Running two at once on shared files will conflict.

---

## Branch topology & merge state — verified 2026-08-07

**Nothing is wrong. There is no conflict, and nothing is missing.**

S1 was never merged down into `rework/2026`, but **S2 was branched directly off
`fix/quick-wins`**, so `fix/request-safety` already contains every S1 commit.
Step 6 above ("merge before starting the next session") is about publishing a
session to the integration branch — it is *not* a precondition for the next
session, as long as the next branch is cut from the previous session's tip
rather than from `rework/2026`. That is what happened.

```
rework/2026 (27c9555)
 └─ d32addb  P00  ┐
    928fad0  P01  │
    f828f7a  P02  ├─ S1  fix/quick-wins → ac4186a
    4cfac47  P03  │
    9183b81  P04  │
    07e7274  P28  │
    ac4186a  docs ┘
     └─ 05f757e  P05  ┐
        b22c5dc  P07  ├─ S2  fix/request-safety → 914cf4a
        7dc2c03  P08  │
        d343bbe  docs │
        a8d7431  docs │
        914cf4a  docs ┘
         └─ 44d69ef  P06  ┐
            65f6110  P09  ├─ S3  fix/data-layer → c3ec6a1
            79ee65c  P10  │
            39a310b  P11  │
            c3ec6a1  docs ┘
             └─ 4e04276  P28.4 ┐
                2babbf0  P34   ├─ S4  fix/token-proxy → 8bd9e85
                3523d8d  P35   │
                8bd9e85  docs ┘
                 └─ 4e8cd8a  P12  ┐
                    7f93792  P13  │
                    9370e9c  P14  ├─ S5  fix/error-states → 4ebeb89  ← HEAD
                    9157683  P15  │
                    4ebeb89  P16  ┘
```

Completely linear. No merge commits, no divergence.

**S3 was cut from `914cf4a`, not `a8d7431`.** The S2 summary below names
`a8d7431` because that was the tip when it was written; a docs-only commit
(`914cf4a`) landed on `fix/request-safety` afterwards. `914cf4a` is a descendant
of `a8d7431`, so branching from it is the same instruction — "the previous
session's tip" — and loses nothing.

| Check | Result |
|---|---|
| `git merge-base --is-ancestor fix/quick-wins fix/request-safety` | ✅ exit 0 — S1 is an ancestor of S2 |
| `git merge-base fix/quick-wins fix/request-safety` | `ac4186a` — **the tip of `fix/quick-wins`**, i.e. S2 was cut from it |
| `git log fix/request-safety..fix/quick-wins` | empty — **no S1 commit is missing from S2** |
| `git rev-list --left-right --count rework/2026...fix/request-safety` | `0  12` — S2 is 12 ahead, 0 behind |
| S1 artefacts on `fix/request-safety` | ✅ `.env.example`, `helper/validateLogin.ts`, `_baseline.txt` present; `useFetchSearchUsers.ts` / `react.svg` / `vite.svg` still deleted; 3 × `rel="noopener noreferrer"`; `zod` in `package.json` |

**`git merge fix/quick-wins` while on `fix/request-safety` would print
"Already up to date." and do nothing.** Merging an ancestor is a no-op by
definition — do not run it expecting a merge commit, and do not create one with
`--no-ff` just to have a record. The history already is the record.

### What this *does* leave outstanding

`rework/2026` is still sitting at `27c9555` and has received **neither** S1
**nor** S2. One decision, whenever you want to publish:

- **Merge `fix/request-safety` into `rework/2026`** — a **fast-forward** that
  lands S1 and S2 together, in order, in one move. Simplest, and correct.
- **Or land them as two PRs** (`fix/quick-wins` → `rework/2026`, then
  `fix/request-safety` → `rework/2026`). Also fine, but this is a **stacked
  PR**: until the first merges, the second one's diff shows S1's commits too.
  Review S1 first, and merge in that order — never the reverse.

Either way, **do not rebase any of these branches.** S3 was cut from
`fix/request-safety` and S4 from `fix/data-layer`; rewriting their
SHAs invalidates every SHA recorded in `00.INDEX.md` and in this file.

*(Written before S3. Still accurate after S5 — `rework/2026` has received none of
S1–S5, and a merge of `fix/error-states` into it remains a single fast-forward
landing all five in order.)*

**S4 was cut from `c3ec6a1`, not `39a310b`.** Same situation as S3: the S3
summary names `39a310b` because that was the tip when it was written, and a
docs-only commit landed after. `c3ec6a1` is a descendant, so "the previous
session's tip" is the same instruction and loses nothing.

**S5 was cut from `8bd9e85`, not `3523d8d`** — the same pattern for the fourth
time. It is now the norm, not the exception: **read the branch tip with
`git rev-parse`, never the SHA a previous summary happens to name.**

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

This matters most in **S7, S8** (S1–S5 are done), which touch files that
**S1**, **S2** and **S3** have already rewritten. All three have landed, so this is no
longer hypothetical: **every hook file, `common.types.ts`, `Repositories.tsx`,
`DisplayRepoList.tsx`, `UserProfileRepos.tsx`, `LowerHomeUI.tsx` and the three
GraphQL consumer components have changed since the audit snapshot.** Each
affected session below carries an "Inherited from S2" block listing what is
actually true now.

---

## The 11 sessions

### ✅ S1 — Quick wins & foundations — **landed 2026-08-07**
**Branch:** `fix/quick-wins` (off `rework/2026`) · **Risk:** none
**Plans:** P00 `d32addb` → P01 `928fad0` → P02 `f828f7a` → P03 `4cfac47` →
P04 `9183b81` → P28 `07e7274` · docs `ac4186a`

Scattered one-file edits plus two leaf modules nothing imports yet. Grouped
because none of them interact, all are trivially verifiable, and together they
shrink the files every later session has to read. Gate (`npm run lint && npx tsc
-b --noEmit && npm run build`) green before every commit.

#### What shipped

| Plan | Result |
|---|---|
| **P00** | `npm ci` in `client/` — 230 packages, **no lockfile drift**. **Baseline was green**: lint, `tsc -b --noEmit` and `vite build` all exit 0 at `27c9555`, so every later failure is attributable. Bundle baseline captured in [`implementation_plans/_baseline.txt`](implementation_plans/_baseline.txt): **3.0 MB** of `dist/assets` — 1.42 MB `github-logo-cropped.png`, 548 KB + 505 KB logos, 571 KB JS (179 KB gzip). That is the number **P26** and **P27** are measured against. |
| **P01** | 3 × `rel="noopener noreferrer"` in `ShowSelectedRepo.tsx` (forks chip, issues chip, "Visit on GitHub"). All **6** `target="_blank"` sites in `client/src` now carry `rel`. |
| **P02** | 13 files, **−85 lines**. `Explorer.tsx`: commented "Load More" `<Button>`, orphaned `style4`, commented `Button` import, and the `{!hasNextPage && …}` block nested inside `{hasNextPage && …}` that could never render — the page declared two end-of-results messages and could reach one. `useFetchUserData`: commented `cacheTime`. `seeRepos` prop removed from `UserCards` + `common.types.ts` + call site. `UserProfileRepos`: dead `navigate()` state object. 5 commented-out style one-liners. `git rm`: `useFetchSearchUsers.ts` (B4), `react.svg`, `vite.svg`. |
| **P03** | `LoadingSkeleton.tsx` → MUI `<Skeleton>`. `@keyframes pulse` was referenced but **defined nowhere** (`grep -rn keyframes client/src` → 0 hits), so the contribution skeleton had always been a static grey grid. Also drops the hardcoded `#e0e0e0`, which read wrong in dark mode. |
| **P04** | **new** `helper/validateLogin.ts` — `GITHUB_LOGIN`, `GITHUB_REPO_NAME`, `isValidLogin`, `isValidRepoName`. Leaf module, imported by nothing; P07/P16/P17/P20 each do their own wiring. |
| **P28** ◑ | Steps 1-3, 5, 6. `.env.development` rewritten clean; `.env.example` committed; `!.env.example` added to `.gitignore`; `zod@^4.4.3` installed. |

#### How it was verified

Beyond the gate: **P04's regex was executed, not eyeballed** — all 32 cases run
through `node --experimental-strip-types`, including every pass/fail input the
plan names (`torvalds`, `s3nsh1-dev`, a 39-char login, `microsoft` pass;
`-lead`, `trail-`, `dou--ble`, 40-char, `""`, `undefined`,
`x/../../orgs/github`, `a") { __typename } viewer { login }`, `a&per_page=100`
fail). **P03 was verified in the built bundle**, where the animation now binds
to a real emotion keyframes object (`${Kh} 2s ease-in-out 0.5s infinite`)
instead of a dangling name. **P28's env file was verified by re-parsing its
shape only** — key/value whitespace, quoting and token prefix as booleans. The
value was never printed, and no tracked file matches a token pattern.

#### ⚠️ Deviations from the plans

1. **Branch-name conflict in the plans themselves.** P00's own text says
   `fix/audit-remediation`; this file says `fix/quick-wins`. Went with **this
   file**, since it is what governs sessions.
2. **HEAD was `27c9555`, not the audit snapshot `1fa3e0f`.** The root
   `guide.txt` / `package.json` / `package-lock.json` deletions were already
   committed, and **`.github/dependabot.yml` already existed** — **P32 appears
   to have landed early, outside its session.** Verify before re-doing it in
   **S10**.
3. **P02 cascaded further than written.** Dropping the dead `navigate()` state
   object orphaned `UserProfileRepos`'s `username` prop and `noUnusedLocals`
   failed the build. Since P02's own acceptance criteria require that check to
   pass, the prop and its `DisplayRepoList` call site went too. P07 §5 rebuilds
   the path from `owner`/`name` on the repo object, so it did not need the prop
   back — and did not ask for it.
4. **P02 also removed two commented style one-liners the plan did not name
   individually** (`UserCards.tsx`, `CustomSwitchForModeTransition.tsx`) —
   covered by step 5's "any similar one-liners".
   `useFetchReposPerPage.ts`'s commented `staleTime` is **untouched**, as
   instructed; it is a live behaviour bug owned by **P11**.
5. **P03 was not checked in a browser.** The plan asks for a visual check in
   both themes; only the bundle-level proof above was done. Worth ten seconds
   the next time `npm run dev` is running.
6. **P28 step 5 was a no-op.** `client/src/vite-env.d.ts` already contained only
   the `vite/client` reference — no `VITE_GITHUB_AUTHENTICATION_TOKEN`
   declaration to delete. Verified, not "re-fixed".
7. **`.env.development` was worse than the plan described.** Not just the
   trailing space in the key (`GITHUB_TOKEN =`) — the value was **also quoted
   and whitespace-padded**. All three stripped.
8. **`.env.example` really was being swallowed** by the `.env.*` rule, exactly
   as P28 warned might happen. `!.env.example` now follows the env rules —
   **order matters, do not reorder those lines.** A stray trailing space on the
   `.env.*` line was dropped at the same time.
9. **`npm i zod` also pruned an extraneous `yaml@2.8.0` optional-peer entry**
   from `client/package-lock.json`. Unasked-for but harmless — the real
   `yaml@1.10.2` under `cosmiconfig` is untouched, and the gate stayed green.
   It is in the P28 diff.
10. ❌ **S1's own index note said "7 hooks read `VITE_*`". That was wrong — it
    was 8.** `useFetchLoginType` was miscounted. **S2 caught and corrected it**
    while migrating all 8. Recorded here as the concrete case for rule 3:
    re-grep, never trust a count written down in a previous session.

#### Seen but deliberately NOT fixed (still open for their owning plan)

- `useFetchReposPerPage`'s commented-out `staleTime` → **P11**
- The `"demoUserName"` fallbacks, untouched and still live → **P16**
- `helper/validateLogin.ts` left unimported on purpose → **P16**/**P17**/**P20**
- `npm audit`'s 13 advisories (1 low, 2 moderate, 10 high). `npm audit fix` was
  **not** run — P00 forbids it, since it can bump majors. Unowned by any plan.

---

### ✅ S2 — Request safety *(hook layer, part 1)* — **landed 2026-08-07**
**Branch:** `fix/request-safety`, tip `a8d7431` · **Risk:** medium
**Cut from `fix/quick-wins`@`ac4186a`, so it contains all of S1** — see
[Branch topology & merge state](#branch-topology--merge-state--verified-2026-08-07).
Neither session has been merged down to `rework/2026` yet; that blocks nothing.
**Plans:** P05 `05f757e` → P07 `b22c5dc` → P08 `7dc2c03` · docs `d343bbe`, `a8d7431`

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

#### → How S3 branches from here

```bash
git checkout fix/request-safety      # must be at a8d7431
git checkout -b fix/data-layer
```

**Cut S3 from `fix/request-safety`, not from `rework/2026`.** `rework/2026` is
still at `27c9555` and has neither S1 nor S2; branching from it would hand S3 a
tree where `githubFetch`, `githubUrls`, `graphqlQueries` and `validateLogin` do
not exist, and every plan below would fail on its first import.

You do **not** need to merge anything first. `fix/request-safety` already
contains S1 in full — the merge that was skipped was down to the integration
branch, not up into this one, and it is not a precondition for S3.

Same rule for every later session: **branch off the previous session's tip.**
The one exception is **S6** and **S11**, which only need S1 and can be cut from
`fix/quick-wins`@`ac4186a` directly — but cutting them from the latest tip is
also fine and avoids a second stack.

---

### ✅ S3 — Data layer *(hook layer, part 2)* — **landed 2026-08-07**
**Branch:** `fix/data-layer`, tip `39a310b` · **Risk:** medium
**Cut from `fix/request-safety`@`914cf4a`**, so it contains all of S1 and S2.
Nothing has been merged down to `rework/2026` yet; that still blocks nothing.
**Plans:** P06 `44d69ef` → P09 `65f6110` → P10 `79ee65c` → P11 `39a310b`

"Requests are safe" was S2; this is "data is correct". Both confirmed cache
bugs fixed, Zod schemas at the fetch boundary, the duplicate `/users/:login`
hook deleted, and a real retry policy. Gate (`npm run lint && npx tsc -b
--noEmit && npm run build`) green before every commit.

#### What shipped

| Plan | Result |
|---|---|
| **P06** | New `constants/queryKeys.ts` (`qk.*`). All 8 hooks migrated; **zero inline `queryKey` arrays left**. Fixes the repo-detail collision (owner was in the URL but not the key) and the copy-pasted `["contributionInfo", …]` shared by two hooks with different response shapes. `useFetchUserData` / `useFetchRepositories` deliberately given the *same* key — the setup for P10. |
| **P09** | New `constants/schemas.ts`: 12 Zod schemas, every API type `z.infer`red from one. `common.types.ts` reduced to a re-export plus the view model and prop types. `githubFetch` / `githubGraphQL` take an optional schema and `.safeParse` it. Every `useQuery` carries `<T, GitHubError>`. Every top-level GraphQL field is nullable. `Week` / `ContributionDay` deduped. Three hooks now return the whole `UseQueryResult`. |
| **P10** | `useFetchRepositories.ts` deleted; `Repositories.tsx` reads `public_repos` from `useFetchUserData`. |
| **P11** | `main.tsx` `QueryClient` gains `staleTime` 5 min, `gcTime` 30 min, `refetchOnWindowFocus: false` and an `instanceof`-based retry predicate. Six per-hook `staleTime` overrides removed; `useFetchReposPerPage` gains `placeholderData: keepPreviousData`. |

#### How it was verified

Everything below is **executed**, not inspected. The client has no token, but
`githubFetch` omits `Authorization` rather than sending `Bearer undefined`, so
unauthenticated REST (60 req/hour) works against the **live** `api.github.com` —
no stand-in server was needed this time. GraphQL still 401s, which turned out to
be a useful failure to measure.

- **P06 — against React Query's own `hashKey`.** The two colliding key pairs
  hash apart after the change; the `userProfile` pair hashes together. Not a
  reading of the diff — the actual hashing function the cache uses.
- **P09 — 21 assertions against live payloads.** `torvalds` (rich), `github`
  (Organization), `dependabot`, a repo list, `facebook/react` and
  `torvalds/linux`, and a search page. Plus **every optional field forced to
  `null`, and again forced absent** — the sparse-account test the plan asks for,
  done exhaustively instead of hoping a chosen login is sparse. Plus a required
  field deleted, to prove rejection still happens. Plus a check that the parsed
  object still carries every field the UI reads, since `z.object` strips.
- **P10 and P11 — headless Chrome (`--remote-debugging-port`, CDP over the
  built-in `WebSocket`), against the production `vite build` output.** The same
  scripts were replayed against a throwaway worktree built at the previous
  commit, over identical time windows, for a real before/after.

| Check | Before | After |
|---|---|---|
| `/user/torvalds` → click "PUBLIC REPOS" (client-side nav) | — | **0** further `/users/torvalds` requests; "12 repositories" still correct |
| 404 profile, 14 s window | **4** requests | **1** |
| GraphQL 401, 14 s window | **4** requests | **1** |
| Errored query, 3 hide/show cycles | — | **0** refetches |
| Paging to page 2 | spinner; list replaced by an empty frame for >500 ms | page 1 stays rendered until page 2 arrives; one request either way |
| Smoke: profile, repos tab, repo detail, search, org view | — | all five render real data; **one request per resource** |

#### ⚠️ Deviations from the plans — read before S4

1. ⚠️ **`GitHubApiUserSchema.type` is `z.enum(["User", "Organization", "Bot"])`,
   not the two-value enum P09 wrote.** `"Bot"` is real and live:
   `/users/github-actions%5Bbot%5D` and `/users/copilot%5Bbot%5D` both return
   `type: "Bot"`. The plan's enum would have turned those into a hard error page,
   which contradicts its own instruction not to write a schema that rejects
   accounts GitHub serves happily. (`/users/dependabot` returns
   `type: "Organization"`, so it was not the counter-example it looks like.)
2. ⚠️ **`Repositories.tsx`'s `as number` is still there — deliberately, and it
   is P15's.** The index says "P09/P15 must delete them"; the plans themselves
   draw the line more precisely, and every P09-legal way to remove this one is
   forbidden by another rule: P09 §3 says keep `PaginationProps.totalRepos` as
   `number`, P10's Do-NOT forbids fixing the `undefined → NaN` propagation, and
   `?? NaN` would render a literal "NaN" in the repo count during load.
   **P15 removes it, as part of adding the loading branch that stops `undefined`
   reaching the prop at all.** `DisplayRepoList`'s `as Repo[]` *was* removed —
   it became `reposData ?? []`, which routes a disabled/undefined query into the
   "No repositories found." branch that already existed instead of throwing on
   `repos.length`.
3. **`ContributionDay.contributionCount` is `.nullable()`.** P09 §4 asks for one
   `Week` / `ContributionDay` instead of two. The component pads short weeks with
   `{ date: "", contributionCount: null, color: "grey" }` and renders `null` as a
   blank cell, so a strict `z.number()` would have forced either a second local
   type (no dedupe) or `0` (a visible change: "0" in every padding cell). The
   nullable schema is the honest union of the wire row and the rendered cell.
4. **The two `…ResponseType` wrappers were deleted, not retyped.** P09 §3 flags
   `error: Error | unknown` in `OrganizationRepoResponseType` and
   `ContributionCalenderResponseType`. Both existed only as annotations on hook
   returns, and both discarded `refetch` — which §5 explicitly wants kept. The
   call sites now infer from the hook.
5. **GraphQL type names kept.** P09 §2 suggests `OwnerTypeData` /
   `ContributionsData` / `OrgTopReposData`; the S2 names (`LoginTypeResponse`,
   `ContributionCalendarResponse`, `OrganizationTop10ReposType`) were kept to
   avoid churn across three hooks for no behavioural gain. The nullability the
   plan actually cares about is in place.
6. **`GitHubRepoSchema` added.** P09's schema list names four REST schemas but
   omits the repo-detail one, which `useShowIndividualRepo` needs. Oversight in
   the plan, not a decision.
7. **`z.url()`, not `z.string().url()`.** Zod 4 moved string formats to the top
   level; the plan's form still works but is the deprecated spelling.
8. **`useInfiniteUsers` spells out all five `useInfiniteQuery` generics.** That
   types `pageParam` as `number` and **removed** a pre-existing `as number`, plus
   the `QueryFunctionContext` import. P09's "zero `as` casts added" is met; this
   goes one better.
9. ⚠️ **`helper/githubFetch.ts` now reads `import.meta.env` twice** — the token,
   and `import.meta.env.DEV` to gate the schema-mismatch console log (P09 §6 asks
   for exactly that). **The "exactly one `import.meta.env` read in all of
   `client/src`" invariant from S2 no longer holds.** P34 removes the token read
   and must keep the `DEV` one.
10. **`String(error)` in `OrganizationTopRepos` was left alone.** The type that
    caused it is fixed, but it is one of the six raw error renders **P13** owns.
11. **Two comments were reworded so acceptance-criteria greps stay literally
    clean** — P06's criterion greps for the old key literal and P09's for
    `Error | unknown`, and prose explaining the bug would otherwise match. Worth
    knowing if **P30** ever automates those greps.
12. **P02's commented-out `staleTime` line in `useFetchReposPerPage` is gone**,
    replaced by a comment explaining the inherited default. That was P11 step 3's
    job.

#### Observations that are nobody's plan (but S4 will trip over them)

- 🔴 **Every GitHub request currently costs a CORS preflight.**
  `X-GitHub-Api-Version` is not a CORS-simple header, so Chrome sends an
  `OPTIONS` before every call — each logical request appears **twice** in a
  network log. Two consequences: **(a)** do not read "2×" in DevTools as a
  duplicate fetch; **(b)** **P34's same-origin proxy removes the preflight
  entirely**, which is a real latency win the plan does not claim.
- ⚠️ **`GET /repos/:owner/:name` 301-redirects** (`facebook/react` →
  `/repositories/10270250`). `fetch` follows it transparently. **A proxy that
  does not follow redirects breaks the repo detail page.**
- **P14's bug still reproduces exactly as S2 described.**
  `/user/zzzz-not-a-real-user-zzzz` renders an empty body — now with a single
  request instead of four, but still blank. S5's.
- **`npm audit` still reports 13 advisories.** Untouched, unowned.

#### Seen but deliberately NOT fixed (still open for their owning plan)

- `Pagination`'s `Math.ceil(totalRepos / 8)` `NaN` → **P15**
- `ProfileInfo`'s `if (!userData) return null;` ahead of its error check → **P14**
- The six raw `Error: {error.message}` / `String(error)` renders → **P13**
- The `"demoUserName"` fallbacks, still live in four files → **P16**
- `helper/validateLogin.ts` still imported by nothing → **P16**/**P17**/**P20**
- `PageButton` / `PageQuickButtons` render `<button>` + `navigate()`, not links → **P23**

#### → How S4 branches from here

```bash
git checkout fix/data-layer          # must be at 39a310b
git checkout -b fix/token-proxy
```

Same rule as before: **cut from the previous session's tip.** `rework/2026` is
still at `27c9555` and has received none of S1, S2 or S3.

---

### ✅ S4 — Proxy & deploy — **THE CRITICAL FIX** — **landed 2026-08-07**
**Branch:** `fix/token-proxy`, tip `3523d8d` · **Risk:** high
**Cut from `fix/data-layer`@`c3ec6a1`**, so it contains all of S1, S2 and S3.
Nothing has been merged down to `rework/2026` yet; that still blocks nothing.
**Plans:** P28 step 4 `4e04276` → P34 `2babbf0` → P35 `3523d8d`

**V01 is closed in code.** The token no longer exists anywhere the browser can
reach it. It is **not yet closed in reality** — see [What is still on you](#-what-is-still-on-you-after-s4)
at the end of this section. Gate green before every commit, plus a fourth check
(`npm run typecheck:functions`) that S4 had to add, because `tsc -b` does not
see `netlify/functions/`.

#### What shipped

| Plan | Result |
|---|---|
| **P28 ✅** | `netlify/functions/_shared/env.mts` — typed `env.GITHUB_TOKEN`, validated at module load (cold start) for presence, whitespace and token shape. Messages name the field and the reason, never the value. Plus a standalone `tsconfig.json` for the functions and a `typecheck:functions` script. |
| **P34** | Seven functions — `users`, `user-repos`, `repo`, `search-users` (REST) and `owner-type`, `contributions`, `org-repos` (GraphQL) — over a shared `_shared/github.mts`. The 3 GraphQL documents moved to `_shared/queries.mts`; `client/src/constants/graphqlQueries.ts` **deleted**. Client: `githubFetch` loses `TOKEN`, `authHeaders` and `githubGraphQL`; `githubUrls` builds same-origin `/api` URLs and gains three builders; the 3 GraphQL hooks become ordinary `githubFetch` calls. `netlify.toml` created. Vite dev proxy to `netlify dev`'s 8888. |
| **P35** | CSP + `X-Content-Type-Options` + `Referrer-Policy` + `Permissions-Policy`; `/assets/*` immutable, `/index.html` must-revalidate; SPA fallback below `/api/*`; description, Open Graph and `theme-color` metadata in `index.html`. |

#### How it was verified

Everything below is **executed**. `netlify-cli` was not installed (rule 5), so
the functions ran under **Node 24's native type stripping** behind a ~40-line
stand-in that applies `netlify.toml`'s redirect and header rules parsed out of
the real file — the config under test is the config that ships. Requests went to
the **live** `api.github.com` with the real token; the production `vite build`
output was driven in **headless Chrome over CDP**.

| Check | Result |
|---|---|
| All 7 endpoints, live GitHub | ✅ real data from every one |
| **Contribution graph** | ✅ "3400 contributions" on `/user/torvalds` — **first time it has worked since S1 pulled the token**. This is decision B2's entire justification, and it had been unverifiable for three sessions |
| `dist/`: token strings / `api.github.com` / `Authorization` | **0 / 0 / 0** |
| `client/src`: token read / `Authorization` header | **0 / 0** (2 mentions remain **in prose comments** — see deviation 4) |
| `GET /repos/facebook/react` 301 → `/repositories/10270250` | ✅ followed |
| Smoke in Chrome: home, explore, profile, org profile, repo detail | ✅ all render real data, **one `/api` request per resource**, **zero** direct `github.com` requests, **zero** console errors |
| Click "PUBLIC REPOS" (client-side nav) | ✅ one `/api/user-repos` call, no profile refetch — P10/P11 intact |
| **CSP violations across all five pages** | **0** — and avatars *decode* (`naturalWidth > 0`), Roboto loads, `<style data-emotion>` present |
| `/user/torvalds` cold request | **200**. The live site returns **404** for it today (measured), so every shared profile link is broken until this deploys |

**The S2 PoCs, re-run against the proxy:**

| PoC | Result |
|---|---|
| `login=x/../../orgs/github` (encoded *and* raw) | **400 `bad_request`** — never reaches GitHub |
| `login=a") { __typename } viewer { login email } …` | **400 `bad_request`** |
| `POST /api/owner-type` with `{"query":"{viewer{login email}}"}` | **405 `method_not_allowed`** — no handler reads a body at all |
| `q=a&per_page=100&sort=x` | one `q` value (`total_count: 0`), 20 items — not smuggled |
| `page=abc` → 1 · `per_page=9999` → capped at 100 | ✅ |
| `login=` / absent / `-lead` / 40 chars | 400 · 400 · 400 · 400 (39 chars passes) |
| 404s: unknown user, unknown repo, unknown GraphQL login | all **404 `not_found`**, upstream body never forwarded |

🔴 **The rate-limit path was proven against a real GitHub 403**, not reasoned
about — the branch note below called this the thing most likely to bite, so the
search endpoint's 30/min cap was tripped deliberately. The client sees
**status 403 + `x-ratelimit-remaining: 0` + `x-ratelimit-reset`**, which is
exactly what `assertOk` needs to construct `RateLimitError` and what P11's
predicate needs to refuse the retry. Running the client's own branch logic
against that live response printed `RateLimitError (retry:false)`. **V07 stays
closed.**

#### ⚠️ Deviations from the plans — read before S5

1. ⚠️ **No Zod in the functions.** P28 step 4 specifies a Zod schema; the
   validator is ~25 lines of hand-written TypeScript instead. Reason: `netlify.toml`
   sets `base = "client"`, so npm installs into `client/node_modules`, which is
   **not on Node's resolution path from `netlify/functions/`** — `netlify/functions/`,
   `netlify/`, and the repo root are, and none of them has a `node_modules`.
   P28's own note ("functions resolve `zod` from the repo root or `client/`
   depending on the bundler config; verify the function bundle includes it")
   flagged exactly this, and it **cannot be verified from here** — only a real
   Netlify build proves it. A one-field schema is not worth risking the deploy of
   the critical security fix. All four of P28's acceptance criteria for the step
   still hold, and the validator is exercised by **7 executed cases**, two of
   which assert the value never reaches the message. **`netlify/functions/` now
   has zero npm dependencies** — worth keeping that way.
2. ⚠️ **Every parameter travels in the query string, not in a path segment.**
   P34 sketches `/api/users/:login`; the endpoints are `/api/users?login=…`.
   `URLSearchParams` round-trips a value exactly, whereas a path segment passes
   through Netlify's router *and* the URL parser, either of which may normalise
   `..` and `%2F` — and P34's own warning is that "a proxy that reassembles paths
   by string concatenation reintroduces V03 server-side". This removes the
   question rather than answering it: **there is no path to traverse.** It also
   collapses the redirect table to the single `/api/*` rule P34 specifies, with
   no placeholder-merging behaviour to depend on.
3. **The functions import `client/src/helper/validateLogin.ts` directly** rather
   than copying the regexes into `_shared/`. One definition guards both the
   browser route and the upstream request; a second copy would be free to drift,
   and these two regexes are the V03 fix. esbuild inlines it, so the bundle has
   no cross-package reference at runtime — verified.
4. ⚠️ **P34's grep criterion cannot be satisfied literally, and never could.**
   `grep -rn "import.meta.env\|Authorization\|VITE_" client/src` still returns
   3 hits: `import.meta.env.DEV` (which S3 requires be **kept**), and the strings
   `VITE_GITHUB_AUTHENTICATION_TOKEN` and `Authorization` **inside doc comments
   explaining the bug that was fixed**. S3 reworded comments to keep such greps
   clean; that was not done here, because a comment saying "this file used to
   read `VITE_GITHUB_AUTHENTICATION_TOKEN` and inline it into the bundle" is the
   most valuable sentence in the file. **The code has zero.** If **P30** ever
   automates this grep, scope it to non-comment lines.
5. **`githubGraphQL` was deleted, not repointed.** P34 §5 describes changing a
   URL. Since the query documents had to move server-side anyway, the three
   GraphQL calls became ordinary REST-shaped GETs and the second response path
   disappeared. The envelope unwrapping, the `errors`-at-HTTP-200 handling and
   the "could not resolve to a" → 404 mapping all moved into `proxyGraphQL`
   unchanged, so **client behaviour is identical** — including
   `org-repos?login=<a user>` still producing a not-found, exactly as before.
6. **P35's SPA fallback landed in P34's commit.** It sits in the same redirect
   table as `/api/*` and the ordering between them is the load-bearing part, so
   splitting them across two commits would have committed a broken intermediate
   state. Small scope bleed, recorded here rather than hidden.
7. **A fourth gate step exists now:** `npm run typecheck:functions`
   (`client/package.json`). `tsc -b` does not see `netlify/functions/`, so
   without it the functions were type-checked only at deploy. **Run it whenever
   you touch `netlify/`.**
8. **Import specifiers name the real file** (`./env.mts`, `validateLogin.ts`),
   which needs `allowImportingTsExtensions` in the functions' tsconfig. The
   canonical `.mjs` form was tried first and **fails under Node's type
   stripping** — Node does not remap `.mjs` → `.mts`, only bundlers do. The `.mts`
   form is the one where tsc, esbuild *and* Node all resolve identically, which
   is what made local execution possible at all.
9. **No anti-flash theme script** (P35 §4) — it needs a `script-src` SHA-256 hash
   *and* must agree with **P17**'s `readMode()` on the `prefers-color-scheme`
   fallback, or it flashes in the opposite direction. P17 has not landed. P35
   explicitly permits skipping it. **Revisit in S6.**
10. **No `og:image`** — the asset does not exist, and pointing at a missing image
    renders a *broken* preview, which is worse than the text-only card that ships.
    Needs a real 1200×630 capture. **P26/P36.**
11. **`per_page` and `page` are capped server-side** (100 / 1000, and 100 for
    search) — not in any plan. One line, and it stops a caller turning one page
    view into a 100-item response against a shared quota.

#### Observations that are nobody's plan

- ✅ **The CORS preflight is gone.** S3 measured every GitHub call costing an
  extra `OPTIONS` because `X-GitHub-Api-Version` is not a CORS-simple header.
  Same-origin `/api/*` has no preflight — Chrome's network log now shows **one**
  request per logical call, not two. Worth stating in the PR, and worth
  remembering when comparing "before" numbers, which were doubled.
- **`facebook/react` now reports `full_name: "react/react"`** — GitHub has
  transferred the repository. Noticed while confirming the 301 follow; the page
  renders correctly either way. Nothing to fix.
- **P14's bug still reproduces.** `/user/zzzz-not-a-real-user-zzzz` renders a
  blank body: one request, a correct 404, and `ProfileInfo`'s
  `if (!userData) return null;` still running ahead of its error check. **S5's.**
- **`npm audit` still reports 13 advisories.** Untouched, unowned.
- **Bundle is essentially unchanged** (~641 kB raw). The proxy removed a little
  code and added none.

#### Seen but deliberately NOT fixed (still open for their owning plan)

- `Pagination`'s `Math.ceil(totalRepos / 8)` `NaN` and `Repositories.tsx`'s
  `as number` → **P15**
- `ProfileInfo`'s `if (!userData) return null;` ahead of its error check → **P14**
- The six raw `Error: {error.message}` / `String(error)` renders → **P13**
  *(now more visible: every proxy error is a clean typed error, and the UI still
  prints it raw — `/user/torvalds/repositories` renders "Error: Resource not found")*
- The `"demoUserName"` fallbacks, still live in four files → **P16**
- `LowerHomeUI`'s `alert()` and the `searchTerm.length` vs trimmed-length bug → **P20**
- `PageButton` / `PageQuickButtons` render `<button>` + `navigate()` → **P23**

#### 🔴 What is still on you after S4

The code is done and verified. **V01 is not closed until you do these, in this
order** — the site will 500 on every request if it deploys without step 2:

1. **Create a new token** at <https://github.com/settings/tokens> — **no scopes**.
   Public GitHub data needs none.
2. **Netlify → Site settings → Environment variables → add `GITHUB_TOKEN`**
   (no `VITE_` prefix — that prefix *is* the bug). The root `.env.development`
   covers `netlify dev` only; Netlify's build and runtime do not read it.
3. **Deploy this branch**, and confirm: a profile loads, the contribution graph
   renders, and `curl -sI <site>/ | grep -i content-security` shows the CSP.
4. **Only then revoke the old token.** ⚠️ **Check both lists** — the deployed
   bundle's token is `ghp_`-prefixed (classic) while `.env.development` holds a
   `github_pat_` one (fine-grained). **Different prefixes mean different
   credentials**; revoking the one on your disk does not revoke the public one.
   Classic and fine-grained are listed separately on that page.
5. **Check <https://github.com/settings/security-log>** for anything the exposed
   token did.

If the first deploy 500s, the two likely causes in order: `GITHUB_TOKEN` missing
(step 2), or the functions not deploying at all — check that Netlify's build log
lists seven functions. `base = "client"` makes `[functions] directory` relative
to `client/`, which is why it reads `../netlify/functions`.

#### → How S5 branches from here

```bash
git checkout fix/token-proxy         # must be at 3523d8d
git checkout -b fix/error-states
```

Same rule as before: **cut from the previous session's tip.** `rework/2026` is
still at `27c9555` and has received none of S1, S2, S3 or S4.

S5 touches render paths only and does **not** need the proxy running — but if
you want to see real data while working, `npx netlify dev` from the repo root
serves the functions and the client together on 8888, and `npm run dev` in
`client/` proxies `/api` there.

---

### ✅ S5 — Error & empty states — **landed 2026-08-07**
**Branch:** `fix/error-states`, tip `4ebeb89` · **Risk:** medium
**Cut from `fix/token-proxy`@`8bd9e85`**, so it contains all of S1–S4.
Nothing has been merged down to `rework/2026` yet; that still blocks nothing.
**Plans:** P12 `4e8cd8a` → P13 `7f93792` → P14 `9370e9c` → P15 `9157683` →
P16 `4ebeb89`

The app's remaining user-visible bugs. The blank profile page (P14) and the
pagination `NaN` (P15) are both closed, every failure now renders through one
themed component, and an invalid username no longer becomes a request at all.
Gate (`npm run lint && npx tsc -b --noEmit && npm run build`) green before
every commit; `npm run typecheck:functions` re-run at the end and still green
(S5 touched no function code).

#### What shipped

| Plan | Result |
|---|---|
| **P12** | New `AppErrorBoundary` (class — `getDerivedStateFromError` still has no hook equivalent) + `SomethingWentWrong` fallback. Wired at the root **inside `ThemeProvider`**, and again around `<ContributionChart>`. Keyed on `location.pathname`, which is what makes "Back to home" recover. |
| **P13** | New `ErrorState` — classifies by `instanceof` (`RateLimitError` → the reset time, `NotFoundError` → "Not found", else generic), themed MUI `Alert`, Retry wired to each query's own `refetch`. All six raw renders replaced. `grep -rn "error.message\|String(error)" client/src` → **0**. |
| **P14** | `ProfileInfo` reordered to `isLoading → error → !data`; `mapGitHubResponse` moved below the guards. New `components/skeletons/ProfileSkeleton`, which reuses `LoadingSkeleton` for the contribution grid rather than redrawing it. |
| **P15** | New `helper/paginate.ts` (`PER_PAGE`, `totalPageCount`, `pageWindow`). `Repositories` gains explicit loading/error branches and **drops S2's `as number`**. `Pagination` rewritten around `pageWindow` and returns `null` below two pages. `useFetchReposPerPage` now imports `PER_PAGE` — the magic `8` existed in two files. New `RepoListSkeleton`. |
| **P16** | `NotFound` rebuilt themed and parameterised; new `EmptyState`; **all five placeholder-login fallbacks replaced by `isValidLogin` / `isValidRepoName` gates**; `/explore` with no query, zero-result search, zero public repos and the empty starred dropdown all get real states; catch-all route moved last. `grep -rn "demoUserName\|demoRepo\|noQueryToSearch" client/src` → **0**. |

#### How it was verified

Everything below is **executed**. `netlify-cli` is still not installed (rule 5),
so the seven functions ran under **Node 24's native type stripping** behind the
same ~50-line stand-in S4 used, with the CSP parsed out of the real
`netlify.toml`. Requests went to the **live** `api.github.com` with the real
token; the production `vite build` output was driven in **headless Chrome over
CDP**.

| Check | Result |
|---|---|
| `/user/torvalds` | ✅ full profile, **"3400 contributions"** — the graph still works after the guard reorder |
| `/user/zzzz-not-a-real-user-zzzz` | ✅ **"Not found — That GitHub user or repository doesn't exist." + RETRY.** This is P14's bug, blank since before S2, now closed |
| `/user/-invalid-` and `/user/x%2F..%2F..%2Forgs%2Fgithub` | ✅ themed "Invalid username", **zero API requests** — the guard fires before the query is enabled |
| `/user/torvalds/..%2F..%2Fetc` | ✅ "Invalid repository", **zero API requests** |
| `/explore` with no query | ✅ prompt, **zero API requests** |
| Zero-result search | ✅ "No users found… check the spelling", **no 🎉** |
| `/nonexistent-route` | ✅ themed 404 |
| Retry button | ✅ exactly **one** `/api/users` request per click |
| CSP violations + console errors across 8 pages | **0 / 0** |

🔴 **The pagination bar was measured, not reasoned about.** Rendered button
labels and `disabled` flags were read out of the DOM for eight cases:

| Case | Result |
|---|---|
| 6 repos / 8 repos → 1 page | **no bar at all** (was: arrows with no numbers) |
| 12 repos, page 1 → page 2 | `[1][2]`, back arrows disabled → forward arrows disabled |
| 169 repos (22 pages), page 1 / 10 / 22 | `[1][2][3]` → `[10][11][12]` → `[20][21][22]`, arrows correct at both ends |
| `?page=999` on a 22-page user | clamps to `[20][21][22]`, forward arrows disabled |
| `?page=abc` | requests `page=1` (P07's `parsePage`, verified still holding) |
| **the literal string `NaN` anywhere in the DOM** | **absent** |

The pure helpers were also executed directly — 18 cases plus an **exhaustive
old-vs-new parity check** of the page window for every page of `totalPages`
4/7/13/40, so the numbers shown are provably unchanged wherever the old code
produced numbers at all.

**Both boundaries were proven with a real throw, then reverted:**

| Case | Result |
|---|---|
| `throw` inside `UserContributions` | ✅ profile renders in full; only the chart area shows "Couldn't display the contribution graph." |
| `throw` inside `Explorer` (root boundary) | ✅ themed "Something went wrong" + TRY AGAIN + BACK TO HOME, **`#root` not empty** |
| "Back to home" | ✅ recovers — this is what the `key={location.pathname}` is for |
| "Try again" | ✅ resets and re-renders the subtree, which then renders normally |

⚠️ **A note for whoever tests a boundary next.** React 19 **re-runs the render
synchronously** after catching, so a throw guarded by a "only once" flag never
shows its fallback — the retry succeeds and it looks like the boundary is not
working. The throw has to persist across that second attempt (a time window
works) or the test is measuring nothing.

#### ⚠️ Deviations from the plans — read before S6

1. **`ThemeProvider` was not hoisted to `main.tsx`.** P12 §3 suggests it as
   "probably cleaner", but `App` calls `useMode()`, which must run *inside*
   `ModeContextProvider` — hoisting would need a new wrapper component in
   `main.tsx` to call the hook. Putting the boundary inside the existing
   `ThemeProvider` is a three-line diff and gets the same themed fallback.
   **Trade-off:** a crash *above* `ThemeProvider` (in `ModeContextProvider` or
   `getTheme`) is still uncaught. That is a much smaller surface than the one
   now covered.
2. **The boundary wraps `<Navbar>` as well as `<Routes>`,** so a caught error
   replaces the navbar too. Wrapping only `<Routes>` would keep the navbar
   usable, but then a Navbar crash is still a white screen — which is the
   exact thing P12 exists to stop. Chose coverage; the fallback carries its
   own "Back to home".
3. **The boundary is keyed on `location.pathname`.** Not in the plan, and
   without it the plan's own "Back to home" button is decorative: the URL
   changes and the boundary keeps rendering its fallback, because `error`
   state survives the route change. One prop.
4. **`ErrorState` is a default export, not the named `export const` P13
   sketches**, and `describe` is not exported. Matches the rest of the
   codebase and keeps `react-refresh/only-export-components` quiet.
5. ⚠️ **The guards pass an empty string, they do not skip the hook.** P16 §3
   shows `if (!isValidLogin(username)) return <NotFound … />` before the hook —
   which is a conditional hook call and illegal. The validity check runs first,
   the hook receives `""` when it fails (leaving the query `enabled: false`, so
   **no request is fired**), and the `return` follows. Same user-visible result,
   legal React. **Verified: zero requests on an invalid param.**
6. **`DisplayRepoList` takes `username` as a prop** rather than growing its own
   `isValidLogin` guard. It only ever renders under `Repositories`, which owns
   and validates that param; a second guard would be a second place to keep in
   sync. Not in the plan.
7. **`ShowSelectedRepo`'s `<div>No Data Found</div>` also became a `NotFound`.**
   P13 does not list it among the six (it is not an error render) and P16 does
   not name it either, but it is the same unstyled-div problem in the same
   file, one line away from two edits both plans do ask for.
8. **Comments were worded to keep the acceptance greps literally clean** —
   both P13's and P16's criteria grep for strings that prose explaining the fix
   would otherwise match. Same choice S3 made, and the opposite of S4's
   deviation 4. Worth settling if **P30** ever automates these greps.
9. **P15 step 2's early return serialises two requests on one cold path.**
   `Repositories` now returns a skeleton while the *profile* query is in
   flight, so `DisplayRepoList` — and therefore the repos request — does not
   mount until it resolves. Only affects a cold deep-link to
   `?tab=repositories`; arriving from the profile page hits P10/P11's cache and
   the branch never runs. Followed the plan; noting the cost.
10. **No user with exactly 0 public repos was found to test with**, so the
    `EmptyState` in `UserProfileRepos` was exercised by requesting a page past
    the end (`/user/dhh?tab=repositories&page=4` → empty list). Same branch,
    same render — "No public repositories | This account hasn't published
    anything yet."

#### Observations that are nobody's plan

- **`?page=999` on a 22-page user renders the clamped bar over an empty list.**
  The arrows work and nothing crashes, but the page number in the URL is not
  reconciled with reality. Deciding whether that should redirect is **P23**'s
  natural moment, since it is rewriting these controls as links.
- **`npm audit` still reports 13 advisories.** Untouched, unowned.
- **Bundle: 641.10 kB → 646.22 kB raw.** ~5 kB for five new components.
- 🔴 **`GITHUB_TOKEN` in Netlify and the old PAT's revocation are still
  outstanding** — S4's list, unchanged. S5 did not touch it and cannot.

#### Seen but deliberately NOT fixed (still open for their owning plan)

- `StaredUserContextProvider` reads `localStorage` unvalidated, and
  `checkStared` reads `initialList` rather than state → **P17**/**P18**
- `LowerHomeUI`'s `alert()` and the `searchTerm.length` vs trimmed-length bug
  → **P20**
- `PageButton` / `PageQuickButtons` still render `<button>` + `navigate()`
  → **P23**
- `Explorer`'s `IntersectionObserver` still fires unthrottled → **P21**
- `OrganizationTopRepos` still interpolates `username` into a rendered
  `github.com` href. Unowned; a rendered link, not an authenticated request

#### → How S6 branches from here

```bash
git checkout fix/error-states        # confirm with: git rev-parse --short HEAD
git checkout -b fix/context-storage
```

**S6 only needs S1**, so it *may* be cut from `fix/quick-wins`@`ac4186a` — but
cutting it from `4ebeb89` keeps one line of history instead of a second stack
to reconcile. Recommend the latter. `rework/2026` is still at `27c9555` and has
received none of S1–S5.

S6 touches `context/`, `hooks/useStaredUserList.ts` and the four components
that consume them — none of which S5 changed, apart from the empty-menu branch
added to `StaredRepositories`. **P18 must keep that branch**: it renders when
`staredList.length === 0`, and P18 changes where that list comes from.

---

### 🟡 S6 — Context & storage  ← next
**Branch:** `fix/context-storage`, off `fix/error-states`@`4ebeb89` · **Risk:** medium · **~2 h**
**Plans:** P17 → P18 → P19

Self-contained: `context/`, `hooks/useStaredUserList.ts`, and the 4 components
that consume them.

⚠️ **P18 fixes three bugs that currently cancel each other out.** Fixing the
lazy-`useState` alone freezes the list and the star button stops toggling. Read
P18's "Why" before touching anything. P19 is a pure rename — **zero behaviour
change in that commit**.

⚠️ **Inherited from S5:** `StaredRepositories`'s menu now branches on
`staredList.length === 0` to say "Star a profile to pin it here." instead of
opening onto nothing. **P18 changes where that list comes from — keep the
branch.** Also: **P17 should import `helper/validateLogin.ts`**, which S5 wired
into four route boundaries, rather than writing a second set of rules; the
functions already import the same file, so a third definition would be the
third place to keep in sync.

---

### 🟡 S7 — Search & scroll
**Branch:** `feat/search` · **Risk:** medium · **~3 h**
**Plans:** P20 → P21 → P37

`LowerHomeUI.tsx`, `Explorer.tsx`, `Navbar.tsx`, plus the new shared
`SearchBar.tsx`. Batched because P37 extracts P20's fixed form into the shared
component, and both P21 and P37 touch `Explorer.tsx`.

**S5 has landed**, so P37's dependency is satisfied — `<EmptyState>`, `<ErrorState>` and the parameterised `<NotFound>` all exist, and P37 fills them with the shared `<SearchBar>` (`NotFound` deliberately ships without one).

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

⚠️ **Inherited from S5:** `Pagination` consumes `pageWindow` from
`helper/paginate.ts` and returns `null` below two pages. **P23 should keep both**
— recomputing the window inline is how the `NaN` got there the first time, and
a link-based bar for a single page is still noise.

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

⚠️ **Inherited from S5 — `helper/paginate.ts` is now the highest-value pure
module after `githubUrls`.** `totalPageCount(undefined)` → `0`,
`pageWindow(p, 0)` → `[]`, and the clamping at both ends. S5 executed 18 such
cases plus an old-vs-new parity sweep; **P30 turns those into committed tests**,
and they are the regression guard for the pagination `NaN`.

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
rework/2026 (27c9555 — has received nothing yet)
    └── ✅ S1  quick-wins      ac4186a ─────┐
            └── ✅ S2  request-safety  914cf4a
                    └── ✅ S3  data-layer  c3ec6a1
                            └── ✅ S4  token-proxy  8bd9e85
                                    └── ✅ S5  error-states  4ebeb89  ← branch from here next
                                            ├── S7  feat/search
                                            ├── S8  a11y ── S10  tooling
                                            └── S9  perf/assets
    S6  context-storage  ← only needs S1 (recommend stacking on 4ebeb89 anyway)
    S11 docs/readme      ← only needs S1
```

This tree is **branch ancestry, not merge order**. Each session is cut from the
one above it; merging down to `rework/2026` can happen at any point after, and
so far has not happened at all. Five sessions are done; the next branch is cut
from `4ebeb89`.

**Note the shape change:** S4 and S5 were drawn as siblings off S3. They are not
— S4 landed first, and S5 is cut from it. Nothing forced that order (they share
no files), but stacking keeps a single line of history instead of a second stack
to reconcile later. **The same argument applies to S6**, which the graph still
shows detached: it only needs S1, but cutting it from `4ebeb89` costs nothing
and avoids a second stack.

~~**Critical path to the security fix: S1 → S2 → S3 → S4.**~~ ✅ **All four have
landed. V01 is closed in code.** What remains is not a plan — it is the Netlify
env var and the token revocation, both of which only you can do. See
[What is still on you after S4](#-what-is-still-on-you-after-s4).

**S6 and S11 are independent** — they only need S1, so they may be cut from
`fix/quick-wins`@`ac4186a`. If you run them in parallel with the main line,
that is a second stack off S1: keep them there, and merge S1 down first so both
stacks rebase-free onto a shared base.

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
3. **Re-read files before editing, and re-grep before trusting a count.** The plans' line numbers are from the audit snapshot, and a written-down number can be wrong — S1's index said "7 hooks"; there were 8.
4. **Never touch anything outside the session's plan list.** Note it, move on.
5. **Do not add dependencies** beyond those named in a plan. Pre-approved: `zod` (P28), dev deps in P29/P30.
6. **`git mv`, never `rm`,** for anything that might be an only copy.
7. **Never print an env value** — in logs, errors, or commit messages. Field names only.
8. **Update `00.INDEX.md`** at session end with ✅ + SHA per landed plan.
9. **Report honestly.** Half-landed = say which half. Build broken = say so, with output.
10. **Do not commit to `main`.**
11. **Branch from the previous session's tip; never rebase a landed session.** The SHAs in this file and in `00.INDEX.md` are the only record of what shipped where — rewriting history invalidates all of them.

---

## Outstanding action (blocks no plan)

🔴 **Add `GITHUB_TOKEN` in Netlify, then revoke the exposed PAT.** ✅ **S4 has
landed**, so the code side is done — the full step-by-step is in
[What is still on you after S4](#-what-is-still-on-you-after-s4). Short version:
new no-scope token → add as `GITHUB_TOKEN` in Netlify (**no `VITE_` prefix**) →
deploy `fix/token-proxy` → *then* revoke the old one at
<https://github.com/settings/tokens>. Check
<https://github.com/settings/security-log> too.

⚠️ **This is now the only thing between the repo and V01 being genuinely
closed.** It blocks no plan; S5 onward can proceed in parallel.

⚠️ **There are probably two different tokens — check both.** Noted during S1:
the audit records the deployed bundle's token as **`ghp_`**-prefixed (classic
PAT), but the local `.env.development` holds a **`github_pat_`** one
(fine-grained). Different prefixes mean **different credentials**, so revoking
the one on your disk would not revoke the one that is public. Enumerate both at
<https://github.com/settings/tokens> — classic and fine-grained are listed
separately — before revoking anything.

✅ Not a new exposure: the locally built bundle at S1 contained **zero** token
strings, because the `VITE_*` variable is no longer defined. ~~The client is
correspondingly broken (`Bearer undefined`) until **P34**, which is accepted.~~
**Fixed in S4** — the client works again, against `/api/*`, and the built bundle
still contains zero token strings because it no longer contains a token read at
all. Re-verify against the deployed bundle once the site ships.
