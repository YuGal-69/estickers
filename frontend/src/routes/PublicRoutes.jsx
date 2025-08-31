import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/product-pages/home";
import Signup from "../pages/authentication/signup";
import Login from "../pages/authentication/login";
import Otp from "../pages/authentication/otp";

const PublicRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/otp" element={<Otp />} />
  </Routes>
);

export default PublicRoutes;
