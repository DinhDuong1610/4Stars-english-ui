import { createBrowserRouter } from 'react-router-dom';

import AdminLayout from 'layouts/admin.layout';
import ClientLayout from 'layouts/client.layout';

import HomePage from 'pages/client/home.page';
import ProductsPage from 'pages/client/products.page';
import DashboardPage from 'pages/admin/dashboard.page';

const routes = [
    {
        path: '/',
        element: <ClientLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'products',
                element: <ProductsPage />,
            },
        ],
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
        ],
    },
];

export const router = createBrowserRouter(routes);