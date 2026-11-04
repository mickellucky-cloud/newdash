# OKN Web3 Dashboard

A high-performance, responsive Web3 portfolio and task rewards dashboard for the **$OKN** ecosystem.

## Features
- **Responsive Architecture**: 1-to-1 parity across Desktop (1440px+), Tablet (768px - 1023px), and Mobile (<768px).
- **Refined Aesthetics**: Soft surfaces, subtle borders, and natural elevation without excess glare or harsh contrast.
- **Merkle Claim Stepper**: 3-stage visualizer (`Earn points` → `Merkle commit` → `Claim on-chain`).
- **Gamified 7-Day Streak**: Pill-capsule visualizer tracking daily activity and streak milestones.
- **Transaction History**: Filterable ledger (`All`, `OK Points`, `$OKN`) with real-time status badges.
- **Official Brand Assets**: 3D iridescent $OKN emblem and official Polymarket partner badges.
- **Vercel-Ready**: Preconfigured `vercel.json` with `cleanUrls`, static asset caching, and canonical routing.

## Quick Start
```bash
# Start local development server (runs on port 3000)
npm run dev

# Or build static output for production
npm run build
```

## Deploying to Vercel

### Option 1: Git Import (Recommended)
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import this repository.
4. Vercel automatically detects the build command (`npm run build`) and output directory (`public`) configured in `vercel.json`.
5. Click **Deploy**.

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel
```
When prompted, accept the default settings.
