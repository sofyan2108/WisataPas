import FavoritePresenter from './favorite-presenter';

class FavoritePage {
    constructor() {
        console.log('FavoritePage: Constructor called');
        this._container = null;
        this._presenter = null;
    }

    setPresenter(presenter) {
        this._presenter = presenter;
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
            <div class="fullscreen-loader">
                <div class="fullscreen-loader__content">
                    <div class="fullscreen-loader__spinner"></div>
                    <p class="fullscreen-loader__text">Menghapus dari favorit...</p>
                </div>
            </div>
        `;
    }

    async afterRender() {
        console.log('FavoritePage: afterRender called');
        if (this._presenter) {
        await this._presenter.init();
        console.log('FavoritePage: Presenter initialized');
        } else {
            console.error('FavoritePage: Presenter not set');
            // Optionally, show an error message to the user
            this.showError('Terjadi kesalahan: Presenter belum diinisialisasi.');
        }
    }

    updateContent(data) {
        console.log('FavoritePage: updateContent called with', data);
        const favoriteContent = document.getElementById('favoriteContent');
        
        if (!data.destinations || !data.destinations.length) {
            favoriteContent.innerHTML = `
                <div class="empty-state">
                    <h2>Belum ada favorit</h2>
                    <p>Anda belum menambahkan destinasi ke favorit.</p>
                </div>
            `;
            return;
        }

        // Group destinations by category
        const destinationsByCategory = data.destinations.reduce((acc, destination) => {
            const category = destination.category || '';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(destination);
            return acc;
        }, {});

        // Create sections for each category
        const sections = Object.entries(destinationsByCategory).map(([category, items]) => {
            return this._createSection(category, items);
        });

        favoriteContent.innerHTML = sections.join('');
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
        console.log('DEBUG FAVORITE: Creating favorite card with ID:', item.id);
        console.log('DEBUG FAVORITE: Card image URL:', item.Link_Img || item.image);
        
        return `
            <div class="favorite-card" 
                data-id="${item.id}" 
                data-place-id="${item.Place_Id || item.id}"
                data-image="${item.Link_Img || item.image}" 
                data-place-name="${item.Place_Name}" 
                data-description="${item.Description || ''}" 
                data-category="${item.Category || 'N/A'}" 
                data-city="${item.City || 'N/A'}" 
                data-rating="${item.Rating || 'N/A'}" 
                data-price="${item.Price || 'N/A'}"
                data-time="${item.Time_Minutes || 'N/A'}"
                data-lat="${item.Lat || ''}"
                data-long="${item.Long || ''}"
                data-gen-text="${item.gen_text || ''}">
                <img src="${item.Link_Img || item.image}" alt="${item.Place_Name}" class="favorite-card__image" onerror="this.onerror=null; this.src='/src/assets/images/placeholder.jpg';">
                <div class="favorite-card__content">
                    <h3 class="favorite-card__title">${item.Place_Name}</h3>
                    <p class="favorite-card__description">${item.Description || ''}</p>
                    <div class="favorite-card__info">
                        <p><i class="fas fa-tag"></i> ${item.Category || 'N/A'}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${item.City || 'N/A'}</p>
                        <p><i class="fas fa-star"></i> ${item.Rating || 'N/A'}</p>
                        <p><i class="fas fa-ticket-alt"></i> ${item.Price || 'N/A'}</p>
                    </div>
                    <div class="favorite-card__footer">
                        <button class="favorite-card__view-detail">
                            <i class="fas fa-info-circle"></i>
                            Lihat Detail
                        </button>
                        <button class="favorite-card__remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    _initializeListeners() {
        const removeButtons = this._container.querySelectorAll('.favorite-card__remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.dataset.id;
                this.showLoader(); // Show loader before removing
                try {
                    await this._presenter.removeFavorite(id);
                } finally {
                    this.hideLoader(); // Hide loader after operation completes
                }
            });
        });

        const viewDetailButtons = this._container.querySelectorAll('.favorite-card__view-detail');
        viewDetailButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.favorite-card');
                const destinationData = {
                    id: card.dataset.id,
                    Place_Id: card.dataset.placeId,
                    Place_Name: card.dataset.placeName,
                    Category: card.dataset.category,
                    City: card.dataset.city,
                    Rating: card.dataset.rating,
                    image: card.dataset.image,
                    Link_Img: card.dataset.image,
                    Description: card.dataset.description,
                    Price: card.dataset.price,
                    Time_Minutes: card.dataset.time,
                    Lat: card.dataset.lat,
                    Long: card.dataset.long,
                    gen_text: card.dataset.genText
                };
                this._presenter.showDestinationDetail(destinationData);
            });
        });
    }

    showMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>${message}</p>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showLoader() {
        const loader = this._container.querySelector('.fullscreen-loader');
        if (loader) {
            loader.classList.add('active');
        }
    }

    hideLoader() {
        const loader = this._container.querySelector('.fullscreen-loader');
        if (loader) {
            loader.classList.remove('active');
        }
    }

    unmount() {
        this._container.innerHTML = '';
    }
}

export default FavoritePage; 