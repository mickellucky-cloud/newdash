const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

// Clean logo
const logoImgDesktop = '<div class="logo-box" style="width: 42px; height: 42px; border-radius: 12px; background: var(--s2); border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; flex: 0 0 auto; box-shadow: 0 4px 14px rgba(0,0,0,0.12);"><img src="assets/okn-logo.png" alt="OKN logo" style="width: 34px; height: 34px; object-fit: contain; display: block; filter: drop-shadow(0 2px 6px rgba(122, 18, 245, 0.35));"></div>';
const logoImgMobile = '<div class="logo-box" style="width: 42px; height: 42px; border-radius: 12px; background: var(--s2); border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; flex: 0 0 auto; box-shadow: 0 4px 14px rgba(0,0,0,0.12);"><img src="assets/okn-logo.png" alt="OKN logo" style="width: 34px; height: 34px; object-fit: contain; display: block; filter: drop-shadow(0 2px 6px rgba(122, 18, 245, 0.35));"></div>';

// Helper for the sidebar
function getSidebar(activePage) {
  const menuItems = [
    { title: 'Portfolio', href: 'portfolio.html', icon: '<path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"></path><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>' },
    { title: 'AI Trading Agent', href: 'agents.html', badge: 'Soon', icon: '<path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path>' },
    { title: 'Polymarket Agent', href: 'agents.html', badge: 'Soon', customIcon: '<img src="assets/polymarket.png" alt="Polymarket" style="width: 20px; height: 20px; border-radius: 50%; object-fit: contain; flex: 0 0 auto; display: block; box-shadow: 0 2px 8px rgba(9, 180, 255, 0.3);">' },
    { title: 'Prediction Markets', href: 'agents.html', badge: 'Soon', icon: '<path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path>' },
    { title: 'Leaderboard', href: 'leaderboard.html', icon: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>' },
    { title: 'Missions', href: 'missions.html', icon: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>' },
    { title: 'Tasks', href: 'tasks.html', icon: '<rect x="3" y="5" width="6" height="6" rx="1"></rect><path d="m3 17 2 2 4-4"></path><path d="M13 6h8"></path><path d="M13 12h8"></path><path d="M13 18h8"></path>' },
    { title: 'Claim', href: 'claim.html', icon: '<rect x="3" y="8" width="18" height="4" rx="1"></rect><path d="M12 8v13"></path><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>' },
    { title: 'Buy', href: 'buy.html', icon: '<circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>' },
    { title: 'Staking', href: 'agents.html', badge: 'Soon', icon: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>' },
    { title: 'News', href: 'news.html', icon: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"></path>' },
    { title: 'Learn', href: 'learn.html', icon: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>' },
    { title: 'Wallet', href: 'wallet.html', icon: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>' },
    { title: 'Referral', href: 'referral.html', icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>' }
  ];

  return `
    <aside aria-label="Sidebar">
      <!-- Logo lockup -->
      <div style="display: flex; align-items: center; gap: 12px; height: 72px; padding: 0px 20px;">
        ${logoImgDesktop}
        <div style="min-width: 0px;" class="sidebar-hide-tablet">
          <div class="num" style="font-size: 20px; font-weight: 700; line-height: 1.1;">$OKN</div>
          <div style="font-size: 12px; font-weight: 600; color: var(--mut); margin-top: 2px;">Earn, Claim, Buy</div>
        </div>
      </div>

      <!-- Search bar -->
      <div class="sidebar-hide-tablet" style="padding: 4px 14px 8px;">
        <div style="position: relative; display: flex; align-items: center;">
          <svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 14px; color: var(--mut);"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
          <input type="text" placeholder="Search" aria-label="Search navigation" oninput="filterSidebarNav(this.value)" style="width: 100%; height: 42px; border-radius: 14px; border: 1px solid var(--line); background: var(--s2); color: var(--tx); font-size: 14px; font-weight: 600; padding: 0px 14px 0px 42px; outline: none; transition: border-color 0.2s ease;">
        </div>
      </div>

      <!-- Navigation Menu (Exact Live Order) -->
      <nav aria-label="Primary" style="flex: 1 1 0%; padding: 4px 14px 20px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto;">
        <div class="sidebar-hide-tablet" style="font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: var(--mut); padding: 4px 14px 8px;">MENU</div>
        ${menuItems.map(item => {
          const isActive = item.title.toLowerCase() === activePage.toLowerCase() ||
            (activePage.toLowerCase() === 'home' && item.title.toLowerCase() === 'portfolio');
          return `
            <a href="${item.href}" title="${item.title}" class="nav-i ${isActive ? 'active' : ''}" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; height: 42px; border-radius: 12px; font-size: 14px; font-weight: 700; padding: 0px 14px; text-decoration: none; color: ${isActive ? '#fff' : 'var(--tx)'}; background: ${isActive ? 'var(--vio)' : 'transparent'}; transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);">
              <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                ${item.customIcon ? item.customIcon : `<svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: 0 0 auto;">${item.icon}</svg>`}
                <span class="sc-interp sidebar-hide-tablet" style="white-space: nowrap;">${item.title}</span>
              </div>
              ${item.badge ? `<span class="sidebar-hide-tablet" style="font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 8px; background: rgba(255,170,0,0.16); color: var(--org-t);">${item.badge}</span>` : ''}
            </a>
          `;
        }).join('')}
      </nav>

      <!-- Bottom Earn more $OKN card (Exact Live Layout) -->
      <div class="sidebar-hide-tablet" style="padding: 14px; margin-top: auto;">
        <div style="background: linear-gradient(135deg, #09B4FF 0%, #7A12F5 100%); color: #fff; border-radius: 18px; padding: 16px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 10px 28px rgba(122,18,245,0.35);">
          <div style="font-size: 14px; font-weight: 800;">Earn more $OKN</div>
          <div style="font-size: 12px; opacity: 0.88; line-height: 1.45;">Complete tasks and invite friends to stack points.</div>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
            <a href="referral.html" style="height: 36px; border-radius: 10px; background: #fff; color: #09B4FF; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: transform 0.15s ease;">
              <span>Invite friends</span>
              <svg class="i" width="14" height="14" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
            <a href="tasks.html" style="height: 32px; border-radius: 10px; background: rgba(255, 255, 255, 0.16); color: #fff; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: background 0.2s ease;">
              Learn more
            </a>
          </div>
        </div>
      </div>
    </aside>
  `;
}

// Helper for Language Dropdown (supports 9 languages with active checkmark)
function getLanguageDropdown(idPrefix = '') {
  const p = idPrefix ? `${idPrefix}-` : '';
  const languages = [
    { name: 'English', code: 'EN' },
    { name: '中文', code: 'ZH' },
    { name: 'Español', code: 'ES' },
    { name: 'Português', code: 'PT' },
    { name: 'Русский', code: 'RU' },
    { name: 'Tiếng Việt', code: 'VI' },
    { name: 'Bahasa Indonesia', code: 'ID' },
    { name: 'Türkçe', code: 'TR' },
    { name: 'Français', code: 'FR' }
  ];

  return `
    <div class="lang-dropdown-wrapper" style="position: relative;">
      <button type="button" onclick="toggleLangDropdown(event, '${idPrefix}')" id="${p}header-lang-btn" class="header-pill-btn" aria-label="Select language" aria-expanded="false">
        <svg class="i" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--mut); flex: 0 0 auto;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        <span class="active-lang-code" style="font-weight: 800; font-size: 13px; letter-spacing: 0.02em;">EN</span>
        <svg class="i chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--mut); transition: transform 0.2s ease;"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>

      <div id="${p}header-lang-menu" class="header-dropdown-menu lang-dropdown-menu" role="menu" aria-label="Languages">
        ${languages.map(lang => `
          <button type="button" class="lang-opt-item ${lang.code === 'EN' ? 'active-lang' : ''}" data-code="${lang.code}" onclick="selectLanguage('${lang.code}', '${lang.name}')">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="lang-label">${lang.name}</span>
              <svg class="lang-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A84FF" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" style="display: ${lang.code === 'EN' ? 'inline-block' : 'none'};"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span class="lang-code-tag">${lang.code}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

// Helper for Profile Initials Dropdown (matches ref image with user info, settings, wallet, referral, social links, appearance toggle, and sign out)
function getProfileDropdown(idPrefix = '') {
  const p = idPrefix ? `${idPrefix}-` : '';

  return `
    <div class="profile-dropdown-wrapper" style="position: relative;">
      <button type="button" onclick="toggleProfileDropdown(event, '${idPrefix}')" id="${p}header-profile-btn" class="header-profile-btn" aria-label="User profile DE" aria-expanded="false">
        <span class="profile-badge-initials">DE</span>
        <svg class="i chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--mut); transition: transform 0.2s ease;"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>

      <div id="${p}header-profile-menu" class="header-dropdown-menu profile-dropdown-menu" role="menu" aria-label="Profile options">
        <!-- User Info Header -->
        <div style="padding: 14px 16px; display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--s2); border: 1.5px solid var(--line); color: var(--tx); font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; flex: 0 0 auto;">DE</div>
          <div style="min-width: 0;">
            <div style="font-size: 15px; font-weight: 800; color: var(--tx); line-height: 1.2;">Dev User</div>
            <div style="font-size: 12.5px; color: var(--mut); margin-top: 2px;">@dev_user</div>
          </div>
        </div>

        <div class="dropdown-divider"></div>

        <!-- Links -->
        <a href="#settings" onclick="openSettingsModal(); return false;" class="profile-menu-link">
          <svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span>Settings</span>
        </a>
        <a href="wallet.html" class="profile-menu-link">
          <svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg>
          <span>Wallet</span>
        </a>
        <a href="referral.html" class="profile-menu-link">
          <svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span>Referral</span>
        </a>

        <div class="dropdown-divider"></div>

        <!-- Social links -->
        <div style="padding: 10px 16px 12px;">
          <div style="font-size: 13px; font-weight: 700; color: var(--mut); margin-bottom: 10px;">Social links</div>
          <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px; flex-wrap: wrap;">
            <a href="https://t.me" target="_blank" rel="noopener noreferrer" class="profile-social-btn" aria-label="Telegram">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="profile-social-btn" aria-label="YouTube">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" class="profile-social-btn" aria-label="Discord">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="profile-social-btn" aria-label="Facebook">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="profile-social-btn" aria-label="Instagram">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <a href="https://coinmarketcap.com" target="_blank" rel="noopener noreferrer" class="profile-social-btn" aria-label="CoinMarketCap">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 15V9l4 4 4-4v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="profile-social-btn" aria-label="X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="profile-social-btn" aria-label="TikTok">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.87-4.49V8.69a8.18 8.18 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.87-.12z"/></svg>
            </a>
          </div>
        </div>

        <div class="dropdown-divider"></div>

        <!-- Appearance -->
        <div style="padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 14px; font-weight: 700; color: var(--tx);">Appearance</span>
          <div class="appearance-toggle-pill">
            <button type="button" onclick="setTheme('light')" class="app-theme-opt" id="${p}app-opt-light" aria-label="Light mode">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </button>
            <button type="button" onclick="setTheme('dark')" class="app-theme-opt" id="${p}app-opt-dark" aria-label="Dark mode">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </button>
          </div>
        </div>

        <div class="dropdown-divider"></div>

        <!-- Sign out -->
        <button type="button" onclick="handleSignOut()" class="profile-signout-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>Sign out</span>
        </button>
      </div>
    </div>
  `;
}

// Helper for the desktop topbar
function getDesktopHeader() {
  return `
    <header class="desktop-header">
      <div style="display: flex; align-items: center; gap: 16px;">
        <button onclick="toggleSidebar()" aria-label="Toggle sidebar" style="width: 40px; height: 40px; border-radius: 12px; background: var(--s2); border: 1px solid var(--line); color: var(--tx); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s ease;">
          <svg class="i" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
        </button>
      </div>

      <div style="display: flex; align-items: center; gap: 10px;">
        <!-- Language selector dropdown -->
        ${getLanguageDropdown('desk')}

        <!-- Theme toggle -->
        <button onclick="toggleTheme()" class="theme-toggle-btn header-icon-btn" aria-label="Toggle theme" style="width: 38px; height: 38px;">
          <svg class="i theme-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        </button>

        <!-- Notification bell -->
        <button onclick="showToast('All caught up! Day 6 check-in recorded (+20 OK Points)')" aria-label="Notifications" class="header-icon-btn" style="position: relative; width: 38px; height: 38px;">
          <svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span style="position: absolute; top: 7px; right: 7px; width: 8px; height: 8px; border-radius: 50%; background: var(--yel); border: 1.5px solid var(--s1);"></span>
        </button>

        <!-- User profile initials dropdown -->
        ${getProfileDropdown('desk')}
      </div>
    </header>
  `;
}

// Helper for the mobile top header (Matches reference images exactly)
function getMobileHeader(activeNav = 'portfolio', title = '') {
  const pageTitleMap = {
    portfolio: 'Portfolio',
    home: 'Portfolio',
    earn: 'Earn',
    tasks: 'Tasks',
    claim: 'Claim',
    buy: 'Buy',
    agents: 'Agents',
    referral: 'Referral',
    activity: 'Activity',
    leaderboard: 'Leaderboard',
    missions: 'Missions',
    news: 'News',
    learn: 'Learn',
    wallet: 'Wallet'
  };
  const headerTitle = pageTitleMap[(activeNav || '').toLowerCase()] || title || 'Portfolio';

  return `
    <header class="mobile-header">
      <!-- Top Left: Menu button that reveals sidebar + Page Title -->
      <div style="display: flex; align-items: center; gap: 10px;">
        <button type="button" onclick="toggleMobileSidebar()" class="top-menu-btn" aria-label="Open sidebar menu">
          <svg class="i" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </button>
        <span class="mobile-header-title">${headerTitle}</span>
      </div>

      <!-- Top Right: Theme, Language dropdown, Notification bell, Profile Initials DE dropdown -->
      <div style="display: flex; align-items: center; gap: 6px;">
        <!-- Theme toggle -->
        <button type="button" onclick="toggleTheme()" class="theme-toggle-btn header-icon-btn" aria-label="Toggle theme">
          <svg class="i theme-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        </button>

        <!-- Language selection dropdown pill -->
        ${getLanguageDropdown('mob')}

        <!-- Notification bell -->
        <button type="button" onclick="showToast('All caught up! Day 6 check-in recorded (+20 OK Points)')" class="header-icon-btn" aria-label="Notifications" style="position: relative;">
          <svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span style="position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; border-radius: 50%; background: var(--yel); border: 1.5px solid var(--s1);"></span>
        </button>

        <!-- Profile initials dropdown button (Replaced wallet icon) -->
        ${getProfileDropdown('mob')}
      </div>
    </header>
  `;
}

// Helper for Mobile Slide-Out Sidebar Drawer (contains all desktop sidebar options)
function getMobileSidebarDrawer(activeNav = 'portfolio') {
  const menuItems = [
    { title: 'Portfolio', href: 'portfolio.html', icon: '<path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"></path><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>' },
    { title: 'AI Trading Agent', href: 'agents.html', badge: 'Soon', icon: '<path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path>' },
    { title: 'Polymarket Agent', href: 'agents.html', badge: 'Soon', customIcon: '<img src="assets/polymarket.png" alt="Polymarket" style="width: 20px; height: 20px; border-radius: 50%; object-fit: contain; flex: 0 0 auto; display: block; box-shadow: 0 2px 8px rgba(9, 180, 255, 0.3);">' },
    { title: 'Prediction Markets', href: 'agents.html', badge: 'Soon', icon: '<path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path>' },
    { title: 'Leaderboard', href: 'leaderboard.html', icon: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>' },
    { title: 'Missions', href: 'missions.html', icon: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="22" r="2"></circle>' },
    { title: 'Tasks', href: 'tasks.html', icon: '<rect x="3" y="5" width="6" height="6" rx="1"></rect><path d="m3 17 2 2 4-4"></path><path d="M13 6h8"></path><path d="M13 12h8"></path><path d="M13 18h8"></path>' },
    { title: 'Claim', href: 'claim.html', icon: '<rect x="3" y="8" width="18" height="4" rx="1"></rect><path d="M12 8v13"></path><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>' },
    { title: 'Buy', href: 'buy.html', icon: '<circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>' },
    { title: 'Staking', href: 'agents.html', badge: 'Soon', icon: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>' },
    { title: 'News', href: 'news.html', icon: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"></path>' },
    { title: 'Learn', href: 'learn.html', icon: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>' },
    { title: 'Wallet', href: 'wallet.html', icon: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>' },
    { title: 'Referral', href: 'referral.html', icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>' }
  ];

  return `
    <div id="mobile-sidebar-backdrop" class="mobile-sidebar-backdrop" onclick="closeMobileSidebar()"></div>
    <aside id="mobile-sidebar-drawer" class="mobile-sidebar-drawer" aria-label="Mobile Navigation Drawer">
      <!-- Drawer Header with Logo and Close Button -->
      <div style="display: flex; align-items: center; justify-content: space-between; height: 68px; padding: 0 18px; border-bottom: 1px solid var(--line); flex-shrink: 0;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="assets/okn-logo.png" alt="OKN logo" style="width: 32px; height: 32px; border-radius: 10px; object-fit: contain;">
          <div>
            <div style="font-size: 16px; font-weight: 800; color: var(--tx); line-height: 1.2;">$OKN Protocol</div>
            <div style="font-size: 11px; font-weight: 600; color: var(--mut);">Earn, Claim, Buy</div>
          </div>
        </div>
        <button type="button" onclick="closeMobileSidebar()" class="drawer-close-btn" aria-label="Close sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <!-- Search in Drawer -->
      <div style="padding: 12px 16px 6px; flex-shrink: 0;">
        <div style="position: relative; display: flex; align-items: center;">
          <svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 12px; color: var(--mut);"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
          <input type="text" placeholder="Search navigation..." aria-label="Search navigation in drawer" oninput="filterDrawerNav(this.value)" style="width: 100%; height: 38px; border-radius: 12px; border: 1px solid var(--line); background: var(--s2); color: var(--tx); font-size: 13.5px; font-weight: 600; padding: 0 12px 0 36px; outline: none;">
        </div>
      </div>

      <!-- Navigation links (identical to desktop) -->
      <nav class="drawer-nav-list" style="flex: 1; padding: 6px 14px 16px; display: flex; flex-direction: column; gap: 3px; overflow-y: auto;">
        <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: var(--mut); padding: 8px 12px 4px;">MENU</div>
        ${menuItems.map(item => {
          const isActive = item.title.toLowerCase() === (activeNav || '').toLowerCase() ||
            ((activeNav || '').toLowerCase() === 'home' && item.title.toLowerCase() === 'portfolio');
          return `
            <a href="${item.href}" class="drawer-nav-item ${isActive ? 'active' : ''}" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; height: 42px; border-radius: 12px; font-size: 14px; font-weight: 700; padding: 0 14px; text-decoration: none; color: ${isActive ? '#fff' : 'var(--tx)'}; background: ${isActive ? 'var(--vio)' : 'transparent'};">
              <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                ${item.customIcon ? item.customIcon : `<svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: 0 0 auto;">${item.icon}</svg>`}
                <span>${item.title}</span>
              </div>
              ${item.badge ? `<span style="font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 8px; background: rgba(255,170,0,0.16); color: var(--org-t);">${item.badge}</span>` : ''}
            </a>
          `;
        }).join('')}

        <!-- Bottom promo inside drawer -->
        <div style="margin-top: 16px; padding: 14px; border-radius: 16px; background: linear-gradient(135deg, #09B4FF 0%, #7A12F5 100%); color: #fff;">
          <div style="font-size: 13.5px; font-weight: 800;">Earn more $OKN</div>
          <div style="font-size: 11.5px; opacity: 0.88; line-height: 1.4; margin-top: 3px;">Invite friends to stack points and unlock tier multipliers.</div>
          <a href="referral.html" style="margin-top: 10px; height: 34px; border-radius: 10px; background: #fff; color: #09B4FF; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none;">
            <span>Invite friends</span>
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </a>
        </div>
      </nav>
    </aside>
  `;
}

// Helper for the fixed mobile bottom navigation
function getBottomNav(activeTab) {
  const tabs = [
    { title: 'Home', href: 'home.html', icon: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>' },
    { title: 'Earn', href: 'earn.html', icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>' },
    { title: 'Claim', href: 'claim.html', icon: '<path d="M12 3v13m0 0l-5-5m5 5l5-5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path>' },
    { title: 'Buy', href: 'buy.html', icon: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>' },
    { title: 'Referral', href: 'referral.html', icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>' },
    { title: 'Agents', href: 'agents.html', icon: '<rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line>' },
  ];

  return `
    <nav class="bottom-nav-bar" aria-label="Bottom Navigation">
      ${tabs.map(t => {
        const isActive = t.title.toLowerCase() === activeTab.toLowerCase();
        return `
          <a href="${t.href}" class="bottom-nav-item ${isActive ? 'active' : ''}" ${isActive ? 'aria-current="page"' : ''}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t.icon}</svg>
            <span>${t.title}</span>
          </a>
        `;
      }).join('')}
    </nav>
  `;
}

// Core scripts (Zero debug bar, pure production Web3 app)
function getCoreScripts() {
  return `
    <script>
      // Theme Toggle and Synchronization
      function updateThemeIcons(theme) {
        const sun = '<svg class="i theme-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        const moon = '<svg class="i theme-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        document.querySelectorAll('.theme-toggle-btn').forEach(b => {
          b.innerHTML = theme === 'light' ? moon : sun;
        });
        updateAppearancePill(theme);
      }

      function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem('okn_theme', theme); } catch (e) {}
        updateThemeIcons(theme);
      }

      function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
      }

      function updateAppearancePill(theme) {
        document.querySelectorAll('.app-theme-opt').forEach(btn => btn.classList.remove('active'));
        const activeButtons = document.querySelectorAll(theme === 'light' ? '[id$="app-opt-light"]' : '[id$="app-opt-dark"]');
        activeButtons.forEach(b => b.classList.add('active'));
      }

      function filterSidebarNav(query) {
        const q = (query || '').trim().toLowerCase();
        document.querySelectorAll('aside[aria-label="Sidebar"] .nav-i').forEach(link => {
          const text = (link.textContent || '').toLowerCase();
          link.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
        });
      }

      // Mobile Slide-Out Sidebar Drawer
      function toggleMobileSidebar() {
        const drawer = document.getElementById('mobile-sidebar-drawer');
        const backdrop = document.getElementById('mobile-sidebar-backdrop');
        if (!drawer || !backdrop) return;
        const isOpen = drawer.classList.contains('open');
        if (isOpen) {
          closeMobileSidebar();
        } else {
          drawer.classList.add('open');
          backdrop.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      }

      function closeMobileSidebar() {
        const drawer = document.getElementById('mobile-sidebar-drawer');
        const backdrop = document.getElementById('mobile-sidebar-backdrop');
        if (drawer) drawer.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        document.body.style.overflow = '';
      }

      function filterDrawerNav(query) {
        const q = (query || '').trim().toLowerCase();
        document.querySelectorAll('.drawer-nav-list .drawer-nav-item').forEach(link => {
          const text = (link.textContent || '').toLowerCase();
          link.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
        });
      }

      // Language selection Dropdown (IMG_5915)
      function selectLanguage(code, name) {
        try { localStorage.setItem('okn_lang', code); } catch (e) {}
        document.querySelectorAll('.active-lang-code').forEach(el => el.textContent = code);
        document.querySelectorAll('.lang-opt-item').forEach(btn => {
          const isThis = btn.getAttribute('data-code') === code;
          btn.classList.toggle('active-lang', isThis);
          const check = btn.querySelector('.lang-check');
          if (check) check.style.display = isThis ? 'inline-block' : 'none';
        });
        closeLangDropdown();
        showToast('Language set to ' + name + ' (' + code + ')');
      }

      function toggleLangDropdown(e, prefix) {
        if (e) e.stopPropagation();
        closeProfileDropdown();
        const p = prefix ? (prefix + '-') : '';
        const menu = document.getElementById(p + 'header-lang-menu');
        const btn = document.getElementById(p + 'header-lang-btn');
        if (!menu) return;
        const isOpen = menu.style.display === 'flex';
        closeLangDropdown();
        if (!isOpen) {
          menu.style.display = 'flex';
          if (btn) btn.classList.add('open');
        }
      }

      function closeLangDropdown() {
        document.querySelectorAll('.lang-dropdown-menu').forEach(m => m.style.display = 'none');
        document.querySelectorAll('.header-pill-btn').forEach(b => b.classList.remove('open'));
      }

      // Profile Initials Dropdown (IMG_5916)
      function toggleProfileDropdown(e, prefix) {
        if (e) e.stopPropagation();
        closeLangDropdown();
        const p = prefix ? (prefix + '-') : '';
        const menu = document.getElementById(p + 'header-profile-menu');
        const btn = document.getElementById(p + 'header-profile-btn');
        if (!menu) return;
        const isOpen = menu.style.display === 'flex';
        closeProfileDropdown();
        if (!isOpen) {
          menu.style.display = 'flex';
          if (btn) btn.classList.add('open');
        }
      }

      function closeProfileDropdown() {
        document.querySelectorAll('.profile-dropdown-menu').forEach(m => m.style.display = 'none');
        document.querySelectorAll('.header-profile-btn').forEach(b => b.classList.remove('open'));
      }

      function handleSignOut() {
        closeProfileDropdown();
        showToast('Signed out of session @dev_user');
      }

      function openSettingsModal() {
        closeProfileDropdown();
        showToast('Settings: Protocol v1.42 • Network: BNB Smart Chain (56)');
      }

      // Global click-outside & ESC dismissal
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-dropdown-wrapper')) {
          closeLangDropdown();
        }
        if (!e.target.closest('.profile-dropdown-wrapper')) {
          closeProfileDropdown();
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeLangDropdown();
          closeProfileDropdown();
          closeMobileSidebar();
        }
      });

      (function() {
        let savedTheme = 'dark';
        try { savedTheme = localStorage.getItem('okn_theme') || 'dark'; } catch (e) {}
        document.documentElement.setAttribute('data-theme', savedTheme);

        let savedLang = 'EN';
        try { savedLang = localStorage.getItem('okn_lang') || 'EN'; } catch (e) {}

        const initUI = () => {
          updateThemeIcons(savedTheme);
          document.querySelectorAll('.active-lang-code').forEach(el => el.textContent = savedLang);
          document.querySelectorAll('.lang-opt-item').forEach(btn => {
            const isThis = btn.getAttribute('data-code') === savedLang;
            btn.classList.toggle('active-lang', isThis);
            const check = btn.querySelector('.lang-check');
            if (check) check.style.display = isThis ? 'inline-block' : 'none';
          });
        };

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initUI);
        } else {
          initUI();
        }
      })();

      // Balance Visibility (Hide / Unhide with persistence)
      const EYE_OPEN_ICON = '<svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
      const EYE_CLOSED_ICON = '<svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';

      function applyBalanceVisibility(hidden) {
        document.querySelectorAll('.balance-display').forEach(el => {
          const raw = el.getAttribute('data-value') || '$1,428.50';
          el.textContent = hidden ? '••••••••' : raw;
        });
        document.querySelectorAll('.balance-eye-btn').forEach(btn => {
          btn.setAttribute('aria-label', hidden ? 'Show balance' : 'Hide balance');
          btn.innerHTML = hidden ? EYE_CLOSED_ICON : EYE_OPEN_ICON;
        });
      }

      function toggleBalanceVisibility() {
        const isCurrentlyHidden = localStorage.getItem('okn_hide_balance') === 'true';
        const next = !isCurrentlyHidden;
        try { localStorage.setItem('okn_hide_balance', next ? 'true' : 'false'); } catch (e) {}
        applyBalanceVisibility(next);
        showToast(next ? 'Balance hidden' : 'Balance visible');
      }

      (function() {
        let isHidden = false;
        try { isHidden = localStorage.getItem('okn_hide_balance') === 'true'; } catch (e) {}
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => applyBalanceVisibility(isHidden));
        } else {
          applyBalanceVisibility(isHidden);
        }
      })();

      // Always restore main-wrapper visibility when navigating back/forward (bfcache)
      window.addEventListener('pageshow', () => {
        const main = document.querySelector('.main-wrapper');
        if (main) {
          main.style.opacity = '1';
          main.style.transform = 'none';
        }
      });

      // Smooth Page Transitions & Interactive Enhancements
      document.addEventListener('DOMContentLoaded', () => {
        const mainWrapper = document.querySelector('.main-wrapper');
        if (mainWrapper) {
          mainWrapper.addEventListener('animationend', () => {
            mainWrapper.style.animation = 'none';
          }, { once: true });
        }

        document.querySelectorAll('a[href]').forEach(a => {
          const href = a.getAttribute('href');
          if (!href || href.startsWith('#') || href.startsWith('javascript:') || a.target === '_blank') return;
          if (href.endsWith('.html') || (!href.includes('://') && !href.startsWith('mailto:'))) {
            a.addEventListener('click', (e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return;
              const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
              const targetFile = href.split('?')[0].split('#')[0].replace(/^\\/+/, '').toLowerCase();

              // Immediately highlight bottom nav item if clicked
              if (a.classList.contains('bottom-nav-item')) {
                document.querySelectorAll('.bottom-nav-item').forEach(item => item.classList.remove('active'));
                a.classList.add('active');
              }

              if (currentFile === targetFile) {
                e.preventDefault();
                if (mainWrapper) mainWrapper.scrollTo({ top: 0, behavior: 'smooth' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
              }

              const main = document.querySelector('.main-wrapper');
              if (main) {
                e.preventDefault();
                main.style.animation = 'none';
                main.style.transition = 'opacity 0.09s ease-out';
                main.style.opacity = '0.45';
                setTimeout(() => {
                  window.location.href = href;
                }, 70);
              }
            });
          }
        });

        // Wire all Connect Wallet buttons across desktop & mobile
        document.querySelectorAll('button').forEach(btn => {
          const txt = (btn.textContent || '').trim().toLowerCase();
          if (txt.includes('connect wallet') && !btn.getAttribute('onclick')) {
            btn.addEventListener('click', () => openWalletModal());
          }
        });

        // Wire Transaction History & Activity filter buttons (All / OK Points / $OKN)
        document.querySelectorAll('.content-container').forEach(container => {
          const buttons = Array.from(container.querySelectorAll('button'));
          const filterGroup = buttons.filter(b => ['All', 'OK Points', '$OKN'].includes((b.textContent || '').trim()));
          if (filterGroup.length >= 3) {
            filterGroup.forEach(btn => {
              btn.addEventListener('click', () => {
                const mode = (btn.textContent || '').trim();
                filterGroup.forEach(other => {
                  const active = other === btn;
                  other.style.background = active ? 'var(--vio)' : (other.parentElement && other.parentElement.style.display === 'inline-flex' ? 'transparent' : 'var(--s2)');
                  other.style.color = active ? '#FFF' : 'var(--mut)';
                  other.style.fontWeight = active ? '700' : '600';
                });
                const tbody = container.querySelector('tbody');
                if (tbody) {
                  const rows = Array.from(tbody.querySelectorAll('tr:not(.empty-filter-row)'));
                  let visibleCount = 0;
                  rows.forEach(r => {
                    const show = mode === 'All' || (r.textContent || '').includes(mode);
                    r.style.display = show ? '' : 'none';
                    if (show) visibleCount++;
                  });
                  let emptyRow = tbody.querySelector('.empty-filter-row');
                  if (visibleCount === 0) {
                    if (!emptyRow) {
                      emptyRow = document.createElement('tr');
                      emptyRow.className = 'empty-filter-row';
                      emptyRow.innerHTML = '<td colspan="5" style="padding:24px;text-align:center;color:var(--mut);font-weight:600;">No ' + mode + ' transactions yet.</td>';
                      tbody.appendChild(emptyRow);
                    } else {
                      emptyRow.firstElementChild.textContent = 'No ' + mode + ' transactions yet.';
                      emptyRow.style.display = '';
                    }
                  } else if (emptyRow) {
                    emptyRow.style.display = 'none';
                  }
                }
              });
            });
          }

          // Wire Task Claim buttons on Tasks / Earn page
          buttons.filter(b => (b.textContent || '').trim() === 'Claim').forEach(btn => {
            btn.addEventListener('click', () => {
              if (btn.getAttribute('data-claimed') === 'true') return;
              btn.setAttribute('data-claimed', 'true');
              btn.textContent = 'Claimed ✓';
              btn.style.background = 'var(--ok)';
              btn.style.color = '#fff';
              showToast('Task verified! Points added to your balance.');
            });
          });

          // Wire Buy page BNB calculator
          const bnbInputs = Array.from(container.querySelectorAll('input[type="text"]:not([readonly])'));
          bnbInputs.forEach(input => {
            const receiveEl = Array.from(container.querySelectorAll('.num')).find(el => (el.textContent || '').includes('~'));
            const updateReceive = (val) => {
              const num = parseFloat(val);
              if (receiveEl && !isNaN(num) && num >= 0) {
                receiveEl.textContent = '~' + Math.round(num * 1000000).toLocaleString('en-US');
              }
            };
            input.addEventListener('input', () => updateReceive(input.value));
            buttons.filter(b => ['0.1', '0.5', '1', 'Max 10'].includes((b.textContent || '').trim())).forEach(preset => {
              preset.addEventListener('click', () => {
                const raw = (preset.textContent || '').trim().replace('Max ', '');
                input.value = raw;
                updateReceive(raw);
              });
            });
          });
        });
      });

      // Copy Referral Link to Clipboard
      function copyReferralLink() {
        const link = 'https://app.okntoken.com/ref/DE-71C49';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(showCopied).catch(fallback);
        } else {
          fallback();
        }
        function fallback() {
          const ta = document.createElement('textarea');
          ta.value = link;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showCopied();
        }
        function showCopied() {
          const btns = document.querySelectorAll('.copy-ref-btn');
          btns.forEach(b => {
            const span = b.querySelector('span');
            if (span) span.innerText = 'Copied!';
            b.style.background = 'var(--ok, #2FBD8E)';
            b.style.color = '#fff';
            setTimeout(() => {
              if (span) span.innerText = 'Copy link';
              b.style.background = '';
              b.style.color = '';
            }, 2500);
          });
          showToast('Referral link copied to clipboard!');
        }
      }

      function showToast(msg) {
        let toast = document.getElementById('okn-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'okn-toast';
          toast.setAttribute('role', 'status');
          toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(19,19,22,0.95);backdrop-filter:blur(16px);border:1px solid var(--line);border-radius:16px;color:#fff;padding:12px 24px;font-size:13px;font-weight:700;z-index:999999;box-shadow:0 10px 30px rgba(0,0,0,0.5);display:flex;align-items:center;gap:10px;opacity:0;transition:all 0.3s cubic-bezier(0.22,1,0.36,1);pointer-events:none;';
          document.body.appendChild(toast);
        }
        toast.innerHTML = '<svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ok, #2FBD8E)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex:0 0 auto;"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>' + msg + '</span>';
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(-50%) translateY(20px)';
        }, 2500);
      }

      // Sidebar Collapse Toggle
      function toggleSidebar() {
        const aside = document.querySelector('aside[aria-label="Sidebar"]');
        if (!aside) return;
        const isCollapsed = aside.getAttribute('data-collapsed') === 'true';
        if (isCollapsed) {
          aside.style.flex = '0 0 272px';
          aside.style.width = '272px';
          aside.removeAttribute('data-collapsed');
          aside.querySelectorAll('.sidebar-hide-tablet').forEach(el => el.style.display = '');
        } else {
          aside.style.flex = '0 0 72px';
          aside.style.width = '72px';
          aside.setAttribute('data-collapsed', 'true');
          aside.querySelectorAll('.sidebar-hide-tablet').forEach(el => el.style.display = 'none');
        }
      }

      // Web3 Wallet Connection Modal
      function openWalletModal() {
        let overlay = document.getElementById('wallet-modal-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.id = 'wallet-modal-overlay';
          overlay.setAttribute('role', 'dialog');
          overlay.setAttribute('aria-modal', 'true');
          overlay.setAttribute('aria-label', 'Connect Wallet');
          overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;';
          overlay.innerHTML = \`
            <div style="background:var(--s1);border:1px solid var(--line);border-radius:24px;padding:24px;max-width:380px;width:100%;color:var(--tx);font-family:Manrope,sans-serif;box-shadow:0 30px 90px rgba(0,0,0,0.9);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <div style="font-size:16px;font-weight:800;">Connect Wallet</div>
                <button aria-label="Close wallet modal" onclick="document.getElementById('wallet-modal-overlay').remove()" style="background:var(--s2);border:1px solid var(--line);border-radius:50%;width:32px;height:32px;color:var(--mut);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s ease;">
                  <svg class="i" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div style="font-size:12px;color:var(--mut);margin-bottom:16px;">Select your Web3 wallet provider on BNB Smart Chain.</div>
              <button onclick="selectWallet('MetaMask')" class="wallet-opt" style="width:100%;color:var(--tx);display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:14px;background:var(--s2);border:1px solid var(--line);margin-bottom:10px;cursor:pointer;transition:all 0.2s ease;">
                <div style="display:flex;align-items:center;gap:12px;font-weight:700;font-size:14px;">
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><path d="M28.4 4.5l-10.8 8 2 4.7 6.4-1.9 2.4-10.8z" fill="#E2761B"/><path d="M3.6 4.5l10.8 8-2 4.7-6.4-1.9L3.6 4.5z" fill="#E4751F"/><path d="M24.7 21.6l-6.3 1.9.9 2.5 4.3 1.3 1.1-5.7z" fill="#E4761B"/><path d="M7.3 21.6l6.3 1.9-.9 2.5-4.3 1.3-1.1-5.7z" fill="#E4761B"/><path d="M13.6 23.5l-5.3-1.6 3.8 6.7 1.5-5.1z" fill="#D7C1B3"/><path d="M18.4 23.5l5.3-1.6-3.8 6.7-1.5-5.1z" fill="#D7C1B3"/><path d="M11.9 14.8l-1.9 3.5 4.7.2-.2-4.1-2.6.4z" fill="#233447"/><path d="M20.1 14.8l1.9 3.5-4.7.2.2-4.1 2.6.4z" fill="#233447"/><path d="M16 18.5l-4.7-.2 3.4 5.2.9-5z" fill="#E4751F"/></svg>
                  <span>MetaMask</span>
                </div>
                <span style="font-size:10px;background:var(--vio);color:#fff;padding:2px 8px;border-radius:6px;font-weight:700;">Popular</span>
              </button>
              <button onclick="selectWallet('Binance Web3 Wallet')" class="wallet-opt" style="width:100%;color:var(--tx);display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:14px;background:var(--s2);border:1px solid var(--line);margin-bottom:10px;cursor:pointer;transition:all 0.2s ease;">
                <div style="display:flex;align-items:center;gap:12px;font-weight:700;font-size:14px;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#F3BA2F"><path d="M12 3.2L16.2 7.4L18.4 5.2L12 0L5.6 5.2L7.8 7.4L12 3.2ZM20.8 7.6L18.6 9.8L20.8 12L23 9.8L20.8 7.6ZM12 8.4L15.6 12L12 15.6L8.4 12L12 8.4ZM3.2 7.6L1 9.8L3.2 12L5.4 9.8L3.2 7.6ZM12 16.6L7.8 12.4L5.6 14.6L12 21L18.4 14.6L16.2 12.4L12 16.6ZM20.8 12L18.6 14.2L20.8 16.4L23 14.2L20.8 12ZM3.2 12L1 14.2L3.2 16.4L5.4 14.2L3.2 12Z"/></svg>
                  <span>Binance Web3</span>
                </div>
                <span style="font-size:10px;background:rgba(255,170,0,0.2);color:var(--org);padding:2px 8px;border-radius:6px;font-weight:700;">BSC Native</span>
              </button>
              <button onclick="selectWallet('Trust Wallet')" class="wallet-opt" style="width:100%;color:var(--tx);display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:14px;background:var(--s2);border:1px solid var(--line);cursor:pointer;transition:all 0.2s ease;">
                <div style="display:flex;align-items:center;gap:12px;font-weight:700;font-size:14px;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6.2c0 5.5 3.4 10.7 8 11.8 4.6-1.1 8-6.3 8-11.8V6l-8-4z" fill="#0500FF"/><path d="M12 4.2L5.8 7.3v5c0 4.3 2.6 8.3 6.2 9.4 3.6-1.1 6.2-5.1 6.2-9.4v-5L12 4.2z" fill="#fff"/><path d="M12 6.5l4 2.5v3.4c0 2.8-1.7 5.4-4 6.3V6.5z" fill="#0500FF"/></svg>
                  <span>Trust Wallet</span>
                </div>
              </button>
            </div>
          \`;
          document.body.appendChild(overlay);
        }
      }

      function selectWallet(name) {
        const overlay = document.getElementById('wallet-modal-overlay');
        if (overlay) overlay.remove();
        const addr = '0x71C...49A1';
        window.__userWalletConnected = true;
        document.querySelectorAll('button').forEach(b => {
          if ((b.innerText || '').toLowerCase().includes('connect wallet')) {
            b.innerHTML = '<svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg> ' + addr;
            b.style.background = 'var(--ok)';
            b.style.color = '#fff';
          }
        });
        showToast('Connected ' + name + ' (' + addr + ') on BNB Smart Chain!');
      }

      // =========================================================================
      // Multiple Payment Gateway Engine (Web3, NOWPayments, Credit Card)
      // =========================================================================
      let currentGateway = 'web3';
      let currentNowCoin = {
        id: 'USDT_TRC20',
        symbol: 'USDT',
        network: 'TRC-20',
        chain: 'TRON',
        rateUsd: 1.0,
        address: 'TF3yK849QzLMnw729kLp10294VbN92K8xm'
      };

      function switchPaymentGateway(gw) {
        currentGateway = gw;
        document.querySelectorAll('.gateway-tab').forEach(tab => {
          if (tab.getAttribute('data-gw') === gw) {
            tab.classList.add('active');
          } else {
            tab.classList.remove('active');
          }
        });

        ['web3', 'nowpayments', 'card'].forEach(p => {
          const els = document.querySelectorAll('#panel-' + p);
          els.forEach(el => {
            el.style.display = (p === gw) ? 'block' : 'none';
          });
        });

        const summaryLabels = document.querySelectorAll('#summary-active-gw');
        summaryLabels.forEach(el => {
          if (gw === 'web3') el.textContent = 'Web3 (BNB Smart Chain)';
          else if (gw === 'nowpayments') el.textContent = 'NOWPayments (' + currentNowCoin.symbol + ' ' + currentNowCoin.network + ')';
          else if (gw === 'card') el.textContent = 'Credit / Debit Card (Visa/MC/Apple Pay)';
        });
      }

      function selectNowCoin(coinId, symbol, network, chainName, usdRate) {
        currentNowCoin = {
          id: coinId,
          symbol: symbol,
          network: network,
          chain: chainName,
          rateUsd: usdRate,
          address: getCryptoAddress(coinId)
        };

        document.querySelectorAll('.coin-badge').forEach(b => {
          if (b.getAttribute('data-coin') === coinId) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });

        document.querySelectorAll('#now-selected-label').forEach(el => {
          el.innerHTML = '<span style="color:var(--vio-l);">' + symbol + '</span> (' + network + ')';
        });

        const input = document.getElementById('buy-now-amt') || document.querySelector('.now-amt-input');
        if (input) {
          calcTokens(input.value, 'nowpayments');
        }

        document.querySelectorAll('#summary-active-gw').forEach(el => {
          if (currentGateway === 'nowpayments') {
            el.textContent = 'NOWPayments (' + symbol + ' ' + network + ')';
          }
        });
      }

      function getCryptoAddress(coinId) {
        switch (coinId) {
          case 'BTC': return 'bc1q9px43k8zqm902lskqew901ncmx49120skqp';
          case 'ETH': return '0x71C2B89A94821890Bf829C10283bB81907A949A1';
          case 'SOL': return '8xj2Kp9L10mNqW4vZbE81qR92mK810vQ28xMn9L8bX4';
          case 'USDT_BEP20':
          case 'BNB_CRYPTO':
          case 'USDC': return '0x71C2B89A94821890Bf829C10283bB81907A949A1';
          case 'LTC': return 'ltc1q98zkm029xlskq481029smckq90281lskq02';
          default: return 'TF3yK849QzLMnw729kLp10294VbN92K8xm'; // USDT TRC20
        }
      }

      function calcTokens(val, mode) {
        const num = parseFloat(val);
        const ratePerOkn = 0.0006; // ~$0.0006 per OKN
        if (mode === 'bnb') {
          const receiveEls = document.querySelectorAll('#buy-receive-bnb, .buy-receive-bnb');
          if (!isNaN(num) && num > 0) {
            const tokens = Math.round(num * 1000000);
            receiveEls.forEach(el => el.textContent = '~' + tokens.toLocaleString('en-US'));
          }
        } else if (mode === 'nowpayments') {
          const receiveEls = document.querySelectorAll('#buy-receive-now, .buy-receive-now');
          const equivEls = document.querySelectorAll('#now-crypto-equiv, .now-crypto-equiv');
          if (!isNaN(num) && num > 0) {
            const tokens = Math.round(num / ratePerOkn);
            receiveEls.forEach(el => el.textContent = '~' + tokens.toLocaleString('en-US'));
            const cryptoAmt = (num / currentNowCoin.rateUsd);
            const formattedCrypto = cryptoAmt < 0.01 ? cryptoAmt.toFixed(6) : (cryptoAmt < 1 ? cryptoAmt.toFixed(4) : cryptoAmt.toFixed(2));
            equivEls.forEach(el => el.textContent = '≈ ' + formattedCrypto + ' ' + currentNowCoin.symbol);
          }
        } else if (mode === 'card') {
          const receiveEls = document.querySelectorAll('#buy-receive-card, .buy-receive-card');
          const btnTexts = document.querySelectorAll('#btn-card-text, .btn-card-text');
          if (!isNaN(num) && num > 0) {
            const tokens = Math.round(num / ratePerOkn);
            receiveEls.forEach(el => el.textContent = '~' + tokens.toLocaleString('en-US') + ' $OKN');
            btnTexts.forEach(el => el.textContent = 'Pay $' + num.toFixed(2) + ' with Card');
          }
        }
      }

      function setBnbPreset(amt) {
        document.querySelectorAll('#buy-bnb-amt, #amt, .buy-bnb-amt').forEach(el => {
          el.value = amt;
        });
        calcTokens(amt, 'bnb');
      }

      function setNowPreset(amt) {
        document.querySelectorAll('#buy-now-amt, .now-amt-input').forEach(el => {
          el.value = amt;
        });
        calcTokens(amt, 'nowpayments');
      }

      function setCardPreset(amt) {
        document.querySelectorAll('#buy-card-amt, .card-amt-input').forEach(el => {
          el.value = amt;
        });
        calcTokens(amt, 'card');
      }

      function formatCardNumber(input) {
        let v = input.value.replace(/\D/g, '').substring(0, 16);
        let formatted = v.match(/.{1,4}/g)?.join(' ') || v;
        input.value = formatted;
        document.querySelectorAll('#card-brand-detected, .card-brand-label').forEach(brand => {
          if (v.startsWith('4')) brand.textContent = 'Visa';
          else if (v.startsWith('5')) brand.textContent = 'Mastercard';
          else if (v.startsWith('3')) brand.textContent = 'Amex';
          else brand.textContent = 'Card';
        });
      }

      function formatCardExp(input) {
        let v = input.value.replace(/\D/g, '').substring(0, 4);
        if (v.length > 2) {
          v = v.substring(0, 2) + '/' + v.substring(2);
        }
        input.value = v;
      }

      // -------------------------------------------------------------------------
      // NOWPayments Invoice Modal Flow
      // -------------------------------------------------------------------------
      function openNowPaymentsModal() {
        const amtInput = document.getElementById('buy-now-amt') || document.querySelector('.now-amt-input');
        const usdVal = parseFloat(amtInput?.value || '100') || 100;
        const tokenVal = Math.round(usdVal / 0.0006);
        const cryptoAmt = (usdVal / currentNowCoin.rateUsd);
        const cryptoStr = (cryptoAmt < 0.01 ? cryptoAmt.toFixed(6) : (cryptoAmt < 1 ? cryptoAmt.toFixed(4) : cryptoAmt.toFixed(2))) + ' ' + currentNowCoin.symbol;
        const invoiceId = 'NP-OKN-' + (Math.floor(100000 + Math.random() * 900000));

        let overlay = document.getElementById('nowpayments-invoice-overlay');
        if (overlay) overlay.remove();

        overlay = document.createElement('div');
        overlay.id = 'nowpayments-invoice-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'NOWPayments Crypto Invoice');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;';

        overlay.innerHTML = \`
          <div style="background:var(--s1);border:1px solid var(--line);border-radius:24px;padding:26px;max-width:440px;width:100%;color:var(--tx);font-family:Manrope,sans-serif;box-shadow:0 30px 90px rgba(0,0,0,0.9);position:relative;">
            
            <!-- Header -->
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
              <div>
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:#09B4FF;color:#fff;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#09B4FF"/><path d="M7 16l4-8h2l-4 8H7zm6 0l4-8h2l-4 8h-2z" fill="#fff"/></svg>
                  </span>
                  <span style="font-size:16px;font-weight:800;">NOWPayments Invoice</span>
                </div>
                <div style="font-size:12px;color:var(--mut);margin-top:4px;">ID: <strong style="color:var(--tx);font-family:Sora,monospace;">\${invoiceId}</strong></div>
              </div>
              <button aria-label="Close invoice" onclick="document.getElementById('nowpayments-invoice-overlay').remove()" style="background:var(--s2);border:1px solid var(--line);border-radius:50%;width:32px;height:32px;color:var(--mut);display:flex;align-items:center;justify-content:center;cursor:pointer;">
                <svg class="i" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <!-- Price Breakdown Box -->
            <div style="background:var(--s2);border:1px solid var(--line);border-radius:18px;padding:14px 16px;margin-bottom:16px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="font-size:12px;color:var(--mut);">Amount to transfer</span>
                <span class="num" style="font-size:16px;font-weight:800;color:var(--cyan);">\${cryptoStr}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--mut);">
                <span>Fiat Value</span>
                <span style="font-weight:700;color:var(--tx);">$\${usdVal.toFixed(2)} USD</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--mut);margin-top:4px;">
                <span>You receive</span>
                <span style="font-weight:800;color:var(--vio-l);">~\${tokenVal.toLocaleString('en-US')} $OKN</span>
              </div>
            </div>

            <!-- QR Code Box -->
            <div style="text-align:center;margin-bottom:16px;background:var(--s2);border:1px solid var(--line);border-radius:18px;padding:16px;">
              <div style="display:inline-block;padding:10px;background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.25);">
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <rect width="150" height="150" fill="#ffffff"/>
                  <!-- Position Markers -->
                  <rect x="15" y="15" width="36" height="36" fill="#000000" rx="4"/>
                  <rect x="22" y="22" width="22" height="22" fill="#ffffff" rx="2"/>
                  <rect x="26" y="26" width="14" height="14" fill="#000000" rx="1"/>
                  <rect x="99" y="15" width="36" height="36" fill="#000000" rx="4"/>
                  <rect x="106" y="22" width="22" height="22" fill="#ffffff" rx="2"/>
                  <rect x="110" y="26" width="14" height="14" fill="#000000" rx="1"/>
                  <rect x="15" y="99" width="36" height="36" fill="#000000" rx="4"/>
                  <rect x="22" y="106" width="22" height="22" fill="#ffffff" rx="2"/>
                  <rect x="26" y="110" width="14" height="14" fill="#000000" rx="1"/>
                  <!-- QR Data Mock Blocks -->
                  <rect x="60" y="20" width="10" height="10" fill="#09B4FF"/>
                  <rect x="75" y="20" width="10" height="10" fill="#7A12F5"/>
                  <rect x="60" y="40" width="10" height="10" fill="#000000"/>
                  <rect x="75" y="40" width="10" height="10" fill="#000000"/>
                  <rect x="20" y="60" width="10" height="10" fill="#000000"/>
                  <rect x="40" y="60" width="10" height="10" fill="#000000"/>
                  <rect x="60" y="60" width="30" height="30" fill="#000000" rx="2"/>
                  <rect x="100" y="60" width="10" height="10" fill="#000000"/>
                  <rect x="120" y="60" width="10" height="10" fill="#000000"/>
                  <rect x="60" y="100" width="10" height="10" fill="#000000"/>
                  <rect x="75" y="100" width="10" height="10" fill="#09B4FF"/>
                  <rect x="100" y="100" width="10" height="10" fill="#000000"/>
                  <rect x="120" y="100" width="10" height="10" fill="#000000"/>
                  <rect x="60" y="120" width="10" height="10" fill="#000000"/>
                  <rect x="80" y="120" width="20" height="10" fill="#7A12F5"/>
                  <rect x="110" y="120" width="10" height="10" fill="#000000"/>
                </svg>
              </div>
              <div style="font-size:11.5px;color:var(--mut);margin-top:8px;">Scan with Binance, Trust Wallet, Phantom, or Exodus</div>
            </div>

            <!-- Deposit Address Box -->
            <div style="margin-bottom:16px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span style="font-size:12px;font-weight:700;color:var(--mut);">Deposit Address (\${currentNowCoin.network})</span>
                <span style="font-size:10px;font-weight:800;background:rgba(255,170,0,0.18);color:var(--org);padding:2px 6px;border-radius:6px;">Send only \${currentNowCoin.symbol}</span>
              </div>
              <div style="display:flex;gap:8px;align-items:center;background:var(--s2);border:1px solid var(--line);border-radius:14px;padding:8px 12px;">
                <input type="text" readonly value="\${currentNowCoin.address}" style="background:transparent;border:none;color:var(--tx);font-size:12px;font-family:Sora,monospace;width:100%;outline:none;text-overflow:ellipsis;">
                <button type="button" onclick="copyInlineText('\${currentNowCoin.address}', this)" style="padding:6px 12px;border-radius:8px;background:var(--vio);color:#fff;border:none;font-weight:800;font-size:11px;cursor:pointer;white-space:nowrap;">Copy</button>
              </div>
            </div>

            <!-- Status Indicator -->
            <div id="now-status-box" style="display:flex;align-items:center;gap:10px;background:rgba(255,170,0,0.08);border:1px solid rgba(255,170,0,0.3);border-radius:14px;padding:12px;margin-bottom:18px;">
              <div class="pulse-dot"></div>
              <div style="font-size:12px;font-weight:700;color:var(--org-t);" id="now-status-text">
                Waiting for transaction deposit on \${currentNowCoin.network}...
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display:flex;flex-direction:column;gap:8px;">
              <button type="button" id="btn-verify-now" onclick="simulateNowBlockchainConfirmation('\${invoiceId}', '\${cryptoStr}', \${tokenVal}, '\${usdVal}')" style="height:48px;border-radius:14px;background:var(--ok);color:#fff;font-weight:800;font-size:14px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 14px rgba(47,189,142,0.3);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>I Have Sent Payment (Verify Deposit)</span>
              </button>
              <button type="button" onclick="document.getElementById('nowpayments-invoice-overlay').remove()" style="height:38px;border-radius:12px;background:transparent;color:var(--mut);border:1px solid var(--line);font-weight:700;font-size:13px;cursor:pointer;">
                Cancel Invoice
              </button>
            </div>
          </div>
        \`;
        document.body.appendChild(overlay);
      }

      function simulateNowBlockchainConfirmation(invoiceId, cryptoStr, tokenVal, usdVal) {
        const btn = document.getElementById('btn-verify-now');
        const statusBox = document.getElementById('now-status-box');
        const statusText = document.getElementById('now-status-text');

        if (btn) {
          btn.disabled = true;
          btn.style.opacity = '0.7';
          btn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;">⏳</span> <span>Scanning Blockchain...</span>';
        }

        if (statusText) statusText.textContent = 'Searching mempool for transaction hash...';

        setTimeout(() => {
          if (statusText) {
            statusText.textContent = 'Transaction detected in mempool! Block confirmations: 1/2...';
            statusBox.style.background = 'rgba(9,180,255,0.1)';
            statusBox.style.borderColor = 'rgba(9,180,255,0.3)';
            statusText.style.color = 'var(--cyan)';
          }
          setTimeout(() => {
            if (statusText) {
              statusText.textContent = 'Confirmed (2/2)! Crediting ' + tokenVal.toLocaleString('en-US') + ' $OKN...';
              statusBox.style.background = 'rgba(47,189,142,0.12)';
              statusBox.style.borderColor = 'rgba(47,189,142,0.3)';
              statusText.style.color = 'var(--ok)';
            }
            setTimeout(() => {
              const overlay = document.getElementById('nowpayments-invoice-overlay');
              if (overlay) overlay.remove();
              completePurchase({
                gateway: 'NOWPayments',
                method: currentNowCoin.symbol + ' (' + currentNowCoin.network + ')',
                amountPaid: cryptoStr + ' (~$' + usdVal + ' USD)',
                tokensReceived: tokenVal,
                txHash: 'NP-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              });
            }, 800);
          }, 1200);
        }, 1200);
      }

      // -------------------------------------------------------------------------
      // Credit Card 3D Secure 2.0 Flow
      // -------------------------------------------------------------------------
      function processCardPayment() {
        const amtInput = document.getElementById('buy-card-amt') || document.querySelector('.card-amt-input');
        const usdVal = parseFloat(amtInput?.value || '100') || 100;
        const tokenVal = Math.round(usdVal / 0.0006);
        const cardNum = document.getElementById('card-number-input')?.value || '4532 •••• •••• 8821';
        const cardLast4 = cardNum.replace(/\s/g, '').slice(-4) || '8821';
        const brand = document.getElementById('card-brand-detected')?.textContent || 'Visa';

        let overlay = document.getElementById('card-3ds-overlay');
        if (overlay) overlay.remove();

        overlay = document.createElement('div');
        overlay.id = 'card-3ds-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', '3D Secure Verification');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;';

        overlay.innerHTML = \`
          <div style="background:var(--s1);border:1px solid var(--line);border-radius:24px;padding:26px;max-width:400px;width:100%;color:var(--tx);font-family:Manrope,sans-serif;box-shadow:0 30px 90px rgba(0,0,0,0.9);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--line);">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-weight:900;color:var(--ok);font-size:16px;">Verified by \${brand}</span>
              </div>
              <span style="font-size:11px;font-weight:700;color:var(--mut);">3D Secure 2.0</span>
            </div>

            <div style="font-size:14px;font-weight:800;margin-bottom:4px;">Bank Authorization Required</div>
            <div style="font-size:12.5px;color:var(--mut);line-height:1.5;margin-bottom:16px;">
              To protect your account, your issuing bank has sent a 6-digit confirmation code via SMS to <strong style="color:var(--tx);">(•••) •••-4921</strong>.
            </div>

            <div style="background:var(--s2);border:1px solid var(--line);border-radius:16px;padding:12px 16px;margin-bottom:16px;">
              <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--mut);margin-bottom:4px;">
                <span>Merchant</span>
                <span style="font-weight:700;color:var(--tx);">OKN Token Presale</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--mut);">
                <span>Total Amount</span>
                <span style="font-weight:800;color:var(--tx);">$\${usdVal.toFixed(2)} USD</span>
              </div>
            </div>

            <div style="margin-bottom:16px;">
              <label for="input-3ds-code" style="display:block;font-size:12px;font-weight:700;color:var(--mut);margin-bottom:6px;">Enter 6-digit SMS code</label>
              <div style="display:flex;gap:8px;">
                <input type="text" id="input-3ds-code" maxlength="6" value="742918" style="flex:1;height:44px;border-radius:12px;background:var(--s2);border:1px solid var(--line);color:var(--tx);font-size:18px;font-weight:800;text-align:center;letter-spacing:4px;outline:none;font-family:Sora,monospace;">
                <button type="button" onclick="document.getElementById('input-3ds-code').value='892401';showToast('Auto-filled test passcode')" style="padding:0 12px;border-radius:12px;background:var(--s2);border:1px solid var(--line);color:var(--vio-l);font-weight:700;font-size:11px;cursor:pointer;">Auto-fill</button>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:8px;">
              <button type="button" id="btn-submit-3ds" onclick="authorize3DSecure(\${usdVal}, \${tokenVal}, '\${brand}', '\${cardLast4}')" style="height:48px;border-radius:14px;background:var(--ok);color:#fff;font-weight:800;font-size:14px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                <span>Authorize $\${usdVal.toFixed(2)} Payment</span>
              </button>
              <button type="button" onclick="document.getElementById('card-3ds-overlay').remove()" style="height:36px;border-radius:12px;background:transparent;color:var(--mut);border:none;font-weight:700;font-size:13px;cursor:pointer;">
                Cancel
              </button>
            </div>
          </div>
        \`;
        document.body.appendChild(overlay);
      }

      function authorize3DSecure(usdVal, tokenVal, brand, cardLast4) {
        const btn = document.getElementById('btn-submit-3ds');
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<span>Processing with bank...</span>';
        }
        setTimeout(() => {
          const overlay = document.getElementById('card-3ds-overlay');
          if (overlay) overlay.remove();
          completePurchase({
            gateway: 'Credit Card',
            method: brand + ' (•••• ' + cardLast4 + ')',
            amountPaid: '$' + usdVal.toFixed(2) + ' USD',
            tokensReceived: tokenVal,
            txHash: 'CC-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }, 1200);
      }

      // -------------------------------------------------------------------------
      // Express Pay Handlers (Apple Pay, Google Pay)
      // -------------------------------------------------------------------------
      function triggerApplePay() {
        const amtInput = document.getElementById('buy-card-amt') || document.querySelector('.card-amt-input');
        const usdVal = parseFloat(amtInput?.value || '100') || 100;
        const tokenVal = Math.round(usdVal / 0.0006);

        let overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);z-index:999999;display:flex;align-items:flex-end;justify-content:center;';
        overlay.innerHTML = \`
          <div style="background:#111;border-top:1px solid rgba(255,255,255,0.15);border-radius:24px 24px 0 0;padding:24px;max-width:440px;width:100%;color:#fff;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <span style="font-size:18px;font-weight:700;"> Pay</span>
              <button onclick="this.closest('div').parentElement.remove()" style="background:rgba(255,255,255,0.1);border:none;border-radius:50%;width:28px;height:28px;color:#fff;cursor:pointer;">✕</button>
            </div>
            <div style="border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:12px;margin-bottom:12px;display:flex;justify-content:space-between;">
              <span style="color:#888;font-size:13px;">OKN Presale Allocation</span>
              <span style="font-weight:700;font-size:15px;">$\${usdVal.toFixed(2)}</span>
            </div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
              <div style="width:36px;height:24px;border-radius:4px;background:#222;border:1px solid #444;display:flex;align-items:center;justify-content:center;font-size:10px;">VISA</div>
              <div style="font-size:13px;">Apple Card (•••• 1042)</div>
            </div>
            <button onclick="this.closest('div').parentElement.remove(); completePurchase({ gateway: 'Apple Pay', method: 'Apple Card (•••• 1042)', amountPaid: '$\${usdVal.toFixed(2)} USD', tokensReceived: \${tokenVal}, txHash: 'AP-' + Math.random().toString(36).substring(2, 9).toUpperCase(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })" style="width:100%;height:50px;border-radius:14px;background:#fff;color:#000;font-weight:700;font-size:16px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
              <span>Double Click Side Button or Confirm</span>
            </button>
          </div>
        \`;
        document.body.appendChild(overlay);
      }

      function triggerGooglePay() {
        const amtInput = document.getElementById('buy-card-amt') || document.querySelector('.card-amt-input');
        const usdVal = parseFloat(amtInput?.value || '100') || 100;
        const tokenVal = Math.round(usdVal / 0.0006);

        let overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;';
        overlay.innerHTML = \`
          <div style="background:var(--s1);border:1px solid var(--line);border-radius:24px;padding:24px;max-width:380px;width:100%;color:var(--tx);font-family:Manrope,sans-serif;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <span style="font-size:16px;font-weight:800;display:flex;align-items:center;gap:6px;">Google Pay</span>
              <button onclick="this.closest('div').parentElement.remove()" style="background:var(--s2);border:none;border-radius:50%;width:28px;height:28px;color:var(--mut);cursor:pointer;">✕</button>
            </div>
            <div style="font-size:13px;color:var(--mut);margin-bottom:12px;">Select card on Google Wallet:</div>
            <div style="background:var(--s2);border:1px solid var(--line);border-radius:14px;padding:12px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;">
              <span style="font-weight:700;font-size:13px;">Chase Visa •••• 9814</span>
              <span class="num" style="font-weight:800;font-size:14px;">$\${usdVal.toFixed(2)}</span>
            </div>
            <button onclick="this.closest('div').parentElement.remove(); completePurchase({ gateway: 'Google Pay', method: 'Chase Visa •••• 9814', amountPaid: '$\${usdVal.toFixed(2)} USD', tokensReceived: \${tokenVal}, txHash: 'GP-' + Math.random().toString(36).substring(2, 9).toUpperCase(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })" style="width:100%;height:46px;border-radius:12px;background:#4285F4;color:#fff;font-weight:800;font-size:14px;border:none;cursor:pointer;">
              Continue with Google Pay
            </button>
          </div>
        \`;
        document.body.appendChild(overlay);
      }

      // -------------------------------------------------------------------------
      // Web3 BNB Swap Action
      // -------------------------------------------------------------------------
      function executeWeb3Buy() {
        if (!window.__userWalletConnected) {
          openWalletModal();
          return;
        }
        const bnbInput = document.getElementById('buy-bnb-amt') || document.getElementById('amt');
        const bnbVal = parseFloat(bnbInput?.value || '0.1') || 0.1;
        const tokens = Math.round(bnbVal * 1000000);

        showToast('Initiating BSC on-chain transaction for ' + bnbVal + ' BNB...');
        setTimeout(() => {
          completePurchase({
            gateway: 'Web3 Wallet',
            method: 'BNB Smart Chain (Testnet)',
            amountPaid: bnbVal + ' BNB',
            tokensReceived: tokens,
            txHash: '0x' + Math.random().toString(16).substring(2, 42),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }, 1200);
      }

      // -------------------------------------------------------------------------
      // Common Purchase Completion & Receipt Engine
      // -------------------------------------------------------------------------
      function completePurchase(data) {
        // Persist tokens
        const currentTokens = parseInt(localStorage.getItem('okn_user_tokens') || '0', 10);
        const newTotal = currentTokens + data.tokensReceived;
        localStorage.setItem('okn_user_tokens', newTotal);

        // Persist transaction record
        let history = [];
        try {
          history = JSON.parse(localStorage.getItem('okn_tx_history') || '[]');
        } catch (e) { history = []; }
        history.unshift(data);
        localStorage.setItem('okn_tx_history', JSON.stringify(history));

        // Update UI counters across page
        updateDynamicBalances();

        // Celebration Toast
        showToast('Payment successful! +' + data.tokensReceived.toLocaleString('en-US') + ' $OKN added.');

        // Show Receipt Modal
        showPaymentReceiptModal(data);
      }

      function showPaymentReceiptModal(data) {
        let overlay = document.getElementById('payment-receipt-overlay');
        if (overlay) overlay.remove();

        overlay = document.createElement('div');
        overlay.id = 'payment-receipt-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Payment Receipt');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;';

        overlay.innerHTML = \`
          <div style="background:var(--s1);border:1px solid var(--line);border-radius:26px;padding:28px;max-width:420px;width:100%;color:var(--tx);font-family:Manrope,sans-serif;box-shadow:0 30px 90px rgba(0,0,0,0.9);text-align:center;">
            
            <div style="width:56px;height:56px;border-radius:50%;background:rgba(47,189,142,0.16);color:var(--ok);display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;box-shadow:0 0 20px rgba(47,189,142,0.35);">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>

            <h3 style="font-size:20px;font-weight:800;margin:0 0 6px;">Payment Confirmed!</h3>
            <p style="font-size:13px;color:var(--mut);margin:0 0 20px;">Your $OKN tokens have been successfully purchased and credited.</p>

            <div style="background:var(--s2);border:1px solid var(--line);border-radius:18px;padding:16px;text-align:left;margin-bottom:20px;">
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--line);font-size:12.5px;">
                <span style="color:var(--mut);">Gateway</span>
                <span style="font-weight:700;color:var(--tx);">\${data.gateway}</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--line);font-size:12.5px;">
                <span style="color:var(--mut);">Method</span>
                <span style="font-weight:700;color:var(--tx);">\${data.method}</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--line);font-size:12.5px;">
                <span style="color:var(--mut);">Total Paid</span>
                <span class="num" style="font-weight:800;color:var(--tx);">\${data.amountPaid}</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--line);font-size:12.5px;">
                <span style="color:var(--mut);">Tokens Credited</span>
                <span class="num" style="font-weight:800;color:var(--ok);">+\${data.tokensReceived.toLocaleString('en-US')} $OKN</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:11.5px;">
                <span style="color:var(--mut);">Reference ID</span>
                <span style="font-family:Sora,monospace;color:var(--vio-l);">\${data.txHash}</span>
              </div>
            </div>

            <div style="display:flex;gap:10px;">
              <a href="wallet.html" style="flex:1;height:44px;border-radius:12px;background:var(--vio);color:#fff;font-weight:800;font-size:13px;display:flex;align-items:center;justify-content:center;text-decoration:none;">
                View in Wallet
              </a>
              <button onclick="document.getElementById('payment-receipt-overlay').remove()" style="flex:1;height:44px;border-radius:12px;background:var(--s2);border:1px solid var(--line);color:var(--tx);font-weight:700;font-size:13px;cursor:pointer;">
                Done
              </button>
            </div>
          </div>
        \`;
        document.body.appendChild(overlay);
      }

      function updateDynamicBalances() {
        const currentTokens = parseInt(localStorage.getItem('okn_user_tokens') || '0', 10);
        if (currentTokens > 0) {
          const str = currentTokens.toLocaleString('en-US') + ' $OKN';
          document.querySelectorAll('.user-okn-tokens, .okn-token-balance').forEach(el => {
            el.textContent = str;
          });
        }
      }

      function copyInlineText(text, btn) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
        }
        const orig = btn.innerText;
        btn.innerText = 'Copied!';
        setTimeout(() => { btn.innerText = orig; }, 2000);
      }

      // Initialize on DOM load
      document.addEventListener('DOMContentLoaded', updateDynamicBalances);
    </script>
  `;
}

// Assemble a complete responsive page (with zero studio bar)
function assemblePage({ title, activeNav, activeBottomTab, desktopMainContent, mobileContent }) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title} | OKN Token</title>
  <link rel="icon" href="favicon.ico" type="image/x-icon">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0A0A0C;
      --s1: #131316;
      --s2: #1B1B20;
      --line: #26262D;
      --tx: #F5F5F7;
      --mut: #A3A3AF;
      --vio: #7A12F5;
      --vio2: #8C38F7;
      --vio-l: #C9A6FF;
      --cyan: #09B4FF;
      --yel: #FFD60A;
      --org: #FFAA00;
      --cyan-t: #09B4FF;
      --yel-t: #FFD60A;
      --org-t: #FFAA00;
      --inv-bg: #FFFFFF;
      --inv-tx: #0A0A0C;
      --inv-mut: #5B5B66;
      --inv-chip: #F0F0F4;
      --dash: #3A3A44;
      --ok: #2FBD8E;
    }
    [data-theme="light"] {
      --bg: #F5F3FA;
      --s1: #FFFFFF;
      --s2: #EFEBF8;
      --line: #E2DDEE;
      --tx: #15121F;
      --mut: #5C5870;
      --vio: #7A12F5;
      --vio2: #8C38F7;
      --vio-l: #6A0FD4;
      --cyan: #0A84C6;
      --cyan-t: #0A6FA6;
      --yel-t: #8A6500;
      --org-t: #9A5A00;
      --inv-bg: #17141F;
      --inv-tx: #FFFFFF;
      --inv-mut: #B9B5C9;
      --inv-chip: #2C2838;
      --dash: #CBC5DB;
      --ok: #0B8F63;
    }
  </style>
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
  <!-- App Layout Shell -->
  <div class="app-layout">
    <!-- Desktop & Tablet Sidebar -->
    ${getSidebar(activeNav)}

    <!-- Main Content Wrapper -->
    <div class="main-wrapper">
      <!-- Desktop Topbar -->
      ${getDesktopHeader()}

      <!-- Mobile Topbar -->
      ${getMobileHeader(activeNav, title)}

      <!-- Page Content: Desktop/Tablet View -->
      <div class="content-container hide-on-mobile">
        ${desktopMainContent}
      </div>

      <!-- Page Content: Mobile View -->
      <div class="content-container mobile-only" style="display: none;">
        ${mobileContent}
      </div>
    </div>
  </div>

  <!-- Mobile Slide-Out Sidebar Drawer (all desktop sidebar options) -->
  ${getMobileSidebarDrawer(activeNav)}

  <!-- Mobile Bottom Navigation Bar -->
  ${getBottomNav(activeBottomTab)}

  <!-- Global Production Scripts -->
  ${getCoreScripts()}
</body>
</html>`;
}

// Export for generation
module.exports = { assemblePage, rootDir };
console.log('Responsive page assembler ready.');
