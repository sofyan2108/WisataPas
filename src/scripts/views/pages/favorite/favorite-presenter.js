import DestinationModal from '../../components/destination-modal';

class FavoritePresenter {
    constructor(view) {
        this._view = view;
        this._favorites = [];
        this._modal = new DestinationModal();
        this._modal.setPresenter(this);
    }

    async init() {
        try {
            await this._loadFavorites();
            this._view.updateContent({
                destinations: this._favorites
            });
        } catch (error) {
            console.error('Error loading favorites:', error);
            this._view.showError(error.message);
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

    async _loadFavorites() {
        try {
            const tokenId = sessionStorage.getItem('authTokenId');
            if (!tokenId) {
                throw new Error('Silakan login terlebih dahulu');
            }

            const idUser = await this._getAuthToLogin(tokenId);
            if (!idUser) {
                throw new Error('ID Pengguna tidak ditemukan, silakan login kembali.');
            }

            const response = await fetch(`https://wisatapas-backend-vercel.vercel.app/api/favorites/${idUser}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenId}`
                }
            });

            console.log('Favorite API Response Status:', response.status);
            console.log('Favorite API Response OK:', response.ok);

            if (!response.ok) {
                // Try to read response body for more details if not OK
                const errorText = await response.text();
                console.error('Favorite API Error Body:', errorText);
                throw new Error(`Gagal memuat data favorit: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Favorite API Response Data:', data);
            
            // Backend is returning the array directly, not as data.favorites
            if (!Array.isArray(data)) {
                console.warn('Response from /favorites was not an array:', data);
                this._favorites = [];
                return;
            }

            this._favorites = (await Promise.all(data.map(async fav => {
                if (!fav || typeof fav !== 'object') {
                    console.warn('Invalid favorite item received:', fav);
                    return null; // Return null for invalid items
                }

                console.log('Processing favorite item:', fav);
                
                // Map to match destination page data structure
                return {
                    id: fav.id_tempat,
                    Place_Id: fav.id_tempat, // Add Place_Id to match destination format
                    Place_Name: fav.nama_tempat,
                    Category: fav.kategori || 'N/A',
                    City: fav.kota || 'N/A',
                    Rating: fav.rating || 'N/A',
                    Link_Img: fav.gambar || '/src/assets/images/placeholder.jpg', // Use Link_Img instead of image
                    image: fav.gambar || '/src/assets/images/placeholder.jpg', // Keep image for backward compatibility
                    Description: fav.deskripsi || '',
                    Price: fav.harga || 'N/A',
                    Time_Minutes: fav.waktu || 'N/A',
                    Lat: fav.lat || '',
                    Long: fav.long || '',
                    gen_text: fav.gen_text || ''
                };
            }))).filter(fav => fav !== null); // Filter out null items
        } catch (error) {
            console.error('Load favorites error:', error);
            throw error;
        }
    }

    async removeFavorite(destinationId) {
        try {
            const tokenId = sessionStorage.getItem('authTokenId');
            const tokenNama = sessionStorage.getItem('authTokenNama');

            if (!tokenId || !tokenNama) {
                throw new Error('Silakan login terlebih dahulu.');
            }

            const id_user = await this._getAuthToLogin(tokenId);
            const nama_user = await this._checkUser(tokenNama);

            if (!id_user || !nama_user) {
                throw new Error('Silakan login terlebih dahulu.');
            }

            // Find the favorite item to get its name
            const favoriteToRemove = this._favorites.find(fav => fav.id === destinationId);
            if (!favoriteToRemove) {
                throw new Error('Favorit tidak ditemukan dalam daftar.');
            }

            const id_tempat = destinationId;
            const nama_tempat = favoriteToRemove.Place_Name;

            // Format data exactly as the backend team does
            const data = {
                id_user,
                nama_user,
                id_tempat,
                nama_tempat
            };

            console.log('Sending remove favorite data to API:', data);

            const response = await fetch(`https://wisatapas-backend-vercel.vercel.app/api/unlike`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenId}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Gagal menghapus dari favorit');
            }

            // Refresh favorites after removal
            await this._loadFavorites();
            await this._view.updateContent({
                destinations: this._favorites
            });

            this._view.showMessage(`${nama_tempat} Berhasil dihapus dari favorit`);
        } catch (error) {
            console.error('Remove favorite error:', error);
            this._view.showError(error.message);
            throw error; // Re-throw the error to be handled by the view
        }
    }

    async handleAddToFavorite(destinationData) {
        try {
            const tokenId = sessionStorage.getItem('authTokenId');
            const tokenNama = sessionStorage.getItem('authTokenNama');

            const idUser = await this._getAuthToLogin(tokenId);
            const namaUser = await this._checkUser(tokenNama);

            if (!idUser || !namaUser) {
                this._view.showError('Silakan login terlebih dahulu.');
                return;
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
                    const errorText = await response.text(); // Capture response body for more details
                    console.error('API Error adding favorite:', response.status, response.statusText, errorText);
                    throw new Error(`Gagal menambahkan ke favorit: ${errorText}`);
                }
            }

            // Refresh favorites after adding
            await this._loadFavorites();
            this._view.updateContent({
                destinations: this._favorites
            });

            this._view.showMessage(`${nama_tempat} berhasil ditambahkan ke favorit.`);
            this._modal.setFavoriteButtonState(true);
        } catch (error) {
            console.error('Add favorite error:', error);
            this._view.showError(error.message);
        }
    }

    showDestinationDetail(data) {
        this._modal.show(data);
    }

    handleLike(placeName, buttonElement) {
        // Simple like functionality for favorite page
        if (buttonElement.textContent.includes('Like')) {
            buttonElement.innerHTML = '<i class="fas fa-thumbs-up"></i> Liked';
            buttonElement.style.backgroundColor = '#28a745';
        } else {
            buttonElement.innerHTML = '<i class="fas fa-thumbs-up"></i> Like';
            buttonElement.style.backgroundColor = '';
        }
    }
}

export default FavoritePresenter; 