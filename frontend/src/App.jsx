import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import './App.css'

const API_BASE = import.meta?.env?.DEV ? '' : 'http://localhost:8081';

// Utility functions for authentication
function getToken() { return localStorage.getItem('token'); }
function getRole() { return localStorage.getItem('role'); }
function getUsername() { return localStorage.getItem('username'); }

function setAuth(token, username, role) {
  localStorage.setItem('token', token);
  localStorage.setItem('username', username);
  localStorage.setItem('role', role);
}

function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
}

// Enhanced API function with better error handling
async function api(path, options = {}) {
  const headers = options.headers || {};
  if (getToken()) headers['Authorization'] = `Bearer ${getToken()}`;
  headers['Content-Type'] = 'application/json';
  
  try {
    const res = await fetch(API_BASE + path, { ...options, headers });
    
    if (!res.ok) {
      let errorMessage = 'Request failed';
      try { 
        const errorData = await res.json(); 
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData); 
      } catch {
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }
      
      // Handle authentication errors
      if (res.status === 401 || res.status === 403) {
        clearAuth();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(errorMessage);
    }
    
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    return res.text();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
}

function Header() {
  const isAuthed = !!getToken();
  const username = getUsername();
  const role = getRole();
  
  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <div className="header">
      <div className="nav">
        <div className="brand">
          <span className="brand-icon">🍭</span>
          Sweet Shop Management
        </div>
        <div className="toolbar">
          {isAuthed ? (
            <>
              <div className="user-info">
                <span className="user-greeting">Welcome back,</span>
                <span className="username">{username}</span>
                <span className={`role-badge role-${role?.toLowerCase()}`}>
                  {role}
                </span>
              </div>
              <Link to="/" className="nav-link">
                <span className="nav-icon">📊</span>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <span className="nav-icon">🚪</span>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link primary">
                <span className="nav-icon">🔑</span>
                Login
              </Link>
              <Link to="/register" className="nav-link secondary">
                <span className="nav-icon">📝</span>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.usernameOrEmail.trim()) {
      setError('Username or email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 3) {
      setError('Password must be at least 3 characters');
      return false;
    }
    return true;
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const resp = await api('/api/auth/login', { 
        method: 'POST', 
        body: JSON.stringify({ 
          usernameOrEmail: formData.usernameOrEmail.trim(), 
          password: formData.password 
        }) 
      });
      setAuth(resp.token, resp.username, resp.role);
      window.location.href = '/';
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="card auth-card">
          <div className="card-header">
            <div className="h1">
              <span className="auth-icon">🔑</span>
              Welcome Back
            </div>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>
          
          <form onSubmit={onLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="usernameOrEmail">Username or Email</label>
              <input 
                id="usernameOrEmail"
                name="usernameOrEmail" 
                type="text"
                placeholder="Enter your username or email" 
                value={formData.usernameOrEmail}
                onChange={handleInputChange}
                disabled={loading}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                id="password"
                name="password" 
                type="password" 
                placeholder="Enter your password" 
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-button primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <span className="button-icon">🔑</span>
                  Sign In
                </>
              )}
            </button>
          </form>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <div className="auth-footer">
            <p>Don't have an account?</p>
            <Link to="/register" className="auth-link">
              <span className="link-icon">📝</span>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

function RegisterPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 3) {
      setError('Password must be at least 3 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await api('/api/auth/register', { 
        method: 'POST', 
        body: JSON.stringify({ 
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role
        }) 
      });
      window.location.href = '/login';
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="card auth-card">
          <div className="card-header">
            <div className="h1">
              <span className="auth-icon">📝</span>
              Create Account
            </div>
            <p className="auth-subtitle">Join Sweet Shop Management today</p>
          </div>
          
          <form onSubmit={onRegister} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                id="username"
                name="username" 
                type="text"
                placeholder="Choose a username" 
                value={formData.username}
                onChange={handleInputChange}
                disabled={loading}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                id="email"
                name="email" 
                type="email"
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                id="password"
                name="password" 
                type="password" 
                placeholder="Create a password" 
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                id="confirmPassword"
                name="confirmPassword" 
                type="password" 
                placeholder="Confirm your password" 
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select 
                id="role"
                name="role" 
                value={formData.role}
                onChange={handleInputChange}
                disabled={loading}
                className="role-select"
              >
                <option value="USER">👤 User - Browse and purchase sweets</option>
                <option value="ADMIN">👑 Admin - Manage inventory and users</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="auth-button primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <span className="button-icon">📝</span>
                  Create Account
                </>
              )}
            </button>
          </form>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <div className="auth-footer">
            <p>Already have an account?</p>
            <Link to="/login" className="auth-link">
              <span className="link-icon">🔑</span>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busyById, setBusyById] = useState({});
  const [searchQuery, setSearchQuery] = useState({ 
    name: '', 
    category: '', 
    minPrice: '', 
    maxPrice: '' 
  });
  const [stats, setStats] = useState({
    totalSweets: 0,
    totalValue: 0,
    lowStock: 0
  });
  const isAdmin = getRole() === 'ADMIN';
  const [toast, setToast] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const loadSweets = useCallback(async () => {
    const params = new URLSearchParams();
    if (searchQuery.name) params.append('name', searchQuery.name);
    if (searchQuery.category) params.append('category', searchQuery.category);
    if (searchQuery.minPrice) params.append('minPrice', searchQuery.minPrice);
    if (searchQuery.maxPrice) params.append('maxPrice', searchQuery.maxPrice);
    
    setLoading(true); 
    setError('');
    try {
      const data = await api('/api/sweets' + (params.toString() ? `/search?${params}` : ''));
      const sweetsData = Array.isArray(data) ? data : [];
      setSweets(sweetsData);
      
      // Calculate stats
      const totalValue = sweetsData.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);
      const lowStock = sweetsData.filter(sweet => sweet.quantity <= 5).length;
      setStats({
        totalSweets: sweetsData.length,
        totalValue: totalValue,
        lowStock: lowStock
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => { 
    loadSweets(); 
  }, [loadSweets]);

  const setBusy = (id, value) => { setBusyById(prev => ({ ...prev, [id]: value })); }
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); }

  const handleSearchChange = (field, value) => {
    setSearchQuery(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadSweets();
  };

  const clearSearch = () => {
    setSearchQuery({ name: '', category: '', minPrice: '', maxPrice: '' });
  };

  const purchase = async (id) => {
    setError(''); 
    setBusy(id, true);
    try { 
      await api(`/api/sweets/${id}/purchase`, { method: 'POST' }); 
      showToast('🛒 Sweet purchased successfully!'); 
      await loadSweets(); 
    } catch (e) { 
      setError(e.message); 
    } finally { 
      setBusy(id, false); 
    }
  };

  const restock = async (id, qty) => {
    const amount = Number(qty || 5);
    if (amount <= 0) {
      setError('Restock quantity must be greater than 0');
      return;
    }
    setError(''); 
    setBusy(id, true);
    try { 
      await api(`/api/sweets/${id}/restock?qty=${amount}`, { method: 'POST' }); 
      showToast(`📦 Restocked ${amount} items!`); 
      await loadSweets(); 
    } catch (e) { 
      setError(e.message); 
    } finally { 
      setBusy(id, false); 
    }
  };

  const addSweet = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = { 
      name: form.name.value.trim(), 
      category: form.category.value.trim(), 
      price: parseFloat(form.price.value), 
      quantity: parseInt(form.quantity.value, 10) 
    };
    
    if (payload.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (payload.quantity < 0) {
      setError('Quantity cannot be negative');
      return;
    }
    
    setError('');
    try { 
      await api('/api/sweets', { method: 'POST', body: JSON.stringify(payload) }); 
      showToast('🍭 Sweet added successfully!'); 
      form.reset(); 
      setShowAddForm(false);
      await loadSweets(); 
    } catch (e2) { 
      setError(e2.message); 
    }
  };

  const updateSweet = async (id, s) => {
    const name = prompt('Sweet Name:', s.name); 
    if (name == null) return;
    const category = prompt('Category:', s.category); 
    if (category == null) return;
    const price = parseFloat(prompt('Price:', s.price)); 
    if (isNaN(price) || price <= 0) {
      setError('Invalid price entered');
      return;
    }
    const quantity = parseInt(prompt('Quantity:', s.quantity), 10); 
    if (isNaN(quantity) || quantity < 0) {
      setError('Invalid quantity entered');
      return;
    }
    
    setError(''); 
    setBusy(id, true);
    try { 
      await api(`/api/sweets/${id}`, { method: 'PUT', body: JSON.stringify({ name, category, price, quantity }) }); 
      showToast('✏️ Sweet updated!'); 
      await loadSweets(); 
    } catch (e) { 
      setError(e.message); 
    } finally { 
      setBusy(id, false); 
    }
  };

  const deleteSweet = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet? This action cannot be undone.')) return;
    setError(''); 
    setBusy(id, true);
    try { 
      await api(`/api/sweets/${id}`, { method: 'DELETE' }); 
      showToast('🗑️ Sweet deleted!'); 
      await loadSweets(); 
    } catch (e) { 
      setError(e.message); 
    } finally { 
      setBusy(id, false); 
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🍭</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalSweets}</div>
              <div className="stat-label">Total Sweets</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">${stats.totalValue.toFixed(2)}</div>
              <div className="stat-label">Total Value</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <div className="stat-value">{stats.lowStock}</div>
              <div className="stat-label">Low Stock</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card">
          <div className="card-header">
            <div className="h1">
              <span className="section-icon">🔍</span>
              Search & Filter
            </div>
          </div>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-grid">
              <div className="form-group">
                <label>Search by Name</label>
                <input 
                  placeholder="Enter sweet name..." 
                  value={searchQuery.name} 
                  onChange={(e) => handleSearchChange('name', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input 
                  placeholder="Filter by category..." 
                  value={searchQuery.category} 
                  onChange={(e) => handleSearchChange('category', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Min Price</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={searchQuery.minPrice} 
                  onChange={(e) => handleSearchChange('minPrice', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Max Price</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="100.00" 
                  value={searchQuery.maxPrice} 
                  onChange={(e) => handleSearchChange('maxPrice', e.target.value)} 
                />
              </div>
            </div>
            <div className="search-actions">
              <button type="submit" className="search-btn">
                <span className="button-icon">🔍</span>
                Search
              </button>
              <button type="button" onClick={clearSearch} className="clear-btn">
                <span className="button-icon">🗑️</span>
                Clear
              </button>
            </div>
          </form>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>

        {/* Admin Add Sweet Section */}
        {isAdmin && (
          <div className="card">
            <div className="card-header">
              <div className="h1">
                <span className="section-icon">➕</span>
                Add New Sweet
              </div>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="toggle-btn"
              >
                {showAddForm ? 'Hide Form' : 'Show Form'}
              </button>
            </div>
            {showAddForm && (
              <form onSubmit={addSweet} className="add-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="sweet-name">Sweet Name</label>
                    <input 
                      id="sweet-name"
                      name="name" 
                      placeholder="Enter sweet name..." 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sweet-category">Category</label>
                    <input 
                      id="sweet-category"
                      name="category" 
                      placeholder="Enter category..." 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sweet-price">Price ($)</label>
                    <input 
                      id="sweet-price"
                      name="price" 
                      type="number" 
                      step="0.01" 
                      min="0.01"
                      placeholder="0.00" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sweet-quantity">Quantity</label>
                    <input 
                      id="sweet-quantity"
                      name="quantity" 
                      type="number" 
                      min="0" 
                      placeholder="0" 
                      required 
                    />
                  </div>
                </div>
                <button type="submit" className="add-btn">
                  <span className="button-icon">➕</span>
                  Add Sweet
                </button>
              </form>
            )}
          </div>
        )}

        {/* Sweets Table */}
        <div className="card">
          <div className="card-header">
            <div className="h1">
              <span className="section-icon">🍭</span>
              Sweets Inventory
            </div>
            <div className="table-info">
              {!loading && sweets.length > 0 && (
                <span className="count-badge">
                  {sweets.length} {sweets.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner large"></div>
              <div className="loading-text">Loading sweets...</div>
            </div>
          ) : sweets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍬</div>
              <div className="empty-title">No sweets found</div>
              <div className="empty-subtitle">
                {Object.values(searchQuery).some(v => v) 
                  ? 'Try adjusting your search filters' 
                  : 'No sweets available in inventory'
                }
              </div>
            </div>
          ) : (
            <div className="table-container">
              <table className="sweets-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sweets.map((sweet) => (
                    <tr key={sweet.id} className="sweet-row">
                      <td className="sweet-id">{sweet.id}</td>
                      <td className="sweet-name">
                        <div className="sweet-name-content">
                          <span className="sweet-emoji">🍭</span>
                          {sweet.name}
                        </div>
                      </td>
                      <td className="sweet-category">
                        <span className="category-badge">{sweet.category}</span>
                      </td>
                      <td className="sweet-price">
                        <span className="price-value">${sweet.price}</span>
                      </td>
                      <td className="sweet-stock">
                        <span className={`stock-badge ${sweet.quantity <= 5 ? 'low-stock' : sweet.quantity <= 0 ? 'out-of-stock' : 'in-stock'}`}>
                          {sweet.quantity <= 0 ? 'Out of Stock' : `${sweet.quantity} ${sweet.quantity === 1 ? 'item' : 'items'}`}
                        </span>
                      </td>
                      <td className="sweet-actions">
                        <div className="action-buttons">
                          <button 
                            className={`action-btn purchase-btn ${sweet.quantity <= 0 ? 'disabled' : ''}`}
                            disabled={sweet.quantity <= 0 || busyById[sweet.id]} 
                            onClick={() => purchase(sweet.id)}
                            title={sweet.quantity <= 0 ? 'Out of stock' : 'Purchase this sweet'}
                          >
                            {busyById[sweet.id] ? (
                              <div className="loading-spinner small"></div>
                            ) : (
                              <>
                                <span className="btn-icon">🛒</span>
                                Buy
                              </>
                            )}
                          </button>
                          
                          {isAdmin && (
                            <>
                              <div className="restock-group">
                                <input 
                                  type="number" 
                                  min="1" 
                                  max="100"
                                  defaultValue="5" 
                                  className="restock-input"
                                  id={`restock-${sweet.id}`}
                                  disabled={busyById[sweet.id]}
                                />
                                <button 
                                  className="action-btn restock-btn"
                                  disabled={busyById[sweet.id]} 
                                  onClick={() => {
                                    const val = document.getElementById(`restock-${sweet.id}`).value;
                                    restock(sweet.id, val);
                                  }}
                                  title="Restock this sweet"
                                >
                                  {busyById[sweet.id] ? (
                                    <div className="loading-spinner small"></div>
                                  ) : (
                                    <>
                                      <span className="btn-icon">📦</span>
                                      Restock
                                    </>
                                  )}
                                </button>
                              </div>
                              
                              <button 
                                className="action-btn edit-btn"
                                disabled={busyById[sweet.id]} 
                                onClick={() => updateSweet(sweet.id, sweet)}
                                title="Edit this sweet"
                              >
                                {busyById[sweet.id] ? (
                                  <div className="loading-spinner small"></div>
                                ) : (
                                  <>
                                    <span className="btn-icon">✏️</span>
                                    Edit
                                  </>
                                )}
                              </button>
                              
                              <button 
                                className="action-btn delete-btn"
                                disabled={busyById[sweet.id]} 
                                onClick={() => deleteSweet(sweet.id)}
                                title="Delete this sweet"
                              >
                                {busyById[sweet.id] ? (
                                  <div className="loading-spinner small"></div>
                                ) : (
                                  <>
                                    <span className="btn-icon">🗑️</span>
                                    Delete
                                  </>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="toast-notification">
          <span className="toast-icon">✅</span>
          {toast}
        </div>
      )}
    </>
  )
}

function RequireAuth({ children }) {
  if (!getToken()) return <Navigate to="/login" replace />
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
