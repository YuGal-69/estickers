import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import PublicRoutes from "./routes/PublicRoutes";
// import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/product-pages/dashboard";
import Cart from "./pages/product-pages/cart";
import Order from "./pages/product-pages/order";
import Checkout from "./pages/product-pages/checkout";
import OrderConfirmation from "./pages/product-pages/order-confirmation";
import ProductDetail from "./pages/product-pages/product-detail";
import Profile from "./pages/product-pages/profile";
import AdminDashboard from "./pages/admin/AdminDashboard";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <div className="">
            <Routes>
              {/* Protected user routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div className="flex w-full">
                      {/* <Sidebar /> */}
                      <div className="flex-1">
                        <Dashboard />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <div className="flex w-full">
                      {/* <Sidebar /> */}
                      <div className="flex-1">
                        <Cart />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order"
                element={
                  <ProtectedRoute>
                    <div className="flex w-full">
                      {/* <Sidebar /> */}
                      <div className="flex-1">
                        <Order />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <div className="flex w-full">
                      {/* <Sidebar /> */}
                      <div className="flex-1">
                        <Checkout />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-confirmation/:orderId"
                element={
                  <ProtectedRoute>
                    <div className="flex w-full">
                      {/* <Sidebar /> */}
                      <div className="flex-1">
                        <OrderConfirmation />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product/:productId"
                element={
                  <div className="flex w-full">
                    {/* <Sidebar /> */}
                    <div className="flex-1">
                      <ProductDetail />
                    </div>
                  </div>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <div className="flex w-full">
                      {/* <Sidebar /> */}
                      <div className="flex-1">
                        <Profile />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Protected admin route */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* Public routes - this should be LAST */}
              <Route path="/*" element={<PublicRoutes />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
