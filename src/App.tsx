import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import Occasion from './pages/Occasion';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/cms/Login';
import Dashboard from './pages/cms/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cms/login" element={<Login />} />
        <Route path="/cms" element={<Dashboard />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:slug" element={<Category />} />
          <Route path="occasion/:slug" element={<Occasion />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;