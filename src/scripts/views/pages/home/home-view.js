import '../../../../styles/pages/home.css';
import heroBg from '../../../../assets/images/hero-bg.jpg';

class HomePage {
    constructor() {
        console.log('HomePage: Constructor called');
        this._container = null;
        this._presenter = null;
    }

    setPresenter(presenter) {
        this._presenter = presenter;
    }

    async render(container) {
        console.log('HomePage: Render called');
        this._container = container;
        this._container.innerHTML = `
            <section class="hero"></section>
            <div id="previewSections"></div>
        `;
        console.log('HomePage: Initial HTML rendered');
        this._initializeSmoothScroll();
    }

    _initializeSmoothScroll() {
        const exploreButton = document.querySelector('.hero__explore-button');
        if (exploreButton) {
            exploreButton.addEventListener('click', (e) => {
                e.preventDefault();
                const destinationsSection = document.getElementById('destinations');
                if (destinationsSection) {
                    destinationsSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    async afterRender() {
        console.log('HomePage: afterRender called');
        if (this._presenter) {
        await this._presenter.init();
        console.log('HomePage: Presenter initialized');
        } else {
            console.error('HomePage: Presenter not set');
        }
    }

    updateContent({ destinations, favorites }) {
        console.log('HomePage: updateContent called with data:', { destinations, favorites });
        
        // Update hero section with background carousel
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.innerHTML = `
                <div class="hero-content">
                    <h1 class="hero-title">Jelajahi Keindahan Indonesia</h1>
                    <p class="hero-description">Temukan destinasi wisata terbaik di seluruh Indonesia</p>
                    <a href="#/destination" class="cta-button">Jelajahi Sekarang</a>
                </div>
                <div class="hero-backgrounds">
                    ${destinations ? destinations.slice(0, 5).map((dest, index) => `
                        <div class="hero-background ${index === 0 ? 'active' : ''}" 
                             style="background-image: url('${dest.Link_Img || '/src/assets/images/hero-bg.jpg'}')">
                            <div class="hero-overlay"></div>
                        </div>
                    `).join('') : ''}
                </div>
            `;
            
            // Initialize background carousel
            this._initializeBackgroundCarousel();
        }

        const previewSections = document.getElementById('previewSections');
        if (!previewSections) {
            console.error('HomePage: previewSections element not found');
            return;
        }

        // Check if user is logged in
        // const isLoggedIn = localStorage.getItem('user') !== null;

        previewSections.innerHTML = `
            <section id="destinations" class="preview-section">
                <div class="container">
                    <div class="preview-section__header">
                        <h2 class="preview-section__title">Destinasi Populer</h2>
                        <p class="preview-section__description">Kunjungi tempat-tempat menakjubkan di seluruh Indonesia</p>
                    </div>
                    <div class="popular-container">
                        <div class="popular-scroll">
                            ${destinations ? destinations.map(destination => this._createDestinationCard(destination)).join('') : ''}
                            ${destinations ? destinations.map(destination => this._createDestinationCard(destination)).join('') : ''}
                        </div>
                    </div>
                </div>
            </section>
        `;

        console.log('HomePage: Preview sections added');
        this._initializeListeners();
        console.log('HomePage: Listeners initialized');
    }

    _initializeBackgroundCarousel() {
        const backgrounds = document.querySelectorAll('.hero-background');
        if (!backgrounds.length) return;

        let currentIndex = 0;
        const interval = 5000; // Change background every 5 seconds

        const changeBackground = () => {
            backgrounds[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % backgrounds.length;
            backgrounds[currentIndex].classList.add('active');
        };

        // Start the carousel
        setInterval(changeBackground, interval);
    }

    _createDestinationCard(destination) {
        return `
            <div class="popular-destination-card">
                <div class="destination-image">
                    <img src="${destination.Link_Img || '/src/assets/images/hero-bg.jpg'}" alt="${destination.Place_Name}">
                </div>
                <div class="destination-info">
                    <h3>${destination.Place_Name}</h3>
                    <div class="result-info">
                        <p><i class="fas fa-tag"></i> ${destination.Category || 'N/A'}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${destination.City || 'N/A'}</p>
                        <p><i class="fas fa-star"></i> ${destination.Rating || 'N/A'}</p>
                    </div>
                </div>
            </div>
        `;
    }

    _createPreviewCard(item, type) {
        return `
            <div class="preview-card">
                <img src="${item.image}" alt="${item.Place_Name}" class="preview-card__image">
                <div class="preview-card__content">
                    <h3 class="preview-card__title">${item.Place_Name}</h3>
                    <p class="preview-card__description">${item.Description || ''}</p>
                    <div class="preview-card__footer">
                        <div class="preview-card__rating">
                            <i class="fas fa-star"></i>
                            <span>${item.Rating}</span>
                        </div>
                        <span class="preview-card__location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${item.City}
                        </span>
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
                        <a href="#/${type}" class="view-more__button" data-type="${type}">
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
                if (this._presenter) {
                this._presenter.handleSearch(
                    locationInput.value,
                    dateInput.value
                );
                } else {
                    console.error('HomePage: Presenter not set');
                }
            });
        }

        const viewMoreButtons = document.querySelectorAll('.view-more__button');
        viewMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const isLoggedIn = !!sessionStorage.getItem('authTokenId');
                const type = button.dataset.type;

                if (!isLoggedIn) {
                    // Tampilkan notifikasi
                    const notification = document.createElement('div');
                    notification.className = 'notification';
                    notification.innerHTML = `
                        <div class="notification__content">
                            <i class="fas fa-info-circle"></i>
                            <p>Silakan login terlebih dahulu untuk mengakses halaman ${type === 'destination' ? 'Destinasi' : 'Favorit'}</p>
                        </div>
                    `;
                    document.body.appendChild(notification);

                    // Hapus notifikasi setelah 3 detik
                    setTimeout(() => {
                        notification.remove();
                    }, 3000);

                    // Redirect ke halaman login
                    window.location.hash = '#/login';
                    return;
                }

                // Jika sudah login, lanjutkan ke halaman yang dituju
                window.location.hash = `#/${type}`;
            });
        });
    }

    unmount() {
        console.log('HomePage: Unmounting');
        this._container.innerHTML = '';
    }
}

export default HomePage; 