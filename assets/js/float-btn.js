// Float button visibility control
(function() {
    const floatBtn = document.getElementById('float-btn');
    if (!floatBtn) return;

    // Get all buttons except the float button itself and secondary buttons
    const otherButtons = Array.from(document.querySelectorAll('.btn')).filter(btn => 
        btn.id !== 'float-btn' && !btn.classList.contains('btn-secondary')
    );

    // Check if any button (except float-btn) is in viewport
    function isAnyButtonInViewport() {
        return otherButtons.some(btn => {
            const rect = btn.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        });
    }

    // Update float button visibility
    function updateFloatButtonVisibility() {
        const anyButtonVisible = isAnyButtonInViewport();
        
        if (anyButtonVisible) {
            floatBtn.classList.remove('is-visible');
        } else {
            floatBtn.classList.add('is-visible');
        }
    }

    // Initial check
    updateFloatButtonVisibility();

    // Check on scroll with throttle for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateFloatButtonVisibility();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Check on resize
    window.addEventListener('resize', updateFloatButtonVisibility);
})();
