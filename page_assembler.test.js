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
});
