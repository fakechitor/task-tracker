import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from "./components/ProtectedRoute"; // ← новая строка

const router = createBrowserRouter([
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },// ← новая строка
    { path: '*', element: <Login /> },
    { path: '/dashboard', element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ) }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);