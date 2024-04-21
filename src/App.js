import './App.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Footer from './components/Footer';
import Footer2 from './components/Footer2';
import NotFound from './pages/NotFound';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element:  <div>
                  <Header />
                  <Home />
                  <Footer />
                </div>,
      errorElement: <NotFound />
    },
    {
      path: '/about',
      element:  <div>
                  <Header />
                  <About />
                  <Footer2 />
                </div>,
    }
  ]);
  return (
    <div className="app-div">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;