import { formatPrice } from '../../../utils/formatter';
import AccommodationPresenter from './accommodation-presenter';

class AccommodationPage {
    constructor() {
        console.log('AccommodationPage: Constructor called');
        this._container = null;
        this._presenter = new AccommodationPresenter(this);
    }

    async render(container) {
        console.log('AccommodationPage: Render called');
        this._container = container;
        this._container.innerHTML = `
            <section class="accommodation-page">
                <div class="container">
                    <h1>Akomodasi</h1>
                    <div id="accommodationContent">
                        <div class="loading">
                            <div class="loading__spinner"></div>
                            <p>Memuat akomodasi...</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    async afterRender() {
        console.log('AccommodationPage: afterRender called');
        await this._presenter.init();
        console.log('AccommodationPage: Presenter initialized');
    }

    updateContent(data) {
        console.log('AccommodationPage: updateContent called');
        const content = document.getElementById('accommodationContent');
        if (!content) {
            console.error('AccommodationPage: Content element not found');
            return;
        }

        if (!data || !data.accommodations) {
            content.innerHTML = `
                <div class="error-message">
                    <p>Tidak ada data akomodasi yang tersedia</p>
                </div>
            `;
            return;
        }

        content.innerHTML = `
            <div class="accommodation__grid">
                ${data.accommodations.map(item => this._createAccommodationCard(item)).join('')}
            </div>
        `;

        this._initializeListeners();
    }

    _createAccommodationCard(accommodation) {
        return `
            <div class="accommodation-card">
                <img src="${accommodation.image}" alt="${accommodation.title}" class="accommodation-card__image">
                <div class="accommodation-card__content">
                    <h3 class="accommodation-card__title">${accommodation.title}</h3>
                    <p class="accommodation-card__description">${accommodation.description}</p>
                    <div class="accommodation-card__footer">
                        <div class="accommodation-card__rating">
                            <i class="fas fa-star"></i>
                            <span>${accommodation.rating}</span>
                        </div>
                        <span class="accommodation-card__price">${accommodation.price}</span>
                    </div>
                </div>
            </div>
        `;
    }

    _initializeListeners() {
        // Will be implemented later
    }

    unmount() {
        console.log('AccommodationPage: Unmounting');
        this._container.innerHTML = '';
    }
}

export default AccommodationPage; 