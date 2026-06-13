import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function StoreAuth({ mode }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isRegister = mode === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isRegister ? '/auth/store/register' : '/auth/store/login';
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);
      login(data.token, data.user);
      navigate('/store/browse');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-logo"><span>Stock</span>er</div>
        <h2>Find and order stock from warehouses near you.</h2>
        <div className="auth-feature">
          <div className="auth-feature-icon"><i className="bi bi-search" /></div>
          <p>Search items by name, category or warehouse</p>
        </div>
        <div className="auth-feature">
          <div className="auth-feature-icon"><i className="bi bi-cart-check" /></div>
          <p>Place orders in seconds, track their status in real time</p>
        </div>
        <div className="auth-feature">
          <div className="auth-feature-icon"><i className="bi bi-bell" /></div>
          <p>Get notified when your order is accepted or rejected</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-card">
          <h3>{isRegister ? 'Create store account' : 'Welcome back'}</h3>
          <p className="subtitle">{isRegister ? 'Start browsing warehouse stock' : 'Sign in to your store account'}</p>

          {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="mb-3">
                <label className="form-label">Store Name</label>
                <input
                  className="form-control form-control-lg"
                  placeholder="e.g. Madeiras Lisboa"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button className="btn btn-primary w-100" style={{ padding: '0.65rem', fontSize: '0.9rem' }} disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm me-2" />}
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            {isRegister ? (
              <>Already have an account? <Link to="/store/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>Sign in</Link></>
            ) : (
              <>No account? <Link to="/store/register" style={{ color: 'var(--brand)', fontWeight: 600 }}>Register</Link></>
            )}
          </div>
          <div className="mt-3 text-center" style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
            Are you a warehouse? <Link to="/warehouse/login" style={{ color: 'var(--muted)', fontWeight: 600 }}>Warehouse Portal →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
