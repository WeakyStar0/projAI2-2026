import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const emptyForm = { name: '', description: '', quantity: '', unit: 'units', category_id: '' };

export default function WarehouseStock() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [catName, setCatName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user || user.role !== 'warehouse') navigate('/warehouse/login');
  }, [user]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [itemsRes, catsRes] = await Promise.all([api.get('/items/mine'), api.get('/categories')]);
      setItems(itemsRes.data);
      setCategories(catsRes.data);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) { await api.put(`/items/${editId}`, form); }
      else { await api.post('/items', form); }
      setForm(emptyForm); setEditId(null); setShowForm(false);
      fetchAll();
    } catch (err) { setError(err.response?.data?.error || 'Error saving item'); }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description || '', quantity: item.quantity, unit: item.unit, category_id: item.category_id || '' });
    setEditId(item.id); setShowForm(true); setShowCatForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('stock.deleteConfirm'))) return;
    await api.delete(`/items/${id}`); fetchAll();
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      await api.post('/categories', { name: catName.trim() });
      setCatName(''); setShowCatForm(false); fetchAll();
    } catch (err) { setError(err.response?.data?.error || 'Category already exists'); }
  };

  const getCategoryLabel = (cat) => {
    if (!cat) return t('stock.noCategory');
    const key = `categories.${cat.name}`;
    const translated = t(key);
    return translated === key ? cat.name : translated;
  };

  const lowStock = items.filter((i) => i.quantity < 10).length;
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  if (loading) return <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}><div className="spinner-border" /></div>;

  return (
    <>
      <div className="page-header">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h1 className="page-title">{t('stock.title')}</h1>
            <p className="page-subtitle">{t('stock.subtitle')}</p>
          </div>
          <div className="d-flex gap-2 mt-1">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => { setShowCatForm(!showCatForm); setShowForm(false); setCatName(''); }}>
              <i className="bi bi-tag me-1" />{showCatForm ? t('stock.cancel') : t('stock.newCategory')}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm); setShowCatForm(false); }}>
              <i className="bi bi-plus-lg me-1" />{showForm && !editId ? t('stock.cancel') : t('stock.addItem')}
            </button>
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card" style={{ '--accent-color': 'var(--brand)' }}>
          <div className="stat-value">{items.length}</div>
          <div className="stat-label">{t('stock.totalItems')}</div>
          <i className="bi bi-box-seam stat-icon" />
        </div>
        <div className="stat-card" style={{ '--accent-color': '#3b82f6' }}>
          <div className="stat-value">{totalQty.toLocaleString()}</div>
          <div className="stat-label">{t('stock.unitsInStock')}</div>
          <i className="bi bi-stack stat-icon" />
        </div>
        <div className="stat-card" style={{ '--accent-color': lowStock > 0 ? '#ef4444' : '#22c55e' }}>
          <div className="stat-value" style={{ color: lowStock > 0 ? '#ef4444' : 'inherit' }}>{lowStock}</div>
          <div className="stat-label">{t('stock.lowStock')}</div>
          <i className="bi bi-exclamation-triangle stat-icon" />
        </div>
        <div className="stat-card" style={{ '--accent-color': '#8b5cf6' }}>
          <div className="stat-value">{categories.length}</div>
          <div className="stat-label">{t('stock.categories')}</div>
          <i className="bi bi-tag stat-icon" />
        </div>
      </div>

      <div className="page-body" style={{ paddingTop: 0 }}>
        {error && <div className="alert alert-danger mb-3">{error}</div>}

        {showCatForm && (
          <form className="card mb-3" onSubmit={handleAddCategory}>
            <div className="card-body d-flex gap-2 align-items-end">
              <div className="flex-grow-1">
                <label className="form-label">{t('stock.newCategoryName')}</label>
                <input className="form-control" value={catName} onChange={(e) => setCatName(e.target.value)} placeholder={t('stock.categoryPlaceholder')} autoFocus required />
              </div>
              <button type="submit" className="btn btn-primary">{t('stock.create')}</button>
            </div>
          </form>
        )}

        {showForm && (
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="fw-semibold">{editId ? t('stock.editItem') : t('stock.newItem')}</span>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => { setShowForm(false); setEditId(null); }}><i className="bi bi-x" /></button>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">{t('stock.nameCol')}</label>
                  <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">{t('stock.categoryCol')}</label>
                  <select className="form-select" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                    <option value="">{t('stock.noCategory')}</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{getCategoryLabel(c)}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">{t('stock.quantityCol')}</label>
                  <input type="number" className="form-control" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required min="0" />
                </div>
                <div className="col-md-2">
                  <label className="form-label">{t('stock.unitCol')}</label>
                  <input className="form-control" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                </div>
                <div className="col-md-1 d-flex align-items-end">
                  <button type="submit" className="btn btn-primary w-100"><i className="bi bi-check-lg" /></button>
                </div>
                <div className="col-12">
                  <label className="form-label">{t('stock.descriptionCol')}</label>
                  <textarea className="form-control" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t('stock.descriptionPlaceholder')} />
                </div>
              </form>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <i className="bi bi-box-seam" />
              <p>{t('stock.noItems')}<br />{t('stock.noItemsSub')}</p>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>{t('stock.nameCol')}</th>
                    <th>{t('stock.categoryCol')}</th>
                    <th>{t('stock.quantityCol')}</th>
                    <th>{t('stock.unitCol')}</th>
                    <th>{t('stock.descriptionCol')}</th>
                    <th style={{ width: 120 }}>{t('stock.actionsCol')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td><div className="fw-semibold">{item.name}</div></td>
                      <td>
                        {item.Category ? (
                          <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
                            {getCategoryLabel(item.Category)}
                          </span>
                        ) : '—'}
                      </td>
                      <td><span className={`badge ${item.quantity === 0 ? 'bg-danger' : item.quantity < 10 ? 'bg-warning text-dark' : 'bg-success'}`}>{item.quantity}</span></td>
                      <td className="text-muted">{item.unit}</td>
                      <td className="text-muted" style={{ fontSize: '0.78rem' }}>{item.description || '—'}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(item)}><i className="bi bi-pencil" /></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}><i className="bi bi-trash" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
