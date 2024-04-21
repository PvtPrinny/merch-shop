import './App.css';
import React from 'react';
import { createBrowserRouter, RouterProvider, HashRouter as Router } from "react-router-dom";
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
      errorElement:<div>
                  <Header />
                  <Home />
                  <Footer />
                  </div>,
      // errorElement: <NotFound />
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
//   return (
//   <HashRouter>
//   <Routes>
//     <Route path="/" element={<Header />} />
//     <Route path="/Skills" element={<Skills />} />
//     <Route path="/Attributions" element={<Attributions />} />
//     <Route path="/Experience" element={<Experience />} />
//     <Route path="/Projects" element={<Projects />} />
//     <Route path="/Socials" element={<Social />} />
//     <Route path="/test" element={<Test />} />
//     <Route path="/Chart" element={<Chart />} />
//   </Routes>
// </HashRouter>)
}

export default App;
