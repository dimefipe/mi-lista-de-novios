document.addEventListener('DOMContentLoaded', function() {
    const countEl = document.getElementById('gracias-count');
    const totalSeconds = 10;
    let current = totalSeconds;

    if (countEl) {
        countEl.textContent = String(current);
    }

    const interval = setInterval(function() {
        current -= 1;
        if (current <= 0) {
            clearInterval(interval);
            window.location.href = 'index.html';
            return;
        }
        if (countEl) {
            countEl.textContent = String(current);
        }
    }, 1000);
});
