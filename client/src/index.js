import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import auth context
import { AuthProvider } from './context/AuthContext'
import router from './routes.js'
import { RouterProvider } from 'react-router-dom'; // <-- Import RouterProvider


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

// Authentication context is accesible to all components rendered with RouterProvider.

