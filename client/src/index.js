import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import router from './routes.js'
import { RouterProvider } from 'react-router-dom'; // <-- Import RouterProvider


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);



