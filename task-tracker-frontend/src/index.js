import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Calendar from "./components/dashboard/Calendar";
import Statistics from "./components/dashboard/Statistics";

const router = createBrowserRouter([
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },// ← новая строка
    { path: '*', element: <Login /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/dashboard/statistics', element: <Statistics /> },
    { path: '/dashboard/calendar', element: <Calendar /> },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);