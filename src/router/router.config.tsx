import { createBrowserRouter } from 'react-router-dom';

import AdminLayout from 'layouts/admin.layout';
import ClientLayout from 'layouts/client.layout';

import HomePage from 'pages/client/home.page';
import ProductsPage from 'pages/client/products.page';
import DashboardPage from 'pages/admin/dashboard.page';
import UsersPage from 'pages/admin/users.page';
import PlanPage from 'pages/admin/plans.page';
import BadgePage from 'pages/admin/badges.page';
import ArticlePage from 'pages/admin/articles.page';
import VideoPage from 'pages/admin/videos.page';

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
            {
                path: 'users',
                element: <UsersPage />,
            },
            {
                path: 'plans',
                element: <PlanPage />,
            },
            {
                path: 'badges',
                element: <BadgePage />,
            },
            {
                path: 'articles',
                element: <ArticlePage />,
            },
            {
                path: 'videos',
                element: <VideoPage />,
            }
        ],
    },
];

export const router = createBrowserRouter(routes);