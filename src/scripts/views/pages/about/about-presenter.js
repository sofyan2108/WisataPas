class AboutPresenter {
    constructor(view) {
        this._view = view;
        this._view.setPresenter(this);
    }

    async init() {
        const aboutData = {
            appName: 'WisataPas',
            description: 'Aplikasi pencarian akomodasi terbaik untuk perjalanan Anda',
            version: '1.0.0',
            features: [
                {
                    icon: 'fa-search',
                    title: 'Pencarian Mudah',
                    description: 'Temukan akomodasi dengan mudah menggunakan berbagai filter pencarian'
                },
                {
                    icon: 'fa-hotel',
                    title: 'Berbagai Pilihan',
                    description: 'Pilihan akomodasi lengkap dari hotel, villa, resort hingga apartment'
                },
                {
                    icon: 'fa-heart',
                    title: 'Simpan Favorit',
                    description: 'Simpan akomodasi favorit Anda untuk referensi di masa mendatang'
                },
                {
                    icon: 'fa-money',
                    title: 'Harga Terbaik',
                    description: 'Dapatkan harga terbaik dengan berbagai pilihan pembayaran'
                }
            ],
            team: [
                {
                    name: 'Meng Capstone',
                    role: 'Full Stack Developer',
                    image: 'images/team/meng.jpg',
                    social: {
                        github: 'https://github.com/mengcapstone',
                        linkedin: 'https://linkedin.com/in/mengcapstone'
                    }
                }
            ],
            technologies: [
                {
                    name: 'HTML5',
                    icon: 'fab fa-html5'
                },
                {
                    name: 'CSS3',
                    icon: 'fab fa-css3-alt'
                },
                {
                    name: 'JavaScript',
                    icon: 'fab fa-js'
                },
                {
                    name: 'Node.js',
                    icon: 'fab fa-node-js'
                }
            ],
            contact: {
                email: 'info@wisatapas.com',
                phone: '+62 812 3456 7890',
                address: 'Jakarta, Indonesia',
                social: {
                    facebook: 'https://facebook.com/wisatapas',
                    twitter: 'https://twitter.com/wisatapas',
                    instagram: 'https://instagram.com/wisatapas'
                }
            }
        };

        this._view.render(aboutData);
    }
}

export default AboutPresenter; 