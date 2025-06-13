class LoginView {
    constructor() {
        this._container = null;
    }

    async render(container) {
        this._container = container;
        this._container.innerHTML = `
            <div class="auth-page">
                <div class="auth-container">
                    <h1>Login</h1>
                    <form id="loginForm" class="auth-form">
                        <div class="form-group">
                            <label for="nama">Nama</label>
                            <input type="text" id="nama" name="nama" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit" id="loginButton" class="button button--primary">
                            <span class="button__text">Login</span>
                            <span class="button__loader"></span>
                        </button>
                    </form>
                    <p class="auth-link">
                        Belum punya akun? <a href="#/register">Daftar di sini</a>
                    </p>
                </div>
            </div>
        `;

        this._initializeListeners();
    }

    async afterRender() {
        // Focus on the first input field
        const firstInput = document.getElementById('nama');
        if (firstInput) {
            firstInput.focus();
        }
    }

    _initializeListeners() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const nama = document.getElementById('nama').value;
                const password = document.getElementById('password').value;
                
                if (this._presenter) {
                    this._presenter.handleLogin(nama, password);
                }
            });
        }
    }

    setPresenter(presenter) {
        this._presenter = presenter;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.textContent = message;
        
        const form = document.getElementById('loginForm');
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    unmount() {
        this._container.innerHTML = '';
    }

    setLoading(isLoading) {
        const button = document.getElementById('loginButton');
        if (button) {
            if (isLoading) {
                button.classList.add('button--loading');
                button.disabled = true;
                // Disable form inputs while loading
                const inputs = this._container.querySelectorAll('input');
                inputs.forEach(input => input.disabled = true);
            } else {
                button.classList.remove('button--loading');
                button.disabled = false;
                // Re-enable form inputs
                const inputs = this._container.querySelectorAll('input');
                inputs.forEach(input => input.disabled = false);
            }
        }
    }
}

export default LoginView; 