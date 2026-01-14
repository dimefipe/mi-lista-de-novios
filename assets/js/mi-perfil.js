document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('qr-modal');
    if (!modal) return;

    const openBtn = document.querySelector('[data-qr-open]');
    const closeButtons = modal.querySelectorAll('[data-qr-close]');
    const passwordToggles = document.querySelectorAll('[data-password-toggle]');
    const copyButtons = document.querySelectorAll('.profile__url-copy');
    const toast = document.getElementById('profile-toast');
    let closeTimer = null;
    let toastTimer = null;

    const eyeIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
        </svg>
    `;

    const eyeOffIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925ZM11.7229 7.50857C11.8146 7.50299 11.9071 7.50016 12.0003 7.50016C14.4855 7.50016 16.5003 9.51488 16.5003 12.0002C16.5003 12.0933 16.4974 12.1858 16.4919 12.2775L11.7229 7.50857Z"></path>
        </svg>
    `;

    const openModal = () => {
        if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
        }
        requestAnimationFrame(() => {
            modal.classList.add('is-open');
        });
        modal.classList.remove('is-closing');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.classList.add('is-closing');
        closeTimer = window.setTimeout(() => {
            modal.classList.remove('is-closing');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }, 260);
    };

    if (openBtn) {
        openBtn.addEventListener('click', openModal);
    }

    closeButtons.forEach((btn) => btn.addEventListener('click', closeModal));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    passwordToggles.forEach((toggle) => {
        const wrapper = toggle.closest('.profile__input-wrap');
        const input = wrapper ? wrapper.querySelector('input') : null;
        if (!input) return;

        const setState = (visible) => {
            input.type = visible ? 'text' : 'password';
            toggle.classList.toggle('is-active', visible);
            toggle.setAttribute('aria-label', visible ? 'Ocultar contrasena' : 'Mostrar contrasena');
            toggle.innerHTML = visible ? eyeOffIcon : eyeIcon;
        };

        setState(false);
        toggle.addEventListener('click', () => setState(input.type === 'password'));
    });

    const fileInputs = document.querySelectorAll('.profile__media-input');
    const bannerInput = document.getElementById('perfil-banner');
    const avatarInput = document.getElementById('perfil-foto');
    const previewBanner = document.querySelector('.profile-preview__banner img');
    const previewAvatar = document.querySelector('.profile-preview__avatar img');
    const previewNames = document.querySelector('.profile-preview__names');
    const previewDate = document.querySelector('.profile-preview__badge span');
    const previewMessage = document.querySelector('.profile-preview__message');
    const headerInput = document.getElementById('perfil-encabezado-texto');
    const novioInput = document.getElementById('perfil-novio');
    const novioApellidoInput = document.getElementById('perfil-apellido-novio');
    const noviaInput = document.getElementById('perfil-novia');
    const noviaApellidoInput = document.getElementById('perfil-apellido-novia');
    const fechaInput = document.getElementById('perfil-fecha');
    const mensajeInput = document.getElementById('perfil-mensaje');
    const separatorInputs = document.querySelectorAll('input[name="perfil-encabezado"]');

    const defaultText = (element, key, fallback) => {
        if (!element) return fallback;
        if (!element.dataset[key]) {
            element.dataset[key] = element.textContent || fallback || '';
        }
        return element.dataset[key];
    };

    const defaultSrc = (element) => {
        if (!element) return '';
        if (!element.dataset.defaultSrc) {
            element.dataset.defaultSrc = element.getAttribute('src') || '';
        }
        return element.dataset.defaultSrc;
    };

    const setPreviewImage = (element, file) => {
        if (!element) return;
        if (element.dataset.objectUrl) {
            URL.revokeObjectURL(element.dataset.objectUrl);
            delete element.dataset.objectUrl;
        }

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            element.dataset.objectUrl = objectUrl;
            element.src = objectUrl;
        } else {
            element.src = defaultSrc(element);
        }
    };

    const updateFileState = (input) => {
        const card = input.closest('.profile__media-card');
        if (!card) return;

        const filename = card.querySelector('.profile__media-filename');
        const clearButton = card.querySelector('.profile__media-clear');
        if (!filename || !clearButton) return;

        const file = input.files && input.files[0];
        if (file) {
            filename.textContent = file.name;
            filename.title = file.name;
            card.classList.add('is-selected');
            clearButton.disabled = false;
        } else {
            filename.textContent = 'Sin archivo seleccionado';
            filename.removeAttribute('title');
            card.classList.remove('is-selected');
            clearButton.disabled = true;
        }
    };

    fileInputs.forEach((input) => {
        updateFileState(input);
        input.addEventListener('change', () => {
            updateFileState(input);
            if (input === bannerInput) {
                const file = input.files && input.files[0];
                setPreviewImage(previewBanner, file || null);
            }
            if (input === avatarInput) {
                const file = input.files && input.files[0];
                setPreviewImage(previewAvatar, file || null);
            }
        });

        const card = input.closest('.profile__media-card');
        const clearButton = card ? card.querySelector('.profile__media-clear') : null;
        if (!clearButton) return;

        clearButton.addEventListener('click', () => {
            input.value = '';
            updateFileState(input);
            if (input === bannerInput) {
                setPreviewImage(previewBanner, null);
            }
            if (input === avatarInput) {
                setPreviewImage(previewAvatar, null);
            }
        });
    });

    const getSeparatorMode = () => {
        for (const input of separatorInputs) {
            if (input.checked) {
                const label = input.closest('label');
                const text = label ? label.querySelector('span')?.textContent?.trim() : '';
                if (text.toLowerCase() === 'personalizado') {
                    return { mode: 'custom', separator: '' };
                }
                return { mode: 'auto', separator: text || 'y' };
            }
        }
        return { mode: 'auto', separator: 'y' };
    };

    const buildFullName = (nombre, apellido) => {
        const parts = [];
        if (nombre) parts.push(nombre);
        if (apellido) parts.push(apellido);
        return parts.join(' ').trim();
    };

    const updateNamesPreview = () => {
        if (!previewNames) return;
        const { mode, separator } = getSeparatorMode();
        const fallback = defaultText(previewNames, 'defaultText', '');

        if (mode === 'custom') {
            const custom = headerInput ? headerInput.value.trim() : '';
            previewNames.textContent = custom || fallback;
            return;
        }

        const novio = buildFullName(novioInput?.value?.trim() || '', novioApellidoInput?.value?.trim() || '');
        const novia = buildFullName(noviaInput?.value?.trim() || '', noviaApellidoInput?.value?.trim() || '');
        const sepText = separator ? ` ${separator} ` : ' ';
        const composed = [novio, novia].filter(Boolean).join(sepText).trim();
        previewNames.textContent = composed || fallback;
    };

    const updateDatePreview = () => {
        if (!previewDate || !fechaInput) return;
        const fallback = defaultText(previewDate, 'defaultText', '');
        const value = fechaInput.value;
        if (!value) {
            previewDate.textContent = fallback;
            return;
        }

        const [year, month, day] = value.split('-');
        const months = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        const monthIndex = Number(month) - 1;
        if (monthIndex < 0 || monthIndex >= months.length) {
            previewDate.textContent = fallback;
            return;
        }
        const monthName = months[monthIndex];
        const capitalized = `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)}`;
        previewDate.textContent = `${Number(day)} de ${capitalized} del ${year}`;
    };

    const updateMessagePreview = () => {
        if (!previewMessage || !mensajeInput) return;
        const fallback = defaultText(previewMessage, 'defaultText', '');
        const value = mensajeInput.value.trim();
        previewMessage.textContent = value || fallback;
    };

    if (headerInput) headerInput.addEventListener('input', updateNamesPreview);
    if (novioInput) novioInput.addEventListener('input', updateNamesPreview);
    if (novioApellidoInput) novioApellidoInput.addEventListener('input', updateNamesPreview);
    if (noviaInput) noviaInput.addEventListener('input', updateNamesPreview);
    if (noviaApellidoInput) noviaApellidoInput.addEventListener('input', updateNamesPreview);
    if (fechaInput) fechaInput.addEventListener('input', updateDatePreview);
    if (mensajeInput) mensajeInput.addEventListener('input', updateMessagePreview);
    separatorInputs.forEach((input) => input.addEventListener('change', updateNamesPreview));

    updateNamesPreview();
    updateDatePreview();
    updateMessagePreview();

    const showToast = (message) => {
        if (!toast) return;
        if (toastTimer) {
            clearTimeout(toastTimer);
        }
        toast.textContent = message;
        toast.classList.add('is-visible');
        toastTimer = window.setTimeout(() => {
            toast.classList.remove('is-visible');
        }, 2200);
    };

    const copyUrl = async (button) => {
        if (!button) return;
        const field = button.closest('.profile__field');
        const prefix = field ? field.querySelector('.profile__url-prefix') : document.querySelector('.profile__url-prefix');
        const input = field ? field.querySelector('#perfil-url') : document.getElementById('perfil-url');
        if (!prefix || !input) return;

        const base = prefix.textContent.trim();
        const slug = input.value.trim().replace(/^\/+/, '');
        const fullUrl = `${base}${slug}`;

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(fullUrl);
            } else {
                const tempInput = document.createElement('input');
                tempInput.value = fullUrl;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                tempInput.remove();
            }
            showToast('URL copiada correctamente');
        } catch (error) {
            showToast('No se pudo copiar la URL');
        }
    };

    copyButtons.forEach((button) => {
        button.addEventListener('click', () => copyUrl(button));
    });
});
