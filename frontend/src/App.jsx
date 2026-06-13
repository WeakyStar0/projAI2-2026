import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import StoreAuth from './pages/store/StoreAuth';
import StoreBrowse from './pages/store/StoreBrowse';
import StoreOrders from './pages/store/StoreOrders';
import WarehouseAuth from './pages/warehouse/WarehouseAuth';
import WarehouseStock from './pages/warehouse/WarehouseStock';
import WarehouseOrders from './pages/warehouse/WarehouseOrders';

const WithLayout = ({ element }) => <AppLayout>{element}</AppLayout>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/store/login" element={<StoreAuth mode="login" />} />
          <Route path="/store/register" element={<StoreAuth mode="register" />} />
          <Route path="/store/browse" element={<WithLayout element={<StoreBrowse />} />} />
          <Route path="/store/orders" element={<WithLayout element={<StoreOrders />} />} />

          <Route path="/warehouse/login" element={<WarehouseAuth mode="login" />} />
          <Route path="/warehouse/register" element={<WarehouseAuth mode="register" />} />
          <Route path="/warehouse/stock" element={<WithLayout element={<WarehouseStock />} />} />
          <Route path="/warehouse/orders" element={<WithLayout element={<WarehouseOrders />} />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
