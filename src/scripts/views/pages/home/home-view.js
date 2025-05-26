import '../../../../styles/pages/home.css';
import HomePresenter from './home-presenter';
import heroBg from '../../../../assets/images/hero-bg.jpg';

class HomePage {
    constructor() {
        console.log('HomePage: Constructor called');
        this._presenter = new HomePresenter(this);
    }

    async render(container) {
        console.log('HomePage: Render called');
        this._container = container;
        this._container.innerHTML = `
            <section class="hero" style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${heroBg}')">
                <div class="hero__content">
                    <h1 class="hero__title">Jelajahi Keindahan Indonesia</h1>
                    <p class="hero__description">
                        Temukan destinasi wisata menakjubkan, akomodasi nyaman, dan pengalaman tak terlupakan di seluruh Indonesia.
                    </p>
                    <div class="search-form">
                        <div class="search-form__grid">
                            <input type="text" class="search-form__input" placeholder="Mau kemana?" id="locationInput">
                            <input type="date" class="search-form__input" id="dateInput">
                            <button class="button button--primary" id="searchButton">
                                <i class="fas fa-search"></i>
                                Cari
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <div id="previewSections"></div>
        `;
        console.log('HomePage: Initial HTML rendered');
    }

    async afterRender() {
        console.log('HomePage: afterRender called');
        await this._presenter.init();
        console.log('HomePage: Presenter initialized');
    }

    updateContent({ destinations, accommodations, favorites }) {
        console.log('HomePage: updateContent called with data:', { destinations, accommodations, favorites });
        const previewSections = document.getElementById('previewSections');
        if (!previewSections) {
            console.error('HomePage: previewSections element not found');
            return;
        }

        previewSections.innerHTML = `
            ${this._createPreviewSection(
                'Destinasi Populer',
                'Kunjungi tempat-tempat menakjubkan di seluruh Indonesia',
                destinations || [],
                'destination'
            )}

            ${this._createPreviewSection(
                'Akomodasi Terbaik',
                'Temukan penginapan nyaman untuk liburan Anda',
                accommodations || [],
                'accommodation'
            )}

            ${this._createPreviewSection(
                'Favorit Wisatawan',
                'Pengalaman terbaik yang direkomendasikan wisatawan',
                favorites || [],
                'favorite'
            )}
        `;

        console.log('HomePage: Preview sections added');
        this._initializeListeners();
        console.log('HomePage: Listeners initialized');
    }

    _createPreviewCard(item, type) {
        return `
            <div class="preview-card">
                <img src="${item.image}" alt="${item.title}" class="preview-card__image">
                <div class="preview-card__content">
                    <h3 class="preview-card__title">${item.title}</h3>
                    <p class="preview-card__description">${item.description}</p>
                    <div class="preview-card__footer">
                        <div class="preview-card__rating">
                            <i class="fas fa-star"></i>
                            <span>${item.rating}</span>
                        </div>
                        <span>${type === 'accommodation' ? item.price : item.location}</span>
                    </div>
                </div>
            </div>
        `;
    }

    _createPreviewSection(title, description, items, type) {
        if (!items || items.length === 0) {
            console.log(`HomePage: No items for section ${type}`);
            return '';
        }

        return `
            <section class="preview-section">
                <div class="container">
                    <div class="preview-section__header">
                        <h2 class="preview-section__title">${title}</h2>
                        <p class="preview-section__description">${description}</p>
                    </div>
                    <div class="preview-section__content">
                        ${items.map(item => this._createPreviewCard(item, type)).join('')}
                    </div>
                    <div class="view-more">
                        <a href="#/${type}" class="view-more__button">
                            Lihat Semua
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </section>
        `;
    }

    _initializeListeners() {
        const searchButton = document.getElementById('searchButton');
        const locationInput = document.getElementById('locationInput');
        const dateInput = document.getElementById('dateInput');

        if (searchButton && locationInput && dateInput) {
            searchButton.addEventListener('click', (e) => {
                e.preventDefault();
                this._presenter.handleSearch(
                    locationInput.value,
                    dateInput.value
                );
            });
        }

        const viewMoreButtons = document.querySelectorAll('.view-more__button');
        viewMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const section = button.getAttribute('href').slice(2);
                this._presenter.handleViewMore(section);
            });
        });
    }

    unmount() {
        console.log('HomePage: Unmounting');
        this._container.innerHTML = '';
    }
}

export default HomePage; 