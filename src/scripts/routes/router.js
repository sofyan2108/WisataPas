import HomePage from '../views/pages/home/home-view';
import DestinationPage from '../views/pages/destination/destination-view';
import DestinationDetail from '../views/pages/destination/destination-detail';
import AccommodationPage from '../views/pages/accommodation/accommodation-view';
import FavoritePage from '../views/pages/favorite/favorite-view';
import AboutPage from '../views/pages/about/about-view';

const routes = {
    '/': HomePage,
    '/destination': DestinationPage,
    '/accommodation': AccommodationPage,
    '/favorite': FavoritePage,
    '/about': AboutPage,
};

class Router {
    constructor() {
        console.log('Router: Constructor called');
        this._content = document.getElementById('mainContent');
        this._currentPage = null;
        this._isNavigating = false;
    }

    async handleUrlChange(forceReload = false) {
        if (this._isNavigating && !forceReload) {
            console.log('Router: Navigation already in progress');
            return;
        }

        this._isNavigating = true;

        try {
            console.log('Router: Handling URL change');
            let hash = window.location.hash.slice(1);
            console.log('Router: Raw hash:', hash);
            
            // Handle empty hash or root path
            if (!hash || hash === '/') {
                console.log('Router: Empty hash or root path detected');
                if (window.location.hash !== '#/') {
                    window.location.hash = '#/';
                    this._isNavigating = false;
                    return;
                }
                hash = '/';
            }

            // Handle detail pages
            const detailMatch = hash.match(/^\/destination\/(\d+)$/);
            if (detailMatch) {
                console.log('Router: Destination detail page detected');
                const id = detailMatch[1];
                this._handleDetailPage(id);
                this._isNavigating = false;
                return;
            }

            console.log('Router: Processed hash:', hash);
            const Page = routes[hash];

            if (!Page) {
                console.error('Router: Page not found for hash:', hash);
                window.location.hash = '#/';
                this._isNavigating = false;
                return;
            }

            // Clear current page content and unmount if exists
            if (this._currentPage && typeof this._currentPage.unmount === 'function') {
                console.log('Router: Unmounting current page');
                this._currentPage.unmount();
            }
            
            if (this._content) {
                this._content.innerHTML = '';
            }

            console.log('Router: Creating new page instance');
            this._currentPage = new Page();
            
            console.log('Router: Rendering page');
            await this._currentPage.render(this._content);
            
            console.log('Router: Running afterRender');
            await this._currentPage.afterRender();
        } catch (error) {
            console.error('Router: Error handling URL change:', error);
            if (this._content) {
                this._content.innerHTML = `
                    <div class="error-container">
                        <h1>Oops! Terjadi Kesalahan</h1>
                        <p>Mohon maaf, halaman tidak dapat dimuat.</p>
                        <p class="error-details">${error.message}</p>
                        <a href="#/" class="button button--primary">Kembali ke Beranda</a>
                    </div>
                `;
            }
        } finally {
            this._isNavigating = false;
        }
    }

    async _handleDetailPage(id) {
        // Clear current page content and unmount if exists
        if (this._currentPage && typeof this._currentPage.unmount === 'function') {
            console.log('Router: Unmounting current page');
            this._currentPage.unmount();
        }
        
        if (this._content) {
            this._content.innerHTML = '';
        }

        console.log('Router: Creating destination detail page');
        this._currentPage = new DestinationDetail(id);
        
        console.log('Router: Rendering detail page');
        await this._currentPage.render(this._content);
        
        console.log('Router: Running afterRender for detail page');
        await this._currentPage.afterRender();
    }

    init() {
        console.log('Router: Initializing');
        
        // Handle hashchange events
        window.addEventListener('hashchange', () => {
            console.log('Router: Hash changed');
            this.handleUrlChange();
        });

        // Handle initial load
        window.addEventListener('load', () => {
            console.log('Router: Initial load');
            // Force reload on initial load to ensure content is rendered
            if (!window.location.hash) {
                window.location.hash = '#/';
            } else {
                this.handleUrlChange(true);
            }
        });

        // Handle popstate events (browser back/forward)
        window.addEventListener('popstate', () => {
            console.log('Router: Popstate event');
            this.handleUrlChange(true);
        });
    }
}

export default Router; 