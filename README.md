# sahayogi-ci-sandbox

A **throwaway sandbox** to validate the whole system end-to-end **before** touching
the production `sahayogi_one` repo:

1. **Self-hosted runner** — pushes run CI on *your* machine, not GitHub-hosted
   runners (this is the cost win).
2. **Code Review Platform** — PRs from here appear in the dashboard, and Merge /
   Re-run CI / Deploy / switch-product are driven from there.

It deliberately mirrors `sahayogi_one`'s layout so what we prove here transfers:

```
apps/
  boss/web/     ← product "boss",  surface "web"
  setu/web/     ← product "setu"
  tax/web/      ← product "tax"
.github/workflows/
  ci.yml        ← runs-on: self-hosted   (on push + PR)
  deploy.yml    ← runs-on: self-hosted   (on workflow_dispatch — the Deploy button)
scripts/ci.mjs  ← trivial, dependency-free CI body
```

**Product** = a top-level folder under `apps/` (this is what the dashboard's
product switcher uses). Everything in CI is trivial (echoes / `node`) on purpose —
the point is *where* it runs, not what it does.

## Getting it live (one-time)

1. **Create + push the repo** — see the commands at the bottom of this file.
2. **Register the self-hosted runner** — follow [`RUNNER_SETUP.md`](RUNNER_SETUP.md).
3. **Create the GitHub App** — follow [`GITHUB_APP_SETUP.md`](GITHUB_APP_SETUP.md).
4. Point the Code Review Platform's `.env` at this repo + App, start it, expose it
   with a tunnel, and open a PR here.

## What "done" looks like

- Open a PR → CI shows **"Runner OS"** = your machine, GitHub-hosted minutes used = 0.
- The PR appears in the dashboard; **Merge** merges it on GitHub.
- **Deploy** dispatches `deploy.yml` on your runner.

## Push commands (after `gh auth login`, or create the repo in the GitHub UI)

```bash
# Option A — GitHub CLI (after: gh auth login)
gh repo create sahayogi-ci-sandbox --private --source . --remote origin --push

# Option B — manual: create an empty private repo in the GitHub UI, then:
git remote add origin https://github.com/<owner>/sahayogi-ci-sandbox.git
git push -u origin main
```
