import '../styles/main.css';
import '../styles/pages/home.css';
import '../styles/pages/destination.css';
import '../styles/pages/favorite.css';
import '../styles/pages/about.css';
import '../styles/pages/auth.css';
import '../styles/components/destination-modal.css';
import '../styles/components/favorite-card.css';

import Router from './routes/router';
import Header from './views/components/header';
import Footer from './views/components/footer';

const app = () => {
    // Create main content container if it doesn't exist
    if (!document.getElementById('mainContent')) {
        const mainContent = document.createElement('main');
        mainContent.id = 'mainContent';
        document.body.appendChild(mainContent);
    }

    // Initialize header
    const header = new Header();
    header.render();

    // Initialize footer
    const footer = new Footer();
    footer.render();

    // Initialize router
    const router = new Router();
    router.init();
};

export default app; 