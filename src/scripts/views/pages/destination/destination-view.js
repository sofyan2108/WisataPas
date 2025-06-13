import DestinationPresenter from './destination-presenter';
import DestinationModal from '../../components/destination-modal';
import '../../../../styles/destination.css';

class DestinationPage {
    constructor() {
        console.log('DestinationPage: Constructor called');
        this._container = null;
        this._presenter = new DestinationPresenter(this);
        this._modal = new DestinationModal();
        this._modal.setPresenter(this._presenter);
        this._searchResultsAll = [];
        this._currentPage = 1;
        this._itemsPerPage = 3;
    }

    async render(container) {
        console.log('DestinationPage: Render called');
        this._container = container;
        this._container.innerHTML = `
            <section class="destination-page">
                <div class="container">
                    <h1>Destinasi</h1>
                    <div class="search-container">
                        <!-- SECTION 2: Search (pindah ke atas) -->
                        <section>
                            <h2>Cari Tempat Wisata</h2>
                            <div class="search-section">
                                <input type="text" id="searchInput" placeholder="Nama tempat atau kata kunci...">
                                
                                <select id="categorySelect">
                                    <option value="">-- Pilih Kategori --</option>
                                    <option value="Budaya">Budaya</option>
                                    <option value="Taman Hiburan">Taman Hiburan</option>
                                    <option value="Cagar Alam">Cagar Alam</option>
                                    <option value="Bahari">Bahari</option>
                                    <option value="Pusat Perbelanjaan">Pusat Perbelanjaan</option>
                                    <option value="Tempat Ibadah">Tempat Ibadah</option>
                                </select>

                                <select id="locationSelect" size="1" style="max-height: 25dvh; overflow-y: auto;">
                                    <option value="">-- Pilih Kota --</option>
                                    <option value="Jakarta">Jakarta</option>
                                    <option value="Yogyakarta">Yogyakarta</option>
                                    <option value="Bandung">Bandung</option>
                                    <option value="Semarang">Semarang</option>
                                    <option value="Surabaya">Surabaya</option>
                                    <option value="Malang">Malang</option>
                                    <option value="Batu">Batu</option>
                                    <option value="Solo">Solo</option>
                                    <option value="Karanganyar">Karanganyar</option>
                                    <option value="Klaten">Klaten</option>
                                    <option value="Boyolali">Boyolali</option>
                                    <option value="Sragen">Sragen</option>
                                    <option value="Sukoharjo">Sukoharjo</option>
                                    <option value="Jember">Jember</option>
                                </select>

                                <button id="searchButton">Cari</button>
                            </div>

                            <div id="searchResults" style="display: none;">
                                <!-- Search Results Loader -->
                                <div class="search-results-loader">
                                    <div class="search-results-loader__spinner"></div>
                                    <div class="search-results-loader__text">Mencari destinasi...</div>
                                </div>
                                <h3>Hasil Pencarian:</h3>
                                <div id="searchOutput"></div>
                            </div>
                        </section>

                        <!-- SECTION 1: Popular Destinations (pindah ke bawah) -->
                        <section>
                            <div class="section-title">
                                <h2>Destinasi Populer</h2>
                                <p>Temukan destinasi wisata terbaik untuk liburan Anda</p>
                            </div>
                            <div id="popularDestinations">
                                <!-- Popular destinations will be loaded here -->
                            </div>
                        </section>

                        <!-- SECTION 3: Recommendations -->
                        <section>
                            <h2>Rekomendasi Untukmu</h2>
                            <div class="recommendation-section">
                                <input type="hidden" id="usernameInput" placeholder="Masukkan User ID" readonly>
                                <button id="recommendationButton"><i class="fa-solid fa-wand-magic-sparkles"></i> Dapatkan Rekomendasi</button>
                            </div>

                            <div id="recommendations" style="display: none;">
                                <!-- Recommendation Results Loader -->
                                <div class="recommendation-results-loader">
                                    <div class="recommendation-results-loader__spinner"></div>
                                    <div class="recommendation-results-loader__text">Mendapatkan rekomendasi...</div>
                                </div>
                                <h3>Hasil Rekomendasi:</h3>
                                <div id="recommendationOutput"></div>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
            <div class="fullscreen-loader">
                <div class="fullscreen-loader__content">
                    <div class="fullscreen-loader__spinner"></div>
                    <p class="fullscreen-loader__text">Menambahkan ke favorit...</p>
                </div>
            </div>
        `;

        this._initializeListeners();
    }

    async afterRender() {
        console.log('DestinationPage: afterRender called');
        await this._presenter.init();
        console.log('DestinationPage: Presenter initialized');
    }

    showSearchLoading() {
        const searchResults = document.getElementById('searchResults');
        const loader = searchResults.querySelector('.search-results-loader');
        if (searchResults && loader) {
            searchResults.style.display = 'block';
            loader.classList.add('active');
        }
    }

    hideSearchLoading() {
        const loader = document.querySelector('.search-results-loader');
        if (loader) {
            loader.classList.remove('active');
        }
    }

    showRecommendationLoading() {
        const recommendations = document.getElementById('recommendations');
        const loader = recommendations.querySelector('.recommendation-results-loader');
        if (recommendations && loader) {
            recommendations.style.display = 'block';
            loader.classList.add('active');
        }
    }

    hideRecommendationLoading() {
        const loader = document.querySelector('.recommendation-results-loader');
        if (loader) {
            loader.classList.remove('active');
        }
    }

    showPopularLoading() {
        const popularSection = document.getElementById('popularDestinations');
        if (popularSection) {
            popularSection.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>Memuat destinasi populer...</p>
                </div>
            `;
        }
    }

    hidePopularLoading() {
        const popularSection = document.getElementById('popularDestinations');
        if (popularSection) {
            const loadingContainer = popularSection.querySelector('.loading-container');
            if (loadingContainer) {
                loadingContainer.remove();
            }
        }
    }

    updateSearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        const output = document.getElementById('searchOutput');
        if (!searchResults || !output) return;

        searchResults.style.display = 'block';
        this.hideSearchLoading();

        if (!results || results.length === 0) {
            output.innerHTML = '<p>Tidak ada hasil ditemukan.</p>';
            return;
        }

        // Render semua hasil dalam grid responsif
        output.innerHTML = '<div class="results-grid"></div>';
        const resultsGrid = output.querySelector('.results-grid');
        results.forEach(item => {
            const resultItem = this._createResultItem(item);
            resultsGrid.appendChild(resultItem);
        });
    }

    _renderPaginatedSearchResults() {
        const searchResults = document.getElementById('searchResults');
        const output = document.getElementById('searchOutput');
        if (!searchResults || !output) return;

        searchResults.style.display = 'block';
        this.hideSearchLoading();

        if (!this._searchResultsAll || this._searchResultsAll.length === 0) {
            output.innerHTML = '<p>Tidak ada hasil ditemukan.</p>';
            this._renderPagination(0);
            return;
        }

        // Pagination logic
        const startIdx = (this._currentPage - 1) * this._itemsPerPage;
        const endIdx = startIdx + this._itemsPerPage;
        const pageItems = this._searchResultsAll.slice(startIdx, endIdx);

        // Render grid 1 baris x 3 kolom
        let gridHtml = '<div class="results-grid-paginated"><div class="results-row">';
        for (let col = 0; col < 3; col++) {
            if (pageItems[col]) {
                const item = pageItems[col];
                const resultItem = this._createResultItem(item);
                gridHtml += resultItem.outerHTML;
            } else {
                gridHtml += '<div class="result-item empty"></div>';
            }
        }
        gridHtml += '</div></div>';
        output.innerHTML = gridHtml;

        this._renderPagination(Math.ceil(this._searchResultsAll.length / this._itemsPerPage));
    }

    _renderPagination(totalPages) {
        let paginationHtml = '';
        if (totalPages > 1) {
            paginationHtml += '<div class="pagination">';
            paginationHtml += `<button class="pagination-btn" data-page="prev" ${this._currentPage === 1 ? 'disabled' : ''}>&laquo;</button>`;
            for (let i = 1; i <= totalPages; i++) {
                paginationHtml += `<button class="pagination-btn${i === this._currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += `<button class="pagination-btn" data-page="next" ${this._currentPage === totalPages ? 'disabled' : ''}>&raquo;</button>`;
            paginationHtml += '</div>';
        }
        const output = document.getElementById('searchOutput');
        if (output) {
            let pagDiv = output.querySelector('.pagination');
            if (pagDiv) pagDiv.remove();
            output.insertAdjacentHTML('beforeend', paginationHtml);
        }
        this._initializePaginationListeners(totalPages);
    }

    _initializePaginationListeners(totalPages) {
        const output = document.getElementById('searchOutput');
        if (!output) return;
        const btns = output.querySelectorAll('.pagination-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = btn.getAttribute('data-page');
                if (page === 'prev' && this._currentPage > 1) {
                    this._currentPage--;
                } else if (page === 'next' && this._currentPage < totalPages) {
                    this._currentPage++;
                } else if (!isNaN(parseInt(page))) {
                    this._currentPage = parseInt(page);
                }
                this._renderPaginatedSearchResults();
            });
        });
    }

    updatePopularDestinations(destinations) {
        const popularSection = document.getElementById('popularDestinations');
        if (popularSection) {
            // Buat container untuk scroll
            const container = document.createElement('div');
            container.className = 'popular-container';
            
            // Buat div untuk scroll
            const scrollDiv = document.createElement('div');
            scrollDiv.className = 'popular-scroll';
            
            // Duplikasi destinasi untuk efek infinite scroll
            const duplicatedDestinations = [...destinations, ...destinations];
            
            // Render setiap destinasi
            duplicatedDestinations.forEach(destination => {
                const card = this._createPopularCard(destination);
                scrollDiv.innerHTML += card;
            });
            
            container.appendChild(scrollDiv);
            popularSection.innerHTML = '';
            popularSection.appendChild(container);
            
            // Initialize event listeners
            this._initializePopularCardListeners();
        }
    }

    _showCard(index) {
        const cards = document.querySelectorAll('.popular-destination-card');
        cards.forEach(card => card.classList.remove('active'));
        cards[index].classList.add('active');
    }

    _startAutoRotation() {
        const cards = document.querySelectorAll('.popular-destination-card');
        let currentIndex = 0;
        
        setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            this._showCard(currentIndex);
        }, 3000); // Change card every 3 seconds
    }

    updateRecommendations(recommendations) {
        const recommendationsSection = document.getElementById('recommendations');
        const output = document.getElementById('recommendationOutput');
        if (!recommendationsSection || !output) return;

        // Show the recommendations section
        recommendationsSection.style.display = 'block';
        this.hideRecommendationLoading();

        if (!recommendations || recommendations.length === 0) {
            output.innerHTML = '<p>Tidak ada rekomendasi ditemukan.</p>';
            return;
        }

        output.innerHTML = ''; // Clear previous results

        // Add the introductory paragraph
        const introParagraph = document.createElement('p');
        introParagraph.className = 'recommendation-intro-text';
        introParagraph.textContent = 'Dari preferensi kamu, kami menyarankan kamu cek wisata dibawah ini!';
        output.appendChild(introParagraph);

        // First row: Featured item
        if (recommendations.length > 0) {
            const featuredItemData = recommendations[0];
            const featuredRow = document.createElement('div');
            featuredRow.className = 'featured-recommendation-row';
            featuredRow.appendChild(this._createFeaturedResultItem(featuredItemData));
            output.appendChild(featuredRow);
        }

        // Second row: Remaining items in a grid
        if (recommendations.length > 1) {
            const remainingItemsData = recommendations.slice(1);
            const gridRow = document.createElement('div');
            gridRow.className = 'recommendations-grid-row';
            remainingItemsData.forEach(item => {
                gridRow.appendChild(this._createResultItem(item));
            });
            output.appendChild(gridRow);
        }
    }

    _createResultItem(destination) {
        console.log('DEBUG VIEW: _createResultItem - Place_Id:', destination.Place_Id);
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        // Simpan semua data destinasi sebagai data attributes
        resultItem.dataset.placeName = destination.Place_Name;
        resultItem.dataset.category = destination.Category;
        resultItem.dataset.city = destination.City;
        resultItem.dataset.rating = destination.Rating;
        resultItem.dataset.image = destination.Link_Img || '/src/assets/images/hero-bg.jpg';
        resultItem.dataset.description = destination.Description || '';
        resultItem.dataset.price = destination.Price || '';
        resultItem.dataset.timeMinutes = destination.Time_Minutes || '';
        resultItem.dataset.lat = destination.Lat || '';
        resultItem.dataset.long = destination.Long || '';
        resultItem.dataset.genText = destination.gen_text || '';
        resultItem.dataset.id = destination.Place_Id;

        resultItem.innerHTML = `
            <div class="result-image">
                <img src="${destination.Link_Img || '/src/assets/images/hero-bg.jpg'}" alt="${destination.Place_Name}">
            </div>
            <div class="result-content">
                <h4>${destination.Place_Name}</h4>
                <div class="result-info">
                    <p><i class="fas fa-tag"></i> ${destination.Category}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${destination.City}</p>
                    <p><i class="fas fa-star"></i> ${destination.Rating}</p>
                </div>
                <div class="result-actions">
                    <button class="detail-btn" data-place="${destination.Place_Name}">
                        <i class="fas fa-info-circle"></i> Lihat Detail
                    </button>
                </div>
            </div>
        `;

        // Add click event listener to the detail button
        const detailBtn = resultItem.querySelector('.detail-btn');
        detailBtn.addEventListener('click', () => {
            // Ambil semua data dari data attributes
            const destinationData = {
                Place_Name: resultItem.dataset.placeName,
                Category: resultItem.dataset.category,
                City: resultItem.dataset.city,
                Rating: resultItem.dataset.rating,
                image: resultItem.dataset.image,
                Description: resultItem.dataset.description,
                Price: resultItem.dataset.price,
                Time_Minutes: resultItem.dataset.timeMinutes,
                Lat: resultItem.dataset.lat,
                Long: resultItem.dataset.long,
                gen_text: resultItem.dataset.genText,
                id: resultItem.dataset.id
            };
            this._presenter.handleShowDetail(destinationData);
        });

        return resultItem;
    }

    _createFeaturedResultItem(destination) {
        console.log('DEBUG VIEW: _createFeaturedResultItem - ID:', destination.id);
        const featuredItem = document.createElement('div');
        featuredItem.className = 'featured-result-item';
        // Simpan semua data destinasi sebagai data attributes
        featuredItem.dataset.id = destination.id; // Pastikan ID tersedia
        featuredItem.dataset.placeName = destination.Place_Name;
        featuredItem.dataset.category = destination.Category;
        featuredItem.dataset.city = destination.City;
        featuredItem.dataset.rating = destination.Rating;
        featuredItem.dataset.image = destination.Link_Img || '/src/assets/images/hero-bg.jpg';
        featuredItem.dataset.description = destination.Description || '';
        featuredItem.dataset.price = destination.Price || '';
        featuredItem.dataset.lat = destination.Lat || '';
        featuredItem.dataset.long = destination.Long || '';
        featuredItem.dataset.genText = destination.gen_text || '';

        featuredItem.innerHTML = `
            <div class="featured-result-image">
                <img src="${destination.Link_Img || '/src/assets/images/hero-bg.jpg'}" alt="${destination.Place_Name}">
            </div>
            <div class="featured-result-content">
                <h4>${destination.Place_Name}</h4>
                <div class="featured-result-info">
                    <p><i class="fas fa-tag"></i> Kategori: ${destination.Category}</p>
                    <p><i class="fas fa-map-marker-alt"></i> Kota: ${destination.City}</p>
                    <p><i class="fas fa-star"></i> Rating: ${destination.Rating}</p>
                    <p><i class="fas fa-money-bill-wave"></i> Harga: Rp ${destination.Price.toLocaleString()}</p>
                    <p>${destination.Description}</p>
                </div>
                <div class="featured-result-actions">
                    <button class="detail-btn" data-id="${destination.id}">
                        <i class="fas fa-info-circle"></i> Lihat Detail
                    </button>
                </div>
            </div>
        `;

        const detailBtn = featuredItem.querySelector('.detail-btn');
        detailBtn.addEventListener('click', () => {
            const destinationData = {
                id: featuredItem.dataset.id,
                Place_Name: featuredItem.dataset.placeName,
                Category: featuredItem.dataset.category,
                City: featuredItem.dataset.city,
                Rating: featuredItem.dataset.rating,
                image: featuredItem.dataset.image,
                Description: featuredItem.dataset.description,
                Price: featuredItem.dataset.price,
                Time_Minutes: featuredItem.dataset.timeMinutes,
                Lat: featuredItem.dataset.lat,
                Long: featuredItem.dataset.long,
                gen_text: featuredItem.dataset.genText,
                id: featuredItem.dataset.id
            };
            this._presenter.handleShowDetail(destinationData);
        });

        return featuredItem;
    }

    _createPopularCard(destination) {
        console.log('DEBUG VIEW: _createPopularCard - Place_Id:', destination.Place_Id);
        // console.log('DEBUG POPULAR CARD: Link_Img for', destination.Place_Name, ':', destination.Link_Img);
        return `
            <div class="popular-destination-card" 
                data-place-name="${destination.Place_Name}"
                data-category="${destination.Category}"
                data-city="${destination.City}"
                data-rating="${destination.Rating}"
                data-description="${destination.Description || ''}"
                data-price="${destination.Price || ''}"
                data-time="${destination.Time_Minutes || ''}"
                data-lat="${destination.Lat || ''}"
                data-long="${destination.Long || ''}"
                data-gen-text="${destination.gen_text || ''}"
                data-image="${destination.Link_Img || '/src/assets/images/hero-bg.jpg'}"
                data-id="${destination.Place_Id}"
            >
                <div class="destination-image">
                    <img src="${destination.Link_Img || '/src/assets/images/hero-bg.jpg'}" alt="${destination.Place_Name}">
                </div>
                <div class="destination-info">
                    <h3>${destination.Place_Name}</h3>
                    <div class="result-info">
                        <p><i class="fas fa-tag"></i> ${destination.Category}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${destination.City}</p>
                        <p><i class="fas fa-star"></i> ${destination.Rating}</p>
                        </div>
                    <div class="destination-actions">
                        <button class="detail-btn">
                            <i class="fas fa-info-circle"></i> Lihat Detail
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    _initializePopularCardListeners() {
        const cards = document.querySelectorAll('.popular-destination-card');
        cards.forEach(card => {
            const detailBtn = card.querySelector('.detail-btn');
            if (detailBtn) {
                detailBtn.addEventListener('click', () => {
                    const destinationData = {
                        Place_Name: card.dataset.placeName,
                        Category: card.dataset.category,
                        City: card.dataset.city,
                        Rating: card.dataset.rating,
                        image: card.dataset.image,
                        Description: card.dataset.description,
                        Price: card.dataset.price,
                        Time_Minutes: card.dataset.time,
                        Lat: card.dataset.lat,
                        Long: card.dataset.long,
                        gen_text: card.dataset.genText,
                        id: card.dataset.id
                    };
                    this._presenter.handleShowDetail(destinationData);
                });
            }
        });
    }

    _initializeListeners() {
        const searchInput = document.getElementById('searchInput');
        const categorySelect = document.getElementById('categorySelect');
        const locationSelect = document.getElementById('locationSelect');
        const searchButton = document.getElementById('searchButton');
        const recommendationButton = document.getElementById('recommendationButton');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this._presenter.handleSearchInput(e.target.value);
            });
        }

        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this._presenter.handleCategoryChange(e.target.value);
            });
        }

        if (locationSelect) {
            locationSelect.addEventListener('change', (e) => {
                this._presenter.handleLocationChange(e.target.value);
            });
        }

        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const searchInput = document.getElementById('searchInput').value;
                const category = document.getElementById('categorySelect').value;
                const location = document.getElementById('locationSelect').value;
                this._presenter.handleSearch(searchInput, category, location);
            });
        }

        if (recommendationButton) {
            recommendationButton.addEventListener('click', () => {
                this._presenter.handleRecommendation();
            });
        }
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

    unmount() {
        this._container.innerHTML = '';
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
}

export default DestinationPage; 