function aplicarTamañoBtn() {
  // Selecciona todos los botones con clases btn, btn-16, btn-20 o btn-24
  const botones = document.querySelectorAll('.btn, .btn-16, .btn-20, .btn-24');
  
  botones.forEach((btn) => {
    const altura = btn.offsetHeight;
    // Solo actualizar si la altura es válida (mayor a 20px)
    // Evita sobrescribir con 0px cuando el botón aún no está renderizado
    if (altura > 20) {
      const offset = `${altura / 2}px`;
      btn.style.setProperty('--offset', offset);
    }
  });
}

window.addEventListener('load', aplicarTamañoBtn);
window.addEventListener('resize', aplicarTamañoBtn);
