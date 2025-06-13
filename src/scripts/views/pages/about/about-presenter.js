class AboutPresenter {
    constructor(view) {
        this._view = view;
    }

    async init() {
        const aboutData = {
            tagline: 'Jelajahi keindahan Indonesia bersama kami!',
            description: 'WisataPas adalah aplikasi yang dirancang untuk mempermudah Anda menemukan dan merencanakan perjalanan wisata impian di seluruh Indonesia. Dari keindahan alam hingga kekayaan budaya, kami hadir untuk membantu Anda menemukan destinasi terbaik yang sesuai dengan preferensi Anda.',
            team: [
                {
                    name: 'Sofyan Farros',
                    role: 'FrontEnd Developer',
                    image: '/assets/images/team/sofyan.png',
                    social: {
                        github: 'https://github.com/sofyan2108',
                        linkedin: 'https://www.linkedin.com/in/sofyanfarros/'
                    }
                },
                {
                    name: 'Miftahullah Surya',
                    role: 'Machine Learning',
                    image: '/assets/images/team/miftah.png',
                    social: {
                        github: 'https://github.com/miftahsuryan',
                        linkedin: 'https://www.linkedin.com/in/miftahullah-surya-nugraha-0442a6295/'
                    }
                },
                {
                    name: 'Marsha Kamilla',
                    role: 'Machine Learning',
                    image: '/assets/images/team/marsha.png',
                    social: {
                        github: 'https://github.com/shamarsha',
                        linkedin: 'https://www.linkedin.com/in/marsha-kamila/'
                    }
                },
                {
                    name: 'Husnul Khatimah',
                    role: 'Machine Learning',
                    image: '/assets/images/team/husnul.png',
                    social: {
                        github: 'https://github.com/husnlkhatmh',
                        linkedin: 'https://www.linkedin.com/in/husnlkhatmh/'
                    }
                },
                {
                    name: 'Abdullah Ridho',
                    role: 'Project Manager',
                    image: '/assets/images/team/ridho.png',
                    social: {
                        github: 'https://github.com/Dw3ls',
                        linkedin: 'https://www.linkedin.com/in/abdullahridho/'
                    }
                },
                {
                    name: 'Muhammad Jamal',
                    role: 'Backend Developer',
                    image: '/assets/images/team/jamal.png',
                    social: {
                        github: 'https://github.com/jamaljml18',
                        linkedin: 'https://www.linkedin.com/in/muhammad-jamaluddin-182f04/'
                    }
                }
            ],
            vision: 'Menjadi platform terkemuka untuk eksplorasi wisata di Indonesia, menghubungkan wisatawan dengan pengalaman tak terlupakan.',
            missions: [
                'Menyediakan informasi destinasi wisata yang akurat dan komprehensif.',
                'Mempermudah perencanaan perjalanan dengan fitur yang intuitif.',
                'Mempromosikan pariwisata lokal yang berkelanjutan.',
                'Membangun komunitas wisatawan yang aktif dan saling berbagi.'
            ],
            contact: {
                email: 'info@wisatapas.com',
                phone: '+62 812 3456 7890',
                address: 'Jl. Contoh No. 123, Jakarta, Indonesia',
                social: {
                    facebook: 'https://facebook.com/wisatapas',
                    twitter: 'https://twitter.com/wisatapas',
                    instagram: 'https://instagram.com/wisatapas'
                }
            }
        };

        this._view.updateContent(aboutData);
    }
}

export default AboutPresenter; 