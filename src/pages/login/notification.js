const notifications = document.querySelector(".notifications");

const toastDetails = {
    timer: 5000,
    success: {
        icon: 'fa-circle-check',
        text: 'Sucesso: Esta é uma notificação de sucesso.',
    },
    error: {
        icon: 'fa-circle-xmark',
        text: 'Erro: Esta é uma notificação de erro.',
    },
    warning: {
        icon: 'fa-triangle-exclamation',
        text: 'Aviso: Esta é uma notificação de aviso.',
    },
    info: {
        icon: 'fa-circle-info',
        text: 'Informação: Esta é uma notificação de informação.',
    }
};

const removeToast = (toast) => {
    toast.classList.add("hide");
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    setTimeout(() => toast.remove(), 500);
};

const createToast = (id) => {
    const { icon, text } = toastDetails[id];
    const toast = document.createElement("li");
    toast.className = `toast ${id}`;
    toast.innerHTML = `<div class="column">
                            <i class="fa-solid ${icon}"></i>
                            <span>${text}</span>
                        </div>
                        <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
    notifications.appendChild(toast);
    toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
};
