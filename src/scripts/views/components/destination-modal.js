class DestinationModal {
    constructor() {
        this._modal = null;
        this._presenter = null;
    }

    setPresenter(presenter) {
        this._presenter = presenter;
    }

    render() {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        modalContainer.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title"></h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="" alt="Destination Image">
                    </div>
                    <div class="modal-info">
                        <div class="info-section">
                            <h3>Informasi Umum</h3>
                            <p class="category"><i class="fas fa-tag"></i> <span></span></p>
                            <p class="location"><i class="fas fa-map-marker-alt"></i> <span></span></p>
                            <p class="rating"><i class="fas fa-star"></i> <span></span></p>
                            <p class="price"><i class="fas fa-ticket-alt"></i> <span></span></p>
                        </div>
                        <div class="info-section">
                            <h3>Deskripsi</h3>
                            <p class="description"></p>
                        </div>
                        <div class="info-section map-section">
                            <h3>Lokasi</h3>
                            <p class="coordinates"></p>
                            <div id="map-container-${Math.random().toString(36).substr(2, 9)}" class="map-container">
                                <!-- Map will be loaded here -->
                            </div>
                            <p class="google-maps-link-container" style="margin-top: 10px; text-align: center;">
                                <a href="#" id="google-maps-link" target="_blank" rel="noopener noreferrer">Cek di Google Maps!</a>
                            </p>
                        </div>
                        <div class="info-section">
                            <h3>Deskripsi AI</h3>
                            <p class="ai-description"></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="favorite-btn">
                        <i class="fas fa-heart"></i> Tambah ke Favorit
                    </button>
                    <button class="like-btn">
                        <i class="fas fa-thumbs-up"></i> Like
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modalContainer);
        this._modal = modalContainer;
        this._initializeListeners();
    }

    show(destination) {
        if (!this._modal) {
            this.render();
        }

        // Reset modal content
        const modalContent = this._modal.querySelector('.modal-content');
        modalContent.dataset.id = destination.id || destination.Place_Id || '';
        modalContent.dataset.placeName = destination.Place_Name || '';
        modalContent.dataset.category = destination.Category || '';
        modalContent.dataset.city = destination.City || '';
        modalContent.dataset.rating = destination.Rating || '';
        modalContent.dataset.image = destination.Link_Img || destination.image || '';
        modalContent.dataset.description = destination.Description || '';
        modalContent.dataset.price = destination.Price || '';
        modalContent.dataset.time = destination.Time_Minutes || '';
        modalContent.dataset.lat = destination.Lat || '';
        modalContent.dataset.long = destination.Long || '';
        modalContent.dataset.genText = destination.gen_text || '';

        console.log('DEBUG MODAL: Showing destination with data:', destination);

        // Update modal content
        this._modal.querySelector('.modal-title').textContent = destination.Place_Name;

        // Set image source with error handling and fallback
        const modalImageElement = this._modal.querySelector('.modal-image img');
        const imageUrlToDisplay = destination.Link_Img || destination.image || '/src/assets/images/hero-bg.jpg';
        console.log('DEBUG MODAL: Using image URL:', imageUrlToDisplay);
        
        modalImageElement.src = imageUrlToDisplay;
        modalImageElement.alt = destination.Place_Name;
        modalImageElement.onerror = function() {
            // Failed to load image, falling back to default.
            console.log('DEBUG MODAL: Image failed to load, using fallback');
            this.onerror = null;
            this.src = '/src/assets/images/hero-bg.jpg';
        };
        
        // Update general info
        this._modal.querySelector('.category span').textContent = destination.Category;
        this._modal.querySelector('.location span').textContent = destination.City;
        this._modal.querySelector('.rating span').textContent = destination.Rating;
        this._modal.querySelector('.price span').textContent = destination.Price;
        
        // Update description
        this._modal.querySelector('.description').textContent = destination.Description;
        
        // Update coordinates and initialize map
        const coordinatesElement = this._modal.querySelector('.coordinates');
        const mapContainer = this._modal.querySelector('.map-container');

        if (destination.Lat && destination.Long) {
            coordinatesElement.textContent = `Latitude: ${destination.Lat}, Longitude: ${destination.Long}`;
            coordinatesElement.style.display = 'none'; // Hide text coordinates if map is shown

            // Clear previous map if it exists and create new one
            if (this._map) {
                this._map.remove();
                this._map = null; // Set to null after removing
            }

            // Check if Leaflet (L) is defined before initializing map
            if (typeof window.L !== 'undefined') {
                this._map = this._initLeafletMap(mapContainer.id, parseFloat(destination.Lat), parseFloat(destination.Long));
                mapContainer.style.display = 'block'; // Show map container
            } else {
                console.warn('Leaflet (L) is not defined yet (window.L is undefined), delaying map initialization.');
                // Retry map initialization after a short delay
                setTimeout(() => {
                    if (typeof window.L !== 'undefined') {
                        this._map = this._initLeafletMap(mapContainer.id, parseFloat(destination.Lat), parseFloat(destination.Long));
                        mapContainer.style.display = 'block';
                        coordinatesElement.style.display = 'none'; // Hide coordinates if map loads now
                    } else {
                        console.error('Leaflet (L) still not defined after 1000ms delay (window.L is undefined). Map cannot be initialized.');
                        mapContainer.style.display = 'none';
                        coordinatesElement.style.display = 'block';
                    }
                }, 1000); // Retry after 1000ms (1 second)
            }

            // Set Google Maps link
            const googleMapsLink = this._modal.querySelector('#google-maps-link');
            if (googleMapsLink) {
                const lat = parseFloat(destination.Lat);
                const lng = parseFloat(destination.Long);
                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                googleMapsLink.href = googleMapsUrl;
                googleMapsLink.parentElement.style.display = 'block'; // Show the link container
            }

        } else {
            coordinatesElement.textContent = 'Koordinat tidak tersedia';
            coordinatesElement.style.display = 'block';
            mapContainer.style.display = 'none'; // Hide map container
            if (this._map) {
                this._map.remove();
                this._map = null;
            }
            // Hide Google Maps link if no coordinates
            const googleMapsLink = this._modal.querySelector('#google-maps-link');
            if (googleMapsLink) {
                googleMapsLink.parentElement.style.display = 'none';
            }
        }
        
        // Update AI description if available
        const aiDescription = this._modal.querySelector('.ai-description');
        if (destination.gen_text) {
            aiDescription.textContent = destination.gen_text;
            aiDescription.parentElement.style.display = 'block';
        } else {
            aiDescription.parentElement.style.display = 'none';
        }

        // Reset favorite button state every time modal is opened
        const favoriteBtn = this._modal.querySelector('.favorite-btn');
        if (favoriteBtn) {
            // Remove any existing classes and reset state
            favoriteBtn.className = 'favorite-btn';
            favoriteBtn.disabled = false;
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Tambah ke Favorit';
            favoriteBtn.style.display = 'block';
            favoriteBtn.style.backgroundColor = ''; // Reset background color
            favoriteBtn.style.cursor = 'pointer'; // Reset cursor
        }

        // Check if we're in the favorite page
        const isFavoritePage = window.location.hash === '#/favorite';
        if (isFavoritePage) {
            favoriteBtn.style.display = 'none';
        }

        // Reset like button state every time modal is opened
        const likeBtn = this._modal.querySelector('.like-btn');
        if (likeBtn) {
            // Remove any existing classes and reset state
            likeBtn.className = 'like-btn';
            likeBtn.disabled = false;
            likeBtn.innerHTML = '<i class="fas fa-thumbs-up"></i> Like';
            likeBtn.style.backgroundColor = '';
            likeBtn.style.cursor = 'pointer';
        }

        // Check if this destination is already liked
        const likedDestination = sessionStorage.getItem('likedDestination');
        if (likedDestination && JSON.parse(likedDestination).id === (destination.id || destination.Place_Id)) {
            this.setLikeButtonState(true);
        }

        // Show modal
        this._modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Invalidate map size after modal is active to ensure proper rendering
        if (this._map && destination.Lat && destination.Long) {
            const currentLat = parseFloat(destination.Lat);
            const currentLng = parseFloat(destination.Long);
            setTimeout(() => {
                this._map.invalidateSize();
                // After invalidating, explicitly re-center the map view and pan to ensure it's truly centered
                this._map.setView([currentLat, currentLng], this._map.getZoom());
                this._map.panTo([currentLat, currentLng]); // Added panTo
            }, 1000); // Increased delay to 1000ms
        }
    }

    setFavoriteButtonState(isAdded) {
        const favoriteBtn = this._modal.querySelector('.favorite-btn');
        if (favoriteBtn) {
            if (isAdded) {
                favoriteBtn.classList.add('added');
                favoriteBtn.disabled = true;
                favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Added to Favorite';
                favoriteBtn.style.backgroundColor = '#6c757d';
                favoriteBtn.style.cursor = 'not-allowed';
            } else {
                favoriteBtn.classList.remove('added');
                favoriteBtn.disabled = false;
                favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Tambah ke Favorit';
                favoriteBtn.style.backgroundColor = '';
                favoriteBtn.style.cursor = 'pointer';
            }
        }
    }

    setLikeButtonState(isLiked) {
        const likeBtn = this._modal.querySelector('.like-btn');
        if (likeBtn) {
            if (isLiked) {
                likeBtn.classList.add('liked');
                likeBtn.disabled = true;
                likeBtn.innerHTML = '<i class="fas fa-thumbs-up"></i> Liked';
                likeBtn.style.backgroundColor = '#6c757d';
                likeBtn.style.cursor = 'not-allowed';
            } else {
                likeBtn.classList.remove('liked');
                likeBtn.disabled = false;
                likeBtn.innerHTML = '<i class="fas fa-thumbs-up"></i> Like';
                likeBtn.style.backgroundColor = '';
                likeBtn.style.cursor = 'pointer';
            }
        }
    }

    hide() {
        if (this._modal) {
            this._modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    _initializeListeners() {
        // Close button
        const closeBtn = this._modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        // Overlay click
        const overlay = this._modal.querySelector('.modal-overlay');
        overlay.addEventListener('click', () => this.hide());

        // Favorite button
        const favoriteBtn = this._modal.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', async () => {
            const modalContent = this._modal.querySelector('.modal-content');
            const destinationData = {
                id: modalContent.dataset.id,
                Place_Id: modalContent.dataset.id,
                Place_Name: modalContent.dataset.placeName,
                Category: modalContent.dataset.category,
                City: modalContent.dataset.city,
                Rating: modalContent.dataset.rating,
                image: modalContent.dataset.image,
                Link_Img: modalContent.dataset.image,
                Description: modalContent.dataset.description,
                Price: modalContent.dataset.price,
                Time_Minutes: modalContent.dataset.time,
                Lat: modalContent.dataset.lat,
                Long: modalContent.dataset.long,
                gen_text: modalContent.dataset.genText
            };
            
            // Check if we're in the favorite page by checking the current URL
            const isFavoritePage = window.location.hash === '#/favorite';
            if (isFavoritePage) {
                // Hide favorite button if we're already in the favorite page
                favoriteBtn.style.display = 'none';
            } else {
                try {
                    // Show loader before adding to favorite
                    if (this._presenter._view.showLoader) {
                        this._presenter._view.showLoader();
                    }
                    await this._presenter.handleAddToFavorite(destinationData);
                } finally {
                    // Hide loader after operation completes
                    if (this._presenter._view.hideLoader) {
                        this._presenter._view.hideLoader();
                    }
                }
            }
        });

        // Like button
        const likeBtn = this._modal.querySelector('.like-btn');
        likeBtn.addEventListener('click', () => {
            const placeName = this._modal.querySelector('.modal-title').textContent;
            this._presenter.handleLike(placeName, likeBtn);
        });

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._modal.classList.contains('active')) {
                this.hide();
            }
        });
    }

    // New method for Leaflet Map initialization
    _initLeafletMap(mapId, lat, lng) {
        console.log('DEBUG MAP INIT: Initializing Leaflet map with Lat:', lat, 'Long:', lng);
        const map = window.L.map(mapId).setView([lat, lng], 15);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        window.L.marker([lat, lng]).addTo(map)
            .bindPopup('<b>Lokasi Destinasi</b>', { offset: [-49, 0] })
            .openPopup();
        
        return map; // Return the map instance
    }
}

export default DestinationModal; 