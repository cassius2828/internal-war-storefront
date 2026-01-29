# Deployment Guide

This document covers deploying the Internal War Storefront to Shopify Oxygen.

## Overview

The storefront is deployed to **Shopify Oxygen**, Shopify's global edge hosting platform powered by Cloudflare Workers. Deployment is automated via GitHub Actions.

## Deployment Methods

### 1. Automatic Deployment (CI/CD)

The repository is configured with GitHub Actions for automatic deployment on every push.

#### How It Works

1. Push code to any branch
2. GitHub Actions workflow triggers
3. Workflow builds the app and deploys to Oxygen
4. Deployment token authenticates with Shopify

#### Workflow Configuration

Location: `.github/workflows/oxygen-deployment-1000024933.yml`

```yaml
name: Storefront 1000024933
on: [push]

permissions:
  contents: read
  deployments: write

jobs:
  deploy:
    name: Deploy to Oxygen
    timeout-minutes: 30
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup node.js
        uses: actions/setup-node@v4
        with:
          node-version: "lts/*"
          check-latest: true

      - name: Cache node modules
        id: cache-npm
        uses: actions/cache@v4
        env:
          cache-name: cache-node-modules
        with:
          path: ~/.npm
          key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}

      - name: Install dependencies
        run: npm ci

      - name: Build and Publish to Oxygen
        run: npx shopify hydrogen deploy
        env:
          SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN: ${{ secrets.OXYGEN_DEPLOYMENT_TOKEN_1000024933 }}
```

#### Required Secrets

Configure in GitHub repository settings under **Settings > Secrets and variables > Actions**:

| Secret | Description |
|--------|-------------|
| `OXYGEN_DEPLOYMENT_TOKEN_1000024933` | Deployment token from Shopify |

### 2. Manual Deployment

Deploy manually using the Shopify CLI:

```bash
# Build and deploy
npx shopify hydrogen deploy

# Or with explicit token
SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN=your-token npx shopify hydrogen deploy
```

### 3. Preview Deployments

Each branch creates a preview deployment with a unique URL. This allows testing changes before merging to production.

## Getting a Deployment Token

1. Go to your Shopify Admin
2. Navigate to **Settings > Apps and sales channels**
3. Select your Hydrogen app
4. Go to the **Deployments** section
5. Generate a new deployment token
6. Add it to GitHub Secrets

## Environment Variables in Oxygen

### Configuring Variables

Environment variables for production are managed in Shopify Admin:

1. Go to **Apps and sales channels**
2. Select your Hydrogen storefront
3. Navigate to **Settings**
4. Add environment variables under **Environment variables**

### Variable Categories

#### Public Variables (prefixed with `PUBLIC_` or `VITE_`)

Accessible in both server and client code:
- `PUBLIC_STOREFRONT_API_TOKEN`
- `PUBLIC_STORE_DOMAIN`
- `PUBLIC_STOREFRONT_ID`
- `VITE_FALLBACK_LOGO`

#### Private Variables

Only accessible on the server:
- `SESSION_SECRET`
- `PRIVATE_STOREFRONT_API_TOKEN`

## Build Process

### What Happens During Build

1. **TypeScript Compilation** - Code is type-checked
2. **GraphQL Codegen** - Types generated from queries
3. **Vite Build** - Assets bundled and optimized
4. **Hydrogen Transform** - Code optimized for Oxygen

### Build Command

```bash
npm run build
# Runs: shopify hydrogen build --codegen
```

### Build Output

The build produces:
- Server bundle for Cloudflare Workers
- Client assets for CDN distribution

## Deployment Environments

### Production

- Deployed from the main/master branch
- Full environment variables
- Primary domain

### Preview/Staging

- Deployed from feature branches
- Unique preview URLs
- Same environment variables as production

## Monitoring Deployments

### Deployment Status

Check deployment status in:
1. **GitHub Actions** - See workflow runs
2. **Shopify Admin** - View deployment history

### Logs

View runtime logs in Shopify Admin under your Hydrogen app's **Logs** section.

## Rollback

### Rolling Back to Previous Version

1. Go to Shopify Admin
2. Navigate to your Hydrogen app
3. View deployment history
4. Select a previous deployment
5. Click **Rollback**

### Re-deploying a Previous Commit

```bash
git checkout <commit-hash>
npx shopify hydrogen deploy
```

## Custom Domains

### Adding a Custom Domain

1. Go to Shopify Admin
2. Navigate to **Online Store > Domains**
3. Add your custom domain
4. Configure DNS settings as instructed

### DNS Configuration

Point your domain to Shopify:
- Add a CNAME record pointing to your `.myshopify.com` domain
- Or use an A record with Shopify's IP addresses

## Performance Considerations

### Edge Caching

Oxygen caches responses at the edge. Configure caching via Hydrogen utilities:

```typescript
import {CacheShort, CacheLong, CacheNone} from '@shopify/hydrogen';

// In loader
const data = await context.storefront.query(QUERY, {
  cache: CacheShort(),  // 1 minute
  // cache: CacheLong(),  // 1 hour
  // cache: CacheNone(),  // No cache
});
```

### Cache Purging

Caches are automatically purged:
- When products/collections change in Shopify
- On new deployments

### CDN Assets

Static assets are served from Shopify's global CDN with long-term caching.

## Troubleshooting

### Build Failures

1. **Check logs** in GitHub Actions
2. **Run locally**: `npm run build`
3. **Check TypeScript**: `npm run typecheck`
4. **Regenerate types**: `npm run codegen`

### Deployment Token Issues

```
Error: Invalid or expired deployment token
```

1. Generate a new token in Shopify Admin
2. Update the GitHub secret
3. Retry the deployment

### 502/504 Errors

Usually indicates:
- Unhandled exceptions in loaders/actions
- Timeout issues
- Missing environment variables

Check Oxygen logs for details.

### Missing Environment Variables

```
Error: SESSION_SECRET environment variable is not set
```

Ensure all required variables are configured in Shopify Admin.

## Best Practices

1. **Test locally** before pushing: `npm run build && npm run preview`
2. **Use preview deployments** for feature branches
3. **Monitor logs** after deployment
4. **Set up alerts** for error rates
5. **Keep deployment tokens secure** - rotate periodically

## CI/CD Best Practices

### Branch Protection

Consider setting up branch protection rules:
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date

### Deployment Notifications

Configure notifications in:
- GitHub Actions (Slack integration)
- Shopify Admin (email notifications)

## Useful Commands

```bash
# Check deployment status
npx shopify hydrogen check

# View app info
npx shopify hydrogen info

# Preview production build locally
npm run preview

# Deploy with verbose logging
npx shopify hydrogen deploy --verbose
```
