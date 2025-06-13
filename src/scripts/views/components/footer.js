import '../../../styles/components/footer.css';

class Footer {
    constructor() {
        this._footer = document.getElementById('footerContainer');
    }

    async render() {
        this._footer.innerHTML = `
            <footer class="footer">
                <div class="container">
                    <div class="footer__content">
                        <div class="footer__brand">
                            <div class="footer__logo">
                                <i class="fas fa-compass"></i>
                                <span>WisataPas</span>
                            </div>
                            <p class="footer__description">
                                Temukan destinasi wisata terbaik untuk perjalanan Anda di Indonesia.
                            </p>
                        </div>
                        
                        <div class="footer__links">
                            <div class="footer__section">
                                <h3 class="footer__title">Jelajahi</h3>
                                <ul class="footer__list">
                                    <li><a href="#/destination">Destinasi</a></li>
                                    <li><a href="#/favorite">Favorit</a></li>
                                    <li><a href="#/about">Tentang Kami</a></li>
                                </ul>
                            </div>
                            
                            <div class="footer__section">
                                <h3 class="footer__title">Hubungi Kami</h3>
                                <ul class="footer__list">
                                    <li><a href="mailto:info@wisatapas.com">info@wisatapas.com</a></li>
                                    <li><a href="tel:+628xx-xxxx-xxxx">+62 8xx-xxxx-xxxx</a></li>
                                    <li>Jl. Wisata No. 123</li>
                                    <li>Jakarta, Indonesia</li>
                                </ul>
                            </div>
                            
                            <div class="footer__section">
                                <h3 class="footer__title">Ikuti Kami</h3>
                                <div class="footer__social">
                                    <a href="#" class="footer__social-link">
                                        <i class="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#" class="footer__social-link">
                                        <i class="fab fa-twitter"></i>
                                    </a>
                                    <a href="#" class="footer__social-link">
                                        <i class="fab fa-instagram"></i>
                                    </a>
                                    <a href="#" class="footer__social-link">
                                        <i class="fab fa-youtube"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer__bottom">
                        <p>&copy; 2025 WisataPas. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

export default Footer; 