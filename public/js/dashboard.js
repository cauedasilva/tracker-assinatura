const API_BASE_URL = '/api/v1';
let token = localStorage.getItem('token');
let currentUser = null;

if (!token) {
    window.location.href = '/';
}

async function init() {
    try {
        await getCurrentUser();
        await loadSubscriptions();
        setDefaultDate();
    } catch (error) {
        console.error('Initialization error:', error);
        logout();
    }
}

async function getCurrentUser() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Invalid token');
        }

        const data = await response.json();
        currentUser = data.data;
        document.getElementById('userName').textContent = currentUser.name;
    } catch (error) {
        logout();
    }
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
}

async function loadSubscriptions() {
    const container = document.getElementById('subscriptionsList');
    container.innerHTML = '<div class="loading">Carregando assinaturas...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/subscriptions/user/${currentUser._id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok && data.data && data.data.length > 0) {
            renderSubscriptions(data.data);
        } else {
            container.innerHTML = '<div class="empty-state">Sem assinaturas disponíveis.</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="empty-state">Erro ao carregar assinaturas.</div>';
    }
}

function renderSubscriptions(subscriptions) {
    const container = document.getElementById('subscriptionsList');

    container.innerHTML = subscriptions.map(sub => `
                <div class="subscription-card">
                    <span class="subscription-status ${sub.status}">${sub.status.toUpperCase()}</span>
                    <h3>${sub.name}</h3>
                    
                    <div class="subscription-details">
                        <div class="detail-item">
                            <strong>Price:</strong> ${sub.currency} ${sub.price.toFixed(2)}
                        </div>
                        <div class="detail-item">
                            <strong>Frequency:</strong> ${capitalizeFirst(sub.frequency)}
                        </div>
                        <div class="detail-item">
                            <strong>Category:</strong> ${capitalizeFirst(sub.category)}
                        </div>
                        <div class="detail-item">
                            <strong>Payment:</strong> ${sub.paymentMethod}
                        </div>
                        <div class="detail-item">
                            <strong>Start Date:</strong> ${formatDate(sub.startDate)}
                        </div>
                        <div class="detail-item">
                            <strong>Renewal:</strong> ${formatDate(sub.renewalDate)}
                        </div>
                    </div>

                    <div class="subscription-actions">
                        <button class="btn-edit" data-id="${sub._id}">Editar</button>
                        ${sub.status === 'active' ?
            `<button class="btn-cancel" data-id="${sub._id}">Cancelar</button>` :
            ''
        }
                        <button class="btn-delete" data-id="${sub._id}">Excluir</button>
                    </div>
                </div>
            `).join('');
    
    attachSubscriptionEventListeners();
}

function attachSubscriptionEventListeners() {
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', async function() {
            const id = this.getAttribute('data-id');
            await loadSubscriptionForEdit(id);
        });
    });
    
    document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            cancelSubscription(id);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteSubscription(id);
        });
    });
}

async function loadSubscriptionForEdit(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            openEditModal(data.data);
        }
    } catch (error) {
        console.error('Error loading subscription:', error);
    }
}

document.getElementById('subscriptionForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Adding...';

    const formData = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        currency: document.getElementById('currency').value,
        frequency: document.getElementById('frequency').value,
        category: document.getElementById('category').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        startDate: new Date(document.getElementById('startDate').value).toISOString()
    };

    try {
        const response = await fetch(`${API_BASE_URL}/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('formMessage', 'Assinatura adicionada com sucesso!', 'success');
            this.reset();
            setDefaultDate();
            await loadSubscriptions();
        } else {
            showMessage('formMessage', data.message || 'Erro ao adicionar assinatura.', 'error');
        }
    } catch (error) {
        showMessage('formMessage', 'Connection error', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Add Subscription';
    }
});

function openEditModal(subscription) {
    document.getElementById('editId').value = subscription._id;
    document.getElementById('editName').value = subscription.name;
    document.getElementById('editPrice').value = subscription.price;
    document.getElementById('editCurrency').value = subscription.currency;
    document.getElementById('editFrequency').value = subscription.frequency;
    document.getElementById('editCategory').value = subscription.category;
    document.getElementById('editPaymentMethod').value = subscription.paymentMethod;

    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('editSubscriptionForm').reset();
    document.getElementById('editFormMessage').style.display = 'none';
}

window.closeEditModal = closeEditModal;

document.getElementById('editSubscriptionForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Atualizando...';

    const id = document.getElementById('editId').value;
    const formData = {
        name: document.getElementById('editName').value,
        price: parseFloat(document.getElementById('editPrice').value),
        currency: document.getElementById('editCurrency').value,
        frequency: document.getElementById('editFrequency').value,
        category: document.getElementById('editCategory').value,
        paymentMethod: document.getElementById('editPaymentMethod').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('editFormMessage', 'Assinatura atualizada com sucesso!', 'success');
            setTimeout(() => {
                closeEditModal();
                loadSubscriptions();
            }, 1500);
        } else {
            showMessage('editFormMessage', data.message || 'Error updating subscription', 'error');
        }
    } catch (error) {
        showMessage('editFormMessage', 'Connection error', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Update Subscription';
    }
});

async function cancelSubscription(id) {
    if (!confirm('Você tem certeza que deseja cancelar esta assinatura?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/subscriptions/${id}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            await loadSubscriptions();
        } else {
            alert('Error canceling subscription');
        }
    } catch (error) {
        alert('Connection error');
    }
}

async function deleteSubscription(id) {
    if (!confirm('Você tem certeza que deseja excluir esta assinatura? Esta ação não pode ser desfeita.')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            await loadSubscriptions();
        } else {
            alert('Error deleting subscription');
        }
    } catch (error) {
        alert('Connection error');
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}

window.logout = logout;

function showMessage(elementId, text, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

init();