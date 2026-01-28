document.addEventListener('DOMContentLoaded', () => {
    const modals = Array.from(document.querySelectorAll('.profile-modal'));
    const openButtons = document.querySelectorAll('[data-modal-open]');
    const closeButtons = document.querySelectorAll('[data-modal-close]');
    let closeTimer = null;
    let bodyPaddingRight = null;
    let deleteModal = null;
    let pendingDeleteRow = null;

    const setBodyLock = (locked) => {
        if (locked) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            if (bodyPaddingRight === null) {
                bodyPaddingRight = window.getComputedStyle(document.body).paddingRight;
            }
            const basePadding = Number.parseFloat(bodyPaddingRight) || 0;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = scrollbarWidth > 0 ? `${basePadding + scrollbarWidth}px` : `${basePadding}px`;
            document.body.style.setProperty('--scrollbar-comp', `${scrollbarWidth}px`);
            document.body.classList.add('is-scroll-locked');
            return;
        }
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.body.style.removeProperty('--scrollbar-comp');
        document.body.classList.remove('is-scroll-locked');
        bodyPaddingRight = null;
    };

    const closeAllEmojiMenus = () => {
        document.querySelectorAll('.emoji-picker.is-open').forEach((picker) => {
            picker.classList.remove('is-open');
            const toggle = picker.querySelector('[data-emoji-toggle]');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    };

    const syncEmojiToggleStates = () => {
        document.querySelectorAll('.gift-list__row').forEach((row) => {
            const isEditing = row.classList.contains('is-editing');
            const toggle = row.querySelector('[data-emoji-toggle]');
            const picker = row.querySelector('.emoji-picker');
            if (toggle) {
                toggle.disabled = !isEditing;
                if (!isEditing) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            }
            if (!isEditing && picker) {
                picker.classList.remove('is-open');
            }
        });
    };

    const openModal = (modal) => {
        if (!modal) return;
        if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
        }
        closeAllEmojiMenus();
        syncEmojiToggleStates();
        modal.classList.add('is-open');
        modal.classList.remove('is-closing');
        modal.setAttribute('aria-hidden', 'false');
        setBodyLock(true);
    };

    const closeModal = (modal) => {
        if (!modal) return;
        closeAllEmojiMenus();
        syncEmojiToggleStates();
        modal.classList.remove('is-open');
        modal.classList.add('is-closing');
        if (modal === deleteModal) {
            pendingDeleteRow = null;
        }
        closeTimer = window.setTimeout(() => {
            modal.classList.remove('is-closing');
            modal.setAttribute('aria-hidden', 'true');
            if (!document.querySelector('.profile-modal.is-open')) {
                setBodyLock(false);
            }
        }, 260);
    };

    const closeAllModals = () => {
        modals.forEach((modal) => {
            if (modal.classList.contains('is-open')) {
                closeModal(modal);
            }
        });
    };

    if (modals.length) {
        openButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-modal-open');
                const modal = document.getElementById(id);
                if (!modal) return;
                closeAllModals();
                openModal(modal);
            });
        });

        closeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const modal = button.closest('.profile-modal');
                if (!modal) return;
                closeModal(modal);
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            const openModalEl = document.querySelector('.profile-modal.is-open');
            if (openModalEl) {
                closeModal(openModalEl);
            }
        });
    }

    const listBody = document.querySelector('.gift-list__body');
    if (!listBody) return;
    const giftList = listBody.closest('.gift-list');
    const emptyState = giftList?.querySelector('[data-gift-empty]');
    deleteModal = document.getElementById('gift-delete-modal');
    const deleteName = deleteModal?.querySelector('[data-gift-delete-name]');
    const deleteQty = deleteModal?.querySelector('[data-gift-delete-qty]');
    const deletePrice = deleteModal?.querySelector('[data-gift-delete-price]');
    const deleteConfirmBtn = deleteModal?.querySelector('[data-gift-delete-confirm]');

    // Keep the emoji menu consistent across rows.
    const emojiOptions = [
        '💖', '✨', '🎉', '🎁', '🌸', '💫', '🥂', '💍', '🌙', '🍾',
        '💌', '🌿', '🏖️', '🏡', '🎶', '🎨', '🧳', '🍰', '🍷', '🌺',
        '🕯️', '🎈', '🍀', '💎', '💐', '💕', '💘', '💞', '💓', '💗',
        '💝', '💑', '👰', '🤵', '🤍', '🌷', '🌼', '🌻', '🌹', '🌱',
        '🍃', '🌊', '🌅', '🌞', '⭐️', '🌟', '🎆', '🎇', '🎊', '🎀',
        '🧸', '🕊️', '🧁', '🍫', '🥰', '😍', '😊', '😘', '🤗', '🙏',
        '🎵', '🎬', '📸', '🖼️', '🛋️', '🧺', '🍳', '🍽️', '🪴', '🪞',
        '🧵', '🪡', '✈️', '🚗', '🚲', '🏔️', '🏝️', '🎡', '🎢', '🎠',
        '🛍️', '🎮', '🎯', '🛁', '🧼', '🧹', '🛏️', '🕰️', '📚', '💡',
        '🔮', '🧿', '🌈', '🎹', '🎻', '🎺', '🎷', '🎤', '🎧', '🏆'
    ];

    const populateEmojiMenus = () => {
        const menus = document.querySelectorAll('.emoji-picker__menu');
        menus.forEach((menu) => {
            menu.innerHTML = '';
            emojiOptions.forEach((emoji) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'emoji-picker__item';
                button.dataset.emoji = emoji;
                button.textContent = emoji;
                menu.appendChild(button);
            });
        });
    };

    populateEmojiMenus();

    const rows = Array.from(listBody.querySelectorAll('.gift-list__row'));
    const handles = Array.from(listBody.querySelectorAll('.gift-list__drag'));
    const totalAmount = document.getElementById('gift-total-amount');
    let draggingRow = null;

    const normalizeNumber = (value) => (value || '').toString().replace(/\D/g, '');

    const formatCLP = (value) => {
        const normalized = normalizeNumber(value);
        if (!normalized) return '';
        const safe = Math.max(0, Math.round(Number(normalized)));
        return safe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const formatCLPWithSymbol = (value) => {
        const formatted = formatCLP(value);
        return `$${formatted || '0'}`;
    };

    const updateEmptyState = () => {
        if (!giftList || !emptyState) return;
        const hasRows = Boolean(listBody.querySelector('.gift-list__row'));
        giftList.classList.toggle('is-empty', !hasRows);
        emptyState.setAttribute('aria-hidden', hasRows.toString());
    };

    const giftCreateModal = document.getElementById('gift-create-modal');
    if (giftCreateModal) {
        const createSaveBtn = giftCreateModal.querySelector('[data-gift-create-save]');
        const modalMoneyInputs = giftCreateModal.querySelectorAll('[data-money="clp"]');
        modalMoneyInputs.forEach((input) => {
            const formatInput = () => {
                const raw = normalizeNumber(input.value);
                input.value = raw ? formatCLP(raw) : '';
            };
            formatInput();
            input.addEventListener('input', formatInput);
            input.addEventListener('blur', formatInput);
        });

        giftCreateModal.addEventListener('click', (event) => {
            const toggle = event.target.closest('[data-emoji-toggle]');
            if (toggle) {
                event.stopPropagation();
                const picker = toggle.closest('.emoji-picker');
                if (!picker) return;
                const isOpen = picker.classList.contains('is-open');
                closeAllEmojiMenus();
                if (!isOpen) {
                    picker.classList.add('is-open');
                    toggle.setAttribute('aria-expanded', 'true');
                }
                return;
            }

            const item = event.target.closest('.emoji-picker__item');
            if (item) {
                event.stopPropagation();
                const giftName = item.closest('.gift-name');
                const input = giftName?.querySelector('.gift-name__input');
                if (!input) return;
                const emoji = item.dataset.emoji || item.textContent || '';
                input.focus();
                const start = input.selectionStart ?? input.value.length;
                const end = input.selectionEnd ?? input.value.length;
                const value = input.value;
                input.value = value.slice(0, start) + emoji + value.slice(end);
                const caret = start + emoji.length;
                input.setSelectionRange(caret, caret);
                closeAllEmojiMenus();
                return;
            }

            const button = event.target.closest('.qty-btn');
            if (!button) return;
            const control = button.closest('.qty-control');
            const input = control?.querySelector('[data-qty-input]');
            if (!input) return;

            const min = input.min ? Number(input.min) : 0;
            const step = input.step ? Number(input.step) : 1;
            let value = Number(input.value) || 0;
            if (button.dataset.qtyAction === 'increase') {
                value += step;
            } else {
                value -= step;
            }
            if (value < min) value = min;
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });

        if (createSaveBtn) {
            createSaveBtn.addEventListener('click', () => {
                const nameInput = giftCreateModal.querySelector('.gift-name__input');
                const qtyInput = giftCreateModal.querySelector('[data-qty-input]');
                const priceInput = giftCreateModal.querySelector('[data-money="clp"]');

                const name = nameInput?.value?.trim() || '';
                const qty = Number(qtyInput?.value) || 1;
                const price = normalizeNumber(priceInput?.value) || '0';

                if (!name) {
                    nameInput?.focus();
                    return;
                }

                const rowId = `regalo-${Date.now()}`;
                const newRow = document.createElement('div');
                newRow.className = 'gift-list__row';
                newRow.innerHTML = `
                    <button class="gift-list__drag" type="button" aria-label="Reordenar">
                        <i class="ri-draggable" aria-hidden="true"></i>
                    </button>
                    <div class="gift-list__field gift-list__field--name">
                        <label class="sr-only" for="${rowId}">Regalo o deseo</label>
                        <div class="gift-name">
                            <input class="profile__input gift-name__input" id="${rowId}" type="text" value="${name.replace(/"/g, '&quot;')}" readonly tabindex="-1" aria-readonly="true">
                            <div class="emoji-picker">
                                <button class="emoji-picker__toggle" type="button" aria-label="Agregar emoji" aria-expanded="false" data-emoji-toggle disabled>
                                    <i class="ri-emoji-sticker-line" aria-hidden="true"></i>
                                </button>
                                <div class="emoji-picker__menu" role="listbox" aria-label="Emojis"></div>
                            </div>
                        </div>
                    </div>
                    <div class="gift-list__field gift-list__field--qty">
                        <div class="qty-control">
                            <button class="qty-btn" type="button" data-qty-action="decrease" aria-label="Disminuir cantidad">
                                <i class="ri-subtract-line" aria-hidden="true"></i>
                            </button>
                            <input class="profile__input qty-input" type="number" min="1" value="${qty}" data-qty-input readonly tabindex="-1" aria-readonly="true">
                            <button class="qty-btn" type="button" data-qty-action="increase" aria-label="Aumentar cantidad">
                                <i class="ri-add-line" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                    <div class="gift-list__field gift-list__field--price">
                        <div class="money-input">
                            <span class="money-prefix">$</span>
                            <input class="profile__input money-input__field" type="text" value="${formatCLP(price)}" data-money="clp" readonly tabindex="-1" aria-readonly="true">
                        </div>
                    </div>
                    <div class="gift-list__actions">
                        <button class="gift-list__icon-btn gift-list__toggle-btn" type="button" data-gift-toggle="edit" aria-label="Editar regalo">
                            <i class="ri-pencil-line" aria-hidden="true"></i>
                        </button>
                        <button class="gift-list__icon-btn gift-list__icon-btn--danger" type="button" data-gift-delete aria-label="Eliminar regalo">
                            <i class="ri-delete-bin-line" aria-hidden="true"></i>
                        </button>
                    </div>
                `;

                listBody.prepend(newRow);
                populateEmojiMenus();
                initNewRow(newRow);
                updateTotal();

                if (nameInput) nameInput.value = '';
                if (qtyInput) qtyInput.value = '';
                if (priceInput) priceInput.value = '';
                closeModal(giftCreateModal);
            });
        }
    }

    const getRowNumbers = (row) => {
        const qtyInput = row.querySelector('[data-qty-input]');
        const priceInput = row.querySelector('[data-money="clp"]');
        const qty = Number(qtyInput?.value) || 0;
        const price = Number(normalizeNumber(priceInput?.value)) || 0;
        return { qty, price };
    };

    const updateTotal = () => {
        const currentRows = Array.from(listBody.querySelectorAll('.gift-list__row'));
        const sum = currentRows.reduce((acc, row) => {
            const { qty, price } = getRowNumbers(row);
            return acc + qty * price;
        }, 0);
        if (totalAmount) {
            totalAmount.textContent = formatCLPWithSymbol(sum);
        }
        updateEmptyState();
    };

    const getRowSummary = (row) => {
        const name = row.querySelector('.gift-name__input')?.value?.trim() || 'Regalo sin nombre';
        const { qty, price } = getRowNumbers(row);
        return {
            name,
            qty,
            price: formatCLPWithSymbol(price)
        };
    };

    const openDeleteModal = (row) => {
        if (!deleteModal) return;
        closeAllModals();
        pendingDeleteRow = row;
        const summary = getRowSummary(row);
        if (deleteName) deleteName.textContent = summary.name;
        if (deleteQty) deleteQty.textContent = summary.qty.toString();
        if (deletePrice) deletePrice.textContent = summary.price;
        openModal(deleteModal);
    };

    const setRowEditing = (row, isEditing) => {
        row.classList.toggle('is-editing', isEditing);
        const toggleBtn = row.querySelector('.gift-list__toggle-btn');
        if (toggleBtn) {
            if (isEditing) {
                toggleBtn.dataset.giftToggle = 'save';
                toggleBtn.classList.add('gift-list__icon-btn--save');
                toggleBtn.setAttribute('aria-label', 'Guardar regalo');
                toggleBtn.innerHTML = '<i class="ri-save-3-line" aria-hidden="true"></i>';
            } else {
                toggleBtn.dataset.giftToggle = 'edit';
                toggleBtn.classList.remove('gift-list__icon-btn--save');
                toggleBtn.setAttribute('aria-label', 'Editar regalo');
                toggleBtn.innerHTML = '<i class="ri-pencil-line" aria-hidden="true"></i>';
            }
        }

        const inputs = row.querySelectorAll('.profile__input');
        inputs.forEach((input) => {
            input.readOnly = !isEditing;
            input.tabIndex = isEditing ? 0 : -1;
            input.setAttribute('aria-readonly', (!isEditing).toString());
        });

        const moneyInputs = row.querySelectorAll('[data-money="clp"]');
        moneyInputs.forEach((input) => {
            const raw = normalizeNumber(input.value);
            input.value = raw ? formatCLP(raw) : '';
        });

        const emojiToggle = row.querySelector('[data-emoji-toggle]');
        const emojiPicker = row.querySelector('.emoji-picker');
        if (emojiToggle) {
            emojiToggle.disabled = !isEditing;
            emojiToggle.setAttribute('aria-expanded', 'false');
        }
        if (emojiPicker && !isEditing) {
            emojiPicker.classList.remove('is-open');
        }
    };

    const getDragAfterElement = (container, y) => {
        const draggableElements = [...container.querySelectorAll('.gift-list__row:not(.is-dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            }
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    };

    rows.forEach((row) => {
        row.setAttribute('draggable', 'false');
        setRowEditing(row, row.classList.contains('is-editing'));

        const toggleBtn = row.querySelector('.gift-list__toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const shouldEdit = toggleBtn.dataset.giftToggle === 'edit';
                setRowEditing(row, shouldEdit);
                if (!shouldEdit) {
                    updateTotal();
                }
            });
        }

        const numberInputs = row.querySelectorAll('[data-qty-input]');
        numberInputs.forEach((input) => {
            input.addEventListener('input', updateTotal);
        });

        const moneyInputs = row.querySelectorAll('[data-money="clp"]');
        moneyInputs.forEach((input) => {
            const formatInput = () => {
                const raw = normalizeNumber(input.value);
                input.value = raw ? formatCLP(raw) : '';
            };
            formatInput();
            input.addEventListener('input', () => {
                formatInput();
                updateTotal();
            });
            input.addEventListener('blur', () => {
                formatInput();
                updateTotal();
            });
        });
    });

    const triggerEditShake = (row) => {
        const toggleBtn = row.querySelector('.gift-list__toggle-btn[data-gift-toggle="edit"]');
        if (!toggleBtn) return;
        toggleBtn.classList.remove('is-shaking');
        void toggleBtn.offsetWidth;
        toggleBtn.classList.add('is-shaking');
    };

    listBody.addEventListener('pointerdown', (event) => {
        const target = event.target.closest('.profile__input, .qty-btn, .money-input, .qty-control, [data-emoji-toggle], .emoji-picker__item');
        if (!target) return;
        const row = target.closest('.gift-list__row');
        if (!row || row.classList.contains('is-editing')) return;
        event.preventDefault();
        triggerEditShake(row);
    });

    listBody.addEventListener('focusin', (event) => {
        const target = event.target.closest('.profile__input');
        if (!target) return;
        const row = target.closest('.gift-list__row');
        if (!row || row.classList.contains('is-editing')) return;
        target.blur();
        triggerEditShake(row);
    });

    listBody.addEventListener('click', (event) => {
        const toggle = event.target.closest('[data-emoji-toggle]');
        if (toggle) {
            event.stopPropagation();
            const row = toggle.closest('.gift-list__row');
            if (!row) return;
            if (!row.classList.contains('is-editing')) {
                triggerEditShake(row);
                return;
            }
            const picker = toggle.closest('.emoji-picker');
            if (!picker) return;
            const isOpen = picker.classList.contains('is-open');
            closeAllEmojiMenus();
            if (!isOpen) {
                picker.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
            }
            return;
        }

        const item = event.target.closest('.emoji-picker__item');
        if (item) {
            event.stopPropagation();
            const row = item.closest('.gift-list__row');
            if (!row) return;
            if (!row.classList.contains('is-editing')) {
                triggerEditShake(row);
                return;
            }
            const input = row.querySelector('.gift-name__input');
            if (!input) return;
            const emoji = item.dataset.emoji || item.textContent || '';
            input.focus();
            const start = input.selectionStart ?? input.value.length;
            const end = input.selectionEnd ?? input.value.length;
            const value = input.value;
            input.value = value.slice(0, start) + emoji + value.slice(end);
            const caret = start + emoji.length;
            input.setSelectionRange(caret, caret);
            closeAllEmojiMenus();
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target.closest('.emoji-picker')) return;
        closeAllEmojiMenus();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        closeAllEmojiMenus();
    });

    listBody.addEventListener('click', (event) => {
        const button = event.target.closest('.qty-btn');
        if (!button) return;
        const row = button.closest('.gift-list__row');
        if (!row || !row.classList.contains('is-editing')) return;
        const input = row.querySelector('[data-qty-input]');
        if (!input) return;

        const min = input.min ? Number(input.min) : 0;
        const step = input.step ? Number(input.step) : 1;
        let value = Number(input.value) || 0;
        if (button.dataset.qtyAction === 'increase') {
            value += step;
        } else {
            value -= step;
        }
        if (value < min) value = min;
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    listBody.addEventListener('click', (event) => {
        const deleteBtn = event.target.closest('[data-gift-delete], .gift-list__icon-btn--danger');
        if (!deleteBtn) return;
        const row = deleteBtn.closest('.gift-list__row');
        if (!row) return;
        openDeleteModal(row);
    });

    handles.forEach((handle) => {
        handle.setAttribute('draggable', 'true');

        handle.addEventListener('dragstart', (event) => {
            const row = handle.closest('.gift-list__row');
            if (!row) return;
            draggingRow = row;
            row.classList.add('is-dragging');
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', '');
            if (event.dataTransfer.setDragImage) {
                event.dataTransfer.setDragImage(row, 24, 24);
            }
        });

        handle.addEventListener('dragend', () => {
            if (draggingRow) {
                draggingRow.classList.remove('is-dragging');
            }
            draggingRow = null;
        });
    });

    listBody.addEventListener('dragover', (event) => {
        if (!draggingRow) return;
        event.preventDefault();
        const afterElement = getDragAfterElement(listBody, event.clientY);
        if (!afterElement) {
            listBody.appendChild(draggingRow);
            return;
        }
        listBody.insertBefore(draggingRow, afterElement);
    });

    listBody.addEventListener('drop', (event) => {
        if (!draggingRow) return;
        event.preventDefault();
        draggingRow.classList.remove('is-dragging');
        draggingRow = null;
    });

    if (deleteConfirmBtn) {
        deleteConfirmBtn.addEventListener('click', () => {
            if (!pendingDeleteRow) {
                closeModal(deleteModal);
                return;
            }
            const row = pendingDeleteRow;
            pendingDeleteRow = null;
            row.remove();
            updateTotal();
            closeModal(deleteModal);
        });
    }

    const initNewRow = (row) => {
        row.setAttribute('draggable', 'false');
        setRowEditing(row, false);

        const toggleBtn = row.querySelector('.gift-list__toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const shouldEdit = toggleBtn.dataset.giftToggle === 'edit';
                setRowEditing(row, shouldEdit);
                if (!shouldEdit) {
                    updateTotal();
                }
            });
        }

        const numberInputs = row.querySelectorAll('[data-qty-input]');
        numberInputs.forEach((input) => {
            input.addEventListener('input', updateTotal);
        });

        const moneyInputs = row.querySelectorAll('[data-money="clp"]');
        moneyInputs.forEach((input) => {
            const formatInput = () => {
                const raw = normalizeNumber(input.value);
                input.value = raw ? formatCLP(raw) : '';
            };
            formatInput();
            input.addEventListener('input', () => {
                formatInput();
                updateTotal();
            });
            input.addEventListener('blur', () => {
                formatInput();
                updateTotal();
            });
        });

        const handle = row.querySelector('.gift-list__drag');
        if (handle) {
            handle.setAttribute('draggable', 'true');
            handle.addEventListener('dragstart', (event) => {
                draggingRow = row;
                row.classList.add('is-dragging');
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', '');
                if (event.dataTransfer.setDragImage) {
                    event.dataTransfer.setDragImage(row, 24, 24);
                }
            });
            handle.addEventListener('dragend', () => {
                if (draggingRow) {
                    draggingRow.classList.remove('is-dragging');
                }
                draggingRow = null;
            });
        }
    };

    const giftSuggestModal = document.getElementById('gift-suggest-modal');
    if (giftSuggestModal) {
        const suggestMoneyInputs = giftSuggestModal.querySelectorAll('[data-money="clp"]');
        suggestMoneyInputs.forEach((input) => {
            const formatInput = () => {
                const raw = normalizeNumber(input.value);
                input.value = raw ? formatCLP(raw) : '';
            };
            formatInput();
            input.addEventListener('input', formatInput);
            input.addEventListener('blur', formatInput);
        });

        giftSuggestModal.addEventListener('click', (event) => {
            const toggle = event.target.closest('[data-emoji-toggle]');
            if (toggle) {
                event.stopPropagation();
                const picker = toggle.closest('.emoji-picker');
                if (!picker) return;
                const isOpen = picker.classList.contains('is-open');
                closeAllEmojiMenus();
                if (!isOpen) {
                    picker.classList.add('is-open');
                    toggle.setAttribute('aria-expanded', 'true');
                }
                return;
            }

            const item = event.target.closest('.emoji-picker__item');
            if (item) {
                event.stopPropagation();
                const giftName = item.closest('.gift-name');
                const input = giftName?.querySelector('.gift-name__input');
                if (!input) return;
                const emoji = item.dataset.emoji || item.textContent || '';
                input.focus();
                const start = input.selectionStart ?? input.value.length;
                const end = input.selectionEnd ?? input.value.length;
                const value = input.value;
                input.value = value.slice(0, start) + emoji + value.slice(end);
                const caret = start + emoji.length;
                input.setSelectionRange(caret, caret);
                closeAllEmojiMenus();
                return;
            }

            const qtyButton = event.target.closest('.qty-btn');
            if (qtyButton) {
                const control = qtyButton.closest('.qty-control');
                const input = control?.querySelector('[data-qty-input]');
                if (!input) return;

                const min = input.min ? Number(input.min) : 0;
                const step = input.step ? Number(input.step) : 1;
                let value = Number(input.value) || 0;
                if (qtyButton.dataset.qtyAction === 'increase') {
                    value += step;
                } else {
                    value -= step;
                }
                if (value < min) value = min;
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                return;
            }

            const addButton = event.target.closest('[data-suggestion-add]');
            if (addButton) {
                const suggestion = addButton.closest('.gift-suggestion');
                if (!suggestion) return;

                const nameInput = suggestion.querySelector('.gift-name__input');
                const qtyInput = suggestion.querySelector('[data-qty-input]');
                const priceInput = suggestion.querySelector('[data-money="clp"]');

                const name = nameInput?.value?.trim() || '';
                const qty = Number(qtyInput?.value) || 1;
                const price = normalizeNumber(priceInput?.value) || '0';

                if (!name) {
                    nameInput?.focus();
                    return;
                }

                const rowId = `regalo-${Date.now()}`;
                const newRow = document.createElement('div');
                newRow.className = 'gift-list__row';
                newRow.innerHTML = `
                    <button class="gift-list__drag" type="button" aria-label="Reordenar">
                        <i class="ri-draggable" aria-hidden="true"></i>
                    </button>
                    <div class="gift-list__field gift-list__field--name">
                        <label class="sr-only" for="${rowId}">Regalo o deseo</label>
                        <div class="gift-name">
                            <input class="profile__input gift-name__input" id="${rowId}" type="text" value="${name.replace(/"/g, '&quot;')}" readonly tabindex="-1" aria-readonly="true">
                            <div class="emoji-picker">
                                <button class="emoji-picker__toggle" type="button" aria-label="Agregar emoji" aria-expanded="false" data-emoji-toggle disabled>
                                    <i class="ri-emoji-sticker-line" aria-hidden="true"></i>
                                </button>
                                <div class="emoji-picker__menu" role="listbox" aria-label="Emojis"></div>
                            </div>
                        </div>
                    </div>
                    <div class="gift-list__field gift-list__field--qty">
                        <div class="qty-control">
                            <button class="qty-btn" type="button" data-qty-action="decrease" aria-label="Disminuir cantidad">
                                <i class="ri-subtract-line" aria-hidden="true"></i>
                            </button>
                            <input class="profile__input qty-input" type="number" min="1" value="${qty}" data-qty-input readonly tabindex="-1" aria-readonly="true">
                            <button class="qty-btn" type="button" data-qty-action="increase" aria-label="Aumentar cantidad">
                                <i class="ri-add-line" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                    <div class="gift-list__field gift-list__field--price">
                        <div class="money-input">
                            <span class="money-prefix">$</span>
                            <input class="profile__input money-input__field" type="text" value="${formatCLP(price)}" data-money="clp" readonly tabindex="-1" aria-readonly="true">
                        </div>
                    </div>
                    <div class="gift-list__actions">
                        <button class="gift-list__icon-btn gift-list__toggle-btn" type="button" data-gift-toggle="edit" aria-label="Editar regalo">
                            <i class="ri-pencil-line" aria-hidden="true"></i>
                        </button>
                        <button class="gift-list__icon-btn gift-list__icon-btn--danger" type="button" data-gift-delete aria-label="Eliminar regalo">
                            <i class="ri-delete-bin-line" aria-hidden="true"></i>
                        </button>
                    </div>
                `;

                listBody.prepend(newRow);
                populateEmojiMenus();
                initNewRow(newRow);
                updateTotal();

                addButton.textContent = 'Agregado';
                addButton.disabled = true;
                setTimeout(() => {
                    addButton.textContent = 'Agregar';
                    addButton.disabled = false;
                }, 1500);
            }
        });
    }

    updateTotal();
});
