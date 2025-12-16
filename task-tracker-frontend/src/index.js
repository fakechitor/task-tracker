import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
        errorElement: <ErrorBoundary />
    },
    {
        path: '/register',
        element: <Register />,
        errorElement: <ErrorBoundary />
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
        errorElement: <ErrorBoundary />
    },
    {
        path: '/dashboard/statistics',
        element: <Dashboard />,
        errorElement: <ErrorBoundary />
    },
    {
        path: '/dashboard/calendar',
        element: <Dashboard />,
        errorElement: <ErrorBoundary />
    },
    {
        path: '*',
        element: <Login />,
        errorElement: <ErrorBoundary />
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);