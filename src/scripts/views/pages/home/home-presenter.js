class HomePresenter {
    constructor(view) {
        console.log('HomePresenter: Constructor called');
        this._view = view;
    }

    async init() {
        console.log('HomePresenter: Initializing');
        // Mock data for initial render
        const mockData = {
            destinations: [
                {
                    id: 1,
                    title: 'Pantai Kuta',
                    description: 'Pantai terkenal di Bali dengan pemandangan sunset yang menakjubkan',
                    image: 'https://source.unsplash.com/800x600/?beach',
                    rating: '4.5',
                    location: 'Bali'
                },
                {
                    id: 2,
                    title: 'Candi Borobudur',
                    description: 'Candi Buddha terbesar di dunia, warisan budaya yang menakjubkan',
                    image: 'https://source.unsplash.com/800x600/?temple',
                    rating: '4.8',
                    location: 'Magelang'
                },
                {
                    id: 3,
                    title: 'Gunung Bromo',
                    description: 'Gunung berapi aktif dengan pemandangan yang spektakuler',
                    image: 'https://source.unsplash.com/800x600/?volcano',
                    rating: '4.7',
                    location: 'Jawa Timur'
                }
            ],
            accommodations: [
                {
                    id: 1,
                    title: 'Villa Sunset',
                    description: 'Villa mewah dengan pemandangan laut yang indah',
                    image: 'https://source.unsplash.com/800x600/?villa',
                    rating: '4.6',
                    price: 'Rp 2.000.000/malam'
                },
                {
                    id: 2,
                    title: 'Mountain Lodge',
                    description: 'Penginapan nyaman di kaki gunung',
                    image: 'https://source.unsplash.com/800x600/?lodge',
                    rating: '4.4',
                    price: 'Rp 800.000/malam'
                },
                {
                    id: 3,
                    title: 'City Hotel',
                    description: 'Hotel bintang 4 di pusat kota',
                    image: 'https://source.unsplash.com/800x600/?hotel',
                    rating: '4.3',
                    price: 'Rp 1.200.000/malam'
                }
            ],
            favorites: [
                {
                    id: 1,
                    title: 'Raja Ampat',
                    description: 'Surga diving dengan keindahan bawah laut yang menakjubkan',
                    image: 'https://source.unsplash.com/800x600/?island',
                    rating: '4.9',
                    location: 'Papua Barat'
                },
                {
                    id: 2,
                    title: 'Danau Toba',
                    description: 'Danau vulkanik terbesar di dunia',
                    image: 'https://source.unsplash.com/800x600/?lake',
                    rating: '4.7',
                    location: 'Sumatera Utara'
                },
                {
                    id: 3,
                    title: 'Nusa Penida',
                    description: 'Pulau eksotis dengan pantai dan tebing yang menakjubkan',
                    image: 'https://source.unsplash.com/800x600/?cliff',
                    rating: '4.8',
                    location: 'Bali'
                }
            ]
        };

        console.log('HomePresenter: Updating view with mock data');
        this._view.updateContent(mockData);
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