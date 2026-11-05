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
