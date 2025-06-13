class LoginPresenter {
    constructor(view) {
        this._view = view;
    }

    async handleLogin(nama, password) {
        try {
            const response = await fetch('https://wisatapas-backend-vercel.vercel.app/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama,
                    password
                })
            });

            const data = await response.json();

            if (response.ok && data.userId) {
                // Store user data in session storage
                sessionStorage.setItem('user', JSON.stringify({
                    id: data.userId,
                    nama: nama
                }));
                
                // Store tokens in session storage
                sessionStorage.setItem('authTokenNama', data.token_nama);
                sessionStorage.setItem('authTokenId', data.token_id);
                
                // Use router navigation
                window.location.hash = '#';
            } else {
                this._view.showError(data.message || 'Login gagal. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('Login error:', error);
            this._view.showError('Terjadi kesalahan. Silakan coba lagi.');
        }
    }
}

export default LoginPresenter; 