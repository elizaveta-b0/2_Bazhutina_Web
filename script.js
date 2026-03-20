// ============================================
// ЛАБОРАТОРНАЯ РАБОТА №5
// Карточная игра "Космическая битва"
// С поддержкой галереи изображений
// ============================================

// ===== БАЗОВЫЙ КЛАСС CARD =====
class Card {
    // Приватные поля (инкапсуляция)
    #id;
    #name;
    #description;
    #cost;
    #imageUrl;

    constructor(id, name, description, cost, imageUrl = '') {
        this.#id = id;
        this.#name = name;
        this.#description = description;
        this.#cost = cost;
        this.#imageUrl = imageUrl || this.getDefaultImage();
    }

    // Геттеры (инкапсуляция)
    getId() { return this.#id; }
    getName() { return this.#name; }
    getDescription() { return this.#description; }
    getCost() { return this.#cost; }
    getImageUrl() { return this.#imageUrl; }

    // Сеттеры для редактирования
    setName(name) { this.#name = name; }
    setDescription(desc) { this.#description = desc; }
    setCost(cost) { this.#cost = cost; }
    setImageUrl(url) { this.#imageUrl = url; }

    // Виртуальный метод для получения типа (полиморфизм)
    getType() {
        return 'Карта';
    }

    // Виртуальный метод для получения цвета типа
    getTypeColor() {
        return 'default';
    }

    // Виртуальный метод для получения дополнительной статистики
    getStats() {
        return [];
    }

    // Дефолтное изображение
    getDefaultImage() {
        return 'https://via.placeholder.com/300x180/2c3e50/ffffff?text=Card';
    }

    // Метод, возвращающий HTML-представление карты
    render() {
        const stats = this.getStats();
        const statsHtml = stats.length > 0 
            ? `<div class="card-stats">
                ${stats.map(s => `<span class="${s.class}">${s.icon} ${s.value}</span>`).join('')}
               </div>`
            : '<div class="card-stats"><span class="cost">⚡ ' + this.#cost + '</span></div>';

        return `
            <div class="card" data-id="${this.#id}" data-type="${this.getType()}">
                <img class="card-image" src="${this.#imageUrl}" alt="${this.#name}" onerror="this.src='https://via.placeholder.com/300x180/2c3e50/ffffff?text=Card'">
                <div class="card-type ${this.getTypeColor()}">${this.getType()}</div>
                <div class="card-content">
                    <div class="card-name">${this.#name}</div>
                    <div class="card-description">${this.#description}</div>
                    ${statsHtml}
                </div>
                <button class="delete-btn" onclick="window.cardApp.deleteCard('${this.#id}')">✖</button>
            </div>
        `;
    }

    // Метод для получения объекта данных (для сохранения)
    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            description: this.#description,
            cost: this.#cost,
            imageUrl: this.#imageUrl,
            type: this.getType()
        };
    }
}

// ===== КЛАСС СУЩЕСТВО (CREATURE) =====
class CreatureCard extends Card {
    #attack;
    #defense;

    constructor(id, name, description, cost, attack, defense, imageUrl = '') {
        super(id, name, description, cost, imageUrl);
        this.#attack = attack;
        this.#defense = defense;
    }

    getType() {
        return 'Существо';
    }

    getTypeColor() {
        return 'creature';
    }

    getStats() {
        return [
            { icon: '⚔️', value: this.#attack, class: 'attack' },
            { icon: '🛡️', value: this.#defense, class: 'defense' },
            { icon: '⚡', value: this.getCost(), class: 'cost' }
        ];
    }

    getAttack() { return this.#attack; }
    getDefense() { return this.#defense; }

    setAttack(attack) { this.#attack = attack; }
    setDefense(defense) { this.#defense = defense; }

    toJSON() {
        return {
            ...super.toJSON(),
            attack: this.#attack,
            defense: this.#defense
        };
    }
}

// ===== КЛАСС ЗАКЛИНАНИЕ (SPELL) =====
class SpellCard extends Card {
    #effect;
    #duration;

    constructor(id, name, description, cost, effect, duration = 1, imageUrl = '') {
        super(id, name, description, cost, imageUrl);
        this.#effect = effect;
        this.#duration = duration;
    }

    getType() {
        return 'Заклинание';
    }

    getTypeColor() {
        return 'spell';
    }

    getStats() {
        return [
            { icon: '✨', value: this.#effect, class: 'effect' },
            { icon: '⏳', value: `${this.#duration} ход`, class: 'duration' },
            { icon: '⚡', value: this.getCost(), class: 'cost' }
        ];
    }

    getEffect() { return this.#effect; }
    getDuration() { return this.#duration; }

    setEffect(effect) { this.#effect = effect; }
    setDuration(duration) { this.#duration = duration; }

    toJSON() {
        return {
            ...super.toJSON(),
            effect: this.#effect,
            duration: this.#duration
        };
    }
}

// ===== КЛАСС АРТЕФАКТ (ARTIFACT) =====
class ArtifactCard extends Card {
    #bonusStat;
    #bonusValue;

    constructor(id, name, description, cost, bonusStat, bonusValue, imageUrl = '') {
        super(id, name, description, cost, imageUrl);
        this.#bonusStat = bonusStat;
        this.#bonusValue = bonusValue;
    }

    getType() {
        return 'Артефакт';
    }

    getTypeColor() {
        return 'artifact';
    }

    getStats() {
        return [
            { icon: '📈', value: `+${this.#bonusValue} ${this.#bonusStat}`, class: 'bonus' },
            { icon: '⚡', value: this.getCost(), class: 'cost' }
        ];
    }

    getBonusStat() { return this.#bonusStat; }
    getBonusValue() { return this.#bonusValue; }

    setBonusStat(stat) { this.#bonusStat = stat; }
    setBonusValue(value) { this.#bonusValue = value; }

    toJSON() {
        return {
            ...super.toJSON(),
            bonusStat: this.#bonusStat,
            bonusValue: this.#bonusValue
        };
    }
}

// ===== КЛАСС ГЕРОЙ (HERO) =====
class HeroCard extends Card {
    #health;
    #ability;

    constructor(id, name, description, cost, health, ability, imageUrl = '') {
        super(id, name, description, cost, imageUrl);
        this.#health = health;
        this.#ability = ability;
    }

    getType() {
        return 'Герой';
    }

    getTypeColor() {
        return 'hero';
    }

    getStats() {
        return [
            { icon: '❤️', value: this.#health, class: 'health' },
            { icon: '🌟', value: this.#ability, class: 'ability' },
            { icon: '⚡', value: this.getCost(), class: 'cost' }
        ];
    }

    getHealth() { return this.#health; }
    getAbility() { return this.#ability; }

    setHealth(health) { this.#health = health; }
    setAbility(ability) { this.#ability = ability; }

    toJSON() {
        return {
            ...super.toJSON(),
            health: this.#health,
            ability: this.#ability
        };
    }
}

// ===== ГАЛЕРЕЯ ИЗОБРАЖЕНИЙ =====
class ImageGallery {
    constructor() {
        this.images = [
            { id: 'img1', url: '6d18bc76ba415966f1c83f5fd20c9a4f.jpg', name: 'Звёздный воин' },
            { id: 'img2', url: 'b7288a075bfbc09a61de9fbaaa5ceb6e.jpg', name: 'Космический дрон' },
            { id: 'img3', url: 'ac31d186d4a947d8d5da0f561daf89b4.jpg', name: 'Звёздный дождь' },
            { id: 'img4', url: 'cd462c8825b18df46c71072c58fbd615.jpg', name: 'Магический щит' },
            { id: 'img5', url: '27c45658b3d7879d60643ef36cbd610e.jpg', name: 'Кристалл силы' },
            { id: 'img6', url: '25dadea09aac2622ad336edf05423bf2.jpg', name: 'Древний свиток' },
            { id: 'img7', url: '4f105aca77424ad514f6d631c3ca6cc1.jpg', name: 'Космический капитан' },
            { id: 'img8', url: '336a7caf7f4cfb6eedea08b59fbfe736.jpg', name: 'Инквизитор' },
            { id: 'img9', url: '7f7b2f185494c43d345c0e96e2ef6620.jpg', name: 'Магический кристалл' },
            { id: 'img10', url: 'e7ed11a989337013840aa4ba1d966792.jpg', name: 'Галактика' },
            { id: 'img11', url: 'ffd1e79b7d89a2827082be07b35dfb9f.jpg', name: 'Космическая станция' },
            { id: 'img12', url: 'ee382637d10a6e3618bc9dcab27c7bc9.jpg', name: 'Планета' }
        ];
    }

    getImages() {
        return this.images;
    }

    renderGallery(selectedUrl = '') {
        return `
            <div class="gallery-container">
                <label>Выберите изображение из галереи:</label>
                <div class="gallery-grid">
                    ${this.images.map(img => `
                        <div class="gallery-item ${selectedUrl === img.url ? 'selected' : ''}" 
                             data-url="${img.url}"
                             onclick="window.cardApp.selectImage('${img.url}')">
                            <img src="${img.url}" alt="${img.name}">
                            <span class="gallery-name">${img.name}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="gallery-upload">
                    <label>Или загрузите своё изображение:</label>
                    <input type="file" id="imageUpload" accept="image/*" onchange="window.cardApp.uploadImage(this)">
                </div>
                <div class="gallery-preview" id="galleryPreview" style="display: none;">
                    <p>Выбранное изображение:</p>
                    <img id="selectedImagePreview" src="" alt="Preview">
                </div>
            </div>
        `;
    }
}

// ===== КЛАСС ПРИЛОЖЕНИЯ =====
class CardApp {
    constructor() {
        this.cards = [];
        this.isEditMode = false;
        this.gallery = new ImageGallery();
        this.selectedImageUrl = '';
    }

    // Инициализация
    init() {
        console.log('App initializing...');
        this.loadCards();
        this.render();
        this.bindEvents();
    }

    // Загрузка карт из localStorage или дефолтных
    loadCards() {
        const saved = localStorage.getItem('cardCollection');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.cards = data.map(cardData => this.createCardFromData(cardData));
                console.log('Loaded cards from localStorage:', this.cards.length);
            } catch (e) {
                console.error('Error loading cards:', e);
                this.loadDefaultCards();
            }
        } else {
            this.loadDefaultCards();
        }
    }

    createCardFromData(data) {
        switch (data.type) {
            case 'Существо':
                return new CreatureCard(data.id, data.name, data.description, data.cost, data.attack, data.defense, data.imageUrl);
            case 'Заклинание':
                return new SpellCard(data.id, data.name, data.description, data.cost, data.effect, data.duration, data.imageUrl);
            case 'Артефакт':
                return new ArtifactCard(data.id, data.name, data.description, data.cost, data.bonusStat, data.bonusValue, data.imageUrl);
            case 'Герой':
                return new HeroCard(data.id, data.name, data.description, data.cost, data.health, data.ability, data.imageUrl);
            default:
                return new Card(data.id, data.name, data.description, data.cost, data.imageUrl);
        }
    }

    // Дефолтные карты
    loadDefaultCards() {
        console.log('Loading default cards...');
        this.cards = [
            new CreatureCard('c1', 'Звёздный рыцарь', 'Верный защитник Империума, вооружённый силовым мечом', 3, 4, 3, this.gallery.images[0].url),
            new CreatureCard('c2', 'Космический дрон', 'Быстрый разведчик с лёгким вооружением', 2, 2, 1, this.gallery.images[1].url),
            new SpellCard('s1', 'Звёздный дождь', 'Наносит 3 урона всем вражеским существам', 4, '3 урона всем', 1, this.gallery.images[2].url),
            new SpellCard('s2', 'Щит Империума', 'Даёт +2 защиты выбранному существу на 2 хода', 2, '+2 защиты', 2, this.gallery.images[3].url),
            new ArtifactCard('a1', 'Кристалл силы', 'Увеличивает атаку владельца на 2', 3, 'атаку', 2, this.gallery.images[4].url),
            new ArtifactCard('a2', 'Древний свиток', 'Увеличивает максимальное здоровье на 5', 4, 'здоровье', 5, this.gallery.images[5].url),
            new HeroCard('h1', 'Капитан Ордо', 'Легендарный космодесантник, защитник границ', 5, 8, 'Командирский приказ', this.gallery.images[6].url),
            new HeroCard('h2', 'Инквизитор Мор', 'Беспощадный охотник на еретиков', 6, 7, 'Очищение', this.gallery.images[7].url)
        ];
    }

    // Сохранение в localStorage
    saveCards() {
        const data = this.cards.map(card => card.toJSON());
        localStorage.setItem('cardCollection', JSON.stringify(data));
        console.log('Cards saved to localStorage:', this.cards.length);
    }

    // Выбор изображения из галереи
    selectImage(url) {
        this.selectedImageUrl = url;
        const preview = document.getElementById('selectedImagePreview');
        const previewContainer = document.getElementById('galleryPreview');
        
        if (preview && previewContainer) {
            preview.src = url;
            previewContainer.style.display = 'block';
        }
        
        // Обновляем активный класс в галерее
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.classList.remove('selected');
            if (item.dataset.url === url) {
                item.classList.add('selected');
            }
        });
        
        // Обновляем скрытое поле ввода
        const imageUrlInput = document.getElementById('selectedImageUrl');
        if (imageUrlInput) {
            imageUrlInput.value = url;
        }
    }

    // Загрузка своего изображения
    uploadImage(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target.result;
                this.selectImage(url);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    // Добавление карты
    addCard(cardData) {
        let newCard;
        const id = Date.now().toString();
        const imageUrl = this.selectedImageUrl || '';
        
        switch (cardData.type) {
            case 'Существо':
                newCard = new CreatureCard(id, cardData.name, cardData.description, 
                    parseInt(cardData.cost), parseInt(cardData.attack), parseInt(cardData.defense), imageUrl);
                break;
            case 'Заклинание':
                newCard = new SpellCard(id, cardData.name, cardData.description, 
                    parseInt(cardData.cost), cardData.effect, parseInt(cardData.duration), imageUrl);
                break;
            case 'Артефакт':
                newCard = new ArtifactCard(id, cardData.name, cardData.description, 
                    parseInt(cardData.cost), cardData.bonusStat, parseInt(cardData.bonusValue), imageUrl);
                break;
            case 'Герой':
                newCard = new HeroCard(id, cardData.name, cardData.description, 
                    parseInt(cardData.cost), parseInt(cardData.health), cardData.ability, imageUrl);
                break;
            default:
                newCard = new Card(id, cardData.name, cardData.description, parseInt(cardData.cost), imageUrl);
        }
        
        this.cards.push(newCard);
        this.saveCards();
        this.selectedImageUrl = '';
        this.render();
    }

    // Удаление карты
    deleteCard(id) {
        if (confirm('Удалить эту карту?')) {
            this.cards = this.cards.filter(card => card.getId() !== id);
            this.saveCards();
            this.render();
        }
    }

    // Переключение режима редактирования
    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        this.render();
    }

    // Обработчик отправки формы
    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        const cardData = {
            type: formData.get('type'),
            name: formData.get('name'),
            description: formData.get('description'),
            cost: formData.get('cost'),
            imageUrl: this.selectedImageUrl,
            attack: formData.get('attack'),
            defense: formData.get('defense'),
            effect: formData.get('effect'),
            duration: formData.get('duration'),
            bonusStat: formData.get('bonusStat'),
            bonusValue: formData.get('bonusValue'),
            health: formData.get('health'),
            ability: formData.get('ability')
        };
        
        // Валидация
        if (!cardData.name || !cardData.description || !cardData.cost) {
            alert('Пожалуйста, заполните обязательные поля (название, описание, стоимость)');
            return;
        }
        
        this.addCard(cardData);
        form.reset();
        this.selectedImageUrl = '';
        alert('Карта добавлена!');
    }

    // Динамическое изменение формы в зависимости от типа
    updateFormFields() {
        const type = document.getElementById('cardType')?.value;
        const creatureFields = document.getElementById('creatureFields');
        const spellFields = document.getElementById('spellFields');
        const artifactFields = document.getElementById('artifactFields');
        const heroFields = document.getElementById('heroFields');
        
        if (creatureFields) creatureFields.style.display = 'none';
        if (spellFields) spellFields.style.display = 'none';
        if (artifactFields) artifactFields.style.display = 'none';
        if (heroFields) heroFields.style.display = 'none';
        
        if (type === 'Существо' && creatureFields) creatureFields.style.display = 'block';
        if (type === 'Заклинание' && spellFields) spellFields.style.display = 'block';
        if (type === 'Артефакт' && artifactFields) artifactFields.style.display = 'block';
        if (type === 'Герой' && heroFields) heroFields.style.display = 'block';
    }

    // Сборка всего сайта
    render() {
        const appContainer = document.getElementById('app');
        if (!appContainer) {
            console.error('Container #app not found!');
            return;
        }
        
        appContainer.innerHTML = `
            <div class="${this.isEditMode ? 'edit-mode' : ''}">
                <header class="header">
                    <h1>🎴 КОСМИЧЕСКАЯ БИТВА 🎴</h1>
                    <p>Коллекция карт для настольной игры</p>
                    <button id="editModeToggle" class="edit-mode-toggle">✎ Режим редактирования</button>
                </header>
                
                <main class="main-container">
                    <div class="cards-grid" id="cardsGrid">
                        ${this.cards.map(card => card.render()).join('')}
                    </div>
                    
                    <div class="add-card-form" id="addCardForm" style="display: ${this.isEditMode ? 'block' : 'none'}">
                        <h3>➕ Добавить новую карту</h3>
                        <form id="cardForm">
                            <div class="form-group">
                                <label>Тип карты *</label>
                                <select id="cardType" name="type" required>
                                    <option value="Существо">Существо</option>
                                    <option value="Заклинание">Заклинание</option>
                                    <option value="Артефакт">Артефакт</option>
                                    <option value="Герой">Герой</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Название карты *</label>
                                <input type="text" name="name" placeholder="Введите название" required>
                            </div>
                            <div class="form-group">
                                <label>Описание *</label>
                                <textarea name="description" placeholder="Опишите карту" required></textarea>
                            </div>
                            <div class="form-group">
                                <label>Стоимость (мана) *</label>
                                <input type="number" name="cost" placeholder="Стоимость" required>
                            </div>
                            
                            <!-- ГАЛЕРЕЯ ИЗОБРАЖЕНИЙ -->
                            <div class="form-group">
                                ${this.gallery.renderGallery(this.selectedImageUrl)}
                                <input type="hidden" id="selectedImageUrl" name="imageUrl" value="${this.selectedImageUrl}">
                            </div>
                            
                            <div id="creatureFields" style="display: none;">
                                <div class="form-group">
                                    <label>Атака</label>
                                    <input type="number" name="attack" placeholder="Атака">
                                </div>
                                <div class="form-group">
                                    <label>Защита</label>
                                    <input type="number" name="defense" placeholder="Защита">
                                </div>
                            </div>
                            
                            <div id="spellFields" style="display: none;">
                                <div class="form-group">
                                    <label>Эффект заклинания</label>
                                    <input type="text" name="effect" placeholder="Например: 3 урона всем">
                                </div>
                                <div class="form-group">
                                    <label>Длительность (ходы)</label>
                                    <input type="number" name="duration" placeholder="Длительность">
                                </div>
                            </div>
                            
                            <div id="artifactFields" style="display: none;">
                                <div class="form-group">
                                    <label>Бонус к характеристике</label>
                                    <select name="bonusStat">
                                        <option value="атаку">Атака</option>
                                        <option value="защиту">Защита</option>
                                        <option value="здоровье">Здоровье</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Величина бонуса</label>
                                    <input type="number" name="bonusValue" placeholder="2">
                                </div>
                            </div>
                            
                            <div id="heroFields" style="display: none;">
                                <div class="form-group">
                                    <label>Здоровье героя</label>
                                    <input type="number" name="health" placeholder="Здоровье">
                                </div>
                                <div class="form-group">
                                    <label>Способность</label>
                                    <input type="text" name="ability" placeholder="Способность героя">
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit">✨ Добавить карту</button>
                                <button type="button" id="cancelForm">Отмена</button>
                            </div>
                        </form>
                    </div>
                </main>
                
                <footer class="footer">
                    <p>Коллекция карт для игры "Космическая битва" | Всего карт: ${this.cards.length}</p>
                    <p>О великий суп наварили!</p>
                </footer>
            </div>
        `;
        
        this.bindEvents();
    }
    
    bindEvents() {
        const toggleBtn = document.getElementById('editModeToggle');
        if (toggleBtn) {
            toggleBtn.onclick = () => this.toggleEditMode();
        }
        
        const form = document.getElementById('cardForm');
        if (form) {
            form.onsubmit = (e) => this.handleFormSubmit(e);
        }
        
        const cancelBtn = document.getElementById('cancelForm');
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                this.isEditMode = false;
                this.render();
            };
        }
        
        const typeSelect = document.getElementById('cardType');
        if (typeSelect) {
            typeSelect.onchange = () => this.updateFormFields();
            this.updateFormFields();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting app...');
    window.cardApp = new CardApp();
    window.cardApp.init();
});