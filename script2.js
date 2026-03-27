let currentApi = 'users';
let currentData = [];

// Ключи для localStorage
const STORAGE_KEY = 'api_dashboard_data';
const CURRENT_API_KEY = 'api_dashboard_current_section';

// ===== ЛОКАЛЬНЫЕ ДАННЫЕ ПО УМОЛЧАНИЮ =====
const defaultData = {
    users: [
        { id: 1, name: 'Иван Петров', email: 'ivan@example.com', phone: '+7 (999) 123-45-67', website: 'ivan.ru' },
        { id: 2, name: 'Мария Иванова', email: 'maria@example.com', phone: '+7 (999) 234-56-78', website: 'maria.ru' },
        { id: 3, name: 'Алексей Смирнов', email: 'alex@example.com', phone: '+7 (999) 345-67-89', website: 'alex.ru' },
        { id: 4, name: 'Елена Кузнецова', email: 'elena@example.com', phone: '+7 (999) 456-78-90', website: 'elena.ru' },
        { id: 5, name: 'Дмитрий Соколов', email: 'dmitry@example.com', phone: '+7 (999) 567-89-01', website: 'dmitry.ru' },
        { id: 6, name: 'Анна Морозова', email: 'anna@example.com', phone: '+7 (999) 678-90-12', website: 'anna.ru' }
    ],
    posts: [
        { id: 1, userId: 1, title: 'Первый пост', body: 'Это тестовый пост для демонстрации работы приложения. Здесь может быть любой текст.' },
        { id: 2, userId: 2, title: 'Второй пост', body: 'Ещё один тестовый пост с более длинным содержанием для проверки отображения.' },
        { id: 3, userId: 3, title: 'Третий пост', body: 'Краткое содержание тестового поста.' },
        { id: 4, userId: 4, title: 'Четвёртый пост', body: 'Интересный контент о современных технологиях.' }
    ],
    todos: [
        { id: 1, userId: 1, title: 'Сделать лабораторную работу', completed: false },
        { id: 2, userId: 2, title: 'Написать отчёт', completed: true },
        { id: 3, userId: 3, title: 'Сдать проект', completed: false },
        { id: 4, userId: 4, title: 'Подготовить презентацию', completed: false },
        { id: 5, userId: 5, title: 'Провести тестирование', completed: true }
    ]
};

// ===== РАБОТА С СОХРАНЕНИЕМ РАЗДЕЛА =====

function saveCurrentSection() {
    localStorage.setItem(CURRENT_API_KEY, currentApi);
    console.log('Сохранён текущий раздел:', currentApi);
}

function loadCurrentSection() {
    const saved = localStorage.getItem(CURRENT_API_KEY);
    if (saved && (saved === 'users' || saved === 'posts' || saved === 'todos')) {
        currentApi = saved;
        console.log('Загружен сохранённый раздел:', currentApi);
    } else {
        currentApi = 'users';
        console.log('Используем раздел по умолчанию: users');
    }
    return currentApi;
}

// ===== РАБОТА С LOCALSTORAGE ДАННЫХ =====

function saveToLocalStorage() {
    const saved = loadFromLocalStorage();
    const dataToSave = {
        allUsers: (currentApi === 'users' ? currentData : (saved?.allUsers || defaultData.users)),
        allPosts: (currentApi === 'posts' ? currentData : (saved?.allPosts || defaultData.posts)),
        allTodos: (currentApi === 'todos' ? currentData : (saved?.allTodos || defaultData.todos))
    };
    
    if (currentApi === 'users') dataToSave.allUsers = currentData;
    if (currentApi === 'posts') dataToSave.allPosts = currentData;
    if (currentApi === 'todos') dataToSave.allTodos = currentData;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    console.log('Данные сохранены в localStorage');
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Ошибка парсинга localStorage', e);
            return null;
        }
    }
    return null;
}

function loadDataForCurrentApi() {
    const saved = loadFromLocalStorage();
    
    if (saved) {
        if (currentApi === 'users' && saved.allUsers) {
            currentData = [...saved.allUsers];
            console.log('Загружены пользователи из localStorage:', currentData.length);
        } else if (currentApi === 'posts' && saved.allPosts) {
            currentData = [...saved.allPosts];
            console.log('Загружены посты из localStorage:', currentData.length);
        } else if (currentApi === 'todos' && saved.allTodos) {
            currentData = [...saved.allTodos];
            console.log('Загружены задачи из localStorage:', currentData.length);
        } else {
            loadDefaultData();
        }
    } else {
        loadDefaultData();
    }
    
    return currentData;
}

function loadDefaultData() {
    if (currentApi === 'users') {
        currentData = [...defaultData.users];
    } else if (currentApi === 'posts') {
        currentData = [...defaultData.posts];
    } else if (currentApi === 'todos') {
        currentData = [...defaultData.todos];
    }
    console.log('Загружены дефолтные данные для:', currentApi, currentData.length);
    saveAllDataToLocalStorage();
}

function saveAllDataToLocalStorage() {
    const saved = loadFromLocalStorage();
    const dataToSave = {
        allUsers: (currentApi === 'users' ? currentData : (saved?.allUsers || defaultData.users)),
        allPosts: (currentApi === 'posts' ? currentData : (saved?.allPosts || defaultData.posts)),
        allTodos: (currentApi === 'todos' ? currentData : (saved?.allTodos || defaultData.todos))
    };
    
    if (currentApi === 'users') dataToSave.allUsers = currentData;
    if (currentApi === 'posts') dataToSave.allPosts = currentData;
    if (currentApi === 'todos') dataToSave.allTodos = currentData;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

function showToast(message, type = 'info') {
    const oldToasts = document.querySelectorAll('.toast');
    oldToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ===== API ЗАПРОСЫ (опционально) =====

async function tryLoadFromAPI() {
    let url = '';
    if (currentApi === 'users') url = 'https://jsonplaceholder.typicode.com/users';
    else if (currentApi === 'posts') url = 'https://jsonplaceholder.typicode.com/posts';
    else if (currentApi === 'todos') url = 'https://jsonplaceholder.typicode.com/todos';
    else return false;
    
    try {
        console.log('Попытка загрузить из API:', url);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            currentData = data.slice(0, 8).map(item => ({ ...item, id: item.id }));
            saveToLocalStorage();
            console.log('Успешно загружено из API:', currentData.length);
            showToast('Данные загружены из API', 'success');
            return true;
        }
        return false;
    } catch (error) {
        console.log('API недоступен:', error.message);
        return false;
    }
}

// ===== ВАЛИДАЦИЯ =====

function validateUser(data) {
    const errors = {};
    if (!data.name?.trim() || data.name.trim().length < 2) errors.name = 'Имя (мин. 2 символа)';
    if (!data.email?.trim() || !/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(data.email)) errors.email = 'Неверный email';
    return errors;
}

function validatePost(data) {
    const errors = {};
    if (!data.title?.trim() || data.title.trim().length < 3) errors.title = 'Заголовок (мин. 3 символа)';
    if (!data.body?.trim() || data.body.trim().length < 10) errors.body = 'Содержание (мин. 10 символов)';
    return errors;
}

function validateTodo(data) {
    const errors = {};
    if (!data.title?.trim() || data.title.trim().length < 3) errors.title = 'Название (мин. 3 символа)';
    return errors;
}

// ===== РЕНДЕРИНГ =====

function renderHeader() {
    const saved = loadFromLocalStorage();
    const userCount = saved?.allUsers?.length || defaultData.users.length;
    const postCount = saved?.allPosts?.length || defaultData.posts.length;
    const todoCount = saved?.allTodos?.length || defaultData.todos.length;
    
    return `
        <header class="app-header">
            <div class="header-content">
                <div class="logo">
                    <h1>🌐 DASHBOARD</h1>
                </div>
                <nav class="nav-menu">
                    <button class="nav-btn ${currentApi === 'users' ? 'active' : ''}" data-api="users">👥 Пользователи (${userCount})</button>
                    <button class="nav-btn ${currentApi === 'posts' ? 'active' : ''}" data-api="posts">📝 Посты (${postCount})</button>
                    <button class="nav-btn ${currentApi === 'todos' ? 'active' : ''}" data-api="todos">✅ Задачи (${todoCount})</button>
                </nav>
            </div>
        </header>
    `;
}

function renderForm() {
    if (currentApi === 'users') {
        return `
            <div class="form-container">
                <h3>➕ Добавить пользователя</h3>
                <form id="dataForm">
                    <div class="form-group">
                        <label>Имя *</label>
                        <input type="text" name="name" placeholder="Иван Петров">
                        <div class="error-message" id="nameError"></div>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" placeholder="ivan@example.com">
                        <div class="error-message" id="emailError"></div>
                    </div>
                    <div class="form-group">
                        <label>Телефон</label>
                        <input type="text" name="phone" placeholder="+7 (999) 123-45-67">
                    </div>
                    <div class="form-group">
                        <label>Веб-сайт</label>
                        <input type="text" name="website" placeholder="example.com">
                    </div>
                    <button type="submit" class="submit-btn">✨ Создать</button>
                </form>
            </div>
        `;
    }
    
    if (currentApi === 'posts') {
        return `
            <div class="form-container">
                <h3>➕ Добавить пост</h3>
                <form id="dataForm">
                    <div class="form-group">
                        <label>Заголовок *</label>
                        <input type="text" name="title" placeholder="Заголовок поста">
                        <div class="error-message" id="titleError"></div>
                    </div>
                    <div class="form-group">
                        <label>Содержание *</label>
                        <textarea name="body" rows="4" placeholder="Текст поста..."></textarea>
                        <div class="error-message" id="bodyError"></div>
                    </div>
                    <button type="submit" class="submit-btn">📝 Опубликовать</button>
                </form>
            </div>
        `;
    }
    
    if (currentApi === 'todos') {
        return `
            <div class="form-container">
                <h3>➕ Добавить задачу</h3>
                <form id="dataForm">
                    <div class="form-group">
                        <label>Название *</label>
                        <input type="text" name="title" placeholder="Название задачи">
                        <div class="error-message" id="titleError"></div>
                    </div>
                    <div class="form-group">
                        <label>Статус</label>
                        <select name="completed">
                            <option value="false">🟡 Не выполнено</option>
                            <option value="true">✅ Выполнено</option>
                        </select>
                    </div>
                    <button type="submit" class="submit-btn">✅ Создать</button>
                </form>
            </div>
        `;
    }
    return '';
}

function renderData() {
    if (!currentData || currentData.length === 0) {
        return `<div class="empty-state"><div class="empty-state-icon">📭</div><p>Нет данных</p></div>`;
    }
    
    if (currentApi === 'users') {
        return `
            <div class="data-grid">
                ${currentData.map(user => `
                    <div class="data-card">
                        <div class="card-title">${escapeHtml(user.name)}</div>
                        <div class="card-content">
                            <p>📧 ${escapeHtml(user.email)}</p>
                            <p>📞 ${escapeHtml(user.phone || '—')}</p>
                            <p>🌐 ${escapeHtml(user.website || '—')}</p>
                        </div>
                        <div class="card-meta">
                            <span>ID: ${user.id}</span>
                            <button class="delete-btn" data-id="${user.id}">🗑️ Удалить</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (currentApi === 'posts') {
        return `
            <div class="data-grid">
                ${currentData.map(post => `
                    <div class="data-card">
                        <div class="card-title">${escapeHtml(post.title)}</div>
                        <div class="card-content">${escapeHtml(post.body.substring(0, 100))}${post.body.length > 100 ? '...' : ''}</div>
                        <div class="card-meta">
                            <span>ID: ${post.id}</span>
                            <button class="delete-btn" data-id="${post.id}">🗑️ Удалить</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (currentApi === 'todos') {
        return `
            <div class="data-grid">
                ${currentData.map(todo => `
                    <div class="data-card">
                        <div class="card-title">${escapeHtml(todo.title)}</div>
                        <div class="card-content">${todo.completed ? '✅ Выполнено' : '🟡 Не выполнено'}</div>
                        <div class="card-meta">
                            <span>ID: ${todo.id}</span>
                            <button class="delete-btn" data-id="${todo.id}">🗑️ Удалить</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    return '';
}

async function renderPage() {
    const app = document.getElementById('app');
    if (!app) {
        console.error('#app не найден!');
        return;
    }
    
    app.innerHTML = `
        ${renderHeader()}
        <main class="main-container">
            <div class="loader"><div class="spinner"></div></div>
        </main>
    `;
    
    // Загружаем данные для текущего раздела
    loadDataForCurrentApi();
    
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.innerHTML = renderForm() + renderData();
    }
    
    attachEvents();
    
    // Пытаемся загрузить из API в фоне
    tryLoadFromAPI().then(success => {
        if (success) {
            const mainContainer = document.querySelector('.main-container');
            if (mainContainer) {
                mainContainer.innerHTML = renderForm() + renderData();
                attachEvents();
            }
        }
    });
}

function attachEvents() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.onclick = async () => {
            const api = btn.dataset.api;
            if (api && api !== currentApi) {
                currentApi = api;
                saveCurrentSection(); // Сохраняем выбранный раздел
                await renderPage();
            }
        };
    });
    
    const form = document.getElementById('dataForm');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            await handleSubmit(e);
        };
    }
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = async () => {
            const id = parseInt(btn.dataset.id);
            await handleDelete(id);
        };
    });
}

async function handleSubmit(e) {
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    let errors = {};
    if (currentApi === 'users') errors = validateUser(data);
    if (currentApi === 'posts') errors = validatePost(data);
    if (currentApi === 'todos') errors = validateTodo(data);
    
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    if (Object.keys(errors).length > 0) {
        for (const [field, msg] of Object.entries(errors)) {
            const errorEl = document.getElementById(`${field}Error`);
            if (errorEl) errorEl.textContent = msg;
        }
        showToast('Исправьте ошибки', 'error');
        return;
    }
    
    const submitBtn = form.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Отправка...';
    }
    
    try {
        const newId = Date.now();
        let result;
        
        if (currentApi === 'users') {
            result = { id: newId, name: data.name, email: data.email, phone: data.phone || '', website: data.website || '' };
            showToast(`Пользователь "${data.name}" создан`, 'success');
        } else if (currentApi === 'posts') {
            result = { id: newId, userId: 1, title: data.title, body: data.body };
            showToast(`Пост "${data.title}" опубликован`, 'success');
        } else {
            result = { id: newId, userId: 1, title: data.title, completed: data.completed === 'true' };
            showToast(`Задача "${data.title}" создана`, 'success');
        }
        
        currentData = [result, ...currentData];
        saveToLocalStorage();
        
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.innerHTML = renderForm() + renderData();
            attachEvents();
        }
        
        form.reset();
        
        // Обновляем счётчики в шапке
        const header = document.querySelector('.app-header');
        if (header) {
            const oldHeader = header;
            const newHeader = renderHeader();
            oldHeader.outerHTML = newHeader;
            attachEvents();
        }
        
    } catch (error) {
        showToast('Ошибка: ' + error.message, 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            if (currentApi === 'users') submitBtn.textContent = '✨ Создать';
            else if (currentApi === 'posts') submitBtn.textContent = '📝 Опубликовать';
            else submitBtn.textContent = '✅ Создать';
        }
    }
}

async function handleDelete(id) {
    if (!confirm('Удалить?')) return;
    
    currentData = currentData.filter(item => item.id !== id);
    saveToLocalStorage();
    
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.innerHTML = renderForm() + renderData();
        attachEvents();
    }
    
    // Обновляем счётчики в шапке
    const header = document.querySelector('.app-header');
    if (header) {
        const oldHeader = header;
        const newHeader = renderHeader();
        oldHeader.outerHTML = newHeader;
        attachEvents();
    }
    
    showToast('Удалено', 'success');
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, запускаем приложение...');
    loadCurrentSection(); // Сначала загружаем сохранённый раздел
    renderPage();
});