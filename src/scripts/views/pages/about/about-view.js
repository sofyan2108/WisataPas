import AboutPresenter from './about-presenter';

class AboutPage {
    constructor() {
        console.log('AboutPage: Constructor called');
        this._container = null;
        this._presenter = new AboutPresenter(this);
    }

    async render(container) {
        console.log('AboutPage: Render called');
        this._container = container;
        this._container.innerHTML = `
            <section class="about-page">
                <div class="container">
                    <h1>Tentang Kami</h1>
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
        await this._presenter.init();
        console.log('AboutPage: Presenter initialized');
    }

    updateContent(data) {
        console.log('AboutPage: updateContent called');
        const content = document.getElementById('aboutContent');
        if (!content) {
            console.error('AboutPage: Content element not found');
            return;
        }

        content.innerHTML = `
            <div class="about__hero">
                <h2 class="about__subtitle">${data.tagline}</h2>
                <p class="about__description">${data.description}</p>
            </div>

            <div class="about__section">
                <h2>Tim Kami</h2>
                <div class="team-grid">
                    ${data.team.map(member => this._createTeamCard(member)).join('')}
                </div>
            </div>

            <div class="about__section">
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

            <div class="about__section">
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

    _createTeamCard(member) {
        return `
            <div class="team-card">
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
        this._container.innerHTML = '';
    }
}

export default AboutPage; 