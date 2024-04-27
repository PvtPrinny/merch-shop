import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import React from 'react';
import NotFound from './pages/NotFound';
import { HashRouter, Route, Routes, Link } from "react-router-dom";

function App() {
  return (
    <div className="app-div">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
