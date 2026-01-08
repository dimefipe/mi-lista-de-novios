document.addEventListener('DOMContentLoaded', () => {
    const dashboard = document.querySelector('.dashboard');
    if (!dashboard) {
        return;
    }

    const body = document.body;
    const menuToggle = dashboard.querySelector('.dashboard__menu-toggle');
    const closeToggle = dashboard.querySelector('.dashboard__sidebar-close');
    const overlay = dashboard.querySelector('.dashboard__overlay');
    const submenuToggles = dashboard.querySelectorAll('.dashboard-menu__toggle');
    const userPanels = dashboard.querySelectorAll('.dashboard__user');
    const userTriggers = dashboard.querySelectorAll('.dashboard__user-trigger');
    const notifyPanels = dashboard.querySelectorAll('.dashboard__notify');
    const notifyTriggers = dashboard.querySelectorAll('.dashboard__notify-trigger');
    const notifyCloses = dashboard.querySelectorAll('.dashboard__notify-close');
    const modalCloses = dashboard.querySelectorAll('.dashboard__modal-close');
    const modalPanels = dashboard.querySelectorAll('.dashboard__modal');
    const modalOverlays = dashboard.querySelectorAll('.dashboard__modal-overlay');

    const isMobileModal = () => window.innerWidth <= 680;

    const closeAllSubmenus = () => {
        submenuToggles.forEach((toggle) => {
            toggle.setAttribute('aria-expanded', 'false');
            const item = toggle.closest('.dashboard-menu__item');
            if (item) {
                item.classList.remove('is-open');
            }
        });
    };

    const closeAllUserMenus = () => {
        userPanels.forEach((panel) => {
            panel.classList.remove('is-open');
            const trigger = panel.querySelector('.dashboard__user-trigger');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    };

    const closeAllNotifies = () => {
        notifyPanels.forEach((panel) => {
            panel.classList.remove('is-open');
            const trigger = panel.querySelector('.dashboard__notify-trigger');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    };

    const closeAllModals = () => {
        modalPanels.forEach((modal) => {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
        });
        delete dashboard.dataset.modalActive;
    };

    const openModal = (type) => {
        const modal = dashboard.querySelector(`.dashboard__modal--${type}`);
        if (!modal) {
            return;
        }
        closeAllModals();
        dashboard.dataset.modalActive = type;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    };

    const updateModalState = () => {
        const isModalOpen = [...userPanels, ...notifyPanels].some((panel) =>
            panel.classList.contains('is-open')
        ) || [...modalPanels].some((modal) => modal.classList.contains('is-open'));
        dashboard.classList.toggle('dashboard--modal-open', isModalOpen);
        body.classList.toggle('dashboard-page--modal-open', isModalOpen);
    };

    const setMenuOpen = (isOpen) => {
        dashboard.classList.toggle('dashboard--menu-open', isOpen);
        body.classList.toggle('dashboard-page--menu-open', isOpen);
        if (!isOpen) {
            closeAllSubmenus();
            closeAllUserMenus();
            closeAllNotifies();
            closeAllModals();
        }
        updateModalState();
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const willOpen = !dashboard.classList.contains('dashboard--menu-open');
            setMenuOpen(willOpen);
        });
    }

    if (closeToggle) {
        closeToggle.addEventListener('click', () => setMenuOpen(false));
    }

    if (overlay) {
        overlay.addEventListener('click', () => setMenuOpen(false));
    }

    submenuToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const item = toggle.closest('.dashboard-menu__item');
            if (!item) {
                return;
            }

            const isOpen = item.classList.contains('is-open');
            closeAllSubmenus();
            if (!isOpen) {
                item.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    userTriggers.forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            event.stopPropagation();
            const panel = trigger.closest('.dashboard__user');
            if (!panel) {
                return;
            }

            if (isMobileModal()) {
                closeAllUserMenus();
                closeAllNotifies();
                openModal('user');
                updateModalState();
                return;
            }

            const willOpen = !panel.classList.contains('is-open');
            closeAllUserMenus();
            closeAllNotifies();
            if (willOpen) {
                panel.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
            }
            updateModalState();
        });
    });

    notifyTriggers.forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            event.stopPropagation();
            const panel = trigger.closest('.dashboard__notify');
            if (!panel) {
                return;
            }

            if (isMobileModal()) {
                closeAllNotifies();
                closeAllUserMenus();
                openModal('notify');
                updateModalState();
                return;
            }

            const willOpen = !panel.classList.contains('is-open');
            closeAllNotifies();
            closeAllUserMenus();
            if (willOpen) {
                panel.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
            }
            updateModalState();
        });
    });

    notifyCloses.forEach((button) => {
        button.addEventListener('click', (event) => {
            closeAllNotifies();
            closeAllModals();
            updateModalState();
        });
    });

    modalCloses.forEach((button) => {
        button.addEventListener('click', (event) => {
            closeAllUserMenus();
            closeAllNotifies();
            closeAllModals();
            updateModalState();
        });
    });

    dashboard.addEventListener('click', (event) => {
        if (event.target.closest('[data-dashboard-modal-close], .dashboard__modal-close, .dashboard__notify-close')) {
            closeAllUserMenus();
            closeAllNotifies();
            closeAllModals();
            updateModalState();
            return;
        }
        if (event.target.closest('.dashboard__user-item')) {
            closeAllUserMenus();
            closeAllModals();
            updateModalState();
        }
        if (event.target.closest('.dashboard__notify-action')) {
            closeAllNotifies();
            closeAllModals();
            updateModalState();
        }
    });

    modalOverlays.forEach((overlayNode) => {
        overlayNode.addEventListener('click', () => {
            closeAllUserMenus();
            closeAllNotifies();
            closeAllModals();
            updateModalState();
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.dashboard__user')) {
            closeAllUserMenus();
            updateModalState();
        }
        if (!event.target.closest('.dashboard__notify')) {
            closeAllNotifies();
            updateModalState();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAllUserMenus();
            closeAllNotifies();
            closeAllModals();
            updateModalState();
        }
    });

    const menu = dashboard.querySelector('.dashboard-menu');
    if (menu) {
        menu.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (!link) {
                return;
            }
            if (window.innerWidth <= 1024) {
                setMenuOpen(false);
            }
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            setMenuOpen(false);
        }
        if (window.innerWidth > 680) {
            closeAllModals();
            updateModalState();
        }
    });
});
