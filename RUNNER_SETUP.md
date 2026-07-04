# Self-hosted runner setup (Windows desktop)

Goal: pushes to this repo run CI on **your machine**, not on GitHub-hosted
runners. The runner connects **outbound** to GitHub, so it works behind your
home/office router — **no port forwarding, no public IP**.

> Use self-hosted runners only on **private** repos. Keep this sandbox private.

## 1. Register the runner

1. On GitHub: **repo → Settings → Actions → Runners → New self-hosted runner**.
2. Pick **Windows / x64**. GitHub shows a token and the exact commands. They look
   like this (run in PowerShell; the token is single-use and expires in ~1 hour):

```powershell
# In a folder OUTSIDE the repo, e.g. C:\actions-runner
mkdir C:\actions-runner; cd C:\actions-runner
# download (use the URL/version GitHub shows you)
Invoke-WebRequest -Uri https://github.com/actions/runner/releases/download/vX.Y.Z/actions-runner-win-x64-X.Y.Z.zip -OutFile runner.zip
Expand-Archive runner.zip -DestinationPath .

# configure against THIS repo (copy the exact --url and --token from GitHub)
.\config.cmd --url https://github.com/<owner>/sahayogi-ci-sandbox --token <TOKEN>
```

Accept the defaults (runner group `Default`, a name, and labels — keep the
`self-hosted` label, which our workflows target).

## 2. Run it

```powershell
# Foreground (simplest for testing — leave this window open):
.\run.cmd

# OR install as a Windows service so it survives reboots:
.\svc install
.\svc start
```

## 3. Verify

- GitHub → Settings → Actions → Runners: your runner shows **Idle** (green).
- Open a PR (or push to `main`). The **CI** workflow runs, and the
  **"Where am I running?"** step prints your runner name + OS.
- GitHub → the run's page shows it used your self-hosted runner (0 GitHub-hosted
  minutes billed).

## Moving to a server later

The same steps work on an **Azure VM / AWS EC2 / private server** — install the
runner there instead of the desktop. Nothing in the repo changes; only where the
agent lives. For heavier jobs later, install the real toolchain on the runner
(Node 24, pnpm 11, Docker, Azure CLI + bicep for deploys).

## Mac / Windows desktop builds (for the real repo)

In `sahayogi_one`, `desktop-release.yml` uses `macos-15` and `windows-2025`.
macOS builds **require Apple hardware** and Windows builds require Windows — a
single Linux/Windows runner cannot self-host the mac job. Leave those on
GitHub-hosted (or add a Mac) and self-host the ubuntu jobs (`ci.yml` etc.).
