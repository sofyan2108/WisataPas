import '../../../styles/components/header.css';

class Header {
    constructor() {
        this._header = document.getElementById('headerContainer');
        this._isNavVisible = false;
    }

    _getActivePageHash() {
        return window.location.hash.slice(1) || '/';
    }

    _toggleMobileNav() {
        this._isNavVisible = !this._isNavVisible;
        const nav = document.querySelector('.nav');
        if (this._isNavVisible) {
            nav.classList.add('nav--mobile');
        } else {
            nav.classList.remove('nav--mobile');
        }
    }

    _handleProtectedNavigation(e, isLoggedIn) {
        if (!isLoggedIn) {
            e.preventDefault();
            window.location.hash = '#/login';
        }
    }

    async render() {
        const activeHash = this._getActivePageHash();
        const tokenId = sessionStorage.getItem('authTokenId');
        const isLoggedIn = !!tokenId;

        this._header.innerHTML = `
            <div class="header">
                <div class="header__container">
                    <a href="#/" class="header__logo">
                        <div class="header__logo-icon">
                            <i class="fas fa-compass"></i>
                        </div>
                        <span class="header__logo-text">WisataPas</span>
                    </a>

                    <nav class="nav">
                        <ul class="nav__list">
                            <li class="nav__item">
                                <a href="#/" class="nav__link ${activeHash === '/' ? 'nav__link--active' : ''}">
                                    Beranda
                                </a>
                            </li>
                            <li class="nav__item">
                                <a href="#/destination" class="nav__link ${activeHash === '/destination' ? 'nav__link--active' : ''}" id="destinationLink">
                                    Destinasi
                                </a>
                            </li>
                            <li class="nav__item">
                                <a href="#/favorite" class="nav__link ${activeHash === '/favorite' ? 'nav__link--active' : ''}" id="favoriteLink">
                                    Favorit
                                </a>
                            </li>
                            <li class="nav__item">
                                <a href="#/about" class="nav__link ${activeHash === '/about' ? 'nav__link--active' : ''}">
                                    Tentang Kami
                                </a>
                            </li>
                            <li class="nav__item nav__item--auth">
                                <a href="#/login" class="nav__link nav__link--auth" id="authButton" data-logged-in="${isLoggedIn}">
                                    ${isLoggedIn ? 'Keluar' : 'Masuk'}
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <button class="header__mobile-button" aria-label="Menu">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        `;

        this._initializeListeners();
    }

    _initializeListeners() {
        const mobileButton = document.querySelector('.header__mobile-button');
        mobileButton.addEventListener('click', () => this._toggleMobileNav());

        const authButton = document.getElementById('authButton');
        if (authButton) {
            authButton.addEventListener('click', (e) => {
                const tokenId = sessionStorage.getItem('authTokenId');
                if (tokenId) {
                    e.preventDefault();
                    sessionStorage.removeItem('authTokenId');
                    sessionStorage.removeItem('authTokenNama');
                    window.location.hash = '#/login';
                    this.render();
                }
            });
        }

        // Tambahkan event listener untuk protected navigation
        const destinationLink = document.getElementById('destinationLink');
        const favoriteLink = document.getElementById('favoriteLink');
        const isLoggedIn = !!sessionStorage.getItem('authTokenId');

        if (destinationLink) {
            destinationLink.addEventListener('click', (e) => this._handleProtectedNavigation(e, isLoggedIn));
        }
        if (favoriteLink) {
            favoriteLink.addEventListener('click', (e) => this._handleProtectedNavigation(e, isLoggedIn));
        }

        window.addEventListener('hashchange', () => {
            this.render();
        });
    }
}

export default Header; 