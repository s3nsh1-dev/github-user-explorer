# Branch & Session Plan

**One session = one branch = one batch of plans that touch the same files.**

Plans are grouped by *files touched*, not by severity. That is the whole
optimisation: a session reads a set of files into context once, changes them
several times, and verifies once. Splitting plans that share files across
sessions means re-reading the same code, re-deriving the same context, and
resolving conflicts with yourself.

37 plans → **11 sessions**. Ten have landed, plus a loose-ends pass and a
simplification pass. **S11 is the last.**

---

## How to start a session

```
Implement session S11 (plans P36 → P33) from
report/implementation_plans/. Read 00.INDEX.md for the rules, then each
plan file in order. Branch: docs/readme, off chore/tooling.
```

*(S1 through S10 have landed — see `00.INDEX.md` for their SHAs and for what
they changed that later sessions must account for.)*

Then, in order:

1. `git checkout -b <branch>` **off the previous session's tip** (or `rework/2026` for S1). This is the step that actually matters — see [Branch topology & merge state](#branch-topology--merge-state--verified-2026-08-07).
2. Work the plans **in the listed order** — the order encodes dependencies
3. **One commit per plan**, message referencing it: `fix(security): encode user input in GitHub API URLs (P07)`
4. Verification gate after **every** plan:
   `cd client && npm run lint && npx tsc -b --noEmit && npm run test:run && npm run build`
   — plus `npm run typecheck:functions` whenever you touch `netlify/`
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
                    9370e9c  P14  ├─ S5  fix/error-states → 924fbfb
                    9157683  P15  │
                    4ebeb89  P16  │
                    924fbfb  docs ┘
                     └─ 6987ada  P17  ┐
                        f3fbd6a  P18  ├─ S6  fix/context-storage → 6220418
                        6220418  P19  ┘
                         └─ b449109  docs ┐
                            1796349  docs ├─ fix/netlify-dev-envfile → 39b40dc
                            34a7a40  dev  │
                            39b40dc  dev  ┘
                             └─ dae9883  P20  ┐
                                69880dc  P21  ├─ S7  feat/search → a536151
                                6f1bd78  P37  │
                                a536151  docs ┘
                                 └─ 59a1c45  href   ┐
                                    bba6ac5  theme  ├─ chore/loose-ends → 09f13d6
                                    602417d  deps   │
                                    91ba513  server │
                                    09f13d6  docs   ┘
                                     └─ 3a5aeea  P22  ┐
                                        035089c  P23  ├─ S8  fix/a11y → 38a0f55
                                        33d9461  P24  │
                                        56dae26  P25  │
                                        38a0f55  docs ┘
                                         └─ c598359  chore/simplify
                                             └─ 4586957  P26 ┐
                                                c9e4b32  P27 ┴─ S9  perf/assets → a45e1ae
                                                 └─ 4a38f54  P29 ┐
                                                    1a8969c  P30 ├─ S10  chore/tooling  ← HEAD
                                                    180496c  P31 │
                                                    0bf39e5  P32 ┘
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

*(Written before S3. Still accurate after S10 — `rework/2026` has received none
of S1–S10, and a merge of `chore/tooling` into it remains a single fast-forward
landing all ten in order, plus `fix/netlify-dev-envfile`, `chore/loose-ends`
and `chore/simplify`.)*

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

This mattered most in **S7** and **S8**, both now done. It still applies to
**S9–S11**, which touch files that
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

### ✅ S6 — Context & storage — **landed 2026-08-07**
**Branch:** `fix/context-storage`, tip `6220418` · **Risk:** medium
**Cut from `fix/error-states`@`924fbfb`**, so it contains all of S1–S5.
Nothing has been merged down to `rework/2026` yet; that still blocks nothing.
**Plans:** P17 `6987ada` → P18 `f3fbd6a` → P19 `6220418`

Untrusted `localStorage` closed (V06), the starred-users context rebuilt, and
the `stared`/`started`/`starred` spelling collapsed to one. Gate green before
every commit; `npm run typecheck:functions` re-run at the end and still green.

#### What shipped

| Plan | Result |
|---|---|
| **P17** | New `helper/storage.ts` — the only place `localStorage` is touched. `readStarred` parses in a `try`, checks `Array.isArray`, filters through `isValidLogin` and dedupes; `readMode` *checks* instead of asserting and falls back to `prefers-color-scheme`; both writers swallow quota throws. `ModeContextProvider` wired to it. |
| **P18** | Provider rewritten: lazy initialiser, reads from state, write moved to an effect, `value` memoised. **Hoisted to `main.tsx` and mounted once** — it used to be mounted twice, independently. `useStarredUsers` throws instead of returning null, so every `?.` at the call sites is gone. Dropped the stale dropdown label. |
| **P19** | Four files `git mv`d, symbols renamed, `hirable` → `hireable`, `id="outlined-basic"` → `id="github-username-search"`. **Zero non-rename lines in the diff.** |

#### How it was verified

`helper/storage.ts` was **executed** against a stubbed storage — 18 cases:
malformed JSON, a non-array that parses (`"5"`), `null`, an absent key, an
array of mixed junk, a GraphQL injection string, 39- vs 40-character logins,
dedupe, `mode: "purple"` falling back to the system preference in both
directions, a stored value winning over the system, and a quota throw being
swallowed. The storage key was **asserted** to still be `staredProfiles`.

Then the same claims in a real browser, against the production build behind the
S4/S5 stand-in and live GitHub:

| Poisoned storage | Result |
|---|---|
| `staredProfiles = '{'` | app loads, list empty, **0 console errors** |
| `staredProfiles = '5'` | same |
| `staredProfiles = '[1,null,{},"-bad-"]'` | same |
| `mode = 'purple'` | coherent theme, **not half-dark**, and the valid starred entry survives |
| no stored mode, system **dark** / **light** | dark / light — the fallback works both ways (`Emulation.setEmulatedMedia`) |

**P18's acceptance list, all measured:**

| Check | Result |
|---|---|
| Star → icon fills; unstar → empties | ✅ immediate, both directions |
| **Toggle 5× in a row** | ✅ ends filled, `["torvalds","octocat"]` — **no duplicates** |
| Star on a profile → home dropdown | ✅ lists it after navigating home |
| Reload | ✅ list persists |
| Dropdown button label | ✅ empty — no stale username after navigating away |
| Storage key | ✅ still `staredProfiles` |
| P17's sanitisation | ✅ seeded junk + a duplicate were gone after **one** load — the effect writes the cleaned list back |
| One provider | ✅ `grep -rn "<StarredUsersProvider"` → one hit, `main.tsx` |

**P19 was checked as a refactor, not as a feature:** filtering the staged diff
for lines that are not a rename returns **nothing**, and the entire starred
flow above was re-run after the rename with byte-identical results. The full
S5 scenario sweep and the CSP check were also re-run — 15 routes, 8 pages,
**zero CSP violations, zero unexpected console errors.**

#### ⚠️ Deviations from the plans

1. **MUI strips `data-testid` from its icons in a production build.** The first
   attempt at the star-toggle test selected on `[data-testid="StarIcon"]` and
   found nothing, which reads exactly like a broken star button. The test
   classifies by the SVG path instead (the outlined star carries an inner
   cutout). **Worth knowing before anyone writes a P30 test that selects on
   `data-testid`** — it will pass in dev and find nothing in a built bundle.
2. **`useStarredUsers` returns the context object directly** rather than
   rebuilding `{ staredList, checkStared, updateStaredList }`. The old shape
   allocated a new object on every call for no benefit; P18 §3 only asks that
   it throw.
3. **P19 also fixed the visible label "Stared User Profiles".** It is copy, not
   code, so it is arguably a behaviour change in a "pure refactor" commit — but
   P19's own acceptance grep is case-insensitive and would have failed on it.
   Fixing a spelling in one word of UI text is the least surprising reading.
4. **`staredValueType` became `StarredUsersContextType`** — the plan lists the
   symbol renames but not this one, which was lowercase-typed as well as
   misspelled.
5. **The "Response for LongType was not ok" string was already gone**, removed
   by P05. Verified, not re-fixed, exactly as P19 anticipates.
6. **The anti-flash theme script was NOT added.** The index has been deferring
   it to "S6, after P17", but it is **P35's** item and not in this session's
   plan list — rule 4. P17 has now given it the contract it was waiting for:
   it must read `mode` from `localStorage` and fall back to
   `prefers-color-scheme`, matching `readMode` exactly, or it flashes in the
   opposite direction. It also still needs a `script-src` SHA-256 hash in
   `netlify.toml`. **Both files belong to S9's neighbourhood (`index.html`,
   `netlify.toml`) — do it there, not as a stray commit.**

#### Observations that are nobody's plan

- ⚠️ **Cross-tab behaviour regressed, deliberately.** Storage is read once at
  app start instead of on every page mount, so a second tab starring a profile
  is no longer picked up on navigation. P18 names this and rules out fixing it;
  a `storage` event listener in `StarredUsersProvider` is the two-line fix if
  it ever matters.
- **The theme still flashes on load.** Not new, and not in scope — see
  deviation 6 for what closing it actually requires.
- **`npm audit` still reports 13 advisories.** Untouched, unowned.
- **Bundle: 646.22 kB → 646.35 kB raw.**
- ✅ **B1 is done** — the owner confirmed the Netlify env var and the PAT
  revocation. **V01 is closed in reality, not just in code.** The index's
  "still outstanding" section is now empty.

#### Seen but deliberately NOT fixed (still open for their owning plan)

- `LowerHomeUI`'s `alert()` and the `searchTerm.length` vs trimmed-length bug
  → **P20** (its `id` was already fixed here, as P19 instructs)
- `Explorer`'s `IntersectionObserver` still fires unthrottled → **P21**
- `PageButton` / `PageQuickButtons` still render `<button>` + `navigate()`
  → **P23**
- `StarredUsersMenu`'s trigger is a `<Button>` with no accessible name and no
  `aria-haspopup` → **P22**
- `OrganizationTopRepos` still interpolates `username` into a rendered
  `github.com` href. Unowned; a rendered link, not an authenticated request

#### → How S7 branches from here

```bash
git checkout fix/context-storage      # confirm with: git rev-parse --short HEAD
git checkout -b feat/search
```

S7 needs **S5** (P37 fills the empty states P16 created) and inherits from S6
only the search field's `id` and the `starred` spelling. `rework/2026` is still
at `27c9555` and has received none of S1–S6.

---

### ✅ S7 — Search & scroll — **landed 2026-08-07**
**Branch:** `feat/search`, tip `6f1bd78` · **Risk:** medium
**Cut from `39b40dc`** — the tip of `fix/netlify-dev-envfile`, which is a
descendant of `fix/context-storage`@`6220418`, so it contains all of S1–S6 plus
two docs commits and two `netlify dev` fixes. Nothing has been merged down to
`rework/2026` yet; that still blocks nothing.
**Plans:** P20 `dae9883` → P21 `69880dc` → P37 `6f1bd78`

The search box was the app's front door and its dead end: it validated the
wrong string, reported through `alert()`, and existed in exactly one place, so
a visitor on `/user/torvalds` had to go back to the logo to look anyone else
up. All three are closed. Gate (`npm run lint && npx tsc -b --noEmit && npm run
build`) green before every commit; `npm run typecheck:functions` re-run at the
end and still green (S7 touched no function code).

#### What shipped

| Plan | Result |
|---|---|
| **P20** | Validates the **trimmed** value (`"  a  "` no longer passes at length 5 and searches for `"a"`), reports inline via the field's own `error` + `helperText`, native `autoFocus` instead of the `useRef`/`useEffect` pair, and a real MUI `label` in place of the placeholder. `grep -rn "alert(" client/src` → **0**. `createSearchParams` (P07) and `id="github-username-search"` (P19) kept untouched, as S2 and S6 instructed. |
| **P21** | The in-flight guard moved **inside** the observer callback; `threshold: 1.0 → 0`; `rootMargin: "0px" → "200px"`; cleanup `disconnect()`s instead of `unobserve`. |
| **P37** | New `components/SearchBar.tsx` — `hero` / `compact`, one validation rule, one navigation path. `LowerHomeUI` rewritten to render it (**zero validation logic left**, `grep -c "trim()" SearchBar.tsx` → **1**). Navbar mounts it on every route except `/`, collapsing below `sm` to a search `IconButton` that opens a full-width row **below** the toolbar. Both `Explorer` empty states and `NotFound` now carry a real search box. |

#### How it was verified

Everything below is **executed**. `netlify-cli` is still not installed (rule 5),
so the seven functions ran under **Node 24's native type stripping** behind the
same stand-in S4–S6 used — with the **CSP parsed out of the real
`netlify.toml`** — against the **live** `api.github.com` with the real token,
driving the production `vite build` output in **headless Chrome over CDP**.

| Check | Result |
|---|---|
| `"  a  "` on the home form | ✅ **"Enter at least 3 characters."**, `aria-invalid="true"`, **URL unchanged** — the P20 bug |
| Form height before / after the error | **78.9 px / 78.9 px** — the reserved helper row does its job, **no layout jump** |
| Error clears on typing | ✅ |
| `"  torvalds  "` | ✅ → `/explore?query=torvalds`, results render, field cleared |
| `C++` | ✅ → `/explore?query=C%2B%2B`, upstream `q=C%2B%2B` — **one** correctly-encoded parameter |
| Autofocus / real `<label for>` | ✅ `github-username-search` focused on load, label "GitHub username" |
| Navbar search on `/user/torvalds` | ✅ present; `"  gaearon  "` → `/explore?query=gaearon`; `"  a  "` → the same inline error, because it is the same component |
| Navbar search on `/` | ✅ **not rendered** |
| Duplicate `id`s on a page carrying two boxes | **0** |
| 404 page and empty `/explore` | ✅ both search successfully; `/explore` with no query still fires **0 API requests** |
| Zero-result search | ✅ "No users found" **and** a box to try again |
| **375 px**: icon only, tap expands, Escape / blur / submit collapse | ✅ all four; `aria-expanded` flips `false → true → false`, `aria-controls="navbar-search-panel"`, field autofocused on expand |
| 375 px: panel geometry | toolbar bottom **65 px** = panel top **65 px** — **pushes content down, never overlays the logo** |
| Horizontal overflow at 375 px (profile, expanded panel, home, 404) | **0 px** on all four |
| **CSP violations / console errors** across the whole sweep | **0 / 0** — `form-action 'none'` still holds, because every form `preventDefault`s |

**Pagination, measured against a real search:**

| Case | Result |
|---|---|
| `?query=a`, **60 rapid scroll flips** over ~6 s | pages 2–11 requested, **0 duplicate page requests** |
| `?query=shubham-pandey` (33 results), 20 scroll flips | **exactly one** request for page 2, 33 cards, **exactly one** end-of-results banner |
| 1000 × 400 px viewport | ✅ paginates (6 pages) |

#### ⚠️ Deviations from the plans — read before S8

1. 🔴 **P21's headline claim did not reproduce, and the before/after proves
   it.** The same scroll scripts were replayed against a throwaway worktree
   built at `dae9883` (pre-P21): it also showed **zero duplicate page
   requests**, and it also paginated in a 400 px-tall viewport. React Query
   already ignores a `fetchNextPage` while one is in flight, so the missing
   callback guard never became the burst the plan describes; and the 40 px
   sentinel can always reach 100% visibility in a 400 px viewport, so
   `threshold: 1.0` never blocked pagination either. **The change is still
   right** — it stops depending on library de-duplication, and it stops tearing
   the observer down and rebuilding it on every fetch — but it is a robustness
   fix, not a measured saving. The one *visible* difference is the 200 px
   prefetch lead: the same scroll pattern reached page 11 instead of page 6.
   **Do not repeat the plan's "30 requests in 30 seconds" framing in the PR.**
2. **P20's "`C++` → returns results" criterion cannot be met, and it is not our
   bug.** `q=C++` is encoded correctly and reaches GitHub intact —
   `/search/users?q=C%2B%2B` returns `total_count: 0` from GitHub itself
   (`cpp` returns 6970). The app renders its zero-result empty state, which is
   correct behaviour. The half of the criterion that matters — *navigates
   correctly* — passes.
3. **`isValidLogin` is deliberately not used by the search box.** S5's note
   asks P20 to import `helper/validateLogin.ts` rather than re-derive rules.
   That is right for a *route param* and wrong for a *search query*: `C++` is a
   legal query and an illegal login, and P20's own acceptance criteria require
   it to work. The only rule the box enforces is the trimmed minimum length.
4. **`SearchBar` grew an `id` prop the plan does not mention.** Necessary, not
   decorative: on `/explore` and on the 404 page the navbar box and a hero box
   are on screen together, and two `<input>`s with one id break the label
   association for both.
5. **The mobile/desktop switch is `useMediaQuery`, not `sx` display rules.**
   The plan says "below the `sm` breakpoint render an `IconButton`"; doing that
   in CSS leaves both variants mounted, which is a duplicate id *and* two
   autofocus targets. Only one field is ever in the DOM.
6. **The compact variant submits through an `IconButton` inside the field's end
   adornment** rather than a second "Search" button — a 375 px toolbar has no
   room for a labelled button, and the icon carries `aria-label="Search"`.
7. **Both forms carry `role="search"`.** Not in the plan; it is one attribute
   and it is the landmark **P22** would otherwise have to add.
8. **P37 §3's "blur collapses it" is implemented as a panel-level `onBlur` with
   a `relatedTarget` containment check**, so moving focus from the field to its
   own submit button does not close the panel mid-interaction.
9. **The `docs/` half of P37's last bullet is not done** — it asks for a line in
   the **P33** README feature list and in `docs/PROJECT_LOG.md`. Neither file
   exists yet; both are **S11**'s (P36 creates `docs/`, P33 writes the README
   draft). Recorded there rather than done here — rule 4.
10. **One out-of-session commit, before the branch was cut.** `39b40dc`
    (`.gitignore` → `.netlify`) was an uncommitted change sitting in the working
    tree on `fix/netlify-dev-envfile`; it belonged to that branch's `netlify
    dev` work, so it was committed there rather than dragged into S7's diff.
    `feat/search` was then cut from it.

#### Observations that are nobody's plan

- ⚠️ **`/explore` and the 404 page now show two search boxes** — the navbar's
  compact one and the hero one in the empty state. That is what P37 asks for
  (§2 and §4 independently), and the hero box is the focal recovery action, but
  it is worth a look in **S9** when the pages are being re-measured. Collapsing
  it would mean hiding the navbar box on those two routes.
- **The mobile panel's field measures 294 px inside a 375 px viewport**, not
  the full 343 px available. Cosmetic; no overflow at any width tested.
- **`npm audit` still reports 13 advisories.** Untouched, unowned.
- **Bundle: 646.35 kB → 654.11 kB raw** (200.30 → 202.48 kB gzip).

#### Seen but deliberately NOT fixed (still open for their owning plan)

- `PageButton` / `PageQuickButtons` still render `<button>` + `navigate()`
  → **P23**
- `StarredUsersMenu`'s trigger has no accessible name and no `aria-haspopup`
  → **P22**
- `?page=999` still renders a clamped pagination bar over an empty list
  → **P23**'s natural moment (S5's observation, unchanged)
- `OrganizationTopRepos` still interpolates `username` into a rendered
  `github.com` href. Unowned; a rendered link, not an authenticated request
- The offline / `navigator.onLine` empty state — named in suggestions/10 §10f,
  owned by no plan

#### → How S8 branches from here

```bash
git checkout feat/search              # confirm with: git rev-parse --short HEAD
git checkout -b fix/a11y
```

Same rule as always: **cut from the previous session's tip**, and read it with
`git rev-parse` rather than trusting the SHA written above. `rework/2026` is
still at `27c9555` and has received none of S1–S7.

**What S8 inherits from S7:** `Navbar.tsx` now holds a search field, an
`IconButton` and a `Collapse`, all with their ARIA already in place — **P22
should not re-do them**, and must not replace the `useMediaQuery` switch with
CSS visibility (that would put two fields with one id in the DOM). `NotFound`
no longer has a `<Button>` to relabel. The one search form is
`components/SearchBar.tsx`, and it already carries `role="search"` and a real
`<label for>`, which closes suggestions/09 §9d.

---

### ✅ Loose ends — **landed 2026-08-07**
**Branch:** `chore/loose-ends`, tip `09f13d6` · cut from `feat/search`@`a536151`

Not a session. Four items that every report since S2 had carried forward with
no owner, plus one thrice-deferred plan item, done in one pass before S8 so
they stop being repeated in every summary.

| Commit | What |
|---|---|
| `59a1c45` | `OrganizationTopRepos`'s `github.com` href encodes both segments — **the last raw interpolation of a route param into a URL anywhere in the client** |
| `bba6ac5` | **The anti-flash theme script** (P35 §4, deferred three times) — 🚫 **later reverted**, see the simplification pass below |
| `602417d` | `npm audit fix` — **13 advisories → 2**, entirely inside the ranges `package.json` already declares, so only the lockfile moved |
| `91ba513` | `server/` deleted (V10 §10c) — one `npm init -y` manifest, no code, referenced nowhere |

**The theme script did work** — five scenarios in headless Chrome behind the
real CSP (stored dark on a light system, stored light on dark, no stored value
on each, a junk value), pre-JS background matching what React then paints in
all five, zero CSP violations. **It was removed anyway.** Making an inline
script legal under `script-src 'self'` meant pinning it with a SHA-256, and
keeping that hash honest meant a tool (`npm run csp-hash`) whose whole job was
to notice when a one-character edit had silently invalidated it — which is
exactly what happened on the first attempt. Three coupled parts, one failing
silently, to remove a brief flash. Wrong trade for this project; see the
simplification pass.

**Also closed here, from S1:** P03's skeleton animation, which S1 shipped
without the browser check its plan asked for. Measured in both themes with the
profile request held open: a real emotion keyframes animation (2 s) with
theme-aware colours. Not re-fixed — verified.

**What the audit left:** one advisory, on react-router 7.12–8.2, for **RSC
mode**. This app is a plain `BrowserRouter` SPA with no server components, so
it is not reachable, and clearing it means react-router **8** — a decision, not
a chore. **P31's CI audit step must not fail the build on a bare `npm audit`
until that is settled.**

---

### ✅ S8 — Accessibility — **landed 2026-08-07**
**Branch:** `fix/a11y`, tip `56dae26` · **Risk:** low-medium
**Cut from `chore/loose-ends`@`09f13d6`**, so it contains all of S1–S7 plus the
pass above. Nothing has been merged down to `rework/2026` yet; that still
blocks nothing.
**Plans:** P22 `3a5aeea` → P23 `035089c` → P24 `33d9461` → P25 `56dae26`

The app was fully usable with a mouse and close to unusable without one: no
control that was an icon had a name, the current page was signalled by colour
alone, the signature feature was 365 unlabelled divs, and the focus ring was
either invisible or clipped away. Gate green before every commit, plus
`npm run typecheck:functions` at the end.

#### What shipped

| Plan | Result |
|---|---|
| **P22** | `aria-label` on every icon-only control; `aria-pressed` on the star toggle; `aria-current="page"` on the active page; distinct `alt` per avatar; a `<main>` landmark and a `<nav>` around the pagination bar; `aria-haspopup`/`aria-expanded` on the starred menu. Two focus fixes: an inset ring for the diamond `PageButton` (its `clipPath` clips an outline away) and a **theme-wide 3px ring on every `ButtonBase`**, because MUI's default focus-visible is a 4%-opacity tint. |
| **P23** | `PageButton`, `PageQuickButtons` and the "Public Repos" card render `RouterLink` anchors; disabled arrows stay plain disabled buttons. New `repoPageLink()` in `helper/paginate.ts` — one definition of the URL, with the login encoded. |
| **P24** | Followers/Following become `Paper` cards sharing one shape constant with the link card. Same 90×90 geometry, full-contrast counts, and the affordance now only on the card that navigates. |
| **P25** | `role="grid"`/`row`/`gridcell` with a one-line summary and a per-cell "N contributions on Sat, 3 Aug 2025" used as both tooltip and accessible name; padding cells `aria-hidden`; the digits removed from the cells. Plus a whole-app contrast sweep. |

#### How it was verified

Everything below is **executed** in headless Chrome over CDP against the
production build, behind the same function stand-in and the real CSP.

| Check | Result |
|---|---|
| Controls with **no accessible name**, six routes | **0** (name computed as a screen reader does: text, `aria-label`, `aria-labelledby`, `title`, image `alt`) |
| `<main>` landmarks per page | **exactly 1** on all six |
| Avatar `alt` values in a results list | **21 images, 21 distinct** |
| Star toggle | `Star torvalds`/`aria-pressed=false` → click → `Unstar torvalds`/`true` + `["torvalds"]` in storage → click → back to `false` + `[]` |
| **Whole tab order walked with real Tab events** (repositories page) | **17 controls, every one with a computed focus indicator; zero without.** Before the theme override, four had none |
| Pagination on a 38-page user | page 1: two `<button disabled>` at `tabIndex -1` + five anchors with correct `href`s; middle page: seven anchors; last page: forward pair disabled; `aria-current` on the active number |
| Clicking "Next page" | SPA navigation — **zero document requests** |
| Stat cards, both themes | `tabIndex` 0 / −1 / −1, no `disabled` anywhere, all three exactly **90×90**, counts at **9.25:1** (dark) and **13.79:1** (light) |
| Contribution grid | 53 rows, 371 cells, **370 labelled**, 1 padding cell `aria-hidden`, **0 characters of text painted in the grid**, **0 cell tab stops** (profile page total: 6) |
| Grid tooltip on hover | "2 contributions on Thu, 19 Feb 2026" |
| **Contrast sweep — every text node, 6 routes × 2 themes** | **0 failures** (WCAG 2.1 thresholds, 3:1 for large/bold text) |
| CSP violations / console errors across the whole sweep | **0 / 0** |

#### ⚠️ Deviations from the plans — read before S9

1. **The contrast audit found four failures, and none of them are the three
   P25 §4 names.** The plan lists the grey `>>>`, `PageButton`'s gold, and the
   dark-mode secondary text. Measured: the grey chevrons **do** fail (2.9:1
   light, 3.9:1 dark) and are fixed; the gold and the dark secondary **pass**
   and were left alone. What actually failed instead: MUI's default outlined
   **primary and info chips** on the repository page (4.18 and 3.51 on the
   app's `#f5f5f5` paper) and the **active page number on the dark theme's
   green** (3.89). Fixed via two theme overrides and a white numeral. **This is
   the argument for sweeping rather than checking a list.**
2. 🔴 **A real bug was found inside the element that failed hardest.**
   `ProfileInfo` compared `x_handle !== "Not Provided"` while the mapper writes
   `"🚫 Not Provided"` — so the check never matched and **every account without
   an X handle rendered a live link to `https://x.com/🚫 Not Provided`**. The
   sentinel is now an exported `NOT_PROVIDED` constant. Outside P25's scope on
   paper; it was one line from the colour being changed, and leaving a link to
   a nonsense URL in place while fixing its colour would have been absurd.
3. **P22's `<Box component="main">` also required the `Box` import in
   `App.tsx`** and the `Routes` block to be re-indented — the diff looks larger
   than the change.
4. **The theme-wide focus ring is not in any plan.** P22 §5 asks only for the
   diamond `PageButton`. Walking the tab order showed the navbar search button
   and two pagination arrows with no visible focus either, all for the same
   reason (MUI's tint), so the fix went into the theme where it covers every
   control including ones not yet written. `PageButton` still opts out.
5. **`repoPageLink()` is not in P23 either.** Three components were building
   the same URL by hand, and one of them interpolated the login raw. One
   exported function, encoded, in the file that already owns pagination
   arithmetic.
6. **`Pagination` gained `component="nav"` + `aria-label`.** Not in P22's
   table; a bar of seven links with no grouping is the case `nav` exists for,
   and it is what made the verification selectors honest.
7. **No axe DevTools run.** P22 and P25 both name it. `axe-core` is an npm
   dependency and rule 5 forbids adding one, and the CSP blocks loading it from
   a CDN. The substitutes are the accessible-name computation, the tab-order
   walk and the contrast sweep above — narrower than axe, but **executed
   against the real rendered DOM** rather than inspected. **P29/P30 should add
   `jsx-a11y` and, if a dev dependency is acceptable there, a real axe run.**
8. **The X-handle link is `<Link>` (MUI) rather than a bare `<a>`**, so it
   inherits theming; `encodeURIComponent` was added on the handle at the same
   time, for the same reason as deviation 5.

#### Observations that are nobody's plan

- **The 371 tooltips cost ~7 kB** (654.11 → 661.52 kB raw, 204.77 kB gzip).
  **P27**'s code splitting is measured against P00's baseline, so subtract this
  and S7's ~8 kB before reading its gain.
- **`npm audit` reports 2 advisories**, both the react-router RSC one. Down
  from 13.

#### Seen but deliberately NOT fixed (still open for their owning plan)

- **`?page=999` still renders a clamped bar over an empty list.** S5 named
  **P23** as its natural moment; P23's own scope is the button→link conversion
  and its Do-NOT list forbids restyling, so redirecting a nonsense page number
  is still unowned. It does not crash and the arrows work.
- `/explore` and the 404 page still show two search boxes (navbar + hero) —
  S7's observation, and **S9**'s natural moment since it re-measures those
  pages.
- No skip link — P22 rules it out explicitly for a two-item navbar.
- The offline / `navigator.onLine` empty state — suggestions/10 §10f, unowned.

#### → How S9 branches from here

```bash
git checkout chore/simplify           # confirm with: git rev-parse --short HEAD
git checkout -b perf/assets
```

**What S9 inherits:** P26 must re-check that `netlify.toml`'s `/assets/*` rule
still matches after the image masters move. The contribution grid's cells are
`role=gridcell` with tooltips and **no text**; do not restore the digits. And
the contrast sweep is a repeatable check, not a one-off claim — re-run it after
P26 changes images and P27 changes what renders when.

---

### ✅ Simplification pass — **landed 2026-08-08**
**Branch:** `chore/simplify`, tip `c598359` · cut from `fix/a11y`@`38a0f55`

Not a session, and not a fix — a deliberate reversal. **This is a portfolio
project demonstrating solid basics, not a product with a threat model**, and
four things had grown past what a MERN developer reading the repo should have
to decode. One of them was added three commits earlier, in the loose-ends pass.

| Removed | Replaced by | Why |
|---|---|---|
| The **anti-flash inline script**, its `'sha256-…'` in `script-src`, and `client/scripts/csp-hash.mjs` + its npm script | Nothing. `script-src` is plain `'self'` | Three coupled parts — script, hash, hash-checker — where the coupling **fails silently**: a one-character edit invalidates the hash and the browser drops the script with no error. To remove a brief flash on first load. The CSP is worth one line of config; it stops being worth it the moment it needs its own tooling |
| **`env.mts`'s 61-line validator** — `TOKEN_SHAPE` regex over four PAT prefixes, `tokenIssue()`, `parseEnv()`, `ServerEnv` | 15 lines exporting `GITHUB_TOKEN`, throwing at cold start if it is empty | Netlify either has the variable or it does not. Validating that a string starts with `ghp_` does not make the deploy safer; it makes the file look like it is guarding something |
| **`useInfiniteUsers`' five explicit generics**, including `InfiniteData<T, number>` and `ReturnType<typeof qk.searchUsers>` | `initialPageParam: 1`, and inference | React Query infers all five. The generics were a workaround that outlived its reason, and they are the most advanced TypeScript in the codebase for no gain |
| **`SearchBar`'s `slotProps.input.endAdornment`** wrapper, and `Navbar`'s `onBlur` `relatedTarget` containment check | A sibling `IconButton`; Escape and submit already close the panel | Both were the clever version of something with an obvious version |

**Kept, deliberately:** the CSP header itself, the Netlify function proxy, Zod
schemas, the typed error classes, `queryKeys`, `paginate`, `storage`, and the
`endpoint()` wrapper. None of those is exotic — they are the ordinary way these
problems are solved, they each remove repetition rather than adding a layer,
and every one of them is something a MERN developer meets in normal work.

**Verified unchanged afterwards**, all executed: 8 routes rendering with one
API request per resource; the full search sweep; the mobile navbar (icon,
expand, autofocus, Escape, close-on-submit, **0 px** horizontal overflow);
infinite scroll fetching exactly one page per scroll-to-bottom with exactly one
end banner; and **zero** nameless controls, CSP violations or console errors
anywhere. Gate green, including `npm run typecheck:functions`.

#### The rule this sets for S9–S11

**If a MERN beginner cannot read it once and see why it is there, it does not
belong in this repo.** Concretely, for the sessions that remain:

- **P27** (code splitting): `lazy` + `Suspense` is fine. A manual `manualChunks`
  vendor-splitting config is not — measure first, and only if the number
  justifies it.
- **P29** (eslint): enable `jsx-a11y` and leave it there. No custom rule
  authoring, no plugin-writing.
- **P30** (tests): Vitest over the pure helpers — `paginate`, `parsePage`,
  `githubUrls`, `validateLogin`, `repoPageLink`. **No MSW, no Playwright, no
  test factories.** The plan already scopes it that way; keep it there.
- **P31** (CI): lint, typecheck, test, build. Nothing else, and **`npm audit`
  must not fail the build** while the react-router 8 decision is open.
- **Anything that needs a second tool to keep the first tool honest is the
  signal to stop and pick the boring option.**

---

### ✅ S9 — Assets & performance — **landed 2026-08-08**
**Branch:** `perf/assets`, tip `c9e4b32` · **Risk:** medium
**Cut from `chore/simplify`@`c598359`**, so it contains all of S1–S8 plus both
passes. Nothing has been merged down to `rework/2026` yet; that still blocks
nothing.
**Plans:** P26 `4586957` → P27 `c9e4b32`

The most visible problem after the token: **3.0 MB of images**, a 1.4 MB
favicon declared `type="image/svg+xml"`, and every page in one JavaScript
bundle. Gate green before both commits, plus `npm run typecheck:functions`.

#### What shipped

| Plan | Result |
|---|---|
| **P26** | Favicons generated with PIL into `client/public/` — 16/32/180 px at **884 B / 2.7 kB / 36 kB**, correctly typed, served from the site root. Navbar logos resampled **in place** to 240×100 (2× their 120×50 display size): **505 kB → 14 kB** and **548 kB → 30 kB**. Four masters `git mv`d to `docs/assets-source/`. |
| **P27** | `Explorer`, `LinkWrapper` and `ShowSelectedRepo` are `lazy()`, behind one `<Suspense>` inside the `<main>` landmark and inside `AppErrorBoundary`. |

#### The numbers, against the P00 baseline

| | P00 baseline | After S9 |
|---|---|---|
| `dist/assets` | **3.0 MB** | **704 kB** |
| Images in the bundle | 2,475,201 B | **43,533 B** |
| JS on `/` | 571,526 B · 179.10 kB gzip | **492,546 B · 155.60 kB gzip** |

The JS figure is a real reduction *despite* the bundle having grown between the
audit and now — Zod (~19 kB gzip) and everything S5–S8 added. Immediately
before P27 it was **659,630 B**; splitting took **167 kB** off the landing page.

#### How it was verified

**Measured in headless Chrome against the production build, not read off the
build output** — P27 warns that silent non-splitting is the normal failure mode.

| Check | Result |
|---|---|
| Cold `/` | **one chunk**, `index-*.js`, **492,546 B** of JS |
| → `/explore` | `+ EmptyState`, `+ Explorer`, `+ ErrorState` |
| → `/user/torvalds` | `+ LinkWrapper`, `+ Star` |
| → `/user/torvalds/linux` | `+ ShowSelectedRepo` |
| Deep link straight to a lazy route | renders, 631,208 B total |
| Logo, `deviceScaleFactor: 2`, both themes | natural **239×100 / 240×99**, displayed **120×50** — exactly 2×, and screenshots show a clean resample |
| `/favicon-32.png`, `/favicon-16.png`, `/apple-touch-icon.png` | **200 `image/png`** |
| Failed requests / console errors / CSP violations | **0 / 0 / 0** |
| Re-run of the S8 sweeps | 8 routes with one API request per resource, zero nameless controls |

✅ **`netlify.toml`'s `/assets/*` rule still matches**, including the six new
chunks. The favicons sit at the site root, unfingerprinted and **deliberately
outside** that `immutable` rule.

#### ⚠️ Deviations from the plans

1. **`github-logo-cropped.png` was moved to `docs/assets-source/` too** — P26
   names three masters, but once `index.html` points at `/favicon-*.png` the
   1.4 MB cropped logo is unused, and it is a master by the same argument. That
   move *is* most of P26's gain.
2. **The favicon source is padded to a square before resizing**, not resized
   into one. The master is 959×973; the plan's `resize((32, 32))` would squash
   it 1.5%. Three lines to avoid.
3. **`NotFound` was deliberately left static**, against P27 §1's list.
   `ProfileInfo`, `Repositories` and `ShowSelectedRepo` all import it directly
   for invalid params, so it is in the graph regardless — `lazy()` there would
   have split nothing while looking like it had. This is precisely the failure
   P27 §3 tells you to check for, so it was checked rather than assumed.
4. **The `<Suspense>` fallback is a two-line inline skeleton in `App.tsx`**, not
   a new component file. It is on screen for a few milliseconds; a dedicated
   file would be more surface than the thing it renders.
5. 🚫 **No prefetch-on-hover** (P27 §4, optional) and **no
   `rollup-plugin-visualizer`** (suggestion 7e). Both are optimisations of an
   optimisation. `vite build` already prints raw and gzip per chunk, which is
   where every number above came from, and 7e is now recorded as won't-do.
6. **No `.webp` variants** — P26 says skip unless the PNG is still large. At
   14 kB and 30 kB they are not.

#### Observations that are nobody's plan

- **The favicons have no cache header**, because they are outside `/assets/*`
  and there is no rule for the site root. Netlify's default is fine for files
  requested once per visit; worth a `max-age` line only if it ever shows up in
  a Lighthouse run.
- **`docs/assets-source/` is 7.2 MB in the working tree.** The history already
  carries those bytes and P26 forbids rewriting it, so this changes clone size
  by nothing — it only takes them out of the deployed bundle, which was the
  point.
- **`npm audit` still reports 2 advisories**, both the react-router RSC one.

#### → How S10 branches from here

```bash
git checkout perf/assets              # confirm with: git rev-parse --short HEAD
git checkout -b chore/tooling
```

**What S10 inherits:** the routes are `lazy()`, so **P30 and P31 must read the
chunk list rather than trusting a green build** — a stray static import
silently un-splits a page. `client/public/` and `docs/assets-source/` are new
directories; **P36 should leave `docs/assets-source/` where it is.** And the
simplification pass's rule applies hardest here: P29 enables `jsx-a11y` and
writes no custom rules, P30 tests the pure helpers with no MSW or Playwright,
P31's CI is lint/typecheck/test/build, and **`npm audit` must not fail the
build** while the react-router 8 decision is open.

---

### ✅ S10 — Tooling & CI — **landed 2026-08-08**
**Branch:** `chore/tooling`, tip `0bf39e5` · **Risk:** low
**Cut from `perf/assets`@`c9e4b32`**, so it contains all of S1–S9 and both
short passes. Nothing has been merged down to `rework/2026` yet.
**Plans:** P29 `4a38f54` → P30 `1a8969c` → P31 `180496c` → P32 `0bf39e5`

The repo had no accessibility lint rules, **zero test files**, no `.github/`
directory at all, and nothing watching 4,000 lines of transitive dependencies.
Gate green before every commit — now five steps, including the new
`npm run test:run`.

#### What shipped

| Plan | Result |
|---|---|
| **P29** | `jsx-a11y/recommended` + `react/jsx-no-target-blank` with `enforceDynamicLinks`, and the load-bearing `linkComponents` setting so the link rules can see MUI's `component=` form. |
| **P30** | Vitest + jsdom, **5 suites / 84 tests / 1.2 s**: `validateLogin`, `paginate`, `githubUrls` + `parsePage`, `storage`, `simplifyGitHubResponse`. |
| **P31** | `.github/workflows/ci.yml` — lint, client typecheck, **functions typecheck**, tests, build, plus an advisory audit, on Node 22. |
| **P32** | `.github/dependabot.yml` — monthly, `directory: /client`, MUI/Emotion and dev deps grouped, plus the `github-actions` ecosystem. |

#### How it was verified

**Every claim below is a measurement, and two of them came back negative.**

| Check | Result |
|---|---|
| Whole ruleset on the existing code | **4 errors**, all `jsx-a11y/no-autofocus`, nothing else — the P22–P25-first ordering did what it was for |
| Delete one `rel="noopener noreferrer"` | ✅ **lint fails at that line**; restoring it goes green |
| Delete the star button's `aria-label` | 🔴 **lint stays green** — see deviation 2 |
| `npm run test:run` | **84 passed** in 1.16 s |
| Restore the pre-P15 `totalPageCount`, re-run | ✅ **the NaN test fails**, the other 16 pass; restore → green. Index rule 8, checked rather than claimed |
| All seven CI step commands, run locally in order from `client/`, starting at a clean `npm ci` | **every one passes** |
| `ci.yml` / `dependabot.yml` parsed as YAML | ✅ both |
| Browser sweep after the `autoFocus` → `focusOnMount` rename | home field and mobile panel still take focus; zero CSP violations, zero console errors |

#### ⚠️ Deviations from the plans

1. **P29's four `no-autofocus` errors were one decision, not four.**
   `SearchBar`'s prop is renamed `autoFocus` → `focusOnMount`, which is a
   better name and leaves exactly one site where this reaches the DOM. That
   site carries the single `eslint-disable-next-line` **with its reason**; the
   rule still fires on any real `autoFocus` added later. The alternative —
   `ignoreNonDOM: true` — would have silenced the rule everywhere in a codebase
   that renders no raw DOM controls, which is a rule that can never fire.
2. 🔴 **P29's acceptance criterion "removing an `aria-label` → lint error"
   cannot be met, and I could not make it true.** Every interactive element
   here is a MUI component; `jsx-a11y` matches JSX element names, so
   `control-has-associated-label` sees no `<button>` and reports nothing. This
   was tested by actually deleting the label and running both the recommended
   set and that rule explicitly. **Recorded rather than papered over** with a
   rule that looks like coverage and provides none — the accessible-name
   guarantee is S8's runtime sweep, and that is now written into the docs.
3. **P30 installed two dev dependencies, not four.** `@testing-library/react`
   and `jest-dom` are only needed for component tests, which the plan itself
   rules out for now. Fewer moving parts, same coverage.
4. **A `githubUrls` + `parsePage` suite was added**, which P30's file list does
   not name — the branch notes flagged them as the highest-value security
   regression tests, and they are: `usersUrl("x/../../orgs/github")` keeping
   `%2F`, and `"a&per_page=100"` staying one `q` value.
5. **CI has a sixth step the plan does not list:
   `npm run typecheck:functions`.** `tsc -b` does not see
   `netlify/functions/`, so without it the proxy is only typechecked at deploy.
6. **P31's "first run is green" and "cache hit on the second run" could not be
   observed.** There is no remote for this branch and pushing is not mine to
   do. What *was* done instead: every step command run locally in order from a
   clean `npm ci`. **The commands are green; the badge is unobserved.**
7. **P32's `directory: /client` needed no decision.** The plan hedges it
   against a root `package.json`/lockfile mismatch — the root has no
   `package.json` at all now, so `/client` is simply the only tree.

#### Observations that are nobody's plan

- ✅ **`npm audit` now reports 0.** It went 13 → 2 in the loose-ends pass, then
  **2 → 0 on the same installed `react-router@7.18.2`** — the advisory's
  affected range was revised upstream, with no change here. **The
  "react-router 8 decision" earlier reports flagged is moot.** It is also the
  best possible argument for CI's audit step being advisory: the number moved
  without a commit.
- **The test files are typechecked by `tsc -b`**, so a test that stops
  compiling is a red build rather than a silent skip.
- **Bundle unchanged** — nothing shipped to the client in this session.

#### 🔴 What is on you after S10

Repo settings, which only the owner can click (V10 §10e):

1. **Settings → Code security → Dependabot alerts** and **Dependabot security
   updates** — the config file schedules version bumps; alerts are separate.
2. **Settings → Code security → Secret scanning** and **Push protection.**
   This is the one directly tied to
   [`vulnerabilities/01`](vulnerabilities/01.exposed-github-token.md): push
   protection would have made the original token uncommittable.
3. **Watch the first CI run** and confirm it is green — see deviation 6.

#### → How S11 branches from here

```bash
git checkout chore/tooling            # confirm with: git rev-parse --short HEAD
git checkout -b docs/readme
```

**What S11 inherits:** `docs/` already exists — S9 put the image masters in
`docs/assets-source/`, and **P36 should leave them there**; it is also where an
`og:image` capture would be generated from. **P33's CI badge must match the
workflow filename** (`ci.yml`). And describe the test suite honestly: it is
pure-logic coverage, not component or end-to-end tests.

---

### 🟢 S11 — Docs & licence  ← next, and last
**Branch:** `docs/readme`, off `chore/tooling`@`0bf39e5` · **Risk:** none · **~1.5 h**
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
                                    └── ✅ S5  error-states  924fbfb
                                            └── ✅ S6  context-storage  6220418
                                                 (+ fix/netlify-dev-envfile  39b40dc)
                                                    └── ✅ S7  feat/search  a536151
                                                         (+ chore/loose-ends  09f13d6)
                                                            └── ✅ S8  fix/a11y  38a0f55
                                                                 (+ chore/simplify  c598359)
                                                                    └── ✅ S9  perf/assets  a45e1ae
                                                                            └── ✅ S10  chore/tooling  0bf39e5  ← branch from here next
                                                                    ├── S9  perf/assets
                                                                    └── S10 tooling
    S11 docs/readme      ← only needs S1 (stack it on 0bf39e5 anyway)
```

This tree is **branch ancestry, not merge order**. Each session is cut from the
one above it; merging down to `rework/2026` can happen at any point after, and
so far has not happened at all. Ten sessions are done; the next branch is cut
from `0bf39e5`, and it is the last one.

**Note the shape change:** S4 and S5 were drawn as siblings off S3. They are not
— S4 landed first, and S5 is cut from it. Nothing forced that order (they share
no files), but stacking keeps a single line of history instead of a second stack
to reconcile later. **S6 was drawn detached** — it only needs S1 — and was
stacked on S5 anyway, for the same reason. **S11 is the last one still drawn
that way; stack it too.** Ten sessions plus two short passes, a single line of
history, no merge commits.

~~**Critical path to the security fix: S1 → S2 → S3 → S4.**~~ ✅ **All four have
landed. V01 is closed in code.** What remains is not a plan — it is the Netlify
env var and the token revocation, both of which only you can do. See
[What is still on you after S4](#-what-is-still-on-you-after-s4).

**S11 is independent** — it only needs S1, so it *may* be cut from
`fix/quick-wins`@`ac4186a`. Cutting it from `0bf39e5` instead keeps the single
line every session so far has stayed on. ~~Same for S6~~ — **S6 has landed**,
stacked on S5.

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

## ✅ Outstanding action — cleared

🔴 ~~**Add `GITHUB_TOKEN` in Netlify, then revoke the exposed PAT.**~~
✅ **Done** — confirmed by the repo owner on 2026-08-07, after S5. **V01 is now
closed in reality, not only in code.** The token no longer exists anywhere the
browser can reach it, the exposed PAT is revoked, and the site's requests are
served by `netlify/functions/` with a credential the bundle never sees.

Kept here as history, because it is the finding this whole rework exists for:
the deployed bundle contained **four occurrences of a live `ghp_`-prefixed
token**, inlined by Vite because the variable was `VITE_`-prefixed. There was
no client-side fix — a browser cannot hold a secret — so the credential moved
(**S4**), and then the credential itself was rotated (this).

**Nothing in this plan set is blocked on anything now.** Every remaining
session is implementable end to end.
