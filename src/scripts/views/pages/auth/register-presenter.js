class RegisterPresenter {
    constructor(view) {
        this._view = view;
    }

    async handleRegister(nama, password1, password2) {
        try {
            // Validate passwords match
            if (password1 !== password2) {
                this._view.showError('Password tidak cocok');
                return;
            }

            this._view.setLoading(true);

            const response = await fetch('https://wisatapas-backend-vercel.vercel.app/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama,
                    password1,
                    password2
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to login page after successful registration
                window.location.href = '#/login';
            } else {
                this._view.showError(data.message || 'Registrasi gagal. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('Register error:', error);
            this._view.showError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            this._view.setLoading(false);
        }
    }
}

export default RegisterPresenter; 