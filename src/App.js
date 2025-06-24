// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TemplateProvider } from "./context/TemplateContext";

import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import SearchProduct from "./pages/SearchPage/SearchPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import BusinessCard from "./components/BusinessCard";
import Footer from "./components/Footer";
import Header from "./components/Header";
import DoneDeal from "./components/DoneDeal";
import ProductDetailPage from "./pages/ProductDetailPage";
import DoneDealDetail from "./components/DoneDealsDetail";

import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const Layout = () => {
  const location = useLocation();

  // Hide header/footer ONLY for /business-card route
  const hideHeaderFooter = location.pathname === "/business-card";

  return (
    <>
      {!hideHeaderFooter && <Header />}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/search" element={<SearchProduct />} />
        <Route path="/donedeal/:id" element={<DoneDealDetail />} />
        <Route path="/donedeal" element={<DoneDeal />} />
        <Route path="/property/:slug" element={<ProductDetailPage />} />
        <Route path="/business-card" element={<BusinessCard />} />
        {/* Add more routes if needed */}
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </>
  );
};

const App = () => (
  <AuthProvider>
    <TemplateProvider>
      <Router>
        <Layout />
      </Router>
    </TemplateProvider>
  </AuthProvider>
);

export default App;
