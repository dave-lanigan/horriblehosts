# HorribleHosts

A mobile-first, publicly anonymous guest journal for Airbnb and Vrbo experiences. Anyone can read and search stories for free. Publishing requires a Clerk session, verified on the server. Built with **Bun, Nuxt 4, shadcn-vue, Clerk, and Turso**.

## Local setup

Install Bun, then run from the project directory:

```sh
bun install --frozen-lockfile
cp .env.example .env
bun run dev
```

Open `http://localhost:3000`. With no credentials, the app shows **clearly marked fictional examples**, not real reviews. Publishing is unavailable; a configured empty database shows an empty community feed instead of examples.

Put credentials in the ignored `.env` file:

| Variable | Purpose |
| --- | --- |
| `NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (safe for the browser) |
| `NUXT_CLERK_SECRET_KEY` | Clerk server secret; never expose it publicly |
| `NUXT_TURSO_DATABASE_URL` | Turso `libsql://…` database URL |
| `NUXT_TURSO_AUTH_TOKEN` | Turso database auth token |
| `NUXT_POST_AUTHOR_SECRET` | Stable random secret, at least 32 characters, used to pseudonymize author IDs |

Generate the author secret with:

```sh
bun -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Create a Clerk application, enable your preferred sign-in methods, and copy its keys. Both Clerk keys must be present when Nuxt starts or builds: the module is intentionally disabled without them so public preview doesn't create a keyless Clerk application. Restart the dev server after changing keys.

Create a Turso database and token with the Turso CLI:

```sh
turso db create horriblehosts
turso db show horriblehosts --url
turso db tokens create horriblehosts
```

The server creates the report table and indexes on first database access using idempotent SQL. The database token needs schema/write permissions. To use local SQLite instead, create `.data` and set `NUXT_TURSO_DATABASE_URL=file:./.data/horriblehosts.db`; no Turso token is needed locally. Never use a file database on Vercel.

## Validation

```sh
bun run test
bun run typecheck
bun run build
bun run preview
```

Tests cover input bounds, supported values, consent, date validation, and the public response allowlist. For an end-to-end check with your service credentials, sign in, submit a story, then open its URL in a private browser window. Verify that the story is readable without signing in and that no account information appears.

## Deploy to Vercel

1. Import this repository and select the Nuxt framework.
2. Use Bun with the committed `bun.lock`. `vercel.json` sets `bun install --frozen-lockfile` and `bun run build`; Nitro automatically detects Vercel and creates server functions.
3. Add the **same five environment variables** above in Vercel's Environment Variables UI for the appropriate production/preview environments. Do not upload `.env`.
4. Configure Clerk's production domain and allowed redirect URLs for the deployed site. Use separate development/production Clerk instances as recommended by Clerk.
5. Deploy or redeploy after setting variables. Clerk keys must be available during the build, not only after deployment.
6. Visit `/`, `/submit`, and a published story while signed out. Confirm public browsing works and direct unauthenticated `POST /api/reports` requests return `401`.

Only the publishable Clerk key is public. Turso credentials, the Clerk secret, and the author secret stay server-side. Don't enable shared HTML caching on authenticated pages.

## Smartphone installation and performance

The app includes a web manifest, 192/512-pixel icons, a maskable icon, and a service worker. Chrome on Android offers **Install app** or **Add to Home screen**; the site also shows an install button when the browser supplies an install prompt. On iOS, use Safari → Share → Add to Home Screen. Serve over HTTPS (localhost is exempt).

Only static assets and a dedicated offline connection reminder are precached. API responses, story HTML, and account information are **not** cached by the service worker. Reading and posting require connectivity. Updates are offered with a prompt so an in-progress draft is not automatically reloaded.

Public feeds are server-rendered and paginated (12 stories per page). Queries are parameterized; feed ordering and author quotas have indexes. The responsive UI uses local system fonts, no remote images, labeled controls, keyboard focus states, and reduced-motion support.

## Privacy and launch responsibilities

“Anonymous” means **anonymous to public readers**, not untraceable. Public APIs select an explicit field allowlist and never return author hashes. The database stores a keyed HMAC of the Clerk user ID for abuse prevention, not the raw user ID. Operators with the key and account access may still associate reports with accounts. Clerk, hosting providers, and legal requests may involve identifying information; users may identify themselves through their story. Protection from retaliation cannot be guaranteed.

Posts must be first-hand and truthful, with no doxxing, threats, or identifying personal details. Vue renders stories as text, never raw HTML. Writes require a verified Clerk session and a same-origin JSON request. An atomic database quota limits accounts to five stories per rolling 24 hours.

This initial version has no automated moderation or self-service report editing/deletion. **Before public launch, provide a monitored support/removal channel and a moderation process**, review applicable privacy/legal requirements, and add a retention policy. Operators can remove a report with a parameterized database deletion by its public report ID. Deleting a Clerk account does not automatically delete its stories. The in-app community/privacy page discloses these limits.

## Development skills

The requested skill packages were installed in the development environment, not bundled with the deployed app:

```sh
bunx --bun skills add unovue/shadcn-vue
bunx --bun skills add clerk/skills
bunx --bun skills add vercel-labs/agent-skills
bunx --bun skills add nextlevelbuilder/ui-ux-pro-max-skill
```

The official Nuxt and shadcn-vue CLIs generated the starter and UI components. `components.json` allows additional shadcn-vue components to be added with Bun.
