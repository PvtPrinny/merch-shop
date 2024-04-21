import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div className='index-div'>
    <BrowserRouter basename={"/merch-shop"}>
      <App />
    </BrowserRouter>
  </div>
);

//npm i react-auth-kit (for React Auth Kit)
//npm i -D react-router-dom@latest