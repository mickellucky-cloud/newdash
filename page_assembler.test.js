const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { assemblePage, rootDir } = require('./page_assembler');

test('rootDir resolves to existing project directory instead of hardcoded Windows path', () => {
  assert.equal(rootDir, __dirname);
  assert.equal(fs.existsSync(path.join(rootDir, 'package.json')), true);
  assert.equal(fs.existsSync(path.join(rootDir, 'design_boards')), true);
});

test('assemblePage generates complete HTML with active navigation and scripts', () => {
  const html = assemblePage({
    title: 'Portfolio',
    activeNav: 'Portfolio',
    activeBottomTab: 'Home',
    desktopMainContent: '<div id="desktop-test">Desktop Content</div>',
    mobileContent: '<div id="mobile-test">Mobile Content</div>',
  });

  assert.match(html, /<title>Portfolio \| OKN Token<\/title>/);
  assert.match(html, /id="desktop-test"/);
  assert.match(html, /id="mobile-test"/);
  assert.match(html, /aria-label="Search navigation"/);
  assert.match(html, /function openWalletModal\(\)/);
  assert.match(html, /function copyReferralLink\(\)/);
  assert.match(html, /id="mobile-sidebar-drawer"/);
  assert.match(html, /function toggleMobileSidebar\(\)/);
  assert.match(html, /function selectLanguage\(/);
  assert.match(html, /function toggleProfileDropdown\(/);
  assert.match(html, /top-menu-btn/);
  assert.match(html, /profile-dropdown-menu/);
  assert.match(html, /lang-dropdown-menu/);
  // Verify reference image elements
  assert.match(html, /profile-badge-initials">DE<\/span>/);
  assert.match(html, /Dev User/);
  assert.match(html, /@dev_user/);
  assert.match(html, /data-code="EN"/);
  assert.match(html, /data-code="ZH"/);
  assert.match(html, /data-code="ES"/);
  assert.match(html, /data-code="PT"/);
  assert.match(html, /data-code="RU"/);
  assert.match(html, /data-code="VI"/);
  assert.match(html, /data-code="ID"/);
  assert.match(html, /data-code="TR"/);
  assert.match(html, /data-code="FR"/);
  assert.match(html, /Sign out/);
  assert.match(html, /app-theme-opt/);
});

test('responsive CSS stacks 2-column and 3-column grids on mobile (<768px)', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css', 'responsive.css'), 'utf8');
  assert.match(css, /\.resp-grid-2,\s*\.resp-grid-3\s*\{\s*grid-template-columns:\s*1fr\s*!important;/);
});

test('vercel.json is configured for static deployment from public directory', () => {
  const vercelConfigPath = path.join(rootDir, 'vercel.json');
  assert.equal(fs.existsSync(vercelConfigPath), true);
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  assert.equal(vercelConfig.buildCommand, 'npm run build');
  assert.equal(vercelConfig.outputDirectory, 'public');
});

test('build output populates public/ directory and referral.html has full Partner Package', () => {
  const publicDir = path.join(rootDir, 'public');
  assert.equal(fs.existsSync(path.join(publicDir, 'index.html')), true);
  assert.equal(fs.existsSync(path.join(publicDir, 'referral.html')), true);
  assert.equal(fs.existsSync(path.join(publicDir, 'css', 'responsive.css')), true);
  assert.equal(fs.existsSync(path.join(publicDir, 'assets', 'okn-logo.png')), true);
  assert.equal(fs.existsSync(path.join(publicDir, 'favicon.ico')), true);

  const referralHtml = fs.readFileSync(path.join(publicDir, 'referral.html'), 'utf8');
  assert.match(referralHtml, /Tiered Performance Commissions/);
  assert.match(referralHtml, /The OKN Token Allocation/);
  assert.match(referralHtml, /VIP Access &amp; Status/);
  assert.match(referralHtml, /What We Provide You/);
  assert.match(referralHtml, /DE-71C49/);
});

test('BNB logo, BSC logo, and Polymarket logo assets are deployed and responsive Polymarket banner opens agent directly across desktop, tablet, and mobile', () => {
  const publicDir = path.join(rootDir, 'public');
  assert.equal(fs.existsSync(path.join(publicDir, 'assets', 'bnb-logo.png')), true);
  assert.equal(fs.existsSync(path.join(publicDir, 'assets', 'bsc-logo.svg')), true);
  assert.equal(fs.existsSync(path.join(publicDir, 'assets', 'polymarket.png')), true);

  const indexHtml = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
  assert.match(indexHtml, /assets\/bnb-logo\.png/);
  assert.match(indexHtml, /assets\/bsc-logo\.svg/);
  assert.match(indexHtml, /class="polymarket-live-banner"/);
  assert.match(indexHtml, /onclick="openPolymarketAgent\(event\)"/);
  assert.match(indexHtml, /function openPolymarketAgent\(e\)/);

  // Ensure polymarket-live-banner appears in both desktop/tablet and mobile containers
  const bannerMatches = indexHtml.match(/class="polymarket-live-banner"/g) || [];
  assert.equal(bannerMatches.length, 2);

  const css = fs.readFileSync(path.join(rootDir, 'css', 'responsive.css'), 'utf8');
  assert.doesNotMatch(css, /\.polymarket-live-banner\s*\{\s*display:\s*none\s*!important;/);
  assert.match(css, /@media\s*\(min-width:\s*768px\)[\s\S]*?\.poly-banner-inner,\s*\.okn-banner-inner\s*\{\s*display:\s*grid;/);

  // Ensure mobile bottom nav has 5 tabs (Home, Earn, Buy, Referral, Agents) and no Claim button
  const bottomNavMatch = indexHtml.match(/<nav class="bottom-nav-bar"[\s\S]*?<\/nav>/);
  assert.ok(bottomNavMatch, 'bottom-nav-bar should exist');
  assert.doesNotMatch(bottomNavMatch[0], /<span>Claim<\/span>/);
  assert.match(bottomNavMatch[0], /<span>Home<\/span>/);
  assert.match(bottomNavMatch[0], /<span>Earn<\/span>/);
  assert.match(bottomNavMatch[0], /<span>Buy<\/span>/);
  assert.match(bottomNavMatch[0], /<span>Referral<\/span>/);
  assert.match(bottomNavMatch[0], /<span>Agents<\/span>/);
});

test('Announcement carousel combines Polymarket Copy Agent and Buy $OKN Presale slides and removes static Buy card from Portfolio split grid', () => {
  const publicDir = path.join(rootDir, 'public');
  const indexHtml = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');

  // Both desktop and mobile announcement carousels exist
  assert.match(indexHtml, /id="desktop-ann-carousel"/);
  assert.match(indexHtml, /id="mobile-ann-carousel"/);
  assert.match(indexHtml, /class="okn-presale-live-banner"/);
  assert.match(indexHtml, /PRESALE STAGE 2 LIVE/);
  assert.match(indexHtml, /Buy \$OKN Presale[\s\S]*?Multi-Gateway<\/span> Live!/);
  assert.match(indexHtml, /function switchAnnouncementSlide\(/);
  assert.match(indexHtml, /function stepAnnouncementSlide\(/);

  // Static Buy $OKN Presale card inside portfolio-split-grid should be removed
  const splitGridMatch = indexHtml.match(/<div class="portfolio-split-grid"[\s\S]*?Transaction history/);
  assert.ok(splitGridMatch, 'portfolio-split-grid should exist');
  assert.doesNotMatch(splitGridMatch[0], /Open the sale/);
});

test('wallet.html renders Fintech-ready Account Summary, allocation bar, holdings breakdown, and rails', () => {
  const publicDir = path.join(rootDir, 'public');
  const walletHtml = fs.readFileSync(path.join(publicDir, 'wallet.html'), 'utf8');

  assert.match(walletHtml, /Fintech Account Summary/);
  assert.match(walletHtml, /Total Account Net Worth/);
  assert.match(walletHtml, /\$1,428\.50/);
  assert.match(walletHtml, /UID #849201 · Tier 2 Verified/);
  assert.match(walletHtml, /Account Asset Allocation/);
  assert.match(walletHtml, /Asset Holdings Breakdown/);
  assert.match(walletHtml, /Account Summary &amp; Rails/);
  assert.match(walletHtml, /function copyWalletAddress\(\)/);
});


