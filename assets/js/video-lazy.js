/**
 * Sistema de carga lazy para videos de YouTube
 * Mejora el performance inicial al cargar el iframe solo cuando el usuario hace click
 */

document.addEventListener('DOMContentLoaded', function() {
    const videoContainers = document.querySelectorAll('[data-video-id]');
    
    videoContainers.forEach(container => {
        const playBtn = container.querySelector('.video-play-btn');
        const thumbnail = container.querySelector('.video-thumbnail');
        
        if (!playBtn || !thumbnail) return;
        
        // Función para cargar el video
        function loadVideo() {
            const videoId = container.getAttribute('data-video-id');
            
            // Crear iframe de YouTube
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('title', 'Video de YouTube');
            
            // Ocultar thumbnail y botón con fade out
            thumbnail.style.transition = 'opacity 0.3s ease';
            thumbnail.style.opacity = '0';
            playBtn.style.transition = 'opacity 0.3s ease';
            playBtn.style.opacity = '0';
            
            // Después del fade out, insertar iframe y eliminar elementos
            setTimeout(() => {
                container.appendChild(iframe);
                thumbnail.remove();
                playBtn.remove();
            }, 300);
        }
        
        // Event listeners
        playBtn.addEventListener('click', loadVideo);
        container.addEventListener('click', function(e) {
            // Solo activar si el click es en el contenedor o thumbnail, no en el botón
            if (e.target === container || e.target === thumbnail) {
                loadVideo();
            }
        });
        
        // Accesibilidad: Enter key en el botón
        playBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                loadVideo();
            }
        });
    });
});
