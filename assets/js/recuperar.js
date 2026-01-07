document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.recuperar__form');
    const toast = document.querySelector('.recuperar__toast');
    if (!form || !toast) return;

    let hideTimer = null;
    let redirectTimer = null;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (hideTimer) {
            clearTimeout(hideTimer);
        }
        if (redirectTimer) {
            clearTimeout(redirectTimer);
        }

        toast.classList.remove('is-visible');
        void toast.offsetWidth;
        toast.classList.add('is-visible');

        hideTimer = setTimeout(() => {
            toast.classList.remove('is-visible');
        }, 10000);

        redirectTimer = setTimeout(() => {
            window.location.href = 'ingresar.html';
        }, 10000);
    });
});
