import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/product-pages/dashboard";
import Cart from "../pages/product-pages/cart";
import Order from "../pages/product-pages/order";

const PrivateRoutes = () => (
  <div className="flex w-full">
    <Sidebar />
    <div className="flex-1">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/" element={<Dashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cart/" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order/" element={<Order />} />
      </Routes>
    </div>
  </div>
);

export default PrivateRoutes;
