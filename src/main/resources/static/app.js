const API_BASE = '';

const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const authMsg = document.getElementById('auth-msg');
const whoami = document.getElementById('whoami');
const logoutBtn = document.getElementById('logout-btn');
const adminPanel = document.getElementById('admin-panel');
const sweetsList = document.getElementById('sweets-list');

function setToken(token, username, role) {
  localStorage.setItem('token', token);
  localStorage.setItem('username', username);
  localStorage.setItem('role', role);
}

function getToken() { return localStorage.getItem('token'); }
function getRole() { return localStorage.getItem('role'); }
function getUsername() { return localStorage.getItem('username'); }

function updateUIAuth() {
  const token = getToken();
  if (token) {
    authSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    whoami.textContent = `Signed in as ${getUsername()} (${getRole()})`;
    adminPanel.classList.toggle('hidden', getRole() !== 'ADMIN');
    loadSweets();
  } else {
    authSection.classList.remove('hidden');
    appSection.classList.add('hidden');
  }
}

async function api(path, options = {}) {
  const headers = options.headers || {};
  if (getToken()) headers['Authorization'] = `Bearer ${getToken()}`;
  headers['Content-Type'] = 'application/json';
  const res = await fetch(API_BASE + path, { ...options, headers });
  if (!res.ok) {
    let msg = 'Request failed';
    try { const body = await res.json(); msg = body.message || JSON.stringify(body); } catch {}
    throw new Error(msg);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  authMsg.textContent = '';
  const usernameOrEmail = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  try {
    const resp = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ usernameOrEmail, password }) });
    setToken(resp.token, resp.username, resp.role);
    updateUIAuth();
  } catch (err) { authMsg.textContent = err.message; }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  authMsg.textContent = '';
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const role = document.getElementById('reg-role').value;
  try {
    const resp = await api('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password, role }) });
    setToken(resp.token, resp.username, resp.role);
    updateUIAuth();
  } catch (err) { authMsg.textContent = err.message; }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  updateUIAuth();
});

async function loadSweets() {
  sweetsList.innerHTML = 'Loading...';
  try {
    const data = await api('/api/sweets');
    if (!Array.isArray(data)) { sweetsList.textContent = 'No data'; return; }
    if (data.length === 0) { sweetsList.textContent = 'No sweets available'; return; }
    sweetsList.innerHTML = '';
    for (const s of data) {
      const row = document.createElement('div');
      row.className = 'sweet';
      row.innerHTML = `
        <div>${s.name}</div>
        <div>${s.category}</div>
        <div>$${s.price}</div>
        <div>Qty: ${s.quantity}</div>
        <button ${s.quantity <= 0 ? 'disabled' : ''}>Purchase</button>
        ${getRole() === 'ADMIN' ? '<button class="secondary">Restock +5</button>' : ''}
      `;
      const [purchaseBtn, restockBtn] = row.querySelectorAll('button');
      purchaseBtn?.addEventListener('click', async () => {
        purchaseBtn.disabled = true;
        try { await api(`/api/sweets/${s.id}/purchase`, { method: 'POST' }); await loadSweets(); } catch (e) { alert(e.message); }
        purchaseBtn.disabled = false;
      });
      if (getRole() === 'ADMIN' && restockBtn) {
        restockBtn.addEventListener('click', async () => {
          restockBtn.disabled = true;
          try { await api(`/api/sweets/${s.id}/restock?qty=5`, { method: 'POST' }); await loadSweets(); } catch (e) { alert(e.message); }
          restockBtn.disabled = false;
        });
      }
      sweetsList.appendChild(row);
    }
  } catch (e) { sweetsList.textContent = e.message; }
}

document.getElementById('add-sweet-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('sweet-name').value.trim();
  const category = document.getElementById('sweet-category').value.trim();
  const price = parseFloat(document.getElementById('sweet-price').value);
  const quantity = parseInt(document.getElementById('sweet-qty').value, 10);
  try { await api('/api/sweets', { method: 'POST', body: JSON.stringify({ name, category, price, quantity }) });
    e.target.reset(); await loadSweets();
  } catch (e2) { alert(e2.message); }
});

updateUIAuth();

