import AboutPresenter from './about-presenter';
import revealElements from '../../../utils/scroll-reveal';

class AboutPage {
    constructor() {
        console.log('AboutPage: Constructor called');
        this._container = null;
        this._presenter = null;
    }

    setPresenter(presenter) {
        this._presenter = presenter;
    }

    async render(container) {
        console.log('AboutPage: Render called');
        this._container = container;
        this._container.innerHTML = `
            <section class="about-page">
                <div class="container">
                    <h1 class="reveal">Tentang Kami</h1>
                    <div id="aboutContent">
                        <div class="loading">
                            <div class="loading__spinner"></div>
                            <p>Memuat informasi...</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    async afterRender() {
        console.log('AboutPage: afterRender called');
        document.body.classList.add('about-page');
        // Scroll ke atas saat halaman dimuat
        window.scrollTo(0, 0);
        
        if (this._presenter) {
            console.log('AboutPage: Attempting to initialize presenter...');
            await this._presenter.init();
            console.log('AboutPage: Presenter initialized');
            revealElements(); // Inisialisasi scroll reveal
        } else {
            console.error('AboutPage: Presenter not set');
            this.showError('Terjadi kesalahan: Presenter belum diinisialisasi.');
        }
    }

    updateContent(data) {
        console.log('AboutPage: updateContent called');
        const content = document.getElementById('aboutContent');
        if (!content) {
            console.error('AboutPage: Content element not found');
            return;
        }

        content.innerHTML = `
            <div class="about__hero reveal reveal-delay-1">
                <h2 class="about__subtitle">${data.tagline}</h2>
                <p class="about__description">${data.description}</p>
            </div>

            <div class="about__section reveal reveal-delay-2">
                <h2>Tim Kami</h2>
                <div class="team-grid">
                    ${data.team.map((member, index) => this._createTeamCard(member, index)).join('')}
                </div>
            </div>

            <div class="about__section reveal reveal-delay-3">
                <h2>Visi & Misi</h2>
                <div class="vision-mission">
                    <div class="vision">
                        <h3>Visi</h3>
                        <p>${data.vision}</p>
                    </div>
                    <div class="mission">
                        <h3>Misi</h3>
                        <ul>
                            ${data.missions.map(mission => `<li>${mission}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>

            <div class="about__section reveal reveal-delay-4">
                <h2>Hubungi Kami</h2>
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <a href="mailto:${data.contact.email}">${data.contact.email}</a>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <a href="tel:${data.contact.phone}">${data.contact.phone}</a>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${data.contact.address}</span>
                    </div>
                </div>
            </div>
        `;
    }

    _createTeamCard(member, index) {
        return `
            <div class="team-card reveal reveal-delay-${index + 1}">
                <img src="${member.image}" alt="${member.name}" class="team-card__image">
                <div class="team-card__content">
                    <h3 class="team-card__name">${member.name}</h3>
                    <p class="team-card__role">${member.role}</p>
                    <div class="team-card__social">
                        ${member.social.github ? `
                            <a href="${member.social.github}" target="_blank" rel="noopener">
                                <i class="fab fa-github"></i>
                            </a>
                        ` : ''}
                        ${member.social.linkedin ? `
                            <a href="${member.social.linkedin}" target="_blank" rel="noopener">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    unmount() {
        console.log('AboutPage: Unmounting');
        document.body.classList.remove('about-page');
        this._container.innerHTML = '';
    }
}

export default AboutPage; 