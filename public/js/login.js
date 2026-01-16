const API_BASE_URL = '/api/v1';

document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    const messageDiv = document.getElementById('registerMessage');

    btn.disabled = true;
    btn.textContent = 'Cadastrando...';
    messageDiv.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.getElementById('registerName').value,
                email: document.getElementById('registerEmail').value,
                password: document.getElementById('registerPassword').value
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('registerMessage', 'Cadastro realizado com sucesso!', 'success');
            this.reset();
        } else {
            showMessage('registerMessage', data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showMessage('registerMessage', 'Connection error', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Register';
    }
});

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    const messageDiv = document.getElementById('loginMessage');

    btn.disabled = true;
    btn.textContent = 'Entrando...';
    messageDiv.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            showMessage('loginMessage', 'Login realizado com sucesso!', 'success');

            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        } else {
            showMessage('loginMessage', data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showMessage('loginMessage', 'Connection error', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Login';
    }
});

function showMessage(elementId, text, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messageDiv.style.display = 'block';

    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}