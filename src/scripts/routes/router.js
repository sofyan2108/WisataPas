import HomePage from '../views/pages/home/home-view';
import DestinationPage from '../views/pages/destination/destination-view';
import FavoritePage from '../views/pages/favorite/favorite-view';
import AboutPage from '../views/pages/about/about-view';
import LoginPage from '../views/pages/auth/login-view';
import RegisterPage from '../views/pages/auth/register-view';
import LoginPresenter from '../views/pages/auth/login-presenter';
import RegisterPresenter from '../views/pages/auth/register-presenter';
import HomePresenter from '../views/pages/home/home-presenter';
import FavoritePresenter from '../views/pages/favorite/favorite-presenter';
import AboutPresenter from '../views/pages/about/about-presenter';

const routes = {
    '/': HomePage,
    '/home': HomePage,
    '/destination': DestinationPage,
    '/favorite': FavoritePage,
    '/about': AboutPage,
    '/login': LoginPage,
    '/register': RegisterPage
};

class Router {
    constructor() {
        console.log('Router: Constructor called');
        this._content = document.getElementById('mainContent');
        this._currentPage = null;
        this._isNavigating = false;
    }

    _isAuthenticated() {
        return sessionStorage.getItem('user') !== null;
    }

    _isAuthPage(hash) {
        return hash === '/login' || hash === '/register';
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
                if (!this._isAuthenticated()) {
                    window.location.hash = '#/login';
                    this._isNavigating = false;
                    return;
                }
                if (window.location.hash !== '#/') {
                    window.location.hash = '#/';
                    this._isNavigating = false;
                    return;
                }
                hash = '/';
            }

            // Check authentication for protected routes
            if (!this._isAuthenticated() && !this._isAuthPage(hash)) {
                window.location.hash = '#/login';
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
            
            // Initialize presenter based on page
            if (hash === '/login') {
                const presenter = new LoginPresenter(this._currentPage);
                this._currentPage.setPresenter(presenter);
            } else if (hash === '/register') {
                const presenter = new RegisterPresenter(this._currentPage);
                this._currentPage.setPresenter(presenter);
            } else if (hash === '/' || hash === '/home') {
                const presenter = new HomePresenter(this._currentPage);
                this._currentPage.setPresenter(presenter);
            } else if (hash === '/favorite') {
                const presenter = new FavoritePresenter(this._currentPage);
                this._currentPage.setPresenter(presenter);
            } else if (hash === '/about') {
                const presenter = new AboutPresenter(this._currentPage);
                this._currentPage.setPresenter(presenter);
            }

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
                window.location.hash = '#/login';
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