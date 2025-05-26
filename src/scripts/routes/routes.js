import FavoriteView from '../views/pages/favorite/favorite-view';
import FavoritePresenter from '../views/pages/favorite/favorite-presenter';
import AboutView from '../views/pages/about/about-view';
import AboutPresenter from '../views/pages/about/about-presenter';

const routes = {
    // ... existing routes ...
    '/favorite': {
        view: FavoriteView,
        presenter: FavoritePresenter
    },
    '/about': {
        view: AboutView,
        presenter: AboutPresenter
    }
};

export default routes; 