// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Header from './components/Header'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
            <Header /> 

      <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/search/:location/:year/:term" element={<ProductList />} />
      <Route path="/property/:slug" element={<ProductDetail />} />
        </Routes>
    </Router>
  );
};

export default App;
