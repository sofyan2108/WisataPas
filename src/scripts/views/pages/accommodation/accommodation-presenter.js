import LokaApiService from '../../../data/loka-api-service';
import CONFIG from '../../../globals/config';

class AccommodationPresenter {
    constructor(view) {
        this._view = view;
        this._view.setPresenter(this);
        this._lokaApi = new LokaApiService({
            isProduction: CONFIG.LOKA_API.ENVIRONMENT === 'production',
            clientId: CONFIG.LOKA_API.CLIENT_ID,
            clientSecret: CONFIG.LOKA_API.CLIENT_SECRET
        });

        this._filters = {
            starRating: [],
            priceRange: {
                min: 0,
                max: 10000000
            },
            propertyTypes: [],
            cancellationPolicy: ''
        };

        this._searchParams = {
            geoId: '',
            checkInDate: '',
            checkOutDate: '',
            numRooms: 1,
            numAdults: 2,
            numChildren: 0,
            childrenAges: [],
            displayCurrency: 'IDR',
            language: 'id',
            userNationality: 'ID',
            isExtended: true,
            filters: this._filters,
            sortBy: 'POPULARITY',
            sortDirection: 'DESC'
        };

        this._currentPage = 1;
        this._itemsPerPage = 10;
        this._accommodations = [];
        this._totalItems = 0;

        // Add favorites tracking
        this._favorites = new Set(
            JSON.parse(localStorage.getItem('favorites') || '[]')
                .map(fav => fav.id)
        );
    }

    async init() {
        try {
            this._view.updateLoadingState(true);
            
            // Get initial location (Jakarta as default)
            const geoResponse = await this._lokaApi.searchGeo({
                geoName: 'Jakarta',
                countryCode: 'ID',
                language: 'id',
                limit: 1
            });

            if (geoResponse && geoResponse.length > 0) {
                this._searchParams.geoId = geoResponse[0].geoId;
            }

            // Set default dates
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            this._searchParams.checkInDate = today.toISOString().split('T')[0];
            this._searchParams.checkOutDate = tomorrow.toISOString().split('T')[0];

            // Get initial accommodations
            await this._fetchAccommodations();
        } catch (error) {
            console.error('Error initializing accommodation:', error);
            this._view.updateLoadingState(false);
            this._view._renderError(error.message);
        }
    }

    async _fetchAccommodations() {
        try {
            this._view.updateLoadingState(true);

            const response = await this._lokaApi.discoverRates({
                ...this._searchParams,
                cursor: this._getCursor()
            });

            if (response.error) {
                throw new Error(response.error.message);
            }

            this._processApiResults(response);
            
            const filteredAccommodations = this._getFilteredAccommodations();
            const totalPages = this._getTotalPages();

            this._view.render({
                accommodations: filteredAccommodations,
                currentPage: this._currentPage,
                totalPages,
                filters: this._filters
            });
        } catch (error) {
            console.error('Error fetching accommodations:', error);
            this._view._renderError(error.message);
        } finally {
            this._view.updateLoadingState(false);
        }
    }

    _getCursor() {
        const startIndex = (this._currentPage - 1) * this._itemsPerPage;
        return Buffer.from(JSON.stringify({
            offset: startIndex,
            limit: this._itemsPerPage
        })).toString('base64');
    }

    _processApiResults(results) {
        if (results.data) {
            this._accommodations = Object.entries(results.data).map(([propertyId, property]) => ({
                id: propertyId,
                name: property.propertyName,
                starRating: property.starRating,
                rates: property.rates,
                // Add more properties as needed
            }));

            this._totalItems = this._accommodations.length;
        } else {
            this._accommodations = [];
            this._totalItems = 0;
        }
    }

    _getFilteredAccommodations() {
        const startIndex = (this._currentPage - 1) * this._itemsPerPage;
        const endIndex = startIndex + this._itemsPerPage;

        return this._accommodations
            .filter(accommodation => {
                // Apply filters
                const matchesStarRating = this._filters.starRating.length === 0 || 
                    this._filters.starRating.includes(accommodation.starRating);
                
                const price = accommodation.rates?.[0]?.totalRates?.displaySellAmount || 0;
                const matchesPriceRange = price >= this._filters.priceRange.min && 
                    price <= this._filters.priceRange.max;

                return matchesStarRating && matchesPriceRange;
            })
            .slice(startIndex, endIndex);
    }

    _getTotalPages() {
        return Math.ceil(this._totalItems / this._itemsPerPage);
    }

    async handleFilterChange(filters) {
        this._filters = { ...this._filters, ...filters };
        this._currentPage = 1;
        await this._fetchAccommodations();
    }

    async handleDateChange(checkIn, checkOut) {
        this._searchParams.checkInDate = checkIn;
        this._searchParams.checkOutDate = checkOut;
        this._currentPage = 1;
        await this._fetchAccommodations();
    }

    async handleGuestsChange(guests) {
        this._searchParams.numAdults = guests.adults;
        this._searchParams.numChildren = guests.children;
        this._searchParams.childrenAges = guests.childrenAges;
        this._currentPage = 1;
        await this._fetchAccommodations();
    }

    handlePageChange(page) {
        this._currentPage = page;
        this._fetchAccommodations();
    }

    async handleSearch(query) {
        try {
            const geoResponse = await this._lokaApi.searchGeo({
                geoName: query,
                countryCode: 'ID',
                language: 'id',
                limit: 1
            });

            if (geoResponse && geoResponse.length > 0) {
                this._searchParams.geoId = geoResponse[0].geoId;
                this._currentPage = 1;
                await this._fetchAccommodations();
            } else {
                throw new Error('Location not found');
            }
        } catch (error) {
            console.error('Error searching location:', error);
            this._view._renderError(error.message);
        }
    }

    async toggleFavorite(accommodation) {
        try {
            if (this._favorites.has(accommodation.id)) {
                this._favorites.delete(accommodation.id);
                
                // Remove from localStorage
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
                    .filter(fav => fav.id !== accommodation.id);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                
                this._view.showMessage('Dihapus dari favorit');
            } else {
                this._favorites.add(accommodation.id);
                
                // Add to localStorage
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                favorites.push(accommodation);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                
                this._view.showMessage('Ditambahkan ke favorit');
            }

            // Update UI
            this._view.updateFavoriteButton(
                accommodation.id, 
                this._favorites.has(accommodation.id)
            );
        } catch (error) {
            console.error('Error toggling favorite:', error);
            this._view.showError('Gagal mengubah status favorit');
        }
    }

    isFavorite(accommodationId) {
        return this._favorites.has(accommodationId);
    }
}

export default AccommodationPresenter; 