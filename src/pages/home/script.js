import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAW90peRv9HIfVheM5PsO9VQgRQ17PfmAg",
    authDomain: "oxente-e-app.firebaseapp.com",
    databaseURL: "https://oxente-e-app-default-rtdb.firebaseio.com",
    projectId: "oxente-e-app",
    storageBucket: "oxente-e-app.appspot.com",
    messagingSenderId: "591177999966",
    appId: "1:591177999966:web:6e397a064e81a66f7976cf",
    measurementId: "G-KTN0TVPXGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const dataPath = 'siteData';

let currentData = {
    hero: {
        image: "",
        title: "Vilma Silva",
        subtitle: "Fotógrafa de Comida",
        button: {
            text: "Orçamentos",
            whatsapp: "",
            message: ""
        }
    },
    banner: {
        image: "",
        title: "Meu Portifólio",
        subtitle: "Em Forma de menu",
        titleScreen: "Cardápio"
    },
    categories: [],
    services: [],
    faqs: [],
    about: {
        title: "Sobre Vilma Silva",
        description: "Fotógrafa especializada em gastronomia com mais de 10 anos de experiência.",
        experience: "10+ anos",
        specialties: ["Fotografia de Comida", "Food Styling", "Fotografia Publicitária"]
    },
    contact: {
        phone: "",
        email: "contato@vilmasilva.com.br",
        instagram: ""
    },
    testimonials: [],
    settings: {
        theme: {
            primaryColor: "#000000",
            secondaryColor: "#ffffff",
            font: "Arial"
        },
        features: {
            enableServices: true,
            enableFaqs: true,
            enableSplash: true
        },
        showPrices: true,
        enableContact: true
    },
    metadata: {
        lastUpdated: Date.now(),
        version: 1,
        createdBy: "admin",
        status: "active"
    }
};

// Tab Management
function switchScreen(targetScreen) {
    console.log('Switching to screen:', targetScreen);
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const screenEl = document.getElementById(targetScreen);
    const btnEl = document.querySelector(`[data-screen="${targetScreen}"]`);
    if (screenEl && btnEl) {
        screenEl.classList.add('active');
        btnEl.classList.add('active');
        if (targetScreen === 'meusite') loadData();
    } else {
        console.error('Screen or button not found:', { screenEl, btnEl, targetScreen });
    }
}

// Navigation Event Listeners
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetScreen = button.getAttribute('data-screen');
        switchScreen(targetScreen);
    });
});

// Profile Dropdown Toggle
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');
if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', () => profileDropdown.classList.toggle('active'));
    document.addEventListener('click', (e) => {
        if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function updateStats() {
    const totalImages = currentData.categories.reduce((total, cat) => total + (cat?.gallery?.length || 0), 0) +
        (currentData?.hero?.image ? 1 : 0) +
        (currentData?.banner?.image ? 1 : 0);
    const totalCategoriesEl = document.getElementById('total-categories');
    const totalImagesEl = document.getElementById('total-images');
    const storageEl = document.getElementById('storage-usage');
    const dataVersionEl = document.getElementById('data-version');
    if (totalCategoriesEl) totalCategoriesEl.textContent = currentData?.categories?.length || 0;
    if (totalImagesEl) totalImagesEl.textContent = totalImages;
    if (storageEl) storageEl.textContent = `${(totalImages * 0.5).toFixed(1)} MB`;
    if (dataVersionEl) dataVersionEl.textContent = currentData?.metadata?.version || 1;
}

// Input Validation
function validateInputs() {
    const whatsapp = document.getElementById('hero-whatsapp');
    const title = document.getElementById('hero-title');
    let isValid = true;
    if (title) {
        title.classList.remove('input-error', 'input-success');
        if (!title.value.trim()) {
            showNotification('O título principal é obrigatório', 'error');
            title.classList.add('input-error');
            title.focus();
            isValid = false;
        } else {
            title.classList.add('input-success');
        }
    }
    if (whatsapp) {
        whatsapp.classList.remove('input-error', 'input-success');
        if (whatsapp.value && !/[0-9]{10,15}/.test(whatsapp.value)) {
            showNotification('Número de WhatsApp inválido', 'error');
            whatsapp.classList.add('input-error');
            whatsapp.focus();
            isValid = false;
        } else if (whatsapp.value) {
            whatsapp.classList.add('input-success');
        }
    }
    return isValid;
}

// Image Compression
async function compressImage(file, maxSizeKB = 4000, maxDimension = 1920, initialQuality = 0.85) {
    return new Promise((resolve, reject) => {
        console.log('Iniciando compressão:', {
            nome: file.name,
            tamanho: (file.size / 1024 / 1024).toFixed(2) + 'MB',
            tipo: file.type
        });

        if (!file.type.startsWith('image/')) {
            reject(new Error('Arquivo não é uma imagem válida'));
            return;
        }

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    let width = img.width;
                    let height = img.height;
                    let quality = initialQuality;
                    const maxAttempts = 10;

                    const tryCompress = (attempt = 0, currentDim = maxDimension) => {
                        if (attempt >= maxAttempts) {
                            reject(new Error('Não foi possível comprimir a imagem para menos de 4MB'));
                            return;
                        }

                        if (width > currentDim || height > currentDim) {
                            const ratio = Math.min(currentDim / width, currentDim / height);
                            width = Math.round(width * ratio);
                            height = Math.round(height * ratio);
                            console.log('Redimensionando para:', { width, height });
                        }
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);

                        const mimeType = file.type === 'image/png' ? 'image/jpeg' : file.type;
                        canvas.toBlob(
                            (blob) => {
                                if (!blob) {
                                    reject(new Error('Falha na compressão da imagem'));
                                    return;
                                }
                                const sizeKB = blob.size / 1024;
                                console.log('Tentativa:', { tentativa: attempt + 1, qualidade: quality, tamanhoKB: sizeKB.toFixed(2) });
                                if (sizeKB <= maxSizeKB) {
                                    const compressedFile = new File([blob], file.name, {
                                        type: mimeType,
                                        lastModified: Date.now()
                                    });
                                    console.log('Compressão concluída:', {
                                        tamanhoOriginal: (file.size / 1024 / 1024).toFixed(2) + 'MB',
                                        tamanhoFinal: (compressedFile.size / 1024 / 1024).toFixed(2) + 'MB'
                                    });
                                    resolve(compressedFile);
                                } else {
                                    quality = Math.max(0.1, quality - 0.1);
                                    const newDim = Math.round(currentDim * 0.9);
                                    tryCompress(attempt + 1, newDim > 400 ? newDim : currentDim);
                                }
                            },
                            mimeType,
                            quality
                        );
                    };

                    tryCompress();
                } catch (error) {
                    console.error('Erro no processamento:', error);
                    reject(new Error('Erro no processamento da imagem'));
                }
            };
            img.onerror = () => reject(new Error('Erro ao carregar a imagem'));
        };
        reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
        reader.readAsDataURL(file);
    });
}

// File Upload Functions
async function uploadImageToStorage(file, path) {
    console.log('Iniciando upload:', { nome: file.name, tamanho: (file.size / 1024 / 1024).toFixed(2) + 'MB' });
    try {
        showNotification('Otimizando imagem...', 'info');
        const compressedFile = await compressImage(file);
        console.log('Imagem comprimida:', {
            tamanhoOriginal: (file.size / 1024 / 1024).toFixed(2) + 'MB',
            tamanhoFinal: (compressedFile.size / 1024 / 1024).toFixed(2) + 'MB'
        });
        showNotification('Enviando imagem...', 'info');
        const fileName = `${Date.now()}_${compressedFile.name.replace(/[^a-zA-Z0-9._]/g, '-')}`;
        const imageRef = storageRef(storage, `${path}/${fileName}`);
        const snapshot = await uploadBytes(imageRef, compressedFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Upload concluído:', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Erro no upload:', error);
        throw new Error(error.message || 'Erro ao enviar imagem');
    }
}

function setupImageUpload(uploadArea, inputId, previewId, onUpload) {
    const input = document.getElementById(inputId) || uploadArea?.querySelector('input[type="file"]');
    const preview = document.getElementById(previewId);
    if (!input || !uploadArea) {
        console.error('Elementos de upload não encontrados:', { inputId, uploadArea });
        showNotification('Erro: Elementos de upload não encontrados', 'error');
        return;
    }
    uploadArea.addEventListener('click', () => input.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) handleImageUpload(files[0], uploadArea, preview, onUpload);
        else showNotification('Por favor, selecione uma imagem válida', 'error');
    });
    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleImageUpload(e.target.files[0], uploadArea, preview, onUpload);
    });
}

async function handleImageUpload(file, uploadArea, preview, onUpload) {
    const progressBar = uploadArea?.querySelector('.upload-progress-bar');
    const progress = uploadArea?.querySelector('.upload-progress');
    if (!progress || !progressBar || !uploadArea) {
        console.error('Elementos de progresso não encontrados');
        showNotification('Erro: Elementos de interface não carregados', 'error');
        return;
    }
    try {
        progress.style.display = 'block';
        progressBar.style.width = '0%';
        const progressInterval = setInterval(() => {
            const currentWidth = parseInt(progressBar.style.width) || 0;
            if (currentWidth < 90) progressBar.style.width = (currentWidth + 10) + '%';
        }, 200);
        const downloadURL = await uploadImageToStorage(file, 'banner');
        clearInterval(progressInterval);
        progressBar.style.width = '100%';
        if (preview) {
            preview.src = downloadURL;
            preview.style.display = 'block';
        }
        setTimeout(() => {
            progress.style.display = 'none';
            progressBar.style.width = '0%';
        }, 1000);
        if (onUpload) onUpload(downloadURL);
        showNotification('Imagem enviada com sucesso!', 'success');
    } catch (error) {
        console.error('Upload falhou:', error);
        showNotification(error.message || 'Erro ao enviar imagem', 'error');
        progress.style.display = 'none';
        progressBar.style.width = '0%';
    }
}

async function loadData() {
    try {
        showNotification('Carregando dados do Firebase...', 'info');
        const snapshot = await get(ref(db, dataPath));
        if (snapshot.exists()) {
            const fetchedData = snapshot.val();
            console.log('Dados do Firebase:', fetchedData);
            currentData = {
                ...currentData,
                ...fetchedData,
                hero: {
                    ...currentData.hero,
                    ...fetchedData?.hero || {},
                    image: fetchedData?.hero?.image || '',
                    button: {
                        ...currentData.hero.button,
                        ...fetchedData?.hero?.button || {}
                    }
                },
                banner: {
                    ...currentData.banner,
                    ...fetchedData?.banner || {},
                    image: fetchedData?.banner?.image || '',
                    title: fetchedData?.banner?.title || '',
                    subtitle: fetchedData?.banner?.subtitle || '',
                    titleScreen: fetchedData?.banner?.titleScreen || ''
                },
                categories: Array.isArray(fetchedData?.categories) ? fetchedData.categories : [],
                services: Array.isArray(fetchedData?.services) ? fetchedData.services : [],
                faqs: Array.isArray(fetchedData?.faqs) ? fetchedData.faqs : [],
                settings: {
                    ...currentData.settings,
                    ...fetchedData?.settings || {},
                    theme: {
                        ...currentData.settings.theme,
                        ...fetchedData?.settings?.theme || {}
                    },
                    features: {
                        ...currentData.settings.features,
                        ...fetchedData?.settings?.features || {}
                    }
                },
                metadata: {
                    ...currentData.metadata,
                    ...fetchedData?.metadata || {},
                    lastUpdated: fetchedData?.metadata?.lastUpdated || Date.now(),
                    version: fetchedData?.metadata?.version || 1
                }
            };
            populateForm();
            updateStats();
            renderCategories();
            renderServices();
            renderFAQs();
            customizationManager.initialize();
            showNotification('Dados carregados com sucesso!', 'success');
        } else {
            showNotification('Nenhum dado encontrado, usando dados padrão', 'info');
            populateForm();
            updateStats();
            renderCategories();
            renderServices();
            renderFAQs();
            customizationManager.initialize();
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showNotification('Erro ao conectar com Firebase. Usando dados padrão.', 'error');
        populateForm();
        updateStats();
        renderCategories();
        renderServices();
        renderFAQs();
        customizationManager.initialize();
    }
}



async function saveData() {
    if (!validateInputs()) return;
    const saveBtn = document.getElementById('save-btn');
    if (!saveBtn) return;
    const originalText = saveBtn.querySelector('.btn-text')?.textContent || 'Salvar';
    try {
        saveBtn.disabled = true;
        const btnText = saveBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.innerHTML = '<div class="loading-spinner"></div> Salvando...';
        }
        collectFormData();
        customizationManager.collectSettings(); // Collect customization settings
        currentData.metadata = {
            ...currentData.metadata,
            lastUpdated: Date.now(),
            version: (currentData?.metadata?.version || 0) + 1
        };
        await set(ref(db, dataPath), currentData);
        updateStats();
        showNotification('Dados salvos com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        showNotification('Erro ao salvar dados', 'error');
    } finally {
        saveBtn.disabled = false;
        const btnText = saveBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = originalText;
        }
    }
}

function collectFormData() {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroButtonText = document.getElementById('hero-button-text');
    const heroWhatsapp = document.getElementById('hero-whatsapp');
    const heroMessage = document.getElementById('hero-message');
    const bannerTextEnable = document.getElementById('banner-text-enable');
    const bannerTitle = document.getElementById('banner-title');
    const bannerSubtitle = document.getElementById('banner-subtitle');
    const bannerTitleCardapio = document.getElementById('banner-title-cardapio');
    if (heroTitle) currentData.hero.title = heroTitle.value.trim();
    if (heroSubtitle) currentData.hero.subtitle = heroSubtitle.value.trim();
    if (heroButtonText) currentData.hero.button.text = heroButtonText.value.trim();
    if (heroWhatsapp) currentData.hero.button.whatsapp = heroWhatsapp.value.trim();
    if (heroMessage) currentData.hero.button.message = heroMessage.value.trim();
    if (bannerTitleCardapio) currentData.banner.titleScreen = bannerTitleCardapio.value.trim();
    if (bannerTextEnable && bannerTextEnable.checked) {
        if (bannerTitle) currentData.banner.title = bannerTitle.value.trim();
        if (bannerSubtitle) currentData.banner.subtitle = bannerSubtitle.value.trim();
    } else {
        currentData.banner.title = '';
        currentData.banner.subtitle = '';
    }
    const categoryItems = document.querySelectorAll('.category-item');
    currentData.categories = [];
    categoryItems.forEach(item => {
        const category = {
            name: item.querySelector('[data-field="name"]')?.value?.trim() || '',
            subtitle: item.querySelector('[data-field="subtitle"]')?.value?.trim() || '',
            image: item.dataset.mainImage || '',
            gallery: JSON.parse(item.dataset.gallery || '[]')
        };
        if (category.name) currentData.categories.push(category);
    });
    const serviceItems = document.querySelectorAll('.service-item');
    currentData.services = [];
    serviceItems.forEach(item => {
        const service = {
            name: item.querySelector('[data-field="service-name"]')?.value?.trim() || '',
            description: item.querySelector('[data-field="service-description"]')?.value?.trim() || '',
            price: item.querySelector('[data-field="service-price"]')?.value?.trim() || ''
        };
        if (service.name) currentData.services.push(service);
    });
    const faqItems = document.querySelectorAll('.faq-item');
    currentData.faqs = [];
    faqItems.forEach(item => {
        const faq = {
            question: item.querySelector('[data-field="faq-question"]')?.value?.trim() || '',
            answer: item.querySelector('[data-field="faq-answer"]')?.value?.trim() || ''
        };
        if (faq.question) currentData.faqs.push(faq);
    });
}

function populateForm() {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroButtonText = document.getElementById('hero-button-text');
    const heroWhatsapp = document.getElementById('hero-whatsapp');
    const heroMessage = document.getElementById('hero-message');
    const heroImagePreview = document.getElementById('hero-image-preview');
    const bannerImagePreview = document.getElementById('banner-image-preview');
    const bannerTextEnable = document.getElementById('banner-text-enable');
    const bannerTextFields = document.getElementById('banner-text-fields');
    const bannerTitle = document.getElementById('banner-title');
    const bannerSubtitle = document.getElementById('banner-subtitle');
    const bannerTitleCardapio = document.getElementById('banner-title-cardapio');
    if (heroTitle) heroTitle.value = currentData.hero?.title || '';
    if (heroSubtitle) heroSubtitle.value = currentData.hero?.subtitle || '';
    if (heroButtonText) heroButtonText.value = currentData.hero?.button?.text || '';
    if (heroWhatsapp) heroWhatsapp.value = currentData.hero?.button?.whatsapp || '';
    if (heroMessage) heroMessage.value = currentData.hero?.button?.message || '';
    if (heroImagePreview && currentData?.hero?.image) {
        heroImagePreview.src = currentData.hero.image;
        heroImagePreview.style.display = 'block';
    }
    if (bannerImagePreview && currentData?.banner?.image) {
        bannerImagePreview.src = currentData.banner.image;
        bannerImagePreview.style.display = 'block';
    }
    if (bannerTextEnable && bannerTextFields) {
        bannerTextEnable.checked = !!(currentData.banner?.title || currentData.banner?.subtitle);
        bannerTextFields.style.display = bannerTextEnable.checked ? 'block' : 'none';
    }
    if (bannerTitle) bannerTitle.value = currentData.banner?.title || '';
    if (bannerSubtitle) bannerSubtitle.value = currentData.banner?.subtitle || '';
    if (bannerTitleCardapio) bannerTitleCardapio.value = currentData.banner?.titleScreen || '';
}

// Category Management
function renderCategories() {
    const container = document.getElementById('categories-container');
    const emptyState = document.getElementById('empty-categories');
    if (!container) {
        console.error('Elemento categories-container não encontrado');
        showNotification('Erro: Seção de categorias não encontrada na interface', 'error');
        return;
    }
    if (!emptyState) {
        console.warn('Elemento empty-categories não encontrado - continuando sem ele');
    }
    container.innerHTML = '';
    if (currentData.categories.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    if (emptyState) emptyState.style.display = 'none';
    currentData.categories.forEach((category, index) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-item';
        categoryDiv.dataset.index = index;
        categoryDiv.dataset.mainImage = category.image || '';
        categoryDiv.dataset.gallery = JSON.stringify(category.gallery || []);
        categoryDiv.innerHTML = `
            <div class="category-header">
                <h3>${category.name || 'Nova Categoria'}</h3>
                <button class="btn btn-danger remove-btn" data-index="category-${index}" style="padding: 5px 10px; font-size: 12px;" aria-label="Remover categoria">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="cat-name-${index}">Nome da Categoria *</label>
                    <input type="text" id="cat-name-${index}" data-field="name" value="${category.name || ''}" maxlength="50" required>
                </div>
                <div class="form-group">
                    <label for="cat-subtitle-${index}">Subtítulo</label>
                    <input type="text" id="cat-subtitle-${index}" data-field="subtitle" value="${category.subtitle || ''}" maxlength="100">
                </div>
            </div>
            <div class="form-group">
                <label for="main-image-input-${index}">Imagem Principal</label>
                <div class="image-upload-area main-image-upload" data-category="${index}">
                    <p><ion-icon name="image-outline"></ion-icon> Clique ou arraste uma imagem aqui</p>
                    <small>Qualquer tamanho (será otimizado automaticamente)</small>
                    <input type="file" accept="image/*" style="display: none;" class="main-image-input" id="main-image-input-${index}" aria-label="Upload de imagem principal da categoria">
                    <div class="upload-progress" style="display: none;">
                        <div class="upload-progress-bar" style="width: 0%;"></div>
                    </div>
                </div>
                ${category.image ? `<img src="${category.image}" class="image-preview" alt="Pré-visualização da imagem principal da categoria">` : ''}
            </div>
            <div class="form-group">
                <label for="gallery-input-${index}">Galeria de Imagens</label>
                <div class="image-upload-area gallery-upload" data-category="${index}">
                    <p><ion-icon name="images-outline"></ion-icon> Adicionar imagens à galeria</p>
                    <small>Qualquer tamanho (serão otimizadas automaticamente)</small>
                    <input type="file" accept="image/*" multiple style="display: none;" class="gallery-input" id="gallery-input-${index}" aria-label="Upload de imagens para a galeria">
                    <div class="upload-progress" style="display: none;">
                        <div class="upload-progress-bar" style="width: 0%;"></div>
                    </div>
                </div>
                <div class="gallery-grid">
                    ${(category.gallery || []).map((img, imgIndex) => `
                        <div class="gallery-item">
                            <img src="${img}" alt="Imagem da galeria">
                            <button class="remove-btn" data-category="${index}" data-image="${imgIndex}" aria-label="Remover imagem da galeria"><ion-icon name="close-circle-outline"></ion-icon></button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(categoryDiv);
        setupCategoryImageUploads(categoryDiv, index);
    });
    document.querySelectorAll('.remove-btn[data-index^="category-"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('button').dataset.index.split('-')[1]);
            if (isNaN(index) || index < 0 || index >= currentData.categories.length) {
                showNotification('Erro: Categoria inválida', 'error');
                return;
            }
            if (confirm('Tem certeza que deseja remover esta categoria?')) {
                currentData.categories.splice(index, 1);
                renderCategories();
                showNotification('Categoria removida', 'info');
            }
        });
    });
    document.querySelectorAll('.remove-btn[data-image]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const button = e.target.closest('button');
            const catIndex = parseInt(button.dataset.category);
            const imgIndex = parseInt(button.dataset.image);
            if (isNaN(catIndex) || isNaN(imgIndex) || catIndex < 0 || catIndex >= currentData.categories.length) {
                showNotification('Erro: Índice de categoria ou imagem inválido', 'error');
                return;
            }
            if (!currentData.categories[catIndex].gallery || imgIndex >= currentData.categories[catIndex].gallery.length) {
                showNotification('Erro: Imagem não encontrada', 'error');
                return;
            }
            if (confirm('Remover esta imagem da galeria?')) {
                try {
                    const imgUrl = currentData.categories[catIndex].gallery[imgIndex];
                    const imgRef = storageRef(storage, imgUrl);
                    await deleteObject(imgRef);
                    currentData.categories[catIndex].gallery.splice(imgIndex, 1);
                    const categoryItem = document.querySelector(`.category-item[data-index="${catIndex}"]`);
                    if (categoryItem) categoryItem.dataset.gallery = JSON.stringify(currentData.categories[catIndex].gallery);
                    renderCategories();
                    showNotification('Imagem removida', 'info');
                } catch (error) {
                    console.error('Erro ao remover imagem:', error);
                    showNotification('Erro ao remover imagem', 'error');
                }
            }
        });
    });
}

function setupCategoryImageUploads(categoryDiv, categoryIndex) {
    const mainUpload = categoryDiv.querySelector('.main-image-upload');
    const mainInput = categoryDiv.querySelector('.main-image-input');
    const mainPreview = categoryDiv.querySelector('.image-preview');
    setupImageUpload(mainUpload, mainInput.id, mainPreview?.id, (url) => {
        const categoryItem = document.querySelector(`.category-item[data-index="${categoryIndex}"]`);
        if (categoryItem) {
            categoryItem.dataset.mainImage = url;
            currentData.categories[categoryIndex].image = url;
        }
    });
    const galleryUpload = categoryDiv.querySelector('.gallery-upload');
    const galleryInput = categoryDiv.querySelector('.gallery-input');
    if (!galleryUpload || !galleryInput) {
        console.error('Gallery upload elements not found');
        return;
    }
    galleryUpload.addEventListener('click', () => galleryInput.click());
    galleryUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        galleryUpload.classList.add('dragover');
    });
    galleryUpload.addEventListener('dragleave', () => galleryUpload.classList.remove('dragover'));
    galleryUpload.addEventListener('drop', async (e) => {
        e.preventDefault();
        galleryUpload.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        await handleGalleryUpload(files, categoryIndex);
    });
    galleryInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        await handleGalleryUpload(files, categoryIndex);
    });
}

async function handleGalleryUpload(files, categoryIndex) {
    if (categoryIndex < 0 || categoryIndex >= currentData.categories.length) {
        showNotification('Erro: Categoria inválida', 'error');
        return;
    }
    const gallery = currentData.categories[categoryIndex].gallery || [];
    const galleryUpload = document.querySelector(`.image-upload-area.gallery-upload[data-category="${categoryIndex}"]`);
    const progressBar = galleryUpload?.querySelector('.upload-progress-bar');
    const progress = galleryUpload?.querySelector('.upload-progress');
    if (!galleryUpload || !progress || !progressBar) {
        console.error('Gallery upload progress elements not found');
        showNotification('Erro: Elementos de upload não encontrados', 'error');
        return;
    }
    try {
        progress.style.display = 'block';
        progressBar.style.width = '0%';
        const totalFiles = files.length;
        let uploaded = 0;
        for (const file of files) {
            const url = await uploadImageToStorage(file, 'gallery');
            gallery.push(url);
            uploaded++;
            progressBar.style.width = `${(uploaded / totalFiles) * 100}%`;
        }
        currentData.categories[categoryIndex].gallery = gallery;
        const categoryItem = document.querySelector(`.category-item[data-index="${categoryIndex}"]`);
        if (categoryItem) categoryItem.dataset.gallery = JSON.stringify(gallery);
        renderCategories();
        showNotification(`${totalFiles} imagem${totalFiles > 1 ? 'ns' : ''} adicionada${totalFiles > 1 ? 's' : ''} à galeria`, 'success');
    } catch (error) {
        console.error('Gallery upload failed:', error);
        showNotification(error.message || 'Erro ao enviar imagens da galeria', 'error');
    } finally {
        progress.style.display = 'none';
        progressBar.style.width = '0%';
    }
}

// Service Management
function renderServices() {
    const container = document.getElementById('services-container');
    const emptyState = document.getElementById('empty-services');
    if (!container || !emptyState) {
        console.error('Services container or empty state element not found');
        showNotification('Erro: Elementos da interface não encontrados', 'error');
        return;
    }
    container.innerHTML = '';
    if (currentData.services.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';
    currentData.services.forEach((service, index) => {
        const serviceDiv = document.createElement('div');
        serviceDiv.className = 'service-item';
        serviceDiv.dataset.index = index;
        serviceDiv.innerHTML = `
            <div class="service-header">
                <h3>${service.name || 'Novo Serviço'}</h3>
                <button class="btn btn-danger remove-btn" data-index="service-${index}" style="padding: 5px 10px; font-size: 12px;" aria-label="Remover serviço">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="service-name-${index}">Nome do Serviço *</label>
                    <input type="text" id="service-name-${index}" data-field="service-name" value="${service.name || ''}" maxlength="50" required>
                </div>
                <div class="form-group">
                    <label for="service-price-${index}">Preço (R$)</label>
                    <input type="number" id="service-price-${index}" data-field="service-price" value="${service.price || ''}" step="0.01" min="0">
                </div>
            </div>
            <div class="form-group">
                <label for="service-description-${index}">Descrição</label>
                <textarea id="service-description-${index}" data-field="service-description" maxlength="200">${service.description || ''}</textarea>
            </div>
        `;
        container.appendChild(serviceDiv);
    });
    document.querySelectorAll('.remove-btn[data-index^="service-"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('button').dataset.index.split('-')[1]);
            if (isNaN(index) || index < 0 || index >= currentData.services.length) {
                showNotification('Erro: Serviço inválido', 'error');
                return;
            }
            if (confirm('Tem certeza que deseja remover este serviço?')) {
                currentData.services.splice(index, 1);
                renderServices();
                showNotification('Serviço removido', 'info');
            }
        });
    });
}

// FAQ Management
function renderFAQs() {
    const container = document.getElementById('faqs-container');
    const emptyState = document.getElementById('empty-faqs');
    if (!container) {
        console.warn('FAQs container not found; skipping FAQ rendering');
        return;
    }
    if (!emptyState) {
        console.warn('Empty FAQs state element not found; proceeding without empty state');
    }
    container.innerHTML = '';
    if (currentData.faqs.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    if (emptyState) emptyState.style.display = 'none';
    currentData.faqs.forEach((faq, index) => {
        const faqDiv = document.createElement('div');
        faqDiv.className = 'faq-item';
        faqDiv.dataset.index = index;
        faqDiv.innerHTML = `
            <div class="faq-header">
                <h3>${faq.question || 'Nova Dúvida'}</h3>
                <button class="btn btn-danger remove-btn" data-index="faq-${index}" style="padding: 5px 10px; font-size: 12px;" aria-label="Remover dúvida">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            </div>
            <div class="form-group">
                <label for="faq-question-${index}">Pergunta *</label>
                <input type="text" id="faq-question-${index}" data-field="faq-question" value="${faq.question || ''}" maxlength="100" required>
            </div>
            <div class="form-group">
                <label for="faq-answer-${index}">Resposta</label>
                <textarea id="faq-answer-${index}" data-field="faq-answer" maxlength="500">${faq.answer || ''}</textarea>
            </div>
        `;
        container.appendChild(faqDiv);
    });
    document.querySelectorAll('.remove-btn[data-index^="faq-"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('button').dataset.index.split('-')[1]);
            if (isNaN(index) || index < 0 || index >= currentData.faqs.length) {
                showNotification('Erro: Dúvida inválida', 'error');
                return;
            }
            if (confirm('Tem certeza que deseja remover esta dúvida?')) {
                currentData.faqs.splice(index, 1);
                renderFAQs();
                showNotification('Dúvida removida', 'info');
            }
        });
    });
}

// Event Listeners
document.getElementById('add-category-btn')?.addEventListener('click', () => {
    currentData.categories.push({ name: '', subtitle: '', image: '', gallery: [] });
    renderCategories();
    showNotification('Nova categoria adicionada', 'info');
});

document.getElementById('add-service-btn')?.addEventListener('click', () => {
    currentData.services.push({ name: '', description: '', price: '' });
    renderServices();
    showNotification('Novo serviço adicionado', 'info');
});

document.getElementById('add-faq-btn')?.addEventListener('click', () => {
    currentData.faqs.push({ question: '', answer: '' });
    renderFAQs();
    showNotification('Nova dúvida adicionada', 'info');
});

document.getElementById('save-btn')?.addEventListener('click', saveData);

setupImageUpload(
    document.getElementById('hero-image-upload'),
    'hero-image-input',
    'hero-image-preview',
    (url) => currentData.hero.image = url
);

setupImageUpload(
    document.getElementById('banner-image-upload'),
    'banner-image-input',
    'banner-image-preview',
    (url) => currentData.banner.image = url
);

// Submenu Management
function switchSubscreen(targetSubscreen) {
    document.querySelectorAll('.subscreen').forEach(subscreen => subscreen.classList.remove('active'));
    document.querySelectorAll('.submenu-btn').forEach(btn => btn.classList.remove('active'));
    const subscreenEl = document.getElementById(targetSubscreen);
    const btnEl = document.querySelector(`[data-subscreen="${targetSubscreen}"]`);
    if (subscreenEl && btnEl) {
        subscreenEl.classList.add('active');
        btnEl.classList.add('active');
    }
}

document.querySelectorAll('.submenu-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetSubscreen = button.getAttribute('data-subscreen');
        switchSubscreen(targetSubscreen);
    });
});

// Banner Text Enable Toggle
const bannerTextEnable = document.getElementById('banner-text-enable');
const bannerTextFields = document.getElementById('banner-text-fields');
if (bannerTextEnable && bannerTextFields) {
    bannerTextEnable.addEventListener('change', () => {
        bannerTextFields.style.display = bannerTextEnable.checked ? 'block' : 'none';
    });
}

// CustomizationManager Class
class CustomizationManager {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.loadSettings();
        this.setupEventListeners();
    }

    loadSettings() {
        const primaryColor = document.getElementById('theme-primary-color');
        const secondaryColor = document.getElementById('theme-secondary-color');
        const font = document.getElementById('theme-font');
        const enableServices = document.getElementById('enable-services');
        const enableFaqs = document.getElementById('enable-faqs');
        const enableSplash = document.getElementById('enable-splash');

        if (primaryColor) primaryColor.value = currentData.settings.theme.primaryColor;
        if (secondaryColor) secondaryColor.value = currentData.settings.theme.secondaryColor;
        if (font) font.value = currentData.settings.theme.font;
        if (enableServices) enableServices.checked = currentData.settings.features.enableServices;
        if (enableFaqs) enableFaqs.checked = currentData.settings.features.enableFaqs;
        if (enableSplash) enableSplash.checked = currentData.settings.features.enableSplash;

        this.applyTheme();
    }

    setupEventListeners() {
        const primaryColor = document.getElementById('theme-primary-color');
        const secondaryColor = document.getElementById('theme-secondary-color');
        const font = document.getElementById('theme-font');
        const enableServices = document.getElementById('enable-services');
        const enableFaqs = document.getElementById('enable-faqs');
        const enableSplash = document.getElementById('enable-splash');

        if (primaryColor) primaryColor.addEventListener('change', () => this.updateTheme('primaryColor', primaryColor.value));
        if (secondaryColor) secondaryColor.addEventListener('change', () => this.updateTheme('secondaryColor', secondaryColor.value));
        if (font) font.addEventListener('change', () => this.updateTheme('font', font.value));
        if (enableServices) enableServices.addEventListener('change', () => this.toggleFeature('enableServices', enableServices.checked));
        if (enableFaqs) enableFaqs.addEventListener('change', () => this.toggleFeature('enableFaqs', enableFaqs.checked));
        if (enableSplash) enableSplash.addEventListener('change', () => this.toggleFeature('enableSplash', enableSplash.checked));
    }

    updateTheme(key, value) {
        currentData.settings.theme[key] = value;
        this.applyTheme();
    }

    toggleFeature(key, value) {
        currentData.settings.features[key] = value;
        this.updateVisibility();
    }

    applyTheme() {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', currentData.settings.theme.primaryColor);
        root.style.setProperty('--secondary-color', currentData.settings.theme.secondaryColor);
        root.style.setProperty('--font-family', currentData.settings.theme.font);
    }

    updateVisibility() {
        const servicesTab = document.getElementById('servicos');
        const faqsTab = document.getElementById('duvidas');
        const splashElement = document.querySelector('.splash'); // Assumindo que há uma classe .splash

        if (servicesTab) servicesTab.style.display = currentData.settings.features.enableServices ? 'block' : 'none';
        if (faqsTab) faqsTab.style.display = currentData.settings.features.enableFaqs ? 'block' : 'none';
        if (splashElement) splashElement.style.display = currentData.settings.features.enableSplash ? 'block' : 'none';
    }

    collectSettings() {
        const primaryColor = document.getElementById('theme-primary-color').value;
        const secondaryColor = document.getElementById('theme-secondary-color').value;
        const font = document.getElementById('theme-font').value;
        const enableServices = document.getElementById('enable-services').checked;
        const enableFaqs = document.getElementById('enable-faqs').checked;
        const enableSplash = document.getElementById('enable-splash').checked;

        currentData.settings.theme = {
            primaryColor,
            secondaryColor,
            font
        };
        currentData.settings.features = {
            enableServices,
            enableFaqs,
            enableSplash
        };
    }
}

const customizationManager = new CustomizationManager();

// Initialize
loadData();