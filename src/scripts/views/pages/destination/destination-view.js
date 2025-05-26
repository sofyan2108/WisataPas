import DestinationPresenter from './destination-presenter';

class DestinationPage {
    constructor() {
        console.log('DestinationPage: Constructor called');
        this._container = null;
        this._presenter = new DestinationPresenter(this);
    }

    async render(container) {
        console.log('DestinationPage: Render called');
        this._container = container;
        this._container.innerHTML = `
            <section class="destination-page">
                <div class="container">
                    <h1>Destinasi Wisata</h1>
                    <div id="destinationContent">
                        <div class="loading">
                            <div class="loading__spinner"></div>
                            <p>Memuat destinasi...</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    async afterRender() {
        console.log('DestinationPage: afterRender called');
        await this._presenter.init();
        console.log('DestinationPage: Presenter initialized');
    }

    updateContent(data) {
        console.log('DestinationPage: updateContent called');
        const content = document.getElementById('destinationContent');
        if (!content) {
            console.error('DestinationPage: Content element not found');
            return;
        }

        if (!data || !data.destinations) {
            content.innerHTML = `
                <div class="error-message">
                    <p>Tidak ada data destinasi yang tersedia</p>
                </div>
            `;
            return;
        }

        content.innerHTML = `
            <div class="destination__grid">
                ${data.destinations.map(item => this._createDestinationCard(item)).join('')}
            </div>
        `;

        this._initializeListeners();
    }

    _createDestinationCard(destination) {
        return `
            <div class="destination-card">
                <img src="${destination.image}" alt="${destination.title}" class="destination-card__image">
                <div class="destination-card__content">
                    <h3 class="destination-card__title">${destination.title}</h3>
                    <p class="destination-card__description">${destination.description}</p>
                    <div class="destination-card__footer">
                        <div class="destination-card__rating">
                            <i class="fas fa-star"></i>
                            <span>${destination.rating}</span>
                        </div>
                        <span class="destination-card__location">${destination.location}</span>
                    </div>
                </div>
            </div>
        `;
    }

    _initializeListeners() {
        // Will be implemented later
    }

    unmount() {
        this._container.innerHTML = '';
    }
}

export default DestinationPage; 