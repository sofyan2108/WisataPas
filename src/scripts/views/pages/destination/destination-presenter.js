import DestinationModal from '../../components/destination-modal';

class DestinationPresenter {
    constructor(view) {
        this._view = view;
        this._destinations = [];
        this._filteredDestinations = [];
        this._searchQuery = '';
        this._categoryFilter = '';
        this._locationFilter = '';
        this._ratingFilter = '';
        this._favoritePlace = '';
        this._modal = new DestinationModal();
        this._modal.setPresenter(this);
        this._searchCache = new Map(); // Cache untuk hasil pencarian
        this._recommendationCache = new Map(); // Cache untuk hasil rekomendasi
        this._CACHE_DURATION = 5 * 60 * 1000; // Cache berlaku selama 5 menit
    }

    async init() {
        try {
            // Load popular destinations first
            await this._loadPopularDestinations();

            // Then try to get user info if available
            const tokenId = sessionStorage.getItem('authTokenId');
            if (tokenId) {
                const userId = await this._getAuthToLogin(tokenId);
                if (userId) {
                    const usernameInput = document.getElementById('usernameInput');
                    if (usernameInput) {
                        usernameInput.value = userId;
                        usernameInput.placeholder = userId;
                    }
                }
            }
        } catch (error) {
            console.error('Error initializing destinations:', error);
            this._view.showError('Gagal memuat data destinasi');
        }
    }

    async _getAuthToLogin(token) {
        try {
            const res = await fetch('https://wisatapas-backend-vercel.vercel.app/api/auth-check-id', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!res.ok) throw new Error('Unauthorized');
            const data = await res.json();
            return data.userId;
        } catch (error) {
            console.error('Auth error:', error);
            return null;
        }
    }

    async _checkUser(token) {
        try {
            const res = await fetch('https://wisatapas-backend-vercel.vercel.app/api/auth-check-name', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!res.ok) throw new Error('Unauthorized');
            const data = await res.json();
            return data.nama;
        } catch (error) {
            console.error('Auth error:', error);
            return null;
        }
    }

    async _loadPopularDestinations() {
        try {
            // Show loading state
            this._view.showPopularLoading();

            // Menggunakan endpoint search untuk mendapatkan destinasi acak
            const response = await fetch('https://mjamalm18-fastapi-wisatapas.hf.space/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    place: ''  // Menggunakan format yang sama dengan _searchDestinations
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch destinations');
            }

            const data = await response.json();
            console.log('Destinations response:', data);
            
            if (!data.results || data.results.length === 0) {
                throw new Error('No destinations found');
            }

            // Validasi setiap objek destinasi
            const validDestinations = data.results.filter(dest => {
                return dest && 
                       typeof dest === 'object' &&
                       'Place_Name' in dest &&
                       'Category' in dest &&
                       'City' in dest &&
                       'Rating' in dest;
            });

            if (validDestinations.length === 0) {
                throw new Error('No valid destinations found');
            }

            // Langsung update view dengan destinasi yang valid
            this._view.updatePopularDestinations(validDestinations);
        } catch (error) {
            console.error('Error loading popular destinations:', error);
            this._view.showError('Gagal memuat destinasi populer: ' + error.message);
        } finally {
            // Hide loading state
            this._view.hidePopularLoading();
        }
    }

    async handleSearch(searchTerm, category, location) {
        try {
            console.log('DestinationPresenter: handleSearch called');
            this._view.showSearchLoading();
            
            // const searchInput = document.getElementById('searchInput'); // Removed, now passed as arg
            // const categorySelect = document.getElementById('categorySelect'); // Removed, now passed as arg
            // const locationSelect = document.getElementById('locationSelect'); // Removed, now passed as arg
            
            // if (!searchInput || !categorySelect || !locationSelect) {
            //     throw new Error('Search elements not found');
            // }

            // const searchTerm = searchInput.value.trim(); // Now passed as arg
            // const category = categorySelect.value; // Now passed as arg
            // const location = locationSelect.value; // Now passed as arg

            // Gabungkan input
            const input = `${searchTerm} ${category} ${location}`.trim();

            // Buat cache key
            const cacheKey = input;
            
            // Cek cache
            const now = Date.now();
            if (this._searchCache.has(cacheKey)) {
                const cachedData = this._searchCache.get(cacheKey);
                if (now - cachedData.timestamp < this._CACHE_DURATION) {
                    console.log('Using cached search results');
                    this._filteredDestinations = cachedData.results;
                    this._view.updateSearchResults(cachedData.results);
                    this._view.hideSearchLoading();
                    return;
                }
            }

            if (!input) {
                this._view.showError('Silakan isi minimal satu kriteria pencarian');
                this._view.hideSearchLoading();
                return;
            }

            const results = await this._searchDestinations(input);
            console.log('Search results:', results);
            
            // Simpan ke cache
            this._searchCache.set(cacheKey, {
                results: results,
                timestamp: now
            });
            
            this._filteredDestinations = results;
            this._view.updateSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            this._view.showError('Terjadi kesalahan saat mencari destinasi');
        } finally {
            this._view.hideSearchLoading();
        }
    }

    handleSearchInput(query) {
        this._searchQuery = query;
    }

    handleCategoryChange(category) {
        this._categoryFilter = category;
    }

    handleLocationChange(location) {
        this._locationFilter = location;
    }

    async _handleUnlike(idUser, namaUser, idTempat, namaTempat) {
        try {
            const response = await fetch('https://wisatapas-backend-vercel.vercel.app/api/unlike', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_user: idUser,
                    nama_user: namaUser,
                    id_tempat: idTempat,
                    nama_tempat: namaTempat
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error unliking destination:', response.status, response.statusText, errorText);
                throw new Error(`Gagal menghapus like: ${errorText}`);
            }

            // Remove from sessionStorage
            sessionStorage.removeItem('likedDestination');
            return true;
        } catch (error) {
            console.error('Unlike error:', error);
            throw error;
        }
    }

    async handleLike(destinationData) {
        try {
            const tokenId = sessionStorage.getItem('authTokenId');
            const tokenNama = sessionStorage.getItem('authTokenNama');

            const idUser = await this._getAuthToLogin(tokenId);
            const namaUser = await this._checkUser(tokenNama);

            if (!idUser || !namaUser) {
                throw new Error('Silakan login terlebih dahulu.');
            }

            // Check if user already liked another destination
            const likedDestination = sessionStorage.getItem('likedDestination');
            if (likedDestination) {
                const previousLike = JSON.parse(likedDestination);
                // If trying to like the same destination, do nothing
                if (previousLike.id === (destinationData.id || destinationData.Place_Id)) {
                    return;
                }
                
                // If liking a different destination, unlike the previous one first
                try {
                    await this._handleUnlike(idUser, namaUser, previousLike.id, previousLike.name);
                    this._view.showMessage(`Like pada ${previousLike.name} telah dihapus.`);
                } catch (error) {
                    console.error('Error unliking previous destination:', error);
                    // Continue with new like even if unlike fails
                }
            }

            // Create a mock placeElement similar to what the backend team uses
            const placeElement = document.createElement('div');
            
            // Add hidden fields with data from destinationData
            placeElement.innerHTML = `
                <input type="hidden" class="id_tempat" value="${destinationData.id || destinationData.Place_Id || ''}">
                <div class="nama_tempat">${destinationData.Place_Name || ''}</div>
                <img class="gambar" src="${destinationData.Link_Img || destinationData.image || ''}">
                <div class="kategori">Kategori: ${destinationData.Category || ''}</div>
                <div class="kota">Kota: ${destinationData.City || ''}</div>
                <div class="koordinat">Koordinat: ${destinationData.Lat || ''}, ${destinationData.Long || ''}</div>
                <div class="lat">Lat: <span>${destinationData.Lat || ''}</span></div>
                <div class="long">Long: <span>${destinationData.Long || ''}</span></div>
                <div class="harga">Harga: ${destinationData.Price || ''}</div>
                <div class="rating">Rating: ${destinationData.Rating || ''}</div>
                <div class="deskripsi">Deskripsi: ${destinationData.Description || ''}</div>
            `;

            // Extract data exactly as the backend team does
            const id_tempat = placeElement.querySelector('.id_tempat')?.value || '';
            const nama_tempat = placeElement.querySelector('.nama_tempat')?.textContent.trim() || '';
            const gambar = placeElement.querySelector('.gambar')?.getAttribute('src') || '';
            const kategori = placeElement.querySelector('.kategori')?.textContent.split(':')[1]?.trim() || '';
            const kota = placeElement.querySelector('.kota')?.textContent.split(':')[1]?.trim() || '';
            const koordinat = placeElement.querySelector('.koordinat')?.textContent.split(':')[1]?.trim() || '';
            const lat = placeElement.querySelector('.lat')?.querySelector('span')?.textContent.trim().replace(',', '') || '';
            const long = placeElement.querySelector('.long')?.querySelector('span')?.textContent.trim() || '';
            const harga = placeElement.querySelector('.harga')?.textContent.split(':')[1]?.trim() || '';
            const rating = placeElement.querySelector('.rating')?.textContent.split(':')[1]?.trim() || '';
            const deskripsi = placeElement.querySelector('.deskripsi')?.textContent.split(':')[1]?.trim() || '';

            // Format data exactly as the backend team does
            const data = {
                id_user: idUser,
                nama_user: namaUser,
                id_tempat,
                nama_tempat,
                gambar,
                kategori,
                kota,
                koordinat,
                lat,
                long,
                harga,
                rating,
                deskripsi
            };

            console.log('Sending like data to API:', data);

            const response = await fetch('https://wisatapas-backend-vercel.vercel.app/api/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error liking destination:', response.status, response.statusText, errorText);
                throw new Error(`Gagal menyukai destinasi: ${errorText}`);
            }

            // Store the liked destination in sessionStorage
            sessionStorage.setItem('likedDestination', JSON.stringify({
                id: id_tempat,
                name: nama_tempat,
                timestamp: new Date().toISOString()
            }));

            // Update button state and show success message
            this._modal.setLikeButtonState(true);
            this._view.showMessage(`${nama_tempat} berhasil disukai untuk rekomendasi.`);

        } catch (error) {
            console.error('Like error:', error);
            this._view.showError(error.message);
            // Reset button state on error
            this._modal.setLikeButtonState(false);
            throw error;
        }
    }

    async handleAddToFavorite(destinationData) {
        try {
            const tokenId = sessionStorage.getItem('authTokenId');
            const tokenNama = sessionStorage.getItem('authTokenNama');

            const idUser = await this._getAuthToLogin(tokenId);
            const namaUser = await this._checkUser(tokenNama);

            if (!idUser || !namaUser) {
                throw new Error('Silakan login terlebih dahulu.');
            }

            // Create a mock placeElement similar to what the backend team uses
            const placeElement = document.createElement('div');
            
            // Add hidden fields with data from destinationData
            placeElement.innerHTML = `
                <input type="hidden" class="id_tempat" value="${destinationData.id || destinationData.Place_Id || ''}">
                <div class="nama_tempat">${destinationData.Place_Name || ''}</div>
                <img class="gambar" src="${destinationData.Link_Img || destinationData.image || ''}">
                <div class="kategori">Kategori: ${destinationData.Category || ''}</div>
                <div class="kota">Kota: ${destinationData.City || ''}</div>
                <div class="koordinat">Koordinat: ${destinationData.Lat || ''}, ${destinationData.Long || ''}</div>
                <div class="lat">Lat: <span>${destinationData.Lat || ''}</span></div>
                <div class="long">Long: <span>${destinationData.Long || ''}</span></div>
                <div class="harga">Harga: ${destinationData.Price || ''}</div>
                <div class="rating">Rating: ${destinationData.Rating || ''}</div>
                <div class="deskripsi">Deskripsi: ${destinationData.Description || ''}</div>
            `;

            // Extract data exactly as the backend team does
            const id_tempat = placeElement.querySelector('.id_tempat')?.value || '';
            const nama_tempat = placeElement.querySelector('.nama_tempat')?.textContent.trim() || '';
            const gambar = placeElement.querySelector('.gambar')?.getAttribute('src') || '';
            const kategori = placeElement.querySelector('.kategori')?.textContent.split(':')[1]?.trim() || '';
            const kota = placeElement.querySelector('.kota')?.textContent.split(':')[1]?.trim() || '';
            const koordinat = placeElement.querySelector('.koordinat')?.textContent.split(':')[1]?.trim() || '';
            
            // Extract lat and long exactly as the backend team does
            const lat = placeElement.querySelector('.lat')?.querySelector('span')?.textContent.trim().replace(',', '') || '';
            const long = placeElement.querySelector('.long')?.querySelector('span')?.textContent.trim() || '';
            
            const harga = placeElement.querySelector('.harga')?.textContent.split(':')[1]?.trim() || '';
            const rating = placeElement.querySelector('.rating')?.textContent.split(':')[1]?.trim() || '';
            const deskripsi = placeElement.querySelector('.deskripsi')?.textContent.split(':')[1]?.trim() || '';

            // Format data exactly as the backend team does
            const data = {
                id_user: idUser,
                nama_user: namaUser,
                id_tempat,
                nama_tempat,
                gambar,
                kategori,
                kota,
                koordinat,
                lat,
                long,
                harga,
                rating,
                deskripsi
            };

            console.log('Sending favorite data to API:', data);

            const response = await fetch('https://wisatapas-backend-vercel.vercel.app/api/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error('Destinasi ini sudah ada di favorit Anda.');
                } else {
                    const errorText = await response.text();
                    console.error('API Error adding favorite:', response.status, response.statusText, errorText);
                    throw new Error(`Gagal menambahkan ke favorit: ${errorText}`);
                }
            }

            // Update button state and show success message
            this._modal.setFavoriteButtonState(true);
            this._view.showMessage(`${nama_tempat} berhasil ditambahkan ke favorit.`);

            // Store the added favorite ID in sessionStorage to track it
            const addedFavorites = JSON.parse(sessionStorage.getItem('addedFavorites') || '[]');
            if (!addedFavorites.includes(id_tempat)) {
                addedFavorites.push(id_tempat);
                sessionStorage.setItem('addedFavorites', JSON.stringify(addedFavorites));
            }
        } catch (error) {
            console.error('Add favorite error:', error);
            this._view.showError(error.message);
            // Reset button state on error
            this._modal.setFavoriteButtonState(false);
            throw error;
        }
    }

    handleShowDetail(destinationData) {
        console.log('DEBUG PRESENTER: handleShowDetail received ID:', destinationData.id);
        if (destinationData) {
            // Format data destinasi untuk modal
            const formattedDestination = {
                id: destinationData.id,
                Place_Name: destinationData.Place_Name,
                Category: destinationData.Category,
                City: destinationData.City,
                Rating: destinationData.Rating,
                image: destinationData.image || '/src/assets/images/hero-bg.jpg',
                Description: destinationData.Description || 'Deskripsi tidak tersedia',
                Price: destinationData.Price || 'Harga tidak tersedia',
                Lat: destinationData.Lat || 'Koordinat tidak tersedia',
                Long: destinationData.Long || 'Koordinat tidak tersedia',
                gen_text: destinationData.gen_text || null
            };

            // Tampilkan modal dengan data yang sudah diformat
            this._modal.show(formattedDestination);
        } else {
            console.error('Destination data is missing');
            this._view.showError('Detail destinasi tidak ditemukan');
        }
    }

    async handleRecommendation() {
        try {
            console.log('DestinationPresenter: handleRecommendation called');
            this._view.showRecommendationLoading();
            
            const usernameInput = document.getElementById('usernameInput');
            if (!usernameInput) {
                throw new Error('Username input not found');
            }

            const username = usernameInput.value.trim();
            if (!username) {
                this._view.showError('Silakan Login Kembali');
                this._view.hideRecommendationLoading();
                return;
            }

            // Cek cache
            const now = Date.now();
            if (this._recommendationCache.has(username)) {
                const cachedData = this._recommendationCache.get(username);
                if (now - cachedData.timestamp < this._CACHE_DURATION) {
                    console.log('Using cached recommendations');
                    this._view.updateRecommendations(cachedData.results);
                    this._view.hideRecommendationLoading();
                    return;
                }
            }

            console.log('Getting recommendations for user:', username);
            const recommendations = await this._getRecommendations(username);
            console.log('Recommendations:', recommendations);
            
            // Simpan ke cache
            this._recommendationCache.set(username, {
                results: recommendations,
                timestamp: now
            });
            
            this._view.updateRecommendations(recommendations);
        } catch (error) {
            console.error('Recommendation error:', error);
            this._view.showError('Terjadi kesalahan saat mendapatkan rekomendasi');
        } finally {
            this._view.hideRecommendationLoading();
        }
    }

    async _searchDestinations(input) {
        try {
            console.log('Searching with params:', { input });
            
            const response = await fetch('https://mjamalm18-fastapi-wisatapas.hf.space/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    place: input || '',
                    limit: 10
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            const data = await response.json();
            console.log('=== DEBUG: SEARCH RESULTS ===');
            if (data.results && data.results.length > 0) {
                console.log('First result:', data.results[0]);
                console.log('Link_Img from first result:', data.results[0].Link_Img);
            }
            return data.results || [];
        } catch (error) {
            console.error('Error searching destinations:', error);
            throw error;
        }
    }

    async _getRecommendations(username) {
        try {
            const response = await fetch('https://mjamalm18-fastapi-wisatapas.hf.space/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: username,
                    limit: 5 // Membatasi jumlah rekomendasi untuk performa
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }

            const data = await response.json();
            return data.recommendations || [];
        } catch (error) {
            console.error('Error getting recommendations:', error);
            throw error;
        }
    }

    _createDestinationCard(destination) {
        console.log('=== DEBUG: CREATING CARD ===');
        console.log('Destination data:', destination);
        
        const card = document.createElement('div');
        card.className = 'destination-card';
        
        // Pastikan Link_Img ada dan valid
        const imageUrl = destination.Link_Img;
        console.log('Using image URL:', imageUrl);

        // Test URL gambar
        if (!imageUrl || !imageUrl.startsWith('http')) {
            console.error('Invalid image URL:', imageUrl);
        }

        card.innerHTML = `
            <div class="destination-image" style="width: 100%; height: 200px; background-color: #f0f0f0; overflow: hidden;">
                <img src="${imageUrl}" 
                     alt="${destination.Place_Name}"
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
            </div>
            <div class="destination-info" style="padding: 15px;">
                <h3 style="margin: 0 0 10px 0; font-size: 1.2em;">${destination.Place_Name}</h3>
                <p class="category" style="margin: 5px 0; color: #666;">${destination.Category || 'Uncategorized'}</p>
                <p class="location" style="margin: 5px 0; color: #666;">${destination.City || 'Location not specified'}</p>
                <p class="price" style="margin: 5px 0; color: #2ecc71; font-weight: bold;">${destination.Price ? `Rp ${destination.Price.toLocaleString()}` : 'Price not available'}</p>
                <button class="detail-btn" data-id="${destination.Place_Id}" style="width: 100%; padding: 8px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">Lihat Detail</button>
            </div>
        `;

        const detailBtn = card.querySelector('.detail-btn');
        detailBtn.addEventListener('click', () => {
            this._showDestinationDetail(destination);
        });

        return card;
    }

    _createRecommendationCard(destination) {
        console.log('=== DEBUG: CREATING RECOMMENDATION CARD ===');
        console.log('Destination data:', destination);
        
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        
        // Pastikan Link_Img ada dan valid
        const imageUrl = destination.Link_Img;
        console.log('Using image URL:', imageUrl);

        // Test URL gambar
        if (!imageUrl || !imageUrl.startsWith('http')) {
            console.error('Invalid image URL:', imageUrl);
        }

        card.innerHTML = `
            <div class="recommendation-image" style="width: 100%; height: 200px; background-color: #f0f0f0; overflow: hidden;">
                <img src="${imageUrl}" 
                     alt="${destination.Place_Name}"
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
            </div>
            <div class="recommendation-info" style="padding: 15px;">
                <h3 style="margin: 0 0 10px 0; font-size: 1.2em;">${destination.Place_Name}</h3>
                <p class="category" style="margin: 5px 0; color: #666;">${destination.Category || 'Uncategorized'}</p>
                <p class="location" style="margin: 5px 0; color: #666;">${destination.City || 'Location not specified'}</p>
                <p class="price" style="margin: 5px 0; color: #2ecc71; font-weight: bold;">${destination.Price ? `Rp ${destination.Price.toLocaleString()}` : 'Price not available'}</p>
                <button class="detail-btn" data-id="${destination.Place_Id}" style="width: 100%; padding: 8px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">Lihat Detail</button>
            </div>
        `;

        const detailBtn = card.querySelector('.detail-btn');
        detailBtn.addEventListener('click', () => {
            this._showDestinationDetail(destination);
        });

        return card;
    }

    _showDestinationDetail(destination) {
        console.log('=== DEBUG: SHOWING DETAIL ===');
        console.log('Destination data:', destination);
        
        const modal = document.getElementById('destinationModal');
        const modalContent = document.getElementById('modalContent');
        
        // Pastikan Link_Img ada dan valid
        const imageUrl = destination.Link_Img || '/src/assets/images/hero-bg.jpg';
        console.log('Using image URL:', imageUrl);

        // Test URL gambar
        if (!imageUrl || !imageUrl.startsWith('http')) {
            console.error('Invalid image URL:', imageUrl);
        }
        
        modalContent.innerHTML = `
            <div class="modal-header" style="padding: 15px; border-bottom: 1px solid #ddd;">
                <h2 style="margin: 0;">${destination.Place_Name}</h2>
                <button class="close-btn" style="position: absolute; right: 15px; top: 15px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <div class="modal-image" style="width: 100%; height: 400px; background-color: #f0f0f0; overflow: hidden; margin-bottom: 20px; position: relative;">
                    <img src="${imageUrl}" 
                         alt="${destination.Place_Name}"
                         style="width: 100%; height: 100%; object-fit: cover;"
                         onerror="this.onerror=null; this.src='/src/assets/images/hero-bg.jpg'">
                </div>
                <div class="modal-info">
                    <p style="margin: 10px 0;"><strong>Kategori:</strong> ${destination.Category || 'Uncategorized'}</p>
                    <p style="margin: 10px 0;"><strong>Lokasi:</strong> ${destination.City || 'Location not specified'}</p>
                    <p style="margin: 10px 0;"><strong>Harga:</strong> ${destination.Price ? `Rp ${destination.Price.toLocaleString()}` : 'Price not available'}</p>
                    <p style="margin: 10px 0;"><strong>Deskripsi:</strong> ${destination.Description || 'No description available'}</p>
                </div>
            </div>
        `;

        // Tambahkan event listener untuk tombol close
        const closeBtn = modalContent.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Tampilkan modal
        modal.style.display = 'block';

        // Tutup modal jika user klik di luar modal
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

export default DestinationPresenter; 