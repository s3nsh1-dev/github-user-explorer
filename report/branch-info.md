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
have already rewritten.

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

### ✅ S2 — Request safety *(hook layer, part 1)* — **landed**
**Branch:** `fix/request-safety` · **Risk:** medium · **~2.5 h**
**Plans:** P05 `05f757e` → P07 `b22c5dc` → P08 `7dc2c03`

Fixes the two highest-severity issues reachable without the proxy: **GraphQL
injection (V02)** and **URL tampering (V03)**.

All three plans rewrite the same 8 files in `client/src/hooks/`. P05 also breaks
3 components (it returns `data` instead of the GraphQL envelope) and must fix
them in the same commit.

**Do not split this session.** P07 and P08 both assume P05's `githubFetch` /
`githubGraphQL` exist.

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

---

### 🔴 S4 — Proxy & deploy — **THE CRITICAL FIX**
**Branch:** `fix/token-proxy` · **Risk:** high · **~5 h**
**Plans:** P28 (step 4 only) → P34 → P35

Closes **V01**, the exposed token. Earliest possible point — P34 depends on
P05/P07/P08/P09, so it cannot run before S3.

New territory: `netlify/functions/**`, `netlify.toml`. Also strips all 8
`VITE_*` reads and 9 `Authorization` headers from the client — which is a
one-file change *only because* P05 centralised them.

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

---

### 🟡 S8 — Accessibility
**Branch:** `fix/a11y` · **Risk:** low-medium · **~2.5 h**
**Plans:** P22 → P23 → P24 → P25

Heavily overlapping files: `PageButton.tsx` appears in P22, P23 and P25;
`UserProfileStats.tsx` in P23 and P24. Splitting these would mean editing the
same components three times.

P25 makes one deliberate visual change (contribution-grid numbers → tooltips).

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
