const revealElements = () => {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        reveals.forEach((element, index) => {
            const revealTop = element.getBoundingClientRect().top;
            
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };

    // Jalankan sekali saat halaman dimuat
    revealOnScroll();
    
    // Jalankan setiap kali user scroll
    window.addEventListener('scroll', revealOnScroll);
};

export default revealElements; 