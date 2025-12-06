// HEADER SUBNAV TOGGLE

document.addEventListener('DOMContentLoaded', function() {
    const headerToggle = document.querySelector('.header__toggle');
    const headerNav = document.querySelector('nav.header__nav');
    const navItemsWithSubnav = document.querySelectorAll('.header__nav-has-subnav');

    // Helper: close menu and reset subnavs
    function closeMobileMenu(delay = 0) {
        if (delay > 0) {
            setTimeout(() => {
                headerNav.classList.remove('active');
                headerToggle.classList.remove('active');
                navItemsWithSubnav.forEach(item => item.classList.remove('active'));
            }, delay);
        } else {
            headerNav.classList.remove('active');
            headerToggle.classList.remove('active');
            navItemsWithSubnav.forEach(item => item.classList.remove('active'));
        }
    }

    // Toggle nav on mobile
    headerToggle.addEventListener('click', function(e) {
        const willOpen = !headerNav.classList.contains('active');
        headerNav.classList.toggle('active');
        headerToggle.classList.toggle('active');
        // Always reset subnavs when closing nav
        if (!willOpen) {
            navItemsWithSubnav.forEach(item => item.classList.remove('active'));
        }
    });

    // Subnav toggle (does not close nav)
    navItemsWithSubnav.forEach(item => {
        item.querySelector('.header__subnav-arrow')?.addEventListener('click', function(e) {
            // Only on mobile (<1100px)
            if (window.innerWidth <= 1100) {
                e.stopPropagation();
                navItemsWithSubnav.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            }
        });
    });

    // Close nav when clicking any link except .header__subnav-arrow (delegated)
    headerNav.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        // Si el click es en el arrow, no cerrar
        if (e.target.closest('.header__subnav-arrow')) return;
        if (window.innerWidth <= 1100) {
            closeMobileMenu(150);
        }
    });

    // Close nav when clicking outside nav/toggle (only on mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 1100) return;
        const isNav = e.target.closest('nav.header__nav');
        const isToggle = e.target.closest('.header__toggle');
        if (!isNav && !isToggle && headerNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});