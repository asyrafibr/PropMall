import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { TemplateProvider, useTemplate } from "./context/TemplateContext";

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
import WTBWTRFormPage from "./pages/WTBWTRFormPage";
import WTSWTLFormPage from "./pages/WTSWTLFormPage";

import Sale from "./pages/Sale";
import Rent from "./pages/Rent";
import NewProject from "./pages/NewProject";
import Auction from "./pages/Auction";
import Articles from "./pages/Articles";
import AboutMe from "./pages/Aboutme";
import Tools from "./pages/Tools";
import AgentBox from "./components/AgentBox";
import './custom-bootstrap.scss';

// remove the static CSS import here
// import "./index.css";

const Layout = () => {
  const location = useLocation();
  const { loading, template } = useTemplate();

  // Dynamically load CSS file based on template
useEffect(() => {
  let link = document.querySelector("#dynamic-template-style");

  if (!link) {
    link = document.createElement("link");
    link.rel = "stylesheet";
    link.id = "dynamic-template-style";
    document.head.appendChild(link);
  }

  // change path if files are in public/
  link.href = template === "template2" ? "/index2.css" : "/index.css";
}, [template]);

  const hideHeaderFooter = location.pathname === "/business-card";

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {!hideHeaderFooter && <Header />}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/search" element={<SearchProduct />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/auction" element={<Auction />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/aboutme" element={<AboutMe />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/buy" element={<WTBWTRFormPage mode="buy" />} />
        <Route path="/rent" element={<WTBWTRFormPage mode="rent" />} />
        <Route path="/donedeal/:id" element={<DoneDealDetail />} />
        <Route path="/donedeal" element={<DoneDeal />} />
        <Route path="/property/:slug" element={<ProductDetailPage />} />
        <Route path="/business-card" element={<BusinessCard />} />
        <Route path="/i-want-to" element={<WTSWTLFormPage mode="sale" />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </>
  );
};

const App = () => (
  <TemplateProvider>
    <Router>
      <Layout />
    </Router>
  </TemplateProvider>
);

export default App;
