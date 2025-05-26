import AccommodationView from './accommodation-view';
import AccommodationPresenter from './accommodation-presenter';

const view = new AccommodationView();
const presenter = new AccommodationPresenter(view);
view.setPresenter(presenter);

export default {
    async render() {
        return presenter.init();
    }
}; 