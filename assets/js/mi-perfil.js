document.addEventListener('DOMContentLoaded', () => {
    const tabList = document.querySelector('[data-profile-tabs]');
    if (!tabList) {
        return;
    }

    const mobileQuery = window.matchMedia('(max-width: 680px)');
    const tabs = [...tabList.querySelectorAll('[data-profile-tab]')];
    const panels = [...document.querySelectorAll('[data-profile-panel]')];
    let observer = null;
    let isTabsInteracting = false;
    let isProgrammaticScroll = false;
    let lastTabsInteraction = 0;
    let lastScrollY = window.scrollY;
    let isAnchorScrolling = false;
    let anchorTargetId = null;
    let anchorTimer = null;
    let scrollTicking = false;

    const isMobile = () => mobileQuery.matches;

    const getActiveTab = () => tabs.find((tab) => tab.classList.contains('is-active')) || tabs[0];

    const getStickyOffset = () => {
        const topbar = document.querySelector('.dashboard__topbar');
        const tabsWrap = document.querySelector('.profile__tabs');
        const topbarTop = topbar ? parseFloat(window.getComputedStyle(topbar).top) || 0 : 0;
        const topbarHeight = topbar ? topbar.offsetHeight : 0;
        const tabsHeight = tabsWrap ? tabsWrap.offsetHeight : 0;
        const extra = isMobile() ? 8 : 12;
        return topbarTop + topbarHeight + tabsHeight + extra;
    };

    const setStickyOffset = () => {
        const profile = document.querySelector('.profile');
        const topbar = document.querySelector('.dashboard__topbar');
        if (!profile || !topbar) {
            return;
        }
        const topbarTop = parseFloat(window.getComputedStyle(topbar).top) || 0;
        const extra = isMobile() ? 8 : 12;
        const offset = topbarTop + topbar.offsetHeight + extra;
        profile.style.setProperty('--profile-tabs-offset', `${offset}px`);
    };

    const pauseAutoSync = () => {
        isTabsInteracting = true;
        lastTabsInteraction = Date.now();
    };

    const centerTab = (tab, behavior = 'smooth') => {
        isProgrammaticScroll = true;
        tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior });
        window.setTimeout(() => {
            isProgrammaticScroll = false;
        }, behavior === 'smooth' ? 400 : 0);
    };

    const activateTab = (tab, options = {}) => {
        const { focus = true, scroll = true, updatePanels = true, scrollBehavior = 'auto' } = options;
        const targetId = tab.getAttribute('data-profile-tab');
        tabs.forEach((item) => {
            const isActive = item === tab;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-selected', isActive ? 'true' : 'false');
            item.tabIndex = isActive ? 0 : -1;
        });

        panels.forEach((panel) => {
            const isActive = panel.id === targetId;
            panel.classList.toggle('is-active', isActive);
            if (updatePanels) {
                panel.hidden = !isActive;
            } else {
                panel.hidden = false;
            }
        });

        if (focus) {
            tab.focus();
        }

        if (scroll) {
            centerTab(tab, scrollBehavior);
        }
    };

    const getPanelForOffset = (offset) => {
        let candidate = null;
        panels.forEach((panel) => {
            const rect = panel.getBoundingClientRect();
            const topOffset = rect.top - offset;
            if (topOffset <= 0) {
                if (!candidate || rect.top > candidate.getBoundingClientRect().top) {
                    candidate = panel;
                }
            } else if (!candidate) {
                candidate = panel;
            }
        });
        return candidate || panels[panels.length - 1];
    };

    const getPanelByScroll = (offset) => {
        const scrollPos = window.scrollY + offset + 1;
        let candidate = panels[0] || null;
        panels.forEach((panel) => {
            const panelTop = panel.offsetTop;
            if (panelTop <= scrollPos) {
                candidate = panel;
            }
        });
        return candidate || panels[panels.length - 1];
    };

    const getAnchorTargetTop = (panel) => {
        const offset = getStickyOffset();
        return panel.getBoundingClientRect().top + window.scrollY - offset;
    };

    const resumeAutoSync = () => {
        if (!isTabsInteracting) {
            return;
        }
        isTabsInteracting = false;
        const offset = getStickyOffset();
        const panel = getPanelForOffset(offset + 8);
        if (!panel) {
            return;
        }
        const tab = tabs.find((item) => item.getAttribute('data-profile-tab') === panel.id);
        if (tab && !tab.classList.contains('is-active')) {
            activateTab(tab, { focus: false, updatePanels: false, scrollBehavior: 'smooth' });
        }
    };

    const startAnchorScroll = (tab) => {
        anchorTargetId = tab.getAttribute('data-profile-tab');
        isAnchorScrolling = true;
        if (anchorTimer) {
            window.clearTimeout(anchorTimer);
        }
        anchorTimer = window.setTimeout(() => {
            isAnchorScrolling = false;
            anchorTargetId = null;
        }, 1600);
    };

    const scrollToPanel = (tab) => {
        const targetId = tab.getAttribute('data-profile-tab');
        const panel = document.getElementById(targetId);
        if (!panel) {
            return;
        }
        const offset = getStickyOffset();
        const targetTop = panel.getBoundingClientRect().top + window.scrollY - offset;
        const distance = Math.abs(window.scrollY - targetTop);
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
        if (distance > 2) {
            window.setTimeout(() => {
                if (Math.abs(window.scrollY - targetTop) < 2) {
                    window.scrollTo({ top: targetTop, behavior: 'auto' });
                }
            }, 320);
        }
    };

    const setupObserver = () => {
        if (observer) {
            observer.disconnect();
        }
        if (!isMobile()) {
            observer = null;
            return;
        }

        const offset = getStickyOffset();
        observer = new IntersectionObserver(
            (entries) => {
                if (isAnchorScrolling) {
                    const anchorEntry = entries.find(
                        (entry) => entry.isIntersecting && entry.target.id === anchorTargetId
                    );
                    if (anchorEntry) {
                        const targetTab = tabs.find(
                            (item) => item.getAttribute('data-profile-tab') === anchorEntry.target.id
                        );
                        if (targetTab) {
                            activateTab(targetTab, { focus: false, updatePanels: false, scrollBehavior: 'smooth' });
                        }
                        isAnchorScrolling = false;
                        anchorTargetId = null;
                        if (anchorTimer) {
                            window.clearTimeout(anchorTimer);
                        }
                    }
                    return;
                }
                if (isTabsInteracting) {
                    return;
                }
                const panel = getPanelByScroll(offset + 8);
                const tab = panel
                    ? tabs.find((item) => item.getAttribute('data-profile-tab') === panel.id)
                    : null;
                if (tab && !tab.classList.contains('is-active')) {
                    activateTab(tab, {
                        focus: false,
                        updatePanels: false,
                        scroll: !isTabsInteracting,
                        scrollBehavior: 'smooth',
                    });
                }
            },
            {
                rootMargin: `-${offset}px 0px -60% 0px`,
                threshold: [0.15, 0.3, 0.5, 0.75],
            }
        );

        panels.forEach((panel) => observer.observe(panel));
    };

    const applyMode = () => {
        setStickyOffset();
        const activeTab = getActiveTab();
        if (isMobile()) {
            panels.forEach((panel) => {
                panel.hidden = false;
            });
            if (activeTab) {
                activateTab(activeTab, { focus: false, updatePanels: false, scroll: false });
            }
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            return;
        }

        if (observer) {
            observer.disconnect();
            observer = null;
        }
        if (activeTab) {
            activateTab(activeTab, { focus: false, updatePanels: true, scroll: false });
        }
    };

    const handleScrollEnd = () => {
        if (!isMobile()) {
            return;
        }
        if (isTabsInteracting || isAnchorScrolling) {
            return;
        }
        const scrollBottom = window.scrollY + window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        if (scrollBottom >= docHeight - 4) {
            const lastTab = tabs[tabs.length - 1];
            if (lastTab && !lastTab.classList.contains('is-active')) {
                activateTab(lastTab, {
                    focus: false,
                    updatePanels: false,
                    scroll: !isTabsInteracting,
                    scrollBehavior: 'smooth',
                });
            }
        }
    };

    const syncActiveFromScroll = () => {
        if (!isMobile()) {
            return;
        }
        const offset = getStickyOffset();
        if (isAnchorScrolling && anchorTargetId) {
            const panel = document.getElementById(anchorTargetId);
            if (panel) {
                const targetTop = getAnchorTargetTop(panel);
                if (Math.abs(window.scrollY - targetTop) < 2) {
                    isAnchorScrolling = false;
                    anchorTargetId = null;
                    if (anchorTimer) {
                        window.clearTimeout(anchorTimer);
                    }
                } else {
                    return;
                }
            }
        }
        const scrollBottom = window.scrollY + window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        if (scrollBottom >= docHeight - 6) {
            const lastTab = tabs[tabs.length - 1];
            if (lastTab && !lastTab.classList.contains('is-active')) {
                activateTab(lastTab, { focus: false, updatePanels: false, scrollBehavior: 'smooth' });
            }
            return;
        }
        if (isTabsInteracting || isAnchorScrolling) {
            return;
        }
        const panel = getPanelByScroll(offset + 8);
        const tab = panel
            ? tabs.find((item) => item.getAttribute('data-profile-tab') === panel.id)
            : null;
        if (tab && !tab.classList.contains('is-active')) {
            activateTab(tab, { focus: false, updatePanels: false, scrollBehavior: 'smooth' });
        }
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            if (isMobile()) {
                isTabsInteracting = false;
                startAnchorScroll(tab);
                activateTab(tab, { focus: false, updatePanels: false, scroll: false });
                centerTab(tab, 'smooth');
                scrollToPanel(tab);
                return;
            }
            activateTab(tab, { focus: false });
        });
    });

    tabList.addEventListener('scroll', () => {
        if (isProgrammaticScroll) {
            return;
        }
        pauseAutoSync();
    });

    tabList.addEventListener('wheel', pauseAutoSync, { passive: true });
    tabList.addEventListener('touchstart', pauseAutoSync, { passive: true });
    tabList.addEventListener('pointerdown', pauseAutoSync);

    tabList.addEventListener('keydown', (event) => {
        const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
        if (currentIndex === -1) {
            return;
        }

        let nextIndex = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % tabs.length;
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        }

        if (nextIndex !== null) {
            event.preventDefault();
            const nextTab = tabs[nextIndex];
            if (isMobile()) {
                isTabsInteracting = false;
                startAnchorScroll(nextTab);
                activateTab(nextTab, { updatePanels: false, scroll: false });
                centerTab(nextTab, 'smooth');
                scrollToPanel(nextTab);
                return;
            }
            activateTab(nextTab);
        }
    });

    applyMode();
    mobileQuery.addEventListener('change', applyMode);
    window.addEventListener('resize', () => {
        setStickyOffset();
    });
    window.addEventListener(
        'scroll',
        () => {
            const currentY = window.scrollY;
            const deltaY = Math.abs(currentY - lastScrollY);
            lastScrollY = currentY;

            if (isTabsInteracting && Date.now() - lastTabsInteraction > 100 && deltaY > 12) {
                resumeAutoSync();
            }
            handleScrollEnd();
            if (!scrollTicking) {
                scrollTicking = true;
                window.requestAnimationFrame(() => {
                    syncActiveFromScroll();
                    scrollTicking = false;
                });
            }
        },
        { passive: true }
    );
});
