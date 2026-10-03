# Activate NOOR account sync

The implementation is deployed but remains unavailable until production services are configured. Do not enable account sync by removing configuration checks or using browser identifiers as authentication.

1. Configure a production Clerk application for the actual NOOR domain. Complete its production domain setup and permitted redirect URLs.
2. Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (`pk_live_…`) and `CLERK_SECRET_KEY` (`sk_live_…`) to this Vercel project's production environment. Never commit these values.
3. Connect a PostgreSQL database and add its private connection string as `DATABASE_URL` in production. The server initializes `noor_user_sync` when first used. The database principal needs table creation or a separately provisioned table with the schema in `db/user-sync.ts`.
4. Set `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`, and `NEXT_PUBLIC_SITE_URL` to the public site origin.
5. Redeploy from the validated Git commit so the public authentication key is included in the build.
6. Verify with two separately signed-in browsers: save a verse, create a plan, sync with consent, then sync on the second device. Check saved items, the latest reading position, and plan progress. Notes require separate opt-in.
7. Confirm that an unsigned GET to `/api/account/sync` returns 401, another user's collection cannot be read, cross-origin writes return 403, and concurrent writes return 409 rather than overwriting changes.

Sync runs only when requested by the user. Bookmarks and daily reading activity are merged; conflicting notes keep this device's text and report the conflict. Downloaded files and precise location are not included. Account setup requires the owner's production credentials and provider configuration; the repository cannot create those credentials itself.
