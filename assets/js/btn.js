function aplicarTamañoBtn() {
  // Selecciona todos los botones con clases btn, btn-16, btn-20 o btn-24
  const botones = document.querySelectorAll('.btn, .btn-16, .btn-20, .btn-24');
  
  botones.forEach((btn) => {
    const altura = btn.offsetHeight;
    const offset = `${altura / 2}px`;
    btn.style.setProperty('--offset', offset);
  });
}

window.addEventListener('load', aplicarTamañoBtn);
window.addEventListener('resize', aplicarTamañoBtn);
