/**
 * Sistema de acordeón interactivo
 * Permite expandir/colapsar secciones de contenido
 */

document.addEventListener('DOMContentLoaded', function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.closest('.accordion-item');
            const accordionContent = accordionItem.querySelector('.accordion-content');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Cerrar todos los demás acordeones (opcional: comentar para permitir múltiples abiertos)
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    const otherItem = otherHeader.closest('.accordion-item');
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle del acordeón actual
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                accordionItem.classList.remove('active');
            } else {
                this.setAttribute('aria-expanded', 'true');
                accordionItem.classList.add('active');
            }
        });
        
        // Accesibilidad: soporte para teclado
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Opcional: abrir el primer ítem por defecto
    // const firstHeader = accordionHeaders[0];
    // if (firstHeader) {
    //     firstHeader.click();
    // }
});
