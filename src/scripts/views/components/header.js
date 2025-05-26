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

    async render() {
        const activeHash = this._getActivePageHash();
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
                                <a href="#/destination" class="nav__link ${activeHash === '/destination' ? 'nav__link--active' : ''}">
                                    Destinasi
                                </a>
                            </li>
                            <li class="nav__item">
                                <a href="#/accommodation" class="nav__link ${activeHash === '/accommodation' ? 'nav__link--active' : ''}">
                                    Akomodasi
                                </a>
                            </li>
                            <li class="nav__item">
                                <a href="#/favorite" class="nav__link ${activeHash === '/favorite' ? 'nav__link--active' : ''}">
                                    Favorit
                                </a>
                            </li>
                            <li class="nav__item">
                                <a href="#/about" class="nav__link ${activeHash === '/about' ? 'nav__link--active' : ''}">
                                    Tentang Kami
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

        window.addEventListener('hashchange', () => {
            this.render();
        });
    }
}

export default Header; 