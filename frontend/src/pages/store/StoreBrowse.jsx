import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function StoreBrowse() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [filters, setFilters] = useState({ search: '', category_id: '', warehouse_id: '', min_quantity: '' });
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'store') navigate('/store/login');
  }, [user]);

  useEffect(() => {
    fetchCategories();
    fetchWarehouses();
    fetchItems();
  }, []);

  const fetchCategories = async () => {
    const { data } = await api.get('/categories');
    setCategories(data);
  };

  const fetchWarehouses = async () => {
    const { data } = await api.get('/warehouses');
    setWarehouses(data);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.warehouse_id) params.warehouse_id = filters.warehouse_id;
      if (filters.min_quantity) params.min_quantity = filters.min_quantity;
      const { data } = await api.get('/items', { params });
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const setQty = (itemId, qty) => {
    setCart((prev) => ({ ...prev, [itemId]: Math.max(0, parseInt(qty) || 0) }));
  };

  const groupedByWarehouse = items.reduce((acc, item) => {
    const wId = item.Warehouse.id;
    if (!acc[wId]) acc[wId] = { warehouse: item.Warehouse, items: [] };
    acc[wId].items.push(item);
    return acc;
  }, {});

  const cartTotal = Object.values(cart).reduce((s, q) => s + q, 0);

  const placeOrder = async (warehouseId) => {
    const orderItems = groupedByWarehouse[warehouseId].items
      .filter((i) => cart[i.id] > 0)
      .map((i) => ({ item_id: i.id, quantity_requested: cart[i.id] }));

    if (!orderItems.length) {
      setFeedback({ type: 'warning', msg: 'Set quantities before placing an order.' });
      return;
    }

    setOrderLoading(true);
    try {
      await api.post('/orders', { warehouse_id: warehouseId, items: orderItems });
      setFeedback({ type: 'success', msg: 'Order placed! Check My Orders to track status.' });
      setCart({});
    } catch (err) {
      setFeedback({ type: 'danger', msg: err.response?.data?.error || 'Order failed' });
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h1 className="page-title">Browse Stock</h1>
            <p className="page-subtitle">Search items across all warehouses</p>
          </div>
          {cartTotal > 0 && (
            <div className="badge bg-primary" style={{ fontSize: '0.8rem', padding: '0.5em 0.9em', borderRadius: '8px' }}>
              <i className="bi bi-cart me-1" />{cartTotal} in cart
            </div>
          )}
        </div>
      </div>

      <div className="page-body" style={{ paddingTop: '1.5rem' }}>
        {feedback && (
          <div className={`alert alert-${feedback.type} alert-dismissible mb-4`}>
            {feedback.msg}
            <button className="btn-close" onClick={() => setFeedback(null)} />
          </div>
        )}

        <div className="search-bar">
          <form className="row g-2 align-items-end" onSubmit={handleSearch}>
            <div className="col-md-4">
              <label className="form-label">Search</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: '#f8fafc', borderColor: 'var(--border)' }}>
                  <i className="bi bi-search text-muted" />
                </span>
                <input
                  className="form-control"
                  placeholder="Search by item name..."
                  value={filters.search}
                  style={{ borderLeft: 'none' }}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label">Category</label>
              <select className="form-select" value={filters.category_id} onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}>
                <option value="">All categories</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Warehouse</label>
              <select className="form-select" value={filters.warehouse_id} onChange={(e) => setFilters({ ...filters, warehouse_id: e.target.value })}>
                <option value="">All warehouses</option>
                {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Min Quantity</label>
              <input
                className="form-control"
                type="number"
                placeholder="0"
                value={filters.min_quantity}
                onChange={(e) => setFilters({ ...filters, min_quantity: e.target.value })}
              />
            </div>
            <div className="col-md-1">
              <button className="btn btn-primary w-100" type="submit">
                <i className="bi bi-search" />
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" /></div>
        ) : items.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <i className="bi bi-box-seam" />
              <p>No items found.<br />Try adjusting your search filters.</p>
            </div>
          </div>
        ) : (
          Object.values(groupedByWarehouse).map(({ warehouse, items: wItems }) => (
            <div key={warehouse.id} className="card mb-4">
              <div className="item-row-warehouse">
                <div>
                  <div className="wh-name">
                    <i className="bi bi-building me-2" />{warehouse.name}
                  </div>
                  {warehouse.location && <div className="wh-loc"><i className="bi bi-geo-alt me-1" />{warehouse.location}</div>}
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => placeOrder(warehouse.id)}
                  disabled={orderLoading}
                >
                  <i className="bi bi-cart-plus me-1" />Place Order
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Category</th>
                      <th>Available</th>
                      <th>Unit</th>
                      <th style={{ width: 130 }}>Order Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="fw-semibold">{item.name}</div>
                          {item.description && <div className="text-muted" style={{ fontSize: '0.75rem' }}>{item.description}</div>}
                        </td>
                        <td>
                          {item.Category ? (
                            <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>{item.Category.name}</span>
                          ) : '—'}
                        </td>
                        <td>
                          <span className={`badge ${item.quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                            {item.quantity}
                          </span>
                        </td>
                        <td className="text-muted">{item.unit}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            min="0"
                            max={item.quantity}
                            value={cart[item.id] || ''}
                            placeholder="0"
                            onChange={(e) => setQty(item.id, e.target.value)}
                            style={{ width: 90 }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
