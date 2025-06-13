class HomePresenter {
    constructor(view) {
        console.log('HomePresenter: Constructor called');
        this._view = view;
    }

    async init() {
        console.log('HomePresenter: Initializing');
        try {
            // Load popular destinations
            const destinations = await this._loadPopularDestinations();
            
            // Load favorites (using mock data for now)
            const favorites = [
                {
                    id: 1,
                    Place_Name: 'Raja Ampat',
                    Description: 'Surga diving dengan keindahan bawah laut yang menakjubkan',
                    image: 'https://source.unsplash.com/800x600/?island',
                    Rating: '4.9',
                    City: 'Papua Barat'
                },
                {
                    id: 2,
                    Place_Name: 'Danau Toba',
                    Description: 'Danau vulkanik terbesar di dunia',
                    image: 'https://source.unsplash.com/800x600/?lake',
                    Rating: '4.7',
                    City: 'Sumatera Utara'
                },
                {
                    id: 3,
                    Place_Name: 'Nusa Penida',
                    Description: 'Pulau eksotis dengan pantai dan tebing yang menakjubkan',
                    image: 'https://source.unsplash.com/800x600/?cliff',
                    Rating: '4.8',
                    City: 'Bali'
                }
            ];

            console.log('HomePresenter: Updating view with real data');
            this._view.updateContent({ destinations, favorites });
        } catch (error) {
            console.error('Error loading destinations:', error);
            this._view.showError('Gagal memuat data destinasi');
        }
    }

    async _loadPopularDestinations() {
        try {
            const response = await fetch('https://mjamalm18-fastapi-wisatapas.hf.space/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    place: ''
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch destinations');
            }

            const data = await response.json();
            console.log('Destinations response:', data);
            
            if (!data.results || data.results.length === 0) {
                throw new Error('No destinations found');
            }

            // Validasi setiap objek destinasi
            const validDestinations = data.results.filter(dest => {
                return dest && 
                       typeof dest === 'object' &&
                       'Place_Name' in dest &&
                       'Category' in dest &&
                       'City' in dest &&
                       'Rating' in dest;
            });

            if (validDestinations.length === 0) {
                throw new Error('No valid destinations found');
            }

            return validDestinations;
        } catch (error) {
            console.error('Error loading popular destinations:', error);
            throw error;
        }
    }

    handleSearch(location, date) {
        console.log('HomePresenter: Search triggered with:', { location, date });
        // Implement search logic here
    }

    handleViewMore(section) {
        console.log('HomePresenter: View more triggered for section:', section);
        // Implement view more logic here
        window.location.hash = `#/${section}`;
    }
}

export default HomePresenter; 