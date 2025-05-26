import DestinationDetailPresenter from './destination-detail-presenter';

class DestinationDetail {
    constructor(id) {
        this._id = id;
        this._container = null;
        this._presenter = new DestinationDetailPresenter(this);
    }

    async render(container) {
        this._container = container;
        this._container.innerHTML = `
            <section class="destination-detail">
                <div class="loading">
                    <div class="loading__spinner"></div>
                    <p>Memuat detail destinasi...</p>
                </div>
            </section>
        `;
    }

    async afterRender() {
        await this._presenter.init(this._id);
    }

    updateContent(destination) {
        const content = `
            <article class="destination-detail">
                <header class="destination-detail__header">
                    <div class="destination-detail__hero" style="background-image: url('${destination.image}')">
                        <div class="destination-detail__overlay">
                            <h1 class="destination-detail__title">${destination.title}</h1>
                            <div class="destination-detail__meta">
                                <div class="destination-detail__rating">
                                    <i class="fas fa-star"></i>
                                    <span>${destination.rating}</span>
                                </div>
                                <div class="destination-detail__location">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>${destination.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div class="destination-detail__content container">
                    <div class="destination-detail__main">
                        <section class="destination-detail__description">
                            <h2>Tentang Destinasi</h2>
                            <p>${destination.description}</p>
                        </section>

                        <section class="destination-detail__gallery">
                            <h2>Galeri Foto</h2>
                            <div class="gallery-grid">
                                ${this._createGallery(destination.gallery)}
                            </div>
                        </section>

                        <section class="destination-detail__info">
                            <h2>Informasi Penting</h2>
                            <div class="info-grid">
                                ${this._createInfoItems(destination.info)}
                            </div>
                        </section>

                        <section class="destination-detail__activities">
                            <h2>Aktivitas yang Bisa Dilakukan</h2>
                            <div class="activities-grid">
                                ${this._createActivities(destination.activities)}
                            </div>
                        </section>
                    </div>

                    <aside class="destination-detail__sidebar">
                        <div class="destination-detail__map">
                            <h2>Lokasi</h2>
                            <div id="map" class="map-container"></div>
                            <div class="map-info">
                                <p>${destination.address}</p>
                                <button class="button button--outline" id="directionsButton">
                                    <i class="fas fa-directions"></i>
                                    Petunjuk Arah
                                </button>
                            </div>
                        </div>

                        <div class="destination-detail__reviews">
                            <h2>Review Pengunjung</h2>
                            <div class="reviews-list">
                                ${this._createReviews(destination.reviews)}
                            </div>
                            <button class="button button--primary" id="addReviewButton">
                                <i class="fas fa-plus"></i>
                                Tulis Review
                            </button>
                        </div>

                        <div class="destination-detail__recommendations">
                            <h2>Rekomendasi Lainnya</h2>
                            <div class="recommendations-list">
                                ${this._createRecommendations(destination.recommendations)}
                            </div>
                        </div>
                    </aside>
                </div>
            </article>
        `;

        this._container.innerHTML = content;
        this._initializeMap(destination.coordinates);
        this._initializeListeners();
    }

    _createGallery(gallery) {
        return gallery.map(image => `
            <div class="gallery-item">
                <img src="${image.url}" alt="${image.caption}" loading="lazy">
                <p class="gallery-item__caption">${image.caption}</p>
            </div>
        `).join('');
    }

    _createInfoItems(info) {
        return Object.entries(info).map(([key, value]) => `
            <div class="info-item">
                <h3>${key}</h3>
                <p>${value}</p>
            </div>
        `).join('');
    }

    _createActivities(activities) {
        return activities.map(activity => `
            <div class="activity-item">
                <i class="fas ${activity.icon}"></i>
                <h3>${activity.name}</h3>
                <p>${activity.description}</p>
            </div>
        `).join('');
    }

    _createReviews(reviews) {
        return reviews.map(review => `
            <div class="review-item">
                <div class="review-item__header">
                    <img src="${review.userPhoto}" alt="${review.userName}" class="review-item__photo">
                    <div class="review-item__meta">
                        <h3>${review.userName}</h3>
                        <div class="review-item__rating">
                            ${this._createRatingStars(review.rating)}
                        </div>
                        <span class="review-item__date">${review.date}</span>
                    </div>
                </div>
                <p class="review-item__content">${review.content}</p>
            </div>
        `).join('');
    }

    _createRatingStars(rating) {
        return Array.from({ length: 5 }, (_, index) => `
            <i class="fas fa-star${index < rating ? '' : '-o'}"></i>
        `).join('');
    }

    _createRecommendations(recommendations) {
        return recommendations.map(item => `
            <div class="recommendation-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="recommendation-item__content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <a href="#/destination/${item.id}" class="button button--text">
                        Lihat Detail
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `).join('');
    }

    _initializeMap(coordinates) {
        // Implement map initialization using your preferred map provider
        // Example: Google Maps, Leaflet, etc.
    }

    _initializeListeners() {
        const directionsButton = document.getElementById('directionsButton');
        const addReviewButton = document.getElementById('addReviewButton');

        if (directionsButton) {
            directionsButton.addEventListener('click', () => {
                this._presenter.handleDirections();
            });
        }

        if (addReviewButton) {
            addReviewButton.addEventListener('click', () => {
                this._presenter.handleAddReview();
            });
        }
    }

    unmount() {
        this._container.innerHTML = '';
    }
}

export default DestinationDetail; 