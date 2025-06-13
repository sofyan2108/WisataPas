class RegisterView {
    constructor() {
        this._container = null;
    }

    async render(container) {
        this._container = container;
        this._container.innerHTML = `
            <div class="auth-page">
                <div class="auth-container">
                    <h1>Register</h1>
                    <form id="registerForm" class="auth-form">
                        <div class="form-group">
                            <label for="nama">Nama</label>
                            <input type="text" id="nama" name="nama" required>
                        </div>
                        <div class="form-group">
                            <label for="password1">Password</label>
                            <input type="password" id="password1" name="password1" required>
                        </div>
                        <div class="form-group">
                            <label for="password2">Konfirmasi Password</label>
                            <input type="password" id="password2" name="password2" required>
                        </div>
                        <button type="submit" id="registerButton" class="button button--primary">
                            <span class="button__text">Register</span>
                            <span class="button__loader"></span>
                        </button>
                    </form>
                    <p class="auth-link">
                        Sudah punya akun? <a href="#/login">Login di sini</a>
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
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const nama = document.getElementById('nama').value;
                const password1 = document.getElementById('password1').value;
                const password2 = document.getElementById('password2').value;
                
                if (this._presenter) {
                    this._presenter.handleRegister(nama, password1, password2);
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
        
        const form = document.getElementById('registerForm');
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    unmount() {
        this._container.innerHTML = '';
    }

    setLoading(isLoading) {
        const button = document.getElementById('registerButton');
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

export default RegisterView; 