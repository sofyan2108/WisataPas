class DestinationPresenter {
    constructor(view) {
        this._view = view;
        this._destinations = [
            {
                id: 1,
                title: 'Pantai Kuta',
                description: 'Pantai eksotis dengan pemandangan sunset yang memukau',
                image: 'kuta-beach.jpg',
                location: 'Bali',
                category: 'Pantai',
                rating: 4.8,
                price: 'Rp 50.000',
                facilities: ['Parkir', 'Toilet', 'Tempat Makan', 'Penyewaan Peralatan']
            },
            {
                id: 2,
                title: 'Candi Borobudur',
                description: 'Candi Buddha terbesar di dunia dengan arsitektur menakjubkan',
                image: 'borobudur.jpg',
                location: 'Magelang',
                category: 'Sejarah',
                rating: 4.9,
                price: 'Rp 75.000',
                facilities: ['Parkir', 'Toilet', 'Pemandu Wisata', 'Toko Suvenir']
            },
            {
                id: 3,
                title: 'Raja Ampat',
                description: 'Surga bawah laut dengan keindahan terumbu karang',
                image: 'raja-ampat.jpg',
                location: 'Papua Barat',
                category: 'Pantai',
                rating: 4.9,
                price: 'Rp 100.000',
                facilities: ['Penginapan', 'Diving Center', 'Restaurant', 'Transport']
            },
            // Tambahkan lebih banyak destinasi di sini
        ];

        this._categories = ['Semua', 'Pantai', 'Gunung', 'Sejarah', 'Budaya', 'Alam'];
        this._locations = ['Semua', 'Bali', 'Jawa Timur', 'Jawa Tengah', 'Papua Barat', 'Sumatera'];
        this._currentPage = 1;
        this._itemsPerPage = 9;
        this._filters = {
            category: 'Semua',
            location: 'Semua',
            rating: 0,
            priceRange: 'Semua'
        };
    }

    async init() {
        await this._view.render({
            destinations: this._getFilteredDestinations(),
            categories: this._categories,
            locations: this._locations,
            currentPage: this._currentPage,
            totalPages: this._getTotalPages(),
            filters: this._filters
        });
    }

    _getFilteredDestinations() {
        let filtered = [...this._destinations];

        // Apply filters
        if (this._filters.category !== 'Semua') {
            filtered = filtered.filter(dest => dest.category === this._filters.category);
        }
        if (this._filters.location !== 'Semua') {
            filtered = filtered.filter(dest => dest.location === this._filters.location);
        }
        if (this._filters.rating > 0) {
            filtered = filtered.filter(dest => dest.rating >= this._filters.rating);
        }
        if (this._filters.priceRange !== 'Semua') {
            // Implementasi filter harga
        }

        // Apply pagination
        const start = (this._currentPage - 1) * this._itemsPerPage;
        const end = start + this._itemsPerPage;
        return filtered.slice(start, end);
    }

    _getTotalPages() {
        const filteredCount = this._getFilteredDestinations().length;
        return Math.ceil(filteredCount / this._itemsPerPage);
    }

    handleFilterChange(filters) {
        this._filters = { ...this._filters, ...filters };
        this._currentPage = 1; // Reset to first page when filters change
        this.init();
    }

    handlePageChange(page) {
        this._currentPage = page;
        this.init();
    }

    handleSearch(query) {
        if (query) {
            const searchResults = this._destinations.filter(dest => 
                dest.title.toLowerCase().includes(query.toLowerCase()) ||
                dest.description.toLowerCase().includes(query.toLowerCase()) ||
                dest.location.toLowerCase().includes(query.toLowerCase())
            );
            this._destinations = searchResults;
        }
        this._currentPage = 1;
        this.init();
    }
}

export default DestinationPresenter; 