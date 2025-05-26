import FavoritePresenter from './favorite-presenter';

class FavoritePage {
    constructor() {
        console.log('FavoritePage: Constructor called');
        this._container = null;
        this._presenter = new FavoritePresenter(this);
    }

    async render(container) {
        console.log('FavoritePage: Render called');
        this._container = container;
        this._container.innerHTML = `
            <section class="favorite-page">
                <div class="container">
                    <h1>Favorit</h1>
                    <div id="favoriteContent">
                        <div class="loading">
                            <div class="loading__spinner"></div>
                            <p>Memuat favorit...</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    async afterRender() {
        console.log('FavoritePage: afterRender called');
        await this._presenter.init();
        console.log('FavoritePage: Presenter initialized');
    }

    updateContent(data) {
        console.log('FavoritePage: updateContent called');
        const content = document.getElementById('favoriteContent');
        if (!content) {
            console.error('FavoritePage: Content element not found');
            return;
        }

        if (!data || (!data.destinations?.length && !data.accommodations?.length)) {
            content.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart-broken"></i>
                    <p>Belum ada item favorit</p>
                    <a href="#/" class="button button--primary">Jelajahi Sekarang</a>
                </div>
            `;
            return;
        }

        content.innerHTML = `
            ${this._createSection('Destinasi Favorit', data.destinations || [])}
            ${this._createSection('Akomodasi Favorit', data.accommodations || [])}
        `;

        this._initializeListeners();
    }

    _createSection(title, items) {
        if (!items.length) return '';

        return `
            <div class="favorite-section">
                <h2 class="favorite-section__title">${title}</h2>
                <div class="favorite-section__grid">
                    ${items.map(item => this._createFavoriteCard(item)).join('')}
                </div>
            </div>
        `;
    }

    _createFavoriteCard(item) {
        return `
            <div class="favorite-card">
                <img src="${item.image}" alt="${item.title}" class="favorite-card__image">
                <div class="favorite-card__content">
                    <h3 class="favorite-card__title">${item.title}</h3>
                    <p class="favorite-card__description">${item.description}</p>
                    <div class="favorite-card__footer">
                        <div class="favorite-card__rating">
                            <i class="fas fa-star"></i>
                            <span>${item.rating}</span>
                        </div>
                        <button class="favorite-card__remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                            Hapus dari Favorit
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    _initializeListeners() {
        const removeButtons = this._container.querySelectorAll('.favorite-card__remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                this._presenter.removeFavorite(id);
            });
        });
    }

    unmount() {
        this._container.innerHTML = '';
    }
}

export default FavoritePage; 