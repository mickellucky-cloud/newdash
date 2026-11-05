const fs = require('fs');
const path = require('path');
const { assemblePage, rootDir } = require('./page_assembler');

const srcDir = path.join(rootDir, 'design_boards');

// Helper to make mobile artboard fluid and clean
function makeMobileFluid(mobileHtml) {
  return mobileHtml
    .replace(/\sdata-theme="dark"/gi, '')
    .replace(/width:\s*390px;?\s*height:\s*[0-9]+px;?/gi, 'width: 100%; max-width: 480px; min-height: auto; height: auto; margin: 0 auto;')
    .replace(/overflow:\s*hidden;?/gi, 'overflow: visible;')
    .replace(/<header data-dc-tpl="5"[\s\S]*?<\/header>/gi, '') // mobile topbar is handled by wrapper
    .replace(/<nav[^>]*aria-label="(?:Bottom|Primary)"[\s\S]*?<\/nav>/gi, '') // bottom nav is handled by wrapper
    .replace(/href="Main\.dc\.html"/gi, 'href="home.html"')
    .replace(/href="Home\.dc\.html"/gi, 'href="home.html"')
    .replace(/href="Desktop\.dc\.html"/gi, 'href="portfolio.html"')
    .replace(/href="Earn\.dc\.html"/gi, 'href="earn.html"')
    .replace(/href="Claim\.dc\.html"/gi, 'href="claim.html"')
    .replace(/href="Buy\.dc\.html"/gi, 'href="buy.html"')
    .replace(/href="Agents\.dc\.html"/gi, 'href="agents.html"')
    .replace(/href="Referral\.dc\.html"/gi, 'href="referral.html"')
    .replace(/href="Activity\.dc\.html"/gi, 'href="activity.html"')
    .replace(/href="([a-zA-Z0-9_]+)\.dc\.html"/gi, (_, name) => `href="${name.toLowerCase()}.html"`)
    .replace(/href="Main\.html"/gi, 'href="home.html"')
    .replace(/href="Desktop\.html"/gi, 'href="portfolio.html"')
    .replace(/href="Earn\.html"/gi, 'href="earn.html"');
}

// Common Vector Icons
const ICONS = {
  check: '<svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  telegram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>',
  youtube: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="#4267B2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  lock: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
  shield: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>',
  timer: '<svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  bnb: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#F3BA2F"><path d="M12 3.2L16.2 7.4L18.4 5.2L12 0L5.6 5.2L7.8 7.4L12 3.2ZM20.8 7.6L18.6 9.8L20.8 12L23 9.8L20.8 7.6ZM12 8.4L15.6 12L12 15.6L8.4 12L12 8.4ZM3.2 7.6L1 9.8L3.2 12L5.4 9.8L3.2 7.6ZM12 16.6L7.8 12.4L5.6 14.6L12 21L18.4 14.6L16.2 12.4L12 16.6ZM20.8 12L18.6 14.2L20.8 16.4L23 14.2L20.8 12ZM3.2 12L1 14.2L3.2 16.4L5.4 14.2L3.2 12Z"/></svg>',
  alert: '<svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  trending: '<svg class="i" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
  target: '<svg class="i" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
  barChart: '<svg class="i" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>',
  arrowRight: '<svg class="i" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
  book: '<svg class="i" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
  wallet: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>',
  flame: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
  gift: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"></rect><path d="M12 8v13"></path><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path></svg>',
  coins: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"></circle><path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path><path d="M7 6h1v4"></path><path d="m16.71 13.88.7.71-2.82 2.82"></path></svg>',
  listChecks: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 2 2 4-4"></path><path d="m3 7 2 2 4-4"></path><path d="M13 6h8"></path><path d="M13 12h8"></path><path d="M13 18h8"></path></svg>',
  users: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  cart: '<svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>',
  nowpayments: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
  creditCard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
  visa: '<svg width="32" height="20" viewBox="0 0 48 30" fill="none"><rect width="48" height="30" rx="4" fill="#1A1F71"/><text x="8" y="21" font-family="sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" font-style="italic">VISA</text></svg>',
  mastercard: '<svg width="32" height="20" viewBox="0 0 48 30" fill="none"><rect width="48" height="30" rx="4" fill="#222"/><circle cx="19" cy="15" r="9" fill="#EB001B"/><circle cx="29" cy="15" r="9" fill="#F79E1B" fill-opacity="0.85"/></svg>',
  apple: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.64-.78 1.08-1.87.96-2.96-.93.04-2.06.62-2.73 1.4-.58.67-1.09 1.77-.96 2.84 1.04.08 2.09-.5 2.73-1.28z"/></svg>',
  google: '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/></svg>',
  usdt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="#26A17B"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.385 13.785v3.834h-2.77v-3.834c-3.105-.18-5.35-1.042-5.35-2.075 0-1.034 2.245-1.895 5.35-2.075V7.47h2.77v2.165c3.105.18 5.35 1.041 5.35 2.075 0 1.033-2.245 1.895-5.35 2.075zm0-2.002c2.45-.145 4.095-.694 4.095-1.143 0-.45-1.645-.998-4.095-1.143v2.286zm-2.77-2.286c-2.45.145-4.095.694-4.095 1.143 0 .45 1.645.998 4.095 1.143v-2.286z"/></svg>',
  btc: '<svg width="18" height="18" viewBox="0 0 24 24" fill="#F7931A"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.87 9.42c-.22 1.48-1.13 2.15-2.38 2.37 1.58.46 2.17 1.5 1.84 3.16-.44 2.16-2.12 2.76-4.52 2.76v2.19h-1.42v-2.15H8v-1.43h1.39V7.67H8V6.24h1.39V4.1h1.42v2.12c1.78.04 3.75-.12 4.67 1.25.32.48.43 1.14.39 1.95zm-3.32-.44c0-1.17-.96-1.44-2.13-1.42v2.85c1.17.02 2.13-.26 2.13-1.43zm.32 4.88c0-1.32-1.08-1.6-2.45-1.58v3.17c1.37.01 2.45-.27 2.45-1.59z"/></svg>',
  eth: '<svg width="18" height="18" viewBox="0 0 24 24" fill="#627EEA"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.065 4.5l5.228 8.683-5.228 3.09-5.227-3.09 5.227-8.683zm0 12.87l5.233-3.1-5.233 7.23-5.233-7.23 5.233 3.1z"/></svg>',
  sol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="#9945FF"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM6.5 15.8h8.8l2.2-2.3H8.7L6.5 15.8zm2.2-5.3h8.8l2.2-2.3H8.7L6.5 8.2h8.8l2.2 2.3zm0 2.8H17.5l-2.2-2.3H6.5l2.2 2.3z"/></svg>'
};

// Helper for Portfolio / Activity / Holdings segmented header
function getPortfolioHeader(activeSubTab) {
  const tabs = [
    { label: 'Overview', href: 'portfolio.html', id: 'overview' },
    { label: 'Activity', href: 'activity.html', id: 'activity' },
    { label: 'Holdings', href: 'wallet.html', id: 'holdings' }
  ];
  return `
    <div class="portfolio-header" style="margin-bottom: 20px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;">
      <div>
        <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 4px; color: var(--tx);">Portfolio</h1>
        <p style="font-size: 14px; color: var(--mut); margin: 0;">Your $OKN at a glance: activity, holdings, and earnings.</p>
      </div>
      <!-- Overview / Activity / Holdings Segmented Tabs -->
      <div class="portfolio-tabs" role="tablist" aria-label="Portfolio sections" style="display: inline-flex; align-items: center; background: var(--s2); padding: 4px; border-radius: 12px; border: 1px solid var(--line); gap: 2px;">
        ${tabs.map(t => {
          const isAct = t.id === activeSubTab;
          return `<a href="${t.href}" role="tab" aria-selected="${isAct}" style="padding: 6px 16px; border-radius: 8px; font-size: 13px; font-weight: ${isAct ? '700' : '600'}; color: ${isAct ? '#FFF' : 'var(--mut)'}; background: ${isAct ? 'var(--vio)' : 'transparent'}; text-decoration: none; white-space: nowrap; transition: all 0.2s;">${t.label}</a>`;
        }).join('')}
      </div>
    </div>
  `;
}

// 1. Live Production Portfolio Layout with Modernized UI/UX
const desktopPortfolioMain = `
  <div class="portfolio-container" style="max-width: 1400px; margin: 0 auto; padding-bottom: 40px;">
    <!-- Top Header & Tabs -->
    ${getPortfolioHeader('overview')}


    <!-- 4 Stat Cards Grid -->
    <div class="resp-grid-4" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 16px;">
      <!-- Card 1: OK Points earned -->
      <div class="stat-card" style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease;">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
          <span style="display: flex; width: 44px; height: 44px; align-items: center; justify-content: center; border-radius: 14px; background: rgba(122, 18, 245, 0.12); color: var(--vio-l); flex: 0 0 auto;">
            ${ICONS.gift}
          </span>
          <div style="min-width: 0;">
            <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--mut); margin: 0;">OK Points earned</p>
            <p class="num" style="font-size: 26px; font-weight: 800; color: var(--tx); margin: 2px 0 0; line-height: 1.1;">135</p>
          </div>
        </div>
        <p style="font-size: 12px; color: var(--mut); margin: 0;">Awaiting Merkle commit</p>
      </div>

      <!-- Card 2: $OKN balance -->
      <div class="stat-card" style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease;">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
          <span style="display: flex; width: 44px; height: 44px; align-items: center; justify-content: center; border-radius: 14px; background: rgba(9, 180, 255, 0.12); color: var(--cyan); flex: 0 0 auto;">
            ${ICONS.coins}
          </span>
          <div style="min-width: 0;">
            <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--mut); margin: 0;">$OKN balance</p>
            <p class="num" style="font-size: 26px; font-weight: 800; color: var(--tx); margin: 2px 0 0; line-height: 1.1;">—</p>
          </div>
        </div>
        <p style="font-size: 12px; color: var(--mut); margin: 0;">On-chain balance</p>
      </div>

      <!-- Card 3: Tasks done -->
      <div class="stat-card" style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease;">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
          <span style="display: flex; width: 44px; height: 44px; align-items: center; justify-content: center; border-radius: 14px; background: rgba(47, 189, 142, 0.12); color: var(--ok); flex: 0 0 auto;">
            ${ICONS.listChecks}
          </span>
          <div style="min-width: 0;">
            <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--mut); margin: 0;">Tasks done</p>
            <p class="num" style="font-size: 26px; font-weight: 800; color: var(--tx); margin: 2px 0 0; line-height: 1.1;">0 / 11</p>
          </div>
        </div>
        <p style="font-size: 12px; color: var(--mut); margin: 0;">Verified and pending</p>
      </div>

      <!-- Card 4: Referrals -->
      <div class="stat-card" style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease;">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
          <span style="display: flex; width: 44px; height: 44px; align-items: center; justify-content: center; border-radius: 14px; background: rgba(255, 170, 0, 0.12); color: #FFAA00; flex: 0 0 auto;">
            ${ICONS.users}
          </span>
          <div style="min-width: 0;">
            <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--mut); margin: 0;">Referrals</p>
            <p class="num" style="font-size: 26px; font-weight: 800; color: var(--tx); margin: 2px 0 0; line-height: 1.1;">0</p>
          </div>
        </div>
        <p style="font-size: 12px; color: var(--mut); margin: 0;">0 OK Points earned</p>
      </div>
    </div>

    <!-- Daily Streak Card with Modern 7-Day Capsule Visualizer -->
    <div class="streak-card" style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="display: flex; width: 48px; height: 48px; align-items: center; justify-content: center; border-radius: 14px; background: rgba(255, 170, 0, 0.15); color: #FFAA00; flex: 0 0 auto;">
          ${ICONS.flame}
        </span>
        <div style="min-width: 0;">
          <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--mut); margin: 0;">Daily streak</p>
          <div style="display: flex; align-items: baseline; gap: 12px; margin-top: 2px; flex-wrap: wrap;">
            <p class="num" style="font-size: 24px; font-weight: 800; color: var(--tx); margin: 0;">6 days</p>
            <p style="font-size: 13px; color: var(--mut); margin: 0;">Checked in. Longest streak: 6.</p>
          </div>
        </div>
      </div>

      <!-- Modern Streak Capsules -->
      <div style="display: flex; align-items: center; gap: 8px;">
        <div title="Day 1" style="width: 14px; height: 36px; border-radius: 7px; background: linear-gradient(180deg, #8C38F7, #7A12F5); "></div>
        <div title="Day 2" style="width: 14px; height: 36px; border-radius: 7px; background: linear-gradient(180deg, #8C38F7, #7A12F5); "></div>
        <div title="Day 3" style="width: 14px; height: 36px; border-radius: 7px; background: linear-gradient(180deg, #8C38F7, #7A12F5); "></div>
        <div title="Day 4" style="width: 14px; height: 36px; border-radius: 7px; background: linear-gradient(180deg, #8C38F7, #7A12F5); "></div>
        <div title="Day 5" style="width: 14px; height: 36px; border-radius: 7px; background: linear-gradient(180deg, #8C38F7, #7A12F5); "></div>
        <div title="Day 6 (Today)" style="width: 14px; height: 36px; border-radius: 7px; background: linear-gradient(180deg, #8C38F7, #7A12F5); "></div>
        <div title="Day 7 (Upcoming)" style="width: 14px; height: 36px; border-radius: 7px; background: var(--s2); border: 1.5px dashed var(--line); opacity: 0.6;"></div>
      </div>
    </div>

    <!-- Two-Column Split Grid (3fr : 2fr) -->
    <div class="portfolio-split-grid" style="display: grid; grid-template-columns: 3fr 2fr; gap: 24px; align-items: start;">
      <!-- Left Column: Claim + Buy -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Claim your $OKN Card with Merkle Stepper -->
        <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 14px;">
            <div>
              <h3 style="font-size: 18px; font-weight: 800; color: var(--tx); margin: 0 0 6px;">Claim your $OKN</h3>
              <p style="font-size: 13px; color: var(--mut); line-height: 1.5; margin: 0;">OK Points convert to $OKN when the admin commits a Merkle root. A $3 BNB fee applies at claim time.</p>
            </div>
            <span style="font-size: 11px; font-weight: 700; color: #FFAA00; background: rgba(255, 170, 0, 0.12); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(255, 170, 0, 0.25); white-space: nowrap; flex: 0 0 auto;">Not open yet</span>
          </div>

          <!-- Modern Merkle Progress Stepper -->
          <div style="margin: 20px 0 22px; padding: 18px 20px; background: var(--s2); border-radius: 16px; border: 1px solid var(--line);">
            <div style="display: flex; align-items: center; justify-content: space-between; position: relative;">
              <!-- Connecting Line -->
              <div style="position: absolute; top: 14px; left: 32px; right: 32px; height: 2px; background: var(--line); z-index: 1;">
                <div style="width: 50%; height: 100%; background: linear-gradient(90deg, #09B4FF, #FFD60A);"></div>
              </div>

              <!-- Step 1: Earn points -->
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative; z-index: 2;">
                <div style="width: 28px; height: 28px; border-radius: 50%; background: #09B4FF; color: #000; display: flex; align-items: center; justify-content: center; ">
                  <svg class="i" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span style="font-size: 11px; font-weight: 700; color: var(--tx);">Earn points</span>
              </div>

              <!-- Step 2: Merkle commit (Active) -->
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative; z-index: 2;">
                <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--s1); border: 2px solid #FFD60A; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 9px; height: 9px; border-radius: 50%; background: #FFD60A;"></div>
                </div>
                <span style="font-size: 11px; font-weight: 800; color: #FFD60A;">Merkle commit</span>
              </div>

              <!-- Step 3: Claim on-chain (Pending) -->
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative; z-index: 2;">
                <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--s2); border: 2px dashed var(--mut); display: flex; align-items: center; justify-content: center; opacity: 0.65;">
                  <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--mut);"></div>
                </div>
                <span style="font-size: 11px; font-weight: 600; color: var(--mut);">Claim on-chain</span>
              </div>
            </div>
          </div>

          <!-- Bottom Row: Metrics & Button -->
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding-top: 14px; border-top: 1px solid rgba(255, 170, 0, 0.15);">
            <div>
              <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--mut); margin: 0 0 4px;">Claimable OK Points</p>
              <p class="num" style="font-size: 32px; font-weight: 800; color: #ffb800; margin: 0; line-height: 1;">135</p>
            </div>
            <a href="claim.html" style="display: inline-flex; align-items: center; gap: 8px; height: 42px; padding: 0 22px; border-radius: 12px; background: #ffb800; color: #000; font-weight: 800; font-size: 13px; text-decoration: none; box-shadow: 0 1px 2px rgba(0,0,0,0.15); transition: transform 0.2s cubic-bezier(0.16,1,0.3,1);">
              <span>Go to claim</span>
              ${ICONS.arrowRight}
            </a>
          </div>
        </div>

        <!-- Buy $OKN with BNB Card -->
        <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
          <div style="margin-bottom: 18px;">
            <h3 style="font-size: 18px; font-weight: 800; color: var(--tx); margin: 0 0 6px;">Buy $OKN Presale</h3>
            <p style="font-size: 13px; color: var(--mut); line-height: 1.5; margin: 0;">Multi-Gateway: Web3 BNB, NOWPayments (300+ crypto), & Credit Card</p>
          </div>
          <a href="buy.html" style="display: inline-flex; align-items: center; gap: 10px; height: 42px; padding: 0 20px; border-radius: 12px; background: var(--s2); border: 1px solid var(--line); color: var(--tx); font-weight: 800; font-size: 13px; text-decoration: none; transition: background 0.2s ease;">
            ${ICONS.cart}
            <span>Open the sale</span>
          </a>
        </div>

      </div>

      <!-- Right Column: Modernized Tasks Card with Branded Squircle Icons -->
      <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <h3 style="font-size: 18px; font-weight: 800; color: var(--tx); margin: 0;">Tasks</h3>
          <a href="tasks.html" style="font-size: 12px; font-weight: 700; color: var(--vio-l); text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
            <span>See all</span>
            ${ICONS.arrowRight}
          </a>
        </div>
        <p style="font-size: 13px; color: var(--mut); margin: 0 0 18px;">Earn OK Points toward your next claim.</p>

        <!-- Task List Items -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          
          <!-- Task 1: Telegram -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; background: var(--s2); border: 1px solid var(--line); border-radius: 14px; transition: transform 0.2s cubic-bezier(0.16,1,0.3,1);">
            <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
              <span style="width: 36px; height: 36px; border-radius: 10px; background: rgba(9, 180, 255, 0.15); color: var(--cyan); display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">
                ${ICONS.telegram}
              </span>
              <div style="min-width: 0;">
                <p style="font-size: 13px; font-weight: 700; color: var(--tx); margin: 0;">Join our Telegram</p>
                <p style="font-size: 11px; font-weight: 600; color: var(--ok); margin: 2px 0 0;">+50 OK Points</p>
              </div>
            </div>
            <a href="tasks.html" style="padding: 6px 16px; border-radius: 10px; background: var(--vio); color: #fff; font-size: 12px; font-weight: 700; text-decoration: none;  transition: all 0.2s ease;">Claim</a>
          </div>

          <!-- Task 2: Follow us on X -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; background: var(--s2); border: 1px solid var(--line); border-radius: 14px; transition: transform 0.2s cubic-bezier(0.16,1,0.3,1);">
            <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
              <span style="width: 36px; height: 36px; border-radius: 10px; background: var(--s1); color: var(--tx); border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">
                ${ICONS.x}
              </span>
              <div style="min-width: 0;">
                <p style="font-size: 13px; font-weight: 700; color: var(--tx); margin: 0;">Follow us on X</p>
                <p style="font-size: 11px; font-weight: 600; color: var(--ok); margin: 2px 0 0;">+70 OK Points</p>
              </div>
            </div>
            <a href="tasks.html" style="padding: 6px 16px; border-radius: 10px; background: var(--vio); color: #fff; font-size: 12px; font-weight: 700; text-decoration: none;  transition: all 0.2s ease;">Claim</a>
          </div>

          <!-- Task 3: Follow on Facebook -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; background: var(--s2); border: 1px solid var(--line); border-radius: 14px; transition: transform 0.2s cubic-bezier(0.16,1,0.3,1);">
            <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
              <span style="width: 36px; height: 36px; border-radius: 10px; background: rgba(66, 103, 178, 0.15); color: #4267B2; display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">
                ${ICONS.facebook}
              </span>
              <div style="min-width: 0;">
                <p style="font-size: 13px; font-weight: 700; color: var(--tx); margin: 0;">Follow $OKN on Facebook</p>
                <p style="font-size: 11px; font-weight: 600; color: var(--ok); margin: 2px 0 0;">+50 OK Points</p>
              </div>
            </div>
            <a href="tasks.html" style="padding: 6px 16px; border-radius: 10px; background: var(--vio); color: #fff; font-size: 12px; font-weight: 700; text-decoration: none;  transition: all 0.2s ease;">Claim</a>
          </div>

        </div>
      </div>
    </div>

    <!-- Transaction History Table Section (From Modern UI/UX Guide) -->
    <div style="margin-top: 28px; background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px;">
        <div>
          <h3 style="font-size: 18px; font-weight: 800; color: var(--tx); margin: 0 0 4px;">Transaction history</h3>
          <p style="font-size: 13px; color: var(--mut); margin: 0;">Every OK Points and $OKN movement on your account.</p>
        </div>
        <!-- Filter Pills -->
        <div style="display: inline-flex; align-items: center; background: var(--s2); padding: 4px; border-radius: 12px; border: 1px solid var(--line); gap: 4px;">
          <button style="padding: 5px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; color: #FFF; background: var(--vio); border: none; cursor: pointer; ">All</button>
          <button style="padding: 5px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; color: var(--mut); background: transparent; border: none; cursor: pointer;">OK Points</button>
          <button style="padding: 5px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; color: var(--mut); background: transparent; border: none; cursor: pointer;">$OKN</button>
        </div>
      </div>

      <!-- Table Container -->
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; min-width: 640px; text-align: left; font-size: 13px;">
          <thead>
            <tr style="border-bottom: 1px solid var(--line); color: var(--mut); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
              <th style="padding: 12px 14px 12px 4px;">Description</th>
              <th style="padding: 12px 14px;">Date</th>
              <th style="padding: 12px 14px;">Asset</th>
              <th style="padding: 12px 14px; text-align: right;">Amount</th>
              <th style="padding: 12px 4px 12px 14px; text-align: right;">Status</th>
            </tr>
          </thead>
          <tbody>
            <!-- Row 1 -->
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
              <td style="padding: 14px 14px 14px 4px; display: flex; align-items: center; gap: 12px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(47,189,142,0.12); color: var(--ok); display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">${ICONS.check}</div>
                <div>
                  <div style="font-weight: 700; color: var(--tx);">Daily check-in</div>
                  <div style="font-size: 11px; color: var(--mut); margin-top: 1px;">Day 6 of streak</div>
                </div>
              </td>
              <td style="padding: 14px; color: var(--mut); font-weight: 500;">Nov 2, 2026</td>
              <td style="padding: 14px; font-weight: 600; color: var(--tx);">OK Points</td>
              <td style="padding: 14px; text-align: right; font-weight: 800; color: var(--ok);">+20 pts</td>
              <td style="padding: 14px 4px 14px 14px; text-align: right;">
                <span style="display: inline-block; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; background: rgba(255, 170, 0, 0.12); color: #FFAA00; border: 1px solid rgba(255, 170, 0, 0.25);">Awaiting commit</span>
              </td>
            </tr>
            <!-- Row 2 -->
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
              <td style="padding: 14px 14px 14px 4px; display: flex; align-items: center; gap: 12px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(47,189,142,0.12); color: var(--ok); display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">${ICONS.check}</div>
                <div>
                  <div style="font-weight: 700; color: var(--tx);">Daily check-in</div>
                  <div style="font-size: 11px; color: var(--mut); margin-top: 1px;">Day 5 of streak</div>
                </div>
              </td>
              <td style="padding: 14px; color: var(--mut); font-weight: 500;">Nov 1, 2026</td>
              <td style="padding: 14px; font-weight: 600; color: var(--tx);">OK Points</td>
              <td style="padding: 14px; text-align: right; font-weight: 800; color: var(--ok);">+20 pts</td>
              <td style="padding: 14px 4px 14px 14px; text-align: right;">
                <span style="display: inline-block; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; background: rgba(255, 170, 0, 0.12); color: #FFAA00; border: 1px solid rgba(255, 170, 0, 0.25);">Awaiting commit</span>
              </td>
            </tr>
            <!-- Row 3 -->
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
              <td style="padding: 14px 14px 14px 4px; display: flex; align-items: center; gap: 12px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(47,189,142,0.12); color: var(--ok); display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">${ICONS.check}</div>
                <div>
                  <div style="font-weight: 700; color: var(--tx);">Daily check-in</div>
                  <div style="font-size: 11px; color: var(--mut); margin-top: 1px;">Day 4 of streak</div>
                </div>
              </td>
              <td style="padding: 14px; color: var(--mut); font-weight: 500;">Oct 31, 2026</td>
              <td style="padding: 14px; font-weight: 600; color: var(--tx);">OK Points</td>
              <td style="padding: 14px; text-align: right; font-weight: 800; color: var(--ok);">+20 pts</td>
              <td style="padding: 14px 4px 14px 14px; text-align: right;">
                <span style="display: inline-block; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; background: rgba(255, 170, 0, 0.12); color: #FFAA00; border: 1px solid rgba(255, 170, 0, 0.25);">Awaiting commit</span>
              </td>
            </tr>
            <!-- Row 4 -->
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
              <td style="padding: 14px 14px 14px 4px; display: flex; align-items: center; gap: 12px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(47,189,142,0.12); color: var(--ok); display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">${ICONS.check}</div>
                <div>
                  <div style="font-weight: 700; color: var(--tx);">Daily check-in</div>
                  <div style="font-size: 11px; color: var(--mut); margin-top: 1px;">Day 3 of streak</div>
                </div>
              </td>
              <td style="padding: 14px; color: var(--mut); font-weight: 500;">Oct 30, 2026</td>
              <td style="padding: 14px; font-weight: 600; color: var(--tx);">OK Points</td>
              <td style="padding: 14px; text-align: right; font-weight: 800; color: var(--ok);">+20 pts</td>
              <td style="padding: 14px 4px 14px 14px; text-align: right;">
                <span style="display: inline-block; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; background: rgba(255, 170, 0, 0.12); color: #FFAA00; border: 1px solid rgba(255, 170, 0, 0.25);">Awaiting commit</span>
              </td>
            </tr>
            <!-- Row 5 -->
            <tr>
              <td style="padding: 14px 14px 14px 4px; display: flex; align-items: center; gap: 12px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(47,189,142,0.12); color: var(--ok); display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">${ICONS.check}</div>
                <div>
                  <div style="font-weight: 700; color: var(--tx);">Daily check-in</div>
                  <div style="font-size: 11px; color: var(--mut); margin-top: 1px;">Day 2 of streak</div>
                </div>
              </td>
              <td style="padding: 14px; color: var(--mut); font-weight: 500;">Oct 29, 2026</td>
              <td style="padding: 14px; font-weight: 600; color: var(--tx);">OK Points</td>
              <td style="padding: 14px; text-align: right; font-weight: 800; color: var(--ok);">+20 pts</td>
              <td style="padding: 14px 4px 14px 14px; text-align: right;">
                <span style="display: inline-block; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; background: rgba(255, 170, 0, 0.12); color: #FFAA00; border: 1px solid rgba(255, 170, 0, 0.25);">Awaiting commit</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
`;

// 2. Read all mobile boards directly from srcDir (pristine artboards)
function getMobileBoard(file) {
  const p = path.join(srcDir, file);
  if (!fs.existsSync(p)) return '';
  const c = fs.readFileSync(p, 'utf8');
  const m = c.match(/<div id="dc-root">([\s\S]*?)<\/body>/i);
  if (m) {
    let inner = m[1];
    const scriptIdx = inner.indexOf('<script');
    if (scriptIdx !== -1) inner = inner.substring(0, scriptIdx);
    inner = inner.trim().replace(/(<\/div>\s*)+$/, '');
    // Clean logo blobs
    inner = inner.replace(/src="blob:[^"]+"/gi, 'src="assets/okn-logo.png"');
    inner = inner.replace(/<img[^>]*alt="OKN logo"[^>]*>/gi, '<img src="assets/okn-logo.png" alt="OKN logo" style="width: 42px; height: 42px; border-radius: 12px; object-fit: cover; background: #000; display: block; flex: 0 0 auto;">');
    return makeMobileFluid(inner);
  }
  return '';
}

const mobileHomeRaw = getMobileBoard('Home.html');
// Remove slider announcements from mobile Home
let mobileHome = mobileHomeRaw.replace(/<section[^>]*aria-label="Announcements"[\s\S]*?<\/section>/gi, '');
mobileHome = mobileHome.replace(
  />✓<\/div>/g,
  `><svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>`
);
// Match current design numbers on mobile Home
mobileHome = mobileHome.replace(/>100<\/div>/g, '>135</div>');
mobileHome = mobileHome.replace(/100 pts/g, '135 pts');
mobileHome = mobileHome.replace(/5-day streak/g, '6-day streak');
mobileHome = mobileHome.replace(/5 days\. Longest: 5/g, '6 days. Longest: 6');
// Connect wallet modal handler on mobile Home (matches data-dc-tpl="33" or "34")
mobileHome = mobileHome.replace(
  /<button[^>]*data-dc-tpl="3[34]"[^>]*>[\s\S]*?<\/button>/i,
  `<button onclick="openWalletModal()" style="display: flex; align-items: center; justify-content: space-between; height: 52px; width: 100%; border-radius: 26px; background: #FFFFFF; color: #0A0A0C; font-weight: 800; font-size: 14px; border: none; cursor: pointer; padding: 0 16px 0 6px; box-shadow: 0 6px 20px rgba(0,0,0,0.2); transition: all 0.2s cubic-bezier(0.16,1,0.3,1); margin-top: 6px;">
    <span style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: #000; color: #fff;">
      ${ICONS.wallet}
    </span>
    <span style="font-weight: 800; font-size: 15px;">Connect wallet</span>
    <svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
  </button>`
);

const mobileEarn = getMobileBoard('Earn.html')
  .replace('Subscribe on [platform]', 'Subscribe on YouTube')
  .replace('Follow $OKN on [platform]', 'Follow $OKN on Discord');

const mobileClaim = getMobileBoard('Claim.html')
  .replace(/>100<\/div>/g, '>135</div>')
  .replace(/100 pts/g, '135 pts')
  .replace(/100<\/span>/g, '135</span>')
  .replace(
    /<button[^>]*data-dc-tpl="34"[^>]*>[\s\S]*?<\/button>/i,
    `<button onclick="openWalletModal()" style="display: flex; align-items: center; justify-content: space-between; height: 52px; width: 100%; border-radius: 26px; background: #FFFFFF; color: #0A0A0C; font-weight: 800; font-size: 14px; border: none; cursor: pointer; padding: 0 16px 0 6px; box-shadow: 0 6px 20px rgba(0,0,0,0.2); transition: all 0.2s cubic-bezier(0.16,1,0.3,1); margin-top: 6px;">
      <span style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: #000; color: #fff;">
        ${ICONS.wallet}
      </span>
      <span style="font-weight: 800; font-size: 15px;">Connect wallet</span>
      <svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
    </button>`
  );

const mobileBuy = getMobileBoard('Buy.html')
  .replace(/<button data-dc-tpl="61"/i, '<button data-dc-tpl="61" onclick="openWalletModal()"')
  .replace(/<a data-dc-tpl="75" href="#"/i, '<a data-dc-tpl="75" href="https://testnet.bnbchain.org/faucet-smart" target="_blank" rel="noopener noreferrer"');

const mobileAgents = getMobileBoard('Agents.html')
  .replace(/<span data-dc-tpl="56"[^>]*>.*?<\/span><div data-dc-tpl="60"/s, '<img src="assets/polymarket.png" alt="Polymarket" style="width: 44px; height: 44px; border-radius: 14px; object-fit: contain; box-shadow: 0 4px 14px rgba(9, 180, 255, 0.25); flex: 0 0 auto;"><div data-dc-tpl="60"')
  .replace(/<a data-dc-tpl="65" href="#"/i, '<a data-dc-tpl="65" href="missions.html"')
  .replace(/<a data-dc-tpl="76" href="#"/i, '<a data-dc-tpl="76" href="leaderboard.html"')
  .replace(/<a data-dc-tpl="79" href="#"/i, '<a data-dc-tpl="79" href="missions.html"')
  .replace(/<a data-dc-tpl="82" href="#"/i, '<a data-dc-tpl="82" href="news.html"');

// Referral mobile card & stats
const mobileReferralRaw = getMobileBoard('Referral.html')
  .replace(
    /<section data-dc-tpl="4" class="hero"[\s\S]*?<\/section>/i,
    `<section data-dc-tpl="4" class="hero" style="background: var(--vio); color: rgb(255, 255, 255); border-radius: 0px 0px 32px 32px; padding: 20px 20px 24px; display: flex; flex-direction: column;">
      <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(240, 230, 255, 0.85);">Partner Program</div>
      <div data-dc-tpl="25" class="num" style="font-size: 28px; font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; margin-top: 4px;">Partner package</div>
      <div style="font-size: 13px; font-weight: 500; line-height: 1.45; color: rgba(240, 230, 255, 0.88); margin-top: 6px;">Earn direct sales commissions, OKN token allocations, and VIP partner rewards.</div>
      <div data-dc-tpl="26" style="display: grid; grid-template-columns: repeat(3, minmax(0px, 1fr)); gap: 8px; margin-top: 16px;">
        <div data-dc-tpl="27" style="padding: 10px 6px; border-radius: 14px; background: rgba(255, 255, 255, 0.16); min-width: 0; overflow: hidden; text-align: center;">
          <div data-dc-tpl="28" class="num" style="font-size: 14px; font-weight: 800; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">10–15%</div>
          <div data-dc-tpl="29" style="font-size: 10.5px; font-weight: 600; line-height: 1.3; color: rgba(240, 230, 255, 0.9); margin-top: 4px; word-break: break-word;">Commission</div>
        </div>
        <div data-dc-tpl="30" style="padding: 10px 6px; border-radius: 14px; background: rgba(255, 255, 255, 0.16); min-width: 0; overflow: hidden; text-align: center;">
          <div data-dc-tpl="31" class="num" style="font-size: 14px; font-weight: 800; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">$200,000</div>
          <div data-dc-tpl="32" style="font-size: 10.5px; font-weight: 600; line-height: 1.3; color: rgba(240, 230, 255, 0.9); margin-top: 4px; word-break: break-word;">Marketing budget</div>
        </div>
        <div data-dc-tpl="33" style="padding: 10px 6px; border-radius: 14px; background: rgba(255, 255, 255, 0.16); min-width: 0; overflow: hidden; text-align: center;">
          <div data-dc-tpl="34" class="num" style="font-size: 14px; font-weight: 800; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">12 mo</div>
          <div data-dc-tpl="35" style="font-size: 10.5px; font-weight: 600; line-height: 1.3; color: rgba(240, 230, 255, 0.9); margin-top: 4px; word-break: break-word;">Token vesting</div>
        </div>
      </div>
    </section>`
  )
  .replace(
    /<div data-dc-tpl="37"[^>]*>Here is the package:<\/div>/i,
    '<div data-dc-tpl="37" style="font-size: 18px; font-weight: 800; letter-spacing: -0.01em; color: var(--tx); padding: 6px 2px 2px;">Here is the package:</div>'
  );
const mobileReferralCard = `
  <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 18px 16px; margin-bottom: 4px; display: flex; flex-direction: column; gap: 12px;">
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
      <div style="font-size: 16px; font-weight: 800; line-height: 1.25; color: var(--tx);">Your Referral Link</div>
      <span style="font-size: 11px; font-weight: 700; color: var(--mut); background: var(--s2); padding: 4px 10px; border-radius: 8px; white-space: nowrap;">Code: <strong style="color: var(--tx);">DE-71C49</strong></span>
    </div>
    <div style="font-size: 12.5px; line-height: 1.45; color: var(--mut); margin-top: -4px;">Share your unique tracking link to earn instant commissions on every purchase.</div>
    <div style="background: var(--s2); border: 1px solid var(--line); border-radius: 14px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
      <input type="text" readonly aria-label="Referral link" value="https://app.okntoken.com/ref/DE-71C49" style="background: transparent; border: none; color: var(--vio-l); font-size: 12.5px; font-weight: 600; font-family: Sora, monospace; width: 100%; outline: none; text-overflow: ellipsis;">
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="copyReferralLink()" class="copy-ref-btn" style="flex: 1; height: 44px; border-radius: 14px; background: var(--vio); color: #fff; font-weight: 800; font-size: 14px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s ease;">
        <svg class="i" width="16" height="16" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        <span>Copy link</span>
      </button>
      <a href="https://twitter.com/intent/tweet?text=Join%20the%20$OKN%20ecosystem!&url=https%3A%2F%2Fapp.okntoken.com%2Fref%2FDE-71C49" target="_blank" rel="noopener noreferrer" aria-label="Share on X" style="width: 44px; height: 44px; border-radius: 14px; background: var(--s2); border: 1px solid var(--line); color: var(--tx); display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href="https://t.me/share/url?url=https%3A%2F%2Fapp.okntoken.com%2Fref%2FDE-71C49&text=Join%20the%20OKN%20ecosystem!" target="_blank" rel="noopener noreferrer" aria-label="Share on Telegram" style="width: 44px; height: 44px; border-radius: 14px; background: var(--s2); border: 1px solid var(--line); color: var(--cyan); display: flex; align-items: center; justify-content: center;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
      </a>
    </div>
  </div>
`;
const mobileReferralStats = `
  <section style="padding: 20px 18px; border-radius: 24px; background: var(--s1); border: 1px solid var(--line);">
    <div style="font-size: 16px; font-weight: 800; margin-bottom: 14px; color: var(--tx);">Your Referral Statistics</div>
    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--line);">
      <span style="color: var(--mut); font-size: 13px; font-weight: 600;">Total Referrals</span>
      <span class="num" style="font-weight: 800; font-size: 14px; color: var(--tx);">0 friends</span>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--line);">
      <span style="color: var(--mut); font-size: 13px; font-weight: 600;">Total Commission Earned</span>
      <span class="num" style="font-weight: 800; font-size: 14px; color: var(--ok);">0.00 BNB</span>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--line);">
      <span style="color: var(--mut); font-size: 13px; font-weight: 600;">Point Multiplier</span>
      <span class="num" style="font-weight: 800; font-size: 14px; color: var(--yel-t);">1.0x</span>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 10px 0;">
      <span style="color: var(--mut); font-size: 13px; font-weight: 600;">Tier Status</span>
      <span style="font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 8px; background: var(--s2); color: var(--tx);">Bronze Partner</span>
    </div>
  </section>
`;
const mobileReferral = mobileReferralRaw.includes('<main')
  ? mobileReferralRaw
      .replace(/<main[^>]*>/, m => m + mobileReferralCard)
      .replace(/<\/main>/, mobileReferralStats + '</main>')
  : (mobileReferralCard + mobileReferralRaw + mobileReferralStats);
const mobileActivity = getMobileBoard('Activity.html')
  .replace(/>100<\/div>/g, '>135</div>');

const logoImgDesktop = '<img src="assets/okn-logo.png" alt="OKN logo" style="width: 20px; height: 20px; border-radius: 6px; object-fit: cover; display: inline-block; vertical-align: middle;">';



// 1. Tasks / Earn Desktop
const desktopEarnMain = `
  <section style="background: var(--vio); color: #fff; border-radius: 28px; padding: 32px 36px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
    <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; margin-bottom: 6px;">Earn OK Points</div>
    <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
      <div>
        <div style="font-size: 14px; opacity: 0.85;">Available to earn</div>
        <div class="num" style="font-size: 42px; font-weight: 800; line-height: 1.1; margin-top: 4px;">555 <span style="font-size: 20px; font-weight: 700; opacity: 0.85;">OK Points</span></div>
      </div>
      <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 12px 20px; border-radius: 16px;">
        <div style="font-size: 12px; opacity: 0.85;">Task Progress</div>
        <div style="font-size: 16px; font-weight: 800; margin-top: 2px;">0 / 11 tasks completed</div>
        <div style="width: 160px; height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; margin-top: 8px; overflow: hidden;">
          <div style="width: 12%; height: 100%; background: #fff; border-radius: 3px;"></div>
        </div>
      </div>
    </div>
  </section>

  <div style="display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 4px;">
    <button style="height: 38px; padding: 0 18px; border-radius: 19px; background: var(--vio); color: #fff; font-size: 13px; font-weight: 700; border: none; cursor: pointer;">All</button>
    <button style="height: 38px; padding: 0 18px; border-radius: 19px; background: var(--s2); color: var(--mut); font-size: 13px; font-weight: 700; border: 1px solid var(--line); cursor: pointer;">Social</button>
    <button style="height: 38px; padding: 0 18px; border-radius: 19px; background: var(--s2); color: var(--mut); font-size: 13px; font-weight: 700; border: 1px solid var(--line); cursor: pointer;">Daily</button>
    <button style="height: 38px; padding: 0 18px; border-radius: 19px; background: var(--s2); color: var(--mut); font-size: 13px; font-weight: 700; border: 1px solid var(--line); cursor: pointer;">Referral</button>
  </div>

  <div class="resp-grid-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 20px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(9,180,255,0.15); color: var(--cyan); display: flex; align-items: center; justify-content: center;">${ICONS.telegram}</div>
        <div>
          <div style="font-weight: 800; font-size: 15px;">Join our Telegram</div>
          <div style="font-size: 12px; font-weight: 700; color: var(--ok); margin-top: 2px;">+50 OK Points</div>
        </div>
      </div>
      <button style="height: 36px; padding: 0 16px; border-radius: 18px; background: var(--vio); color: #fff; font-size: 13px; font-weight: 700; border: none; cursor: pointer;">Claim</button>
    </div>

    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 20px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: var(--s2); color: var(--tx); display: flex; align-items: center; justify-content: center;">${ICONS.x}</div>
        <div>
          <div style="font-weight: 800; font-size: 15px;">Follow us on X</div>
          <div style="font-size: 12px; font-weight: 700; color: var(--ok); margin-top: 2px;">+70 OK Points</div>
        </div>
      </div>
      <button style="height: 36px; padding: 0 16px; border-radius: 18px; background: var(--vio); color: #fff; font-size: 13px; font-weight: 700; border: none; cursor: pointer;">Claim</button>
    </div>

    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 20px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(66,103,178,0.15); color: #4267B2; display: flex; align-items: center; justify-content: center;">${ICONS.facebook}</div>
        <div>
          <div style="font-weight: 800; font-size: 15px;">Follow $OKN on Facebook</div>
          <div style="font-size: 12px; font-weight: 700; color: var(--ok); margin-top: 2px;">+50 OK Points</div>
        </div>
      </div>
      <button style="height: 36px; padding: 0 16px; border-radius: 18px; background: var(--vio); color: #fff; font-size: 13px; font-weight: 700; border: none; cursor: pointer;">Claim</button>
    </div>

    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 20px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(255,0,0,0.15); display: flex; align-items: center; justify-content: center;">${ICONS.youtube}</div>
        <div>
          <div style="font-weight: 800; font-size: 15px;">Subscribe on YouTube</div>
          <div style="font-size: 12px; font-weight: 700; color: var(--ok); margin-top: 2px;">+65 OK Points</div>
        </div>
      </div>
      <button style="height: 36px; padding: 0 16px; border-radius: 18px; background: var(--vio); color: #fff; font-size: 13px; font-weight: 700; border: none; cursor: pointer;">Claim</button>
    </div>
  </div>

  <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
    <div>
      <div style="font-size: 18px; font-weight: 800;">Invite friends, earn more points</div>
      <div style="font-size: 13px; color: var(--mut); margin-top: 4px;">Earn 10–15% commission and escalating point multipliers for every invited friend.</div>
    </div>
    <a href="referral.html" style="height: 42px; padding: 0 24px; border-radius: 12px; background: var(--vio); color: #fff; font-weight: 800; font-size: 13px; display: flex; align-items: center; text-decoration: none;">Invite friends</a>
  </div>
`;

// 2. Claim Desktop
const desktopClaimMain = `
  <section style="background: var(--vio); color: #fff; border-radius: 28px; padding: 32px 36px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
    <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; margin-bottom: 6px;">Token Distribution</div>
    <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
      <div>
        <div style="font-size: 14px; opacity: 0.85;">Claimable OK Points</div>
        <div style="display: flex; align-items: center; gap: 14px; margin-top: 4px;">
          <span class="num" style="font-size: 42px; font-weight: 800; line-height: 1.1;">135</span>
          <span style="font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 12px; background: rgba(0,0,0,0.25); color: #fff; display: inline-flex; align-items: center; gap: 6px;">${ICONS.timer} Not open yet</span>
        </div>
      </div>
      <button onclick="openWalletModal()" style="height: 44px; padding: 0 24px; border-radius: 14px; background: #fff; color: #000; font-weight: 800; font-size: 13px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px;">
        ${ICONS.wallet}
        <span>Connect wallet</span>
      </button>
    </div>
  </section>

  <div class="resp-grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="font-size: 16px; font-weight: 800; margin-bottom: 20px;">Claim Summary</div>
      <div style="display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--line);">
        <span style="color: var(--mut); font-size: 14px;">Claimable OK Points</span>
        <span class="num" style="font-weight: 800; font-size: 16px;">135 pts</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--line);">
        <span style="color: var(--mut); font-size: 14px;">Claim fee (paid in BNB)</span>
        <span class="num" style="font-weight: 800; font-size: 16px;">$3 USD</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--line);">
        <span style="color: var(--mut); font-size: 14px;">You receive</span>
        <span class="num" style="font-weight: 800; font-size: 16px; color: var(--vio-l);">0 $OKN</span>
      </div>
      <button onclick="openWalletModal()" style="width: 100%; margin-top: 24px; height: 48px; border-radius: 14px; background: var(--vio); color: #fff; font-weight: 800; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
        ${ICONS.wallet}
        <span>Connect wallet to claim</span>
      </button>
    </div>

    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="font-size: 16px; font-weight: 800; margin-bottom: 20px;">How Claiming Works</div>
      <div style="display: flex; gap: 16px; margin-bottom: 20px;">
        <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--ok); color: #fff; display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">${ICONS.check}</div>
        <div>
          <div style="font-weight: 800; font-size: 14px;">Earn OK Points</div>
          <div style="font-size: 12px; color: var(--mut); margin-top: 2px;">Complete tasks and invite friends to build your allocation.</div>
        </div>
      </div>
      <div style="display: flex; gap: 16px; margin-bottom: 20px;">
        <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(255,214,10,0.2); border: 2px solid var(--yel); color: var(--yel); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; flex: 0 0 auto;">2</div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 800; font-size: 14px;">Wait for the commit</span>
            <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; background: var(--yel); color: #000;">You are here</span>
          </div>
          <div style="font-size: 12px; color: var(--mut); margin-top: 2px;">The admin commits a cryptographic Merkle root to BNB Smart Chain.</div>
        </div>
      </div>
      <div style="display: flex; gap: 16px;">
        <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--s2); border: 2px dashed var(--line); color: var(--mut); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex: 0 0 auto;">3</div>
        <div>
          <div style="font-weight: 800; font-size: 14px;">Claim on-chain</div>
          <div style="font-size: 12px; color: var(--mut); margin-top: 2px;">Pay the $3 BNB gas fee and $OKN tokens arrive in your wallet instantly.</div>
        </div>
      </div>
    </div>
  </div>

  <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 20px 24px; display: flex; align-items: center; gap: 14px;">
    <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(47,189,142,0.15); color: var(--ok); display: flex; align-items: center; justify-content: center;">${ICONS.shield}</div>
    <div style="font-size: 13px; color: var(--mut);"><strong style="color: var(--tx);">Cryptographic Verification:</strong> Claims are verified on-chain via Merkle proofs directly on BNB Smart Chain.</div>
  </div>
`;

// 3. Buy Desktop & Mobile Multi-Gateway Engine
const desktopBuyMain = `
  <section class="buy-hero" style="background: var(--vio); color: #fff; border-radius: 28px; padding: 26px 30px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(122,18,245,0.22);">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px;">
      <div>
        <div class="buy-hero-sub" style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.85; margin-bottom: 4px;">Presale Allocation</div>
        <div class="num buy-hero-title" style="font-size: 32px; font-weight: 800; line-height: 1.15; margin: 0 0 4px;">Buy $OKN Tokens</div>
        <div class="buy-hero-desc" style="font-size: 13.5px; opacity: 0.9; max-width: 540px;">Select your preferred payment gateway: Web3 Wallet (BNB), NOWPayments Crypto Gateway (300+ coins), or Credit/Debit Card.</div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
        <div class="buy-hero-badge" style="font-size: 12px; font-weight: 800; padding: 6px 14px; border-radius: 12px; background: rgba(0,0,0,0.25); color: #fff; display: flex; align-items: center; gap: 8px;">
          ${ICONS.shield}
          <span>Fixed Rate: 1,000,000 $OKN per 1 BNB (~$0.00060 / $OKN)</span>
        </div>
        <div class="buy-hero-footer" style="font-size: 11px; opacity: 0.85;">Instant token custody upon confirmed payment</div>
      </div>
    </div>
  </section>

  <!-- Gateway Selector Tabs -->
  <div class="gateway-tabs" role="tablist" aria-label="Select Payment Gateway">
    <button type="button" class="gateway-tab active" data-gw="web3" onclick="switchPaymentGateway('web3')">
      ${ICONS.bnb}
      <span class="tab-label-full">Web3 (BNB)</span>
      <span class="tab-label-short">Web3 BNB</span>
    </button>
    <button type="button" class="gateway-tab" data-gw="nowpayments" onclick="switchPaymentGateway('nowpayments')">
      ${ICONS.nowpayments}
      <span class="tab-label-full">NOWPayments (Crypto)</span>
      <span class="tab-label-short">Crypto (300+)</span>
      <span class="gateway-tab-badge" style="font-size: 10px; background: rgba(9,180,255,0.18); color: var(--cyan); padding: 2px 6px; border-radius: 6px; font-weight: 800;">300+ Coins</span>
    </button>
    <button type="button" class="gateway-tab" data-gw="card" onclick="switchPaymentGateway('card')">
      ${ICONS.creditCard}
      <span class="tab-label-full">Credit / Debit Card</span>
      <span class="tab-label-short">Card / Pay</span>
      <span class="gateway-tab-badge" style="font-size: 10px; background: rgba(47,189,142,0.18); color: var(--ok); padding: 2px 6px; border-radius: 6px; font-weight: 800;">Visa / MC</span>
    </button>
  </div>

  <div class="resp-grid-2" style="display: grid; grid-template-columns: 1.25fr 0.75fr; gap: 20px; margin-bottom: 24px;">
    <!-- Left Column: Active Gateway Form Panel -->
    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 26px; position: relative;">
      
      <!-- Panel 1: Web3 (BNB) -->
      <div id="panel-web3" class="gateway-panel">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
          <div>
            <div style="font-size: 17px; font-weight: 800; color: var(--tx);">Web3 BSC Native Checkout</div>
            <div style="font-size: 12.5px; color: var(--mut); margin-top: 2px;">Direct smart contract presale swap on BNB Smart Chain.</div>
          </div>
          <span style="font-size: 11px; font-weight: 700; background: rgba(243,186,47,0.15); color: #F3BA2F; padding: 4px 10px; border-radius: 8px;">BSC Chain 97 / 56</span>
        </div>

        <div style="background: var(--s2); border: 1px solid var(--line); border-radius: 18px; padding: 16px; margin-bottom: 12px;">
          <div style="font-size: 12px; color: var(--mut); margin-bottom: 6px; font-weight: 600;">You pay</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <input type="text" id="buy-bnb-amt" aria-label="BNB amount to pay" value="0.1" oninput="calcTokens(this.value, 'bnb')" style="background: transparent; border: none; color: var(--tx); font-size: 26px; font-weight: 800; width: 60%; outline: none; font-family: Sora, sans-serif;">
            <span style="font-weight: 800; font-size: 15px; display: flex; align-items: center; gap: 8px;">${ICONS.bnb} BNB</span>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button type="button" onclick="setBnbPreset(0.1)" style="flex: 1; padding: 8px 0; border-radius: 10px; background: var(--s1); border: 1px solid var(--line); color: var(--tx); font-size: 12px; font-weight: 700; cursor: pointer;">0.1</button>
            <button type="button" onclick="setBnbPreset(0.5)" style="flex: 1; padding: 8px 0; border-radius: 10px; background: var(--s1); border: 1px solid var(--line); color: var(--tx); font-size: 12px; font-weight: 700; cursor: pointer;">0.5</button>
            <button type="button" onclick="setBnbPreset(1.0)" style="flex: 1; padding: 8px 0; border-radius: 10px; background: var(--s1); border: 1px solid var(--line); color: var(--tx); font-size: 12px; font-weight: 700; cursor: pointer;">1.0</button>
            <button type="button" onclick="setBnbPreset(5.0)" style="flex: 1; padding: 8px 0; border-radius: 10px; background: var(--s1); border: 1px solid var(--line); color: var(--tx); font-size: 12px; font-weight: 700; cursor: pointer;">5.0</button>
            <button type="button" onclick="setBnbPreset(10.0)" style="flex: 1; padding: 8px 0; border-radius: 10px; background: var(--s1); border: 1px solid var(--line); color: var(--vio-l); font-size: 12px; font-weight: 800; cursor: pointer;">Max 10</button>
          </div>
        </div>

        <div style="background: var(--s2); border: 1px solid var(--line); border-radius: 18px; padding: 16px; margin-bottom: 20px;">
          <div style="font-size: 12px; color: var(--mut); margin-bottom: 6px; font-weight: 600;">You receive</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div id="buy-receive-bnb" class="num" style="font-size: 26px; font-weight: 800; color: var(--vio-l);">~100,000</div>
            <span style="font-weight: 800; font-size: 14px; display: flex; align-items: center; gap: 6px;">${logoImgDesktop} $OKN</span>
          </div>
        </div>

        <button type="button" onclick="executeWeb3Buy()" id="btn-web3-action" style="width: 100%; height: 50px; border-radius: 14px; background: var(--vio); color: #fff; font-weight: 800; font-size: 15px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: transform 0.15s ease;">
          ${ICONS.wallet}
          <span id="btn-web3-text">Connect wallet to buy</span>
        </button>
      </div>

      <!-- Panel 2: NOWPayments Crypto Gateway -->
      <div id="panel-nowpayments" class="gateway-panel" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <div style="font-size: 17px; font-weight: 800; color: var(--tx);">NOWPayments Multi-Crypto Gateway</div>
            <div style="font-size: 12.5px; color: var(--mut); margin-top: 2px;">Pay with USDT, BTC, ETH, SOL, USDC & 300+ cryptocurrencies.</div>
          </div>
          <span style="font-size: 11px; font-weight: 800; background: rgba(9,180,255,0.15); color: var(--cyan); padding: 4px 10px; border-radius: 8px;">Auto-Convert</span>
        </div>

        <!-- Coin selector pills -->
        <div style="font-size: 12px; font-weight: 700; color: var(--mut); margin-bottom: 8px;">Choose cryptocurrency:</div>
        <div class="coin-badge-grid">
          <button type="button" class="coin-badge active" data-coin="USDT_TRC20" onclick="selectNowCoin('USDT_TRC20', 'USDT', 'TRC-20', 'TRON', 1)">
            ${ICONS.usdt} <span>USDT (TRC20)</span>
          </button>
          <button type="button" class="coin-badge" data-coin="USDT_BEP20" onclick="selectNowCoin('USDT_BEP20', 'USDT', 'BEP-20', 'BSC', 1)">
            ${ICONS.usdt} <span>USDT (BEP20)</span>
          </button>
          <button type="button" class="coin-badge" data-coin="BTC" onclick="selectNowCoin('BTC', 'BTC', 'Bitcoin', 'BTC', 65000)">
            ${ICONS.btc} <span>BTC</span>
          </button>
          <button type="button" class="coin-badge" data-coin="ETH" onclick="selectNowCoin('ETH', 'ETH', 'ERC-20', 'Ethereum', 3200)">
            ${ICONS.eth} <span>ETH</span>
          </button>
          <button type="button" class="coin-badge" data-coin="SOL" onclick="selectNowCoin('SOL', 'SOL', 'Solana', 'SOL', 180)">
            ${ICONS.sol} <span>SOL</span>
          </button>
          <button type="button" class="coin-badge" data-coin="USDC" onclick="selectNowCoin('USDC', 'USDC', 'Multi-chain', 'USDC', 1)">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="#2775CA"><circle cx="16" cy="16" r="16"/><path d="M16 6a10 10 0 100 20 10 10 0 000-20zm1.2 14.8c-1.8 0-2.8-.7-3.1-1.8l1.7-.7c.2.6.7 1 1.4 1 .8 0 1.3-.4 1.3-1 0-.6-.4-.9-1.5-1.2-1.8-.4-2.8-1.1-2.8-2.4 0-1.5 1.1-2.4 2.8-2.4 1.5 0 2.4.6 2.8 1.6l-1.6.7c-.2-.5-.6-.8-1.2-.8-.7 0-1.1.4-1.1.9s.4.8 1.4 1.1c1.9.5 2.9 1.1 2.9 2.5.1 1.7-1.1 2.6-3 2.6z" fill="#fff"/></svg>
            <span>USDC</span>
          </button>
          <button type="button" class="coin-badge" data-coin="BNB_CRYPTO" onclick="selectNowCoin('BNB_CRYPTO', 'BNB', 'BEP-20', 'BSC', 600)">
            ${ICONS.bnb} <span>BNB</span>
          </button>
          <button type="button" class="coin-badge" data-coin="LTC" onclick="selectNowCoin('LTC', 'LTC', 'Litecoin', 'LTC', 85)">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="#345D9D"><circle cx="16" cy="16" r="16"/><path d="M14.5 9h3l-2.1 7.5h3.6l-.7 2.5h-3.6l-1.5 5h7.2l-.7 2.5h-10l4.8-17.5z" fill="#fff"/></svg>
            <span>LTC</span>
          </button>
        </div>

        <div style="background: var(--s2); border: 1px solid var(--line); border-radius: 18px; padding: 16px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 12px; color: var(--mut); font-weight: 600;">Amount in USD</span>
            <span id="now-crypto-equiv" style="font-size: 12px; color: var(--cyan); font-weight: 700;">≈ 100.00 USDT</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 4px; width: 60%;">
              <span style="font-size: 24px; font-weight: 800; color: var(--tx);">$</span>
              <input type="text" id="buy-now-amt" aria-label="USD amount to pay" value="100" oninput="calcTokens(this.value, 'nowpayments')" style="background: transparent; border: none; color: var(--tx); font-size: 26px; font-weight: 800; width: 100%; outline: none; font-family: Sora, sans-serif;">
            </div>
            <span id="now-selected-label" style="font-weight: 800; font-size: 14px; display: flex; align-items: center; gap: 6px;">
              USDT (TRC-20)
            </span>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button type="button" onclick="setNowPreset(50)" style="flex: 1; padding: 8px 0; border-radius: 10px; background: var(--s1); border: 1px solid var(--line); color: var(--tx); font-size: 12px; font-weight: 700; cursor: pointer;">$50</button>
            <button type="button" onclick="setNowPreset(100)" style="flex: 1; padding: 8px 0; border-radius: 10px; background: var(--s1); border: 1px solid var(--line); color: var(--tx); font-size: 12px; font-weight: 700; cursor: pointer;">$100</button>
            <button type="button" onclick="setNowPreset(250)" style="flex: 1; padding: 8px 0; border-radius: 10px; background: var(--s1); border: 1px solid var(--line); color: var(--tx); font-size: 12px; font-weight: 700; cursor: pointer;">$250</button>
            <button type="button" onclick="setNowPreset(500)" style="flex: 1; padding: 8px 0; border-radius: 10px; background: var(--s1); border: 1px solid var(--line); color: var(--tx); font-size: 12px; font-weight: 700; cursor: pointer;">$500</button>
            <button type="button" onclick="setNowPreset(1000)" style="flex: 1; padding: 8px 0; border-radius: 10px; background: var(--s1); border: 1px solid var(--line); color: var(--vio-l); font-size: 12px; font-weight: 800; cursor: pointer;">$1,000</button>
          </div>
        </div>

        <div style="background: var(--s2); border: 1px solid var(--line); border-radius: 18px; padding: 16px; margin-bottom: 20px;">
          <div style="font-size: 12px; color: var(--mut); margin-bottom: 6px; font-weight: 600;">You receive</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div id="buy-receive-now" class="num" style="font-size: 26px; font-weight: 800; color: var(--vio-l);">~166,667</div>
            <span style="font-weight: 800; font-size: 14px; display: flex; align-items: center; gap: 6px;">${logoImgDesktop} $OKN</span>
          </div>
        </div>

        <button type="button" onclick="openNowPaymentsModal()" style="width: 100%; height: 50px; border-radius: 14px; background: linear-gradient(135deg, #09B4FF 0%, #7A12F5 100%); color: #fff; font-weight: 800; font-size: 15px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 14px rgba(9,180,255,0.3); transition: transform 0.15s ease;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#fff"/><path d="M7 16l4-8h2l-4 8H7zm6 0l4-8h2l-4 8h-2z" fill="#09B4FF"/></svg>
          <span>Generate NOWPayments Invoice</span>
        </button>
      </div>

      <!-- Panel 3: Credit Card Gateway -->
      <div id="panel-card" class="gateway-panel" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <div style="font-size: 17px; font-weight: 800; color: var(--tx);">Credit & Debit Card Checkout</div>
            <div style="font-size: 12.5px; color: var(--mut); margin-top: 2px;">Visa, Mastercard, Apple Pay & Google Pay accepted worldwide.</div>
          </div>
          <div style="display: flex; gap: 6px; align-items: center;">
            ${ICONS.visa}
            ${ICONS.mastercard}
          </div>
        </div>

        <!-- Express 1-Touch Options -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
          <button type="button" onclick="triggerApplePay()" class="express-btn express-apple">
            ${ICONS.apple} <span>Pay</span>
          </button>
          <button type="button" onclick="triggerGooglePay()" class="express-btn express-google">
            ${ICONS.google} <span>Pay</span>
          </button>
        </div>

        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
          <div style="flex: 1; height: 1px; background: var(--line);"></div>
          <span style="font-size: 11px; font-weight: 700; color: var(--mut); text-transform: uppercase;">Or pay with card details</span>
          <div style="flex: 1; height: 1px; background: var(--line);"></div>
        </div>

        <div style="background: var(--s2); border: 1px solid var(--line); border-radius: 18px; padding: 14px 16px; margin-bottom: 12px;">
          <div style="font-size: 12px; color: var(--mut); margin-bottom: 4px; font-weight: 600;">Amount in USD</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 4px; width: 60%;">
              <span style="font-size: 22px; font-weight: 800; color: var(--tx);">$</span>
              <input type="text" id="buy-card-amt" aria-label="Card USD amount" value="100" oninput="calcTokens(this.value, 'card')" style="background: transparent; border: none; color: var(--tx); font-size: 24px; font-weight: 800; width: 100%; outline: none; font-family: Sora, sans-serif;">
            </div>
            <div style="text-align: right;">
              <div id="buy-receive-card" class="num" style="font-size: 18px; font-weight: 800; color: var(--vio-l);">~166,667 $OKN</div>
            </div>
          </div>
          <div style="display: flex; gap: 6px; margin-top: 10px;">
            <button type="button" onclick="setCardPreset(50)" style="flex: 1; padding: 6px 0; border-radius: 8px; background: var(--s1); border: 1px solid var(--line); color: var(--tx); font-size: 11px; font-weight: 700; cursor: pointer;">$50</button>
            <button type="button" onclick="setCardPreset(100)" style="flex: 1; padding: 6px 0; border-radius: 8px; background: var(--s1); border: 1px solid var(--line); color: var(--tx); font-size: 11px; font-weight: 700; cursor: pointer;">$100</button>
            <button type="button" onclick="setCardPreset(250)" style="flex: 1; padding: 6px 0; border-radius: 8px; background: var(--s1); border: 1px solid var(--line); color: var(--tx); font-size: 11px; font-weight: 700; cursor: pointer;">$250</button>
            <button type="button" onclick="setCardPreset(500)" style="flex: 1; padding: 6px 0; border-radius: 8px; background: var(--s1); border: 1px solid var(--line); color: var(--tx); font-size: 11px; font-weight: 700; cursor: pointer;">$500</button>
          </div>
        </div>

        <!-- Form fields -->
        <div class="card-input-group">
          <label for="card-holder-name" style="font-size: 12px; font-weight: 700; color: var(--mut);">Cardholder Name</label>
          <input type="text" id="card-holder-name" placeholder="Full name as printed on card" value="Alex Morgan" class="card-input-field">
        </div>

        <div class="card-input-group">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label for="card-number-input" style="font-size: 12px; font-weight: 700; color: var(--mut);">Card Number</label>
            <span id="card-brand-detected" style="font-size: 11px; font-weight: 800; color: var(--ok);">Visa / MC</span>
          </div>
          <div style="position: relative;">
            <input type="text" id="card-number-input" maxlength="19" placeholder="4532 •••• •••• 8821" value="4532 8920 4120 8821" oninput="formatCardNumber(this)" class="card-input-field" style="padding-right: 42px; font-family: Sora, monospace;">
            <span style="position: absolute; right: 12px; top: 11px;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div class="card-input-group" style="margin-bottom: 0;">
            <label for="card-exp-input" style="font-size: 12px; font-weight: 700; color: var(--mut);">Expiration Date</label>
            <input type="text" id="card-exp-input" maxlength="5" placeholder="MM/YY" value="08/29" oninput="formatCardExp(this)" class="card-input-field" style="font-family: Sora, monospace;">
          </div>
          <div class="card-input-group" style="margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between;">
              <label for="card-cvv-input" style="font-size: 12px; font-weight: 700; color: var(--mut);">CVV / CVC</label>
              <span style="font-size: 10px; color: var(--mut);">3 digits</span>
            </div>
            <input type="password" id="card-cvv-input" maxlength="4" placeholder="•••" value="892" class="card-input-field" style="font-family: Sora, monospace;">
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; color: var(--mut); margin-bottom: 16px;">
          <span style="display: flex; align-items: center; gap: 6px;">
            ${ICONS.lock}
            <span>256-bit TLS encrypted</span>
          </span>
          <span style="display: flex; align-items: center; gap: 6px;">
            ${ICONS.shield}
            <span>3D-Secure 2.0 Enabled</span>
          </span>
        </div>

        <button type="button" onclick="processCardPayment()" id="btn-card-pay" style="width: 100%; height: 50px; border-radius: 14px; background: var(--ok); color: #fff; font-weight: 800; font-size: 15px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: transform 0.15s ease;">
          <svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span id="btn-card-text">Pay $100.00 with Card</span>
        </button>
      </div>

    </div>

    <!-- Right Column: Sale Parameters & Supported Gateways -->
    <div class="buy-sidebar-info" style="display: flex; flex-direction: column; gap: 16px;">
      
      <!-- Presale Parameters Card -->
      <div class="buy-sidebar-card" style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 22px;">
        <div style="font-size: 14.5px; font-weight: 800; margin-bottom: 12px; color: var(--tx);">Presale Parameters</div>
        
        <!-- Desktop Detailed Rows -->
        <div class="buy-stat-grid-desktop">
          <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid var(--line);">
            <span style="color: var(--mut); font-size: 13px;">Active Gateway</span>
            <span id="summary-active-gw" style="font-weight: 800; font-size: 13.5px; color: var(--tx);">Web3 (BNB Smart Chain)</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid var(--line);">
            <span style="color: var(--mut); font-size: 13px;">Token Valuation</span>
            <span class="num" style="font-weight: 800; font-size: 13.5px; color: var(--vio-l);">1 $OKN = $0.00060 USD</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid var(--line);">
            <span style="color: var(--mut); font-size: 13px;">Wallet Presale Cap</span>
            <span class="num" style="font-weight: 800; font-size: 13.5px;">10 BNB (~$6,000 USD)</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid var(--line);">
            <span style="color: var(--mut); font-size: 13px;">Total Raised</span>
            <span class="num" style="font-weight: 800; font-size: 13.5px; color: var(--ok);">$428,950 USD</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 11px 0;">
            <span style="color: var(--mut); font-size: 13px;">Tokens Remaining</span>
            <span class="num" style="font-weight: 800; font-size: 13.5px;">1,249,998,000 $OKN</span>
          </div>
        </div>

        <!-- Mobile 2x2 Compact Stat Grid -->
        <div class="buy-stat-grid-mobile">
          <div class="buy-stat-item">
            <div class="buy-stat-label">Token Price</div>
            <div class="buy-stat-value" style="color: var(--vio-l);">$0.00060</div>
          </div>
          <div class="buy-stat-item">
            <div class="buy-stat-label">Presale Rate</div>
            <div class="buy-stat-value">1M / 1 BNB</div>
          </div>
          <div class="buy-stat-item">
            <div class="buy-stat-label">Total Raised</div>
            <div class="buy-stat-value" style="color: var(--ok);">$428,950</div>
          </div>
          <div class="buy-stat-item">
            <div class="buy-stat-label">Wallet Cap</div>
            <div class="buy-stat-value">10 BNB</div>
          </div>
        </div>
      </div>

      <!-- Gateway Features Card -->
      <div class="buy-sidebar-card" style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 22px;">
        <div style="font-size: 14.5px; font-weight: 800; margin-bottom: 12px; color: var(--tx);">Supported Payment Infrastructure</div>
        
        <!-- Desktop Detailed List -->
        <div class="infra-desktop-list" style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; border-radius: 10px; background: rgba(9,180,255,0.14); color: var(--cyan); display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">
              ${ICONS.nowpayments}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 13px;">NOWPayments Gateway</div>
              <div style="font-size: 11px; color: var(--mut);">Automated multi-crypto settlement across 300+ coins.</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; border-radius: 10px; background: rgba(47,189,142,0.14); color: var(--ok); display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">
              ${ICONS.shield}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 13px;">Visa & Mastercard 3DS</div>
              <div style="font-size: 11px; color: var(--mut);">Direct card processing with zero crypto wallet required.</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; border-radius: 10px; background: rgba(243,186,47,0.14); color: #F3BA2F; display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">
              ${ICONS.bnb}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 13px;">BNB Smart Chain EVM</div>
              <div style="font-size: 11px; color: var(--mut);">Direct Web3 smart contract calls via Wagmi / Viem.</div>
            </div>
          </div>
        </div>

        <!-- Mobile Compact Trust Pills -->
        <div class="infra-mobile-pills">
          <div class="infra-pill">${ICONS.nowpayments} <span>NOWPayments (300+ Crypto)</span></div>
          <div class="infra-pill">${ICONS.shield} <span>Visa & MC 3DS</span></div>
          <div class="infra-pill">${ICONS.bnb} <span>BNB Smart Chain</span></div>
        </div>
      </div>
    </div>
  </div>

  <div class="buy-alert-strip" style="background: rgba(255,170,0,0.12); border: 1px solid rgba(255,170,0,0.3); border-radius: 18px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
    <div class="buy-alert-strip-text" style="font-size: 13px; font-weight: 700; color: var(--org-t); display: flex; align-items: center; gap: 8px;">
      ${ICONS.alert}
      <span>Multi-gateway testing mode: Presale is live with verified instant delivery.</span>
    </div>
    <a href="https://testnet.bnbchain.org/faucet-smart" target="_blank" style="padding: 7px 16px; border-radius: 10px; background: var(--s1); border: 1px solid var(--line); color: var(--tx); font-weight: 700; font-size: 12.5px; text-decoration: none; display: flex; align-items: center; gap: 6px;">
      <span>Get testnet BNB</span>
      ${ICONS.arrowRight}
    </a>
  </div>
`;

// 4. Agents Desktop
const desktopAgentsMain = `
  <section style="background: var(--vio); color: #fff; border-radius: 28px; padding: 32px 36px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
    <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; margin-bottom: 6px;">Protocol Roadmap</div>
    <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em;">Coming to OKN</h1>
    <p style="font-size: 15px; opacity: 0.85; margin: 0; max-width: 650px;">Four flagship Web3 AI and staking features are currently being built. Nothing on this page trades or stakes yet.</p>
  </section>

  <div class="resp-grid-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 14px; background: var(--s2); color: var(--tx); display: flex; align-items: center; justify-content: center;">${ICONS.lock}</div>
          <div>
            <div style="font-size: 18px; font-weight: 800;">Staking</div>
            <div style="font-size: 13px; color: var(--mut);">Lock $OKN, earn APY.</div>
          </div>
        </div>
        <span style="font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; background: var(--s2); color: var(--mut);">Coming soon</span>
      </div>
      <div style="font-size: 13px; color: var(--mut); margin-bottom: 18px;">Longer lock durations yield higher staking multipliers.</div>
      <div style="display: flex; gap: 8px;">
        <span style="flex: 1; text-align: center; padding: 8px 0; border-radius: 12px; background: var(--s2); font-weight: 800; font-size: 13px;">30d</span>
        <span style="flex: 1; text-align: center; padding: 8px 0; border-radius: 12px; background: var(--s2); font-weight: 800; font-size: 13px;">90d</span>
        <span style="flex: 1; text-align: center; padding: 8px 0; border-radius: 12px; background: var(--s2); font-weight: 800; font-size: 13px;">180d</span>
        <span style="flex: 1; text-align: center; padding: 8px 0; border-radius: 12px; background: var(--s2); font-weight: 800; font-size: 13px;">365d</span>
      </div>
    </div>

    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(255,170,0,0.15); color: var(--org); display: flex; align-items: center; justify-content: center;">${ICONS.trending}</div>
          <div>
            <div style="font-size: 18px; font-weight: 800;">AI Trading Agent</div>
            <div style="font-size: 13px; color: var(--mut);">Your AI co-pilot for crypto signals</div>
          </div>
        </div>
        <span style="font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; background: rgba(255,170,0,0.15); color: var(--org);">In development</span>
      </div>
      <p style="font-size: 13px; color: var(--mut); line-height: 1.6; margin: 0;">24/7 autonomous market scanning, entry/target levels, and stop loss execution with risk-managed sizing.</p>
    </div>

    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="assets/polymarket.png" alt="Polymarket" style="width: 44px; height: 44px; border-radius: 14px; object-fit: contain; box-shadow: 0 4px 14px rgba(9, 180, 255, 0.25); flex-shrink: 0;">
          <div>
            <div style="font-size: 18px; font-weight: 800;">Polymarket Agent</div>
            <div style="font-size: 13px; color: var(--mut);">Automated prediction positioning</div>
          </div>
        </div>
        <span style="font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; background: rgba(255,170,0,0.15); color: var(--org);">In development</span>
      </div>
      <p style="font-size: 13px; color: var(--mut); line-height: 1.6; margin: 0;">Continuous probability tracking, news-velocity sentiment monitoring, and automated hedging.</p>
    </div>

    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(201,166,255,0.15); color: var(--vio-l); display: flex; align-items: center; justify-content: center;">${ICONS.barChart}</div>
          <div>
            <div style="font-size: 18px; font-weight: 800;">Prediction Markets</div>
            <div style="font-size: 13px; color: var(--mut);">Outcome markets across protocols</div>
          </div>
        </div>
        <span style="font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; background: var(--s2); color: var(--mut);">Coming soon</span>
      </div>
      <p style="font-size: 13px; color: var(--mut); line-height: 1.6; margin: 0;">Direct access to decentralized outcome pools with zero-slippage settlement and native $OKN fee discounts.</p>
    </div>
  </div>
`;

// 5. Referral Desktop
const desktopReferralMain = `
  <section style="background: var(--vio); color: #fff; border-radius: 28px; padding: 32px 36px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
    <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; margin-bottom: 6px;">Partner program · Referral</div>
    <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 16px; letter-spacing: -0.02em;">Partner package</h1>
    <div style="display: flex; gap: 14px; flex-wrap: wrap;">
      <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 12px 20px; border-radius: 16px;">
        <div class="num" style="font-size: 20px; font-weight: 800;">10-15%</div>
        <div style="font-size: 12px; opacity: 0.85;">Commission</div>
      </div>
      <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 12px 20px; border-radius: 16px;">
        <div class="num" style="font-size: 20px; font-weight: 800;">$200,000</div>
        <div style="font-size: 12px; opacity: 0.85;">Marketing budget</div>
      </div>
      <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 12px 20px; border-radius: 16px;">
        <div class="num" style="font-size: 20px; font-weight: 800;">12 mo</div>
        <div style="font-size: 12px; opacity: 0.85;">Token vesting</div>
      </div>
    </div>
  </section>

  <!-- Interactive Referral Copy Link Card -->
  <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 24px 28px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 16px;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
      <div>
        <div style="font-size: 18px; font-weight: 800;">Your Unique Referral Link</div>
        <div style="font-size: 13px; color: var(--mut); margin-top: 4px;">Share your personal link to earn instant commissions and ascending tier multipliers.</div>
      </div>
      <span style="font-size: 12px; font-weight: 800; color: var(--mut); background: var(--s2); padding: 6px 14px; border-radius: 10px;">Referral Code: <strong style="color: var(--tx);">DE-71C49</strong></span>
    </div>
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 240px; background: var(--s2); border: 1px solid var(--line); border-radius: 14px; padding: 12px 18px; display: flex; align-items: center;">
        <input type="text" readonly aria-label="Referral link" value="https://app.okntoken.com/ref/DE-71C49" style="background: transparent; border: none; color: var(--tx); font-size: 14px; font-weight: 700; font-family: Sora, monospace; width: 100%; outline: none;">
      </div>
      <button onclick="copyReferralLink()" class="copy-ref-btn" style="height: 48px; padding: 0 24px; border-radius: 14px; background: var(--vio); color: #fff; font-weight: 800; font-size: 14px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease;">
        <svg class="i" width="16" height="16" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        <span>Copy link</span>
      </button>
      <a href="https://twitter.com/intent/tweet?text=Join%20the%20$OKN%20ecosystem!&url=https%3A%2F%2Fapp.okntoken.com%2Fref%2FDE-71C49" target="_blank" rel="noopener noreferrer" style="height: 48px; padding: 0 18px; border-radius: 14px; background: var(--s2); border: 1px solid var(--line); color: var(--tx); display: flex; align-items: center; justify-content: center; text-decoration: none;">
        ${ICONS.x}
      </a>
      <a href="https://t.me/share/url?url=https%3A%2F%2Fapp.okntoken.com%2Fref%2FDE-71C49&text=Join%20the%20OKN%20ecosystem!" target="_blank" rel="noopener noreferrer" style="height: 48px; padding: 0 18px; border-radius: 14px; background: var(--s2); border: 1px solid var(--line); color: var(--cyan); display: flex; align-items: center; justify-content: center; text-decoration: none;">
        ${ICONS.telegram}
      </a>
    </div>
  </div>

  <!-- Full 4-Section Partner Package Details (Restored from Referral.html) -->
  <div style="font-size: 16px; font-weight: 800; margin: 0 0 16px; color: var(--tx);">Here is the package:</div>
  <div class="resp-grid-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
    <!-- Section 1 -->
    <section style="padding: 24px; border-radius: 24px; background: var(--s1); border: 1px solid var(--line);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="num" style="width: 36px; height: 36px; border-radius: 50%; background: var(--vio); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; flex: 0 0 auto;">1</span>
        <div>
          <div style="font-size: 16px; font-weight: 800; line-height: 1.25;">Tiered Performance Commissions</div>
          <div style="font-size: 12px; font-weight: 600; color: var(--mut); margin-top: 2px;">(The "Mouth-Watering" Part)</div>
        </div>
      </div>
      <div style="font-size: 13px; line-height: 1.55; color: var(--mut); margin-top: 16px;">
        We are allocating an initial <strong style="color: var(--tx); font-weight: 800;">$200,000 Presale Marketing Budget</strong> strictly for performance payouts.
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 14px;">
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--vio-l); margin-top: 8px; flex: 0 0 auto;"></span>
          <div style="font-size: 13px; line-height: 1.55; color: var(--mut);"><strong style="color: var(--tx); font-weight: 800;">Direct Sales Commission:</strong> You earn a <strong style="color: var(--tx); font-weight: 800;">10% - 15% commission</strong> on every single token purchase (USDT/BNB) made through your unique tracking links or promo codes.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--vio-l); margin-top: 8px; flex: 0 0 auto;"></span>
          <div style="font-size: 13px; line-height: 1.55; color: var(--mut);"><strong style="color: var(--tx); font-weight: 800;">The Math:</strong> If you drive $500k in sales (which is only 10 million OKN tokens at our $0.05 stage price), you instantly earn <strong style="color: var(--tx); font-weight: 800;">$50,000 - $75,000</strong>. If you drive $1M, you earn $100k+.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--vio-l); margin-top: 8px; flex: 0 0 auto;"></span>
          <div style="font-size: 13px; line-height: 1.55; color: var(--mut);"><strong style="color: var(--tx); font-weight: 800;">Milestone Bonuses:</strong> We will set aggressive monthly targets (e.g., $100k in volume). Hit the target, and we pay a flat cash bonus on top of your commission.</div>
        </div>
      </div>
    </section>

    <!-- Section 2 -->
    <section style="padding: 24px; border-radius: 24px; background: var(--s1); border: 1px solid var(--line);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="num" style="width: 36px; height: 36px; border-radius: 50%; background: var(--vio); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; flex: 0 0 auto;">2</span>
        <div>
          <div style="font-size: 16px; font-weight: 800; line-height: 1.25;">The OKN Token Allocation</div>
          <div style="font-size: 12px; font-weight: 600; color: var(--mut); margin-top: 2px;">(The "Skin in the Game")</div>
        </div>
      </div>
      <div style="font-size: 13px; line-height: 1.55; color: var(--mut); margin-top: 16px;">
        We want you to be wealthy when OKN succeeds, not just paid for a campaign.
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 14px;">
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--vio-l); margin-top: 8px; flex: 0 0 auto;"></span>
          <div style="font-size: 13px; line-height: 1.55; color: var(--mut);">We are offering an allocation of <strong style="color: var(--tx); font-weight: 800;">OKN Tokens</strong> to our top marketing partners, vesting over 12 months.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--vio-l); margin-top: 8px; flex: 0 0 auto;"></span>
          <div style="font-size: 13px; line-height: 1.55; color: var(--mut);">You get a direct stake in the token you are pumping. When OKN lists on Tier-1 exchanges at a higher price, your allocation becomes your real payday.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--vio-l); margin-top: 8px; flex: 0 0 auto;"></span>
          <div style="font-size: 13px; line-height: 1.55; color: var(--mut);"><strong style="color: var(--tx); font-weight: 800;">Affiliate Leaderboard:</strong> The marketer who drives the highest presale volume in the first 90 days gets a <strong style="color: var(--tx); font-weight: 800;">2x multiplier</strong> on their token allocation.</div>
        </div>
      </div>
    </section>

    <!-- Section 3 -->
    <section style="padding: 24px; border-radius: 24px; background: var(--s1); border: 1px solid var(--line);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="num" style="width: 36px; height: 36px; border-radius: 50%; background: var(--vio); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; flex: 0 0 auto;">3</span>
        <div>
          <div style="font-size: 16px; font-weight: 800; line-height: 1.25;">VIP Access &amp; Status</div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--vio-l); margin-top: 8px; flex: 0 0 auto;"></span>
          <div style="font-size: 13px; line-height: 1.55; color: var(--mut);"><strong style="color: var(--tx); font-weight: 800;">Lifetime Fee Discount:</strong> Your personal trading fees on the OKNexus exchange will be permanently zeroed out or heavily discounted.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--vio-l); margin-top: 8px; flex: 0 0 auto;"></span>
          <div style="font-size: 13px; line-height: 1.55; color: var(--mut);"><strong style="color: var(--tx); font-weight: 800;">Inner Circle:</strong> You will know about major listings, product launches, and roadmap shifts before the public does.</div>
        </div>
      </div>
    </section>

    <!-- Section 4 -->
    <section style="padding: 24px; border-radius: 24px; background: var(--inv-bg); color: var(--inv-tx);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="num" style="width: 36px; height: 36px; border-radius: 50%; background: var(--inv-tx); color: var(--inv-bg); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; flex: 0 0 auto;">4</span>
        <div>
          <div style="font-size: 16px; font-weight: 800; line-height: 1.25;">What We Provide You</div>
          <div style="font-size: 12px; font-weight: 600; color: var(--inv-mut); margin-top: 2px;">(Our Commitment)</div>
        </div>
      </div>
      <div style="font-size: 13px; line-height: 1.55; color: var(--inv-mut); margin-top: 16px;">We aren't making you do this blind. We provide:</div>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 14px;">
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--inv-tx); margin-top: 8px; flex: 0 0 auto;"></span>
          <div style="font-size: 13px; line-height: 1.55;">A high-converting landing page and presale widget.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--inv-tx); margin-top: 8px; flex: 0 0 auto;"></span>
          <div style="font-size: 13px; line-height: 1.55;">Ready-made creative assets, banners, and video explainers.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--inv-tx); margin-top: 8px; flex: 0 0 auto;"></span>
          <div style="font-size: 13px; line-height: 1.55;">A dedicated affiliate dashboard to track your sales and commissions in real-time.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--inv-tx); margin-top: 8px; flex: 0 0 auto;"></span>
          <div style="font-size: 13px; line-height: 1.55;">Weekly syncs to ensure you have the support you need.</div>
        </div>
      </div>
    </section>
  </div>

  <div class="resp-grid-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="font-size: 16px; font-weight: 800; margin-bottom: 20px;">Your Referral Statistics</div>
      <div style="display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--line);">
        <span style="color: var(--mut); font-size: 14px;">Total Referrals</span>
        <span class="num" style="font-weight: 800; font-size: 16px;">0 friends</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--line);">
        <span style="color: var(--mut); font-size: 14px;">Total Commission Earned</span>
        <span class="num" style="font-weight: 800; font-size: 16px; color: var(--ok);">0.00 BNB</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--line);">
        <span style="color: var(--mut); font-size: 14px;">Point Multiplier</span>
        <span class="num" style="font-weight: 800; font-size: 16px; color: var(--yel-t);">1.0x</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 14px 0;">
        <span style="color: var(--mut); font-size: 14px;">Tier Status</span>
        <span style="font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px; background: var(--s2); color: var(--tx);">Bronze Partner</span>
      </div>
    </div>

    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="font-size: 16px; font-weight: 800; margin-bottom: 20px;">Commission Tiers</div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="background: var(--s2); border-radius: 14px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 800; font-size: 14px;">Tier 1 · Starter</div>
            <div style="font-size: 12px; color: var(--mut);">1–10 active referrals</div>
          </div>
          <span class="num" style="font-weight: 800; font-size: 15px; color: var(--vio-l);">10%</span>
        </div>
        <div style="background: var(--s2); border-radius: 14px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 800; font-size: 14px;">Tier 2 · Growth</div>
            <div style="font-size: 12px; color: var(--mut);">11–50 active referrals</div>
          </div>
          <span class="num" style="font-weight: 800; font-size: 15px; color: var(--ok);">12.5%</span>
        </div>
        <div style="background: var(--s2); border-radius: 14px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 800; font-size: 14px;">Tier 3 · Ambassador</div>
            <div style="font-size: 12px; color: var(--mut);">51+ active referrals</div>
          </div>
          <span class="num" style="font-weight: 800; font-size: 15px; color: var(--yel-t);">15%</span>
        </div>
      </div>
    </div>
  </div>
`;

// 6. Activity Desktop & Mobile
const desktopActivityMain = `
  <div class="portfolio-container" style="max-width: 1400px; margin: 0 auto; padding-bottom: 40px;">
    ${getPortfolioHeader('activity')}

    <section class="page-hero" style="background: var(--vio); color: #fff; border-radius: 24px; padding: 24px 28px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.85; margin-bottom: 4px;">Audit Trail</div>
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="font-size: 13px; opacity: 0.85;">Historical Records</div>
          <div class="num" style="font-size: 32px; font-weight: 800; line-height: 1.15; margin-top: 2px;">Activity Log</div>
        </div>
        <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 10px 16px; border-radius: 14px;">
          <div style="font-size: 11px; opacity: 0.85;">Transaction Count</div>
          <div style="font-size: 15px; font-weight: 800; margin-top: 2px;">5 verified movements</div>
        </div>
      </div>
    </section>

    <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
      <button style="height: 38px; padding: 0 18px; border-radius: 19px; background: var(--vio); color: #fff; font-size: 13px; font-weight: 700; border: none; cursor: pointer;">All</button>
      <button style="height: 38px; padding: 0 18px; border-radius: 19px; background: var(--s2); color: var(--mut); font-size: 13px; font-weight: 700; border: 1px solid var(--line); cursor: pointer;">OK Points</button>
      <button style="height: 38px; padding: 0 18px; border-radius: 19px; background: var(--s2); color: var(--mut); font-size: 13px; font-weight: 700; border: 1px solid var(--line); cursor: pointer;">$OKN</button>
    </div>

    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 20px 24px;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--line); flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(47,189,142,0.12); color: var(--ok); display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">${ICONS.check}</div>
            <div style="min-width: 0;">
              <div style="font-weight: 800; font-size: 14px; color: var(--tx);">Daily check-in</div>
              <div style="font-size: 12px; color: var(--mut);">Day 6 of streak · Nov 2, 2026</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
            <span class="num" style="font-weight: 800; font-size: 15px; color: var(--ok); white-space: nowrap;">+20 pts</span>
            <span style="font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px; background: rgba(255,170,0,0.14); color: var(--org-t); white-space: nowrap;">Awaiting commit</span>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--line); flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(47,189,142,0.12); color: var(--ok); display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">${ICONS.check}</div>
            <div style="min-width: 0;">
              <div style="font-weight: 800; font-size: 14px; color: var(--tx);">Daily check-in</div>
              <div style="font-size: 12px; color: var(--mut);">Day 5 of streak · Nov 1, 2026</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
            <span class="num" style="font-weight: 800; font-size: 15px; color: var(--ok); white-space: nowrap;">+20 pts</span>
            <span style="font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px; background: rgba(255,170,0,0.14); color: var(--org-t); white-space: nowrap;">Awaiting commit</span>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 0; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(47,189,142,0.12); color: var(--ok); display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">${ICONS.check}</div>
            <div style="min-width: 0;">
              <div style="font-weight: 800; font-size: 14px; color: var(--tx);">Daily check-in</div>
              <div style="font-size: 12px; color: var(--mut);">Day 4 of streak · Oct 31, 2026</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
            <span class="num" style="font-weight: 800; font-size: 15px; color: var(--ok); white-space: nowrap;">+20 pts</span>
            <span style="font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px; background: rgba(255,170,0,0.14); color: var(--org-t); white-space: nowrap;">Awaiting commit</span>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// 7. Wallet / Holdings Desktop & Mobile
const desktopWalletMain = `
  <div class="portfolio-container" style="max-width: 1400px; margin: 0 auto; padding-bottom: 40px;">
    ${getPortfolioHeader('holdings')}

    <section class="page-hero" style="background: var(--vio); color: #fff; border-radius: 24px; padding: 24px 28px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.85; margin-bottom: 4px;">Web3 Custody</div>
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="font-size: 13px; opacity: 0.85;">Connected Address</div>
          <div class="num" style="font-size: 28px; font-weight: 800; line-height: 1.15; margin-top: 2px;">0x71C...49A1</div>
        </div>
        <div style="background: rgba(255,255,255,0.16); backdrop-filter: blur(10px); padding: 8px 14px; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--ok); flex-shrink: 0;"></span>
          <span style="font-size: 13px; font-weight: 700; white-space: nowrap;">BNB Smart Chain (Testnet)</span>
        </div>
      </div>
    </section>

    <div class="resp-grid-2 wallet-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
      <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 24px;">
        <div style="font-size: 17px; font-weight: 800; margin-bottom: 16px; color: var(--tx);">Asset Balances</div>
        <div class="kv-row" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--line);">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
            <span style="flex-shrink: 0; display: flex;">${ICONS.bnb}</span>
            <span style="color: var(--mut); font-size: 14px; font-weight: 700; white-space: nowrap;">BNB (Native Gas)</span>
          </div>
          <span class="num" style="font-weight: 800; font-size: 16px; color: var(--tx); white-space: nowrap; flex-shrink: 0;">1.45 BNB</span>
        </div>
        <div class="kv-row" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--line);">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
            <span style="flex-shrink: 0; display: flex;">${logoImgDesktop}</span>
            <span style="color: var(--mut); font-size: 14px; font-weight: 700; white-space: nowrap;">$OKN Token</span>
          </div>
          <span class="num" style="font-weight: 800; font-size: 16px; color: var(--vio-l); white-space: nowrap; flex-shrink: 0;">0 $OKN</span>
        </div>
        <div class="kv-row" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 0;">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
            <span style="width: 20px; height: 20px; border-radius: 6px; background: rgba(47,189,142,0.15); color: var(--ok); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${ICONS.gift}</span>
            <span style="color: var(--mut); font-size: 14px; font-weight: 700; white-space: nowrap;">OK Points Balance</span>
          </div>
          <span class="num" style="font-weight: 800; font-size: 16px; color: var(--ok); white-space: nowrap; flex-shrink: 0;">135 pts</span>
        </div>
        <button onclick="openWalletModal()" style="width: 100%; margin-top: 18px; height: 46px; border-radius: 14px; background: var(--s2); border: 1px solid var(--line); color: var(--tx); font-weight: 800; font-size: 14px; cursor: pointer;">Switch Wallet</button>
      </div>

      <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="font-size: 17px; font-weight: 800; margin-bottom: 10px; color: var(--tx);">Deposit & Withdraw</div>
          <p style="font-size: 14px; color: var(--mut); line-height: 1.6; margin: 0 0 20px;">Deposit BNB to participate in the presale allocation or withdraw claimable $OKN allocations to your personal non-custodial wallet.</p>
        </div>
        <div style="display: flex; gap: 12px;">
          <a href="buy.html" style="flex: 1; height: 46px; border-radius: 14px; background: var(--vio); color: #fff; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; text-decoration: none;">Buy $OKN</a>
          <a href="claim.html" style="flex: 1; height: 46px; border-radius: 14px; background: var(--s2); border: 1px solid var(--line); color: var(--tx); font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; text-decoration: none;">Claim $OKN</a>
        </div>
      </div>
    </div>
  </div>
`;

// 8. Leaderboard Desktop & Mobile
const desktopLeaderboardMain = `
  <section style="background: var(--vio); color: #fff; border-radius: 28px; padding: 32px 36px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
    <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; margin-bottom: 6px;">Community Standings</div>
    <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em;">OK Points Leaderboard</h1>
    <p style="font-size: 15px; opacity: 0.85; margin: 0; max-width: 600px;">Rankings update dynamically as community members complete tasks and onboard referrals.</p>
  </section>

  <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 24px 28px;">
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 16px; background: var(--s2);">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: rgba(255,214,10,0.18); color: #FFD60A; font-weight: 900; font-size: 14px; border: 1px solid rgba(255,214,10,0.4); ">1</span>
          <div>
            <div style="font-weight: 800; font-size: 15px;">0x82A...9F21</div>
            <div style="font-size: 12px; color: var(--mut);">34 referrals · Level 7</div>
          </div>
        </div>
        <span class="num" style="font-weight: 800; font-size: 16px; color: #FFD60A;">1,420 pts</span>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 16px; background: var(--s2);">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: rgba(180,185,200,0.18); color: #B4B9C8; font-weight: 900; font-size: 14px; border: 1px solid rgba(180,185,200,0.4);">2</span>
          <div>
            <div style="font-weight: 800; font-size: 15px;">0x39F...11C4</div>
            <div style="font-size: 12px; color: var(--mut);">28 referrals · Level 6</div>
          </div>
        </div>
        <span class="num" style="font-weight: 800; font-size: 16px; color: #B4B9C8;">1,180 pts</span>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 16px; background: var(--s2);">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: rgba(255,170,0,0.18); color: #FFAA00; font-weight: 900; font-size: 14px; border: 1px solid rgba(255,170,0,0.4);">3</span>
          <div>
            <div style="font-weight: 800; font-size: 15px;">0xD41...88E0</div>
            <div style="font-size: 12px; color: var(--mut);">19 referrals · Level 5</div>
          </div>
        </div>
        <span class="num" style="font-weight: 800; font-size: 16px; color: #FFAA00;">940 pts</span>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 16px; background: var(--s1); border-top: 1px solid var(--line);">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: var(--s2); color: var(--mut); font-weight: 800; font-size: 13px;">4</span>
          <div>
            <div style="font-weight: 800; font-size: 15px;">DE (You)</div>
            <div style="font-size: 12px; color: var(--mut);">0 referrals · Level 3</div>
          </div>
        </div>
        <span class="num" style="font-weight: 800; font-size: 16px; color: var(--ok);">135 pts</span>
      </div>
    </div>
  </div>
`;

// 9. Missions Desktop
const desktopMissionsMain = `
  <section style="background: var(--vio); color: #fff; border-radius: 28px; padding: 32px 36px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
    <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; margin-bottom: 6px;">Ecosystem Bounties</div>
    <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em;">Missions & Rewards</h1>
    <p style="font-size: 15px; opacity: 0.85; margin: 0; max-width: 600px;">Unlock exclusive points, early tester badges, and future token airdrop multipliers.</p>
  </section>

  <div class="resp-grid-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">Testnet Pioneer</div>
      <p style="font-size: 13px; color: var(--mut); line-height: 1.6; margin: 0 0 18px;">Execute a test purchase on BSC Testnet with faucet BNB.</p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="num" style="font-weight: 800; font-size: 15px; color: var(--ok);">+250 OK Points</span>
        <a href="buy.html" style="padding: 8px 18px; border-radius: 12px; background: var(--vio); color: #fff; font-size: 13px; font-weight: 700; text-decoration: none;">Start</a>
      </div>
    </div>

    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">Community Builder</div>
      <p style="font-size: 13px; color: var(--mut); line-height: 1.6; margin: 0 0 18px;">Invite 3 friends to the OKN platform using your unique referral code.</p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="num" style="font-weight: 800; font-size: 15px; color: var(--ok);">+500 OK Points</span>
        <a href="referral.html" style="padding: 8px 18px; border-radius: 12px; background: var(--s2); border: 1px solid var(--line); color: var(--tx); font-size: 13px; font-weight: 700; text-decoration: none;">Invite</a>
      </div>
    </div>
  </div>
`;

// 10. News Desktop
const desktopNewsMain = `
  <section style="background: var(--vio); color: #fff; border-radius: 28px; padding: 32px 36px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
    <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; margin-bottom: 6px;">Official Updates</div>
    <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em;">Ecosystem News</h1>
    <p style="font-size: 15px; opacity: 0.85; margin: 0; max-width: 600px;">Direct dispatches from the OKN core development team.</p>
  </section>

  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px; background: rgba(9,180,255,0.15); color: var(--cyan);">Protocol</span>
        <span style="font-size: 12px; color: var(--mut);">Nov 2, 2026</span>
      </div>
      <div style="font-size: 20px; font-weight: 800; margin-bottom: 8px;">BSC Testnet Smart Contracts Deployed</div>
      <p style="font-size: 14px; color: var(--mut); line-height: 1.6; margin: 0;">Presale, staking, and Merkle claim distribution contracts have been verified on BSC Testnet. Testing is currently underway.</p>
    </div>

    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px; background: rgba(255,214,10,0.15); color: var(--yel-t);">Community</span>
        <span style="font-size: 12px; color: var(--mut);">Oct 28, 2026</span>
      </div>
      <div style="font-size: 20px; font-weight: 800; margin-bottom: 8px;">Affiliate Partner Program Launch</div>
      <p style="font-size: 14px; color: var(--mut); line-height: 1.6; margin: 0;">Partners can now access up to 15% direct commission and custom tracking links through the partner package dashboard.</p>
    </div>
  </div>
`;

// 11. Learn Desktop
const desktopLearnMain = `
  <section style="background: var(--vio); color: #fff; border-radius: 28px; padding: 32px 36px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
    <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; margin-bottom: 6px;">Documentation & Guides</div>
    <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em;">Learn OKN</h1>
    <p style="font-size: 15px; opacity: 0.85; margin: 0; max-width: 600px;">Architecture, smart contracts, cryptographic verification, and tokenomics.</p>
  </section>

  <div class="resp-grid-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(122,18,245,0.15); color: var(--vio-l); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">${ICONS.book}</div>
      <div style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">Technical Whitepaper</div>
      <p style="font-size: 13px; color: var(--mut); line-height: 1.6; margin: 0 0 18px;">Detailed specifications on the on-chain Merkle tree distribution and gas-optimized claims.</p>
      <a href="claim.html" style="font-size: 13px; font-weight: 700; color: var(--vio-l); display: flex; align-items: center; gap: 6px; text-decoration: none;">
        <span>Read whitepaper</span>
        ${ICONS.arrowRight}
      </a>
    </div>

    <div style="background: var(--s1); border: 1px solid var(--line); border-radius: 24px; padding: 28px;">
      <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(47,189,142,0.15); color: var(--ok); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">${ICONS.shield}</div>
      <div style="font-size: 18px; font-weight: 800; margin-bottom: 6px;">Smart Contract Audits</div>
      <p style="font-size: 13px; color: var(--mut); line-height: 1.6; margin: 0 0 18px;">Open-source bytecode verification, test coverage reports, and security disclosures.</p>
      <a href="https://testnet.bscscan.com" target="_blank" style="font-size: 13px; font-weight: 700; color: var(--ok); display: flex; align-items: center; gap: 6px; text-decoration: none;">
        <span>View on BscScan</span>
        ${ICONS.arrowRight}
      </a>
    </div>
  </div>
`;

// Helper for mobile versions of all pages
function makeSubpageMobile(title, mainContent) {
  return `
    <div class="mobile-page-wrap" style="padding: 16px 16px 96px; width: 100%; max-width: 540px; margin: 0 auto; box-sizing: border-box;">
      ${mainContent}
    </div>
  `;
}

// Build all responsive pages
const pagesToBuild = [
  {
    title: 'Portfolio',
    activeNav: 'Portfolio',
    activeBottomTab: 'Home',
    desktopMain: desktopPortfolioMain,
    mobile: mobileHome,
    filenames: ['portfolio.html', 'index.html']
  },
  {
    title: 'Tasks',
    activeNav: 'Tasks',
    activeBottomTab: 'Earn',
    desktopMain: desktopEarnMain,
    mobile: mobileEarn,
    filenames: ['tasks.html', 'earn.html']
  },
  {
    title: 'Claim',
    activeNav: 'Claim',
    activeBottomTab: 'Claim',
    desktopMain: desktopClaimMain,
    mobile: mobileClaim,
    filenames: ['claim.html']
  },
  {
    title: 'Buy',
    activeNav: 'Buy',
    activeBottomTab: 'Buy',
    desktopMain: desktopBuyMain,
    mobile: makeSubpageMobile('Buy', desktopBuyMain),
    filenames: ['buy.html']
  },
  {
    title: 'Agents',
    activeNav: 'AI Trading Agent',
    activeBottomTab: 'Agents',
    desktopMain: desktopAgentsMain,
    mobile: mobileAgents,
    filenames: ['agents.html']
  },
  {
    title: 'Referral',
    activeNav: 'Referral',
    activeBottomTab: 'Referral',
    desktopMain: desktopReferralMain,
    mobile: mobileReferral,
    filenames: ['referral.html']
  },
  {
    title: 'Activity',
    activeNav: 'Portfolio',
    activeBottomTab: 'Home',
    desktopMain: desktopActivityMain,
    mobile: mobileActivity,
    filenames: ['activity.html']
  },
  {
    title: 'Home',
    activeNav: 'Portfolio',
    activeBottomTab: 'Home',
    desktopMain: desktopPortfolioMain,
    mobile: mobileHome,
    filenames: ['home.html']
  },
  {
    title: 'Wallet',
    activeNav: 'Wallet',
    activeBottomTab: 'Home',
    desktopMain: desktopWalletMain,
    mobile: makeSubpageMobile('Wallet', desktopWalletMain),
    filenames: ['wallet.html']
  },
  {
    title: 'Leaderboard',
    activeNav: 'Leaderboard',
    activeBottomTab: 'Home',
    desktopMain: desktopLeaderboardMain,
    mobile: makeSubpageMobile('Leaderboard', desktopLeaderboardMain),
    filenames: ['leaderboard.html']
  },
  {
    title: 'Missions',
    activeNav: 'Missions',
    activeBottomTab: 'Home',
    desktopMain: desktopMissionsMain,
    mobile: makeSubpageMobile('Missions', desktopMissionsMain),
    filenames: ['missions.html']
  },
  {
    title: 'News',
    activeNav: 'News',
    activeBottomTab: 'Home',
    desktopMain: desktopNewsMain,
    mobile: makeSubpageMobile('News', desktopNewsMain),
    filenames: ['news.html']
  },
  {
    title: 'Learn',
    activeNav: 'Learn',
    activeBottomTab: 'Home',
    desktopMain: desktopLearnMain,
    mobile: makeSubpageMobile('Learn', desktopLearnMain),
    filenames: ['learn.html']
  }
];

// Ensure public/ and dist/ output directories are populated for static and container deployments
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

[publicDir, distDir].forEach(outDir => {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(path.join(outDir, 'css'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'assets'), { recursive: true });

  if (fs.existsSync(path.join(rootDir, 'css', 'responsive.css'))) {
    fs.copyFileSync(
      path.join(rootDir, 'css', 'responsive.css'),
      path.join(outDir, 'css', 'responsive.css')
    );
  }
  if (fs.existsSync(path.join(rootDir, 'favicon.ico'))) {
    fs.copyFileSync(
      path.join(rootDir, 'favicon.ico'),
      path.join(outDir, 'favicon.ico')
    );
  }
  const assetsSrcDir = path.join(rootDir, 'assets');
  if (fs.existsSync(assetsSrcDir)) {
    for (const entry of fs.readdirSync(assetsSrcDir, { withFileTypes: true })) {
      if (entry.isFile()) {
        fs.copyFileSync(
          path.join(assetsSrcDir, entry.name),
          path.join(outDir, 'assets', entry.name)
        );
      }
    }
  }
});

pagesToBuild.forEach(p => {
  const fullHtml = assemblePage({
    title: p.title,
    activeNav: p.activeNav,
    activeBottomTab: p.activeBottomTab,
    desktopMainContent: p.desktopMain,
    mobileContent: p.mobile
  });

  p.filenames.forEach(fn => {
    fs.writeFileSync(path.join(rootDir, fn), fullHtml, 'utf8');
    fs.writeFileSync(path.join(publicDir, fn), fullHtml, 'utf8');
    fs.writeFileSync(path.join(distDir, fn), fullHtml, 'utf8');
    console.log(`Wrote full responsive: ${fn} (${fullHtml.length} bytes)`);
  });
});

console.log('Finished rebuilding canonical routes in root, public/, and dist/!');
process.exit(0);

