class FavoritePresenter {
    constructor(view) {
        this._view = view;
        this._view.setPresenter(this);
        this._favorites = [];
        this._currentPage = 1;
        this._itemsPerPage = 9;
    }

    async init() {
        try {
            this._view.updateLoadingState(true);
            await this._loadFavorites();
            
            const paginatedFavorites = this._getPaginatedFavorites();
            const totalPages = this._getTotalPages();

            this._view.render({
                favorites: paginatedFavorites,
                currentPage: this._currentPage,
                totalPages,
                totalItems: this._favorites.length
            });
        } catch (error) {
            console.error('Error loading favorites:', error);
            this._view.renderError(error.message);
        } finally {
            this._view.updateLoadingState(false);
        }
    }

    async _loadFavorites() {
        const favoritesJson = localStorage.getItem('favorites') || '[]';
        this._favorites = JSON.parse(favoritesJson);
    }

    _getPaginatedFavorites() {
        const startIndex = (this._currentPage - 1) * this._itemsPerPage;
        const endIndex = startIndex + this._itemsPerPage;
        return this._favorites.slice(startIndex, endIndex);
    }

    _getTotalPages() {
        return Math.ceil(this._favorites.length / this._itemsPerPage);
    }

    handlePageChange(page) {
        this._currentPage = page;
        const paginatedFavorites = this._getPaginatedFavorites();
        const totalPages = this._getTotalPages();

        this._view.render({
            favorites: paginatedFavorites,
            currentPage: this._currentPage,
            totalPages,
            totalItems: this._favorites.length
        });
    }

    async removeFavorite(accommodationId) {
        try {
            this._favorites = this._favorites.filter(fav => fav.id !== accommodationId);
            localStorage.setItem('favorites', JSON.stringify(this._favorites));
            
            // Recalculate current page if needed
            const totalPages = this._getTotalPages();
            if (this._currentPage > totalPages) {
                this._currentPage = Math.max(1, totalPages);
            }

            const paginatedFavorites = this._getPaginatedFavorites();

            this._view.render({
                favorites: paginatedFavorites,
                currentPage: this._currentPage,
                totalPages,
                totalItems: this._favorites.length
            });

            this._view.showMessage('Akomodasi dihapus dari favorit');
        } catch (error) {
            console.error('Error removing favorite:', error);
            this._view.showError('Gagal menghapus dari favorit');
        }
    }
}

export default FavoritePresenter; 