# GitHub App setup

The Code Review Platform talks to GitHub as a **GitHub App installation** (never a
personal token). One App works across all repos it's installed on. Create it once.

## 1. Start a tunnel (so GitHub can reach your local platform)

GitHub must POST webhooks to your machine. On a desktop, expose the platform's
port `3000` with a free tunnel and copy the public URL:

```bash
# Cloudflare (no signup):
cloudflared tunnel --url http://localhost:3000
# …or ngrok:
ngrok http 3000
```

Your webhook URL will be: `https://<tunnel-host>/code-review/webhook`

## 2. Create the App

GitHub → your **profile (or org) → Settings → Developer settings → GitHub Apps →
New GitHub App**.

- **Name:** e.g. `sahayogi-code-review` (must be globally unique)
- **Homepage URL:** anything (e.g. your tunnel URL)
- **Webhook → Active:** ✅ on
- **Webhook URL:** `https://<tunnel-host>/code-review/webhook`
- **Webhook secret:** generate a random string and **save it** — it goes in the
  platform `.env` as `GITHUB_WEBHOOK_SECRET`.

**Repository permissions** (minimum for our features):

| Permission | Access | Why |
|---|---|---|
| Metadata | Read-only | required |
| Contents | Read-only | read files / diffs |
| Pull requests | **Read & write** | list PRs + **Merge** button |
| Checks | **Read & write** | publish the rule-engine gate |
| Actions | **Read & write** | **Re-run CI** + **Deploy** (workflow_dispatch) |

**Subscribe to events:** Pull request, Pull request review, Workflow run,
Deployment status, Check run.

**Where can this be installed:** Only on this account.

Click **Create GitHub App**.

## 3. Collect credentials

- On the App page, note the **App ID**.
- **Generate a private key** → downloads a `.pem` file. Keep it safe.
- **Install App** (left menu) → install on **`sahayogi-ci-sandbox`** (select the
  single repo). After installing, the URL is
  `…/installations/<INSTALLATION_ID>` — note that **Installation ID**.

## 4. Put them in the platform `.env`

In the code-review platform repo's `.env`:

```env
GITHUB_APP_ID="<App ID>"
GITHUB_APP_INSTALLATION_ID="<Installation ID>"
GITHUB_WEBHOOK_SECRET="<the webhook secret from step 2>"
# paste the PEM contents (keep the BEGIN/END lines; use real newlines or \n)
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----"
```

Restart the platform. `GithubClient.isConfigured()` will now be true, and the
webhook → sync → gate → dashboard flow runs against this sandbox repo.

> When you're ready for production, install the **same App** on `sahayogi_one`
> (add the repo to the installation) — no new App needed.
