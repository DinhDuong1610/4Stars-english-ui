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
import GrammarPage from 'pages/admin/grammars.page';
import VocabularyPage from 'pages/admin/vocabularies.page';
import LoginPage from 'pages/auth/login.page';
import ProtectedRoute from '@/components/common/share/protected-route.component';
import PermissionsPage from 'pages/admin/permissions.page';
import ForbiddenPage from 'pages/error/403.page';
import NotFoundPage from 'pages/error/404.page';
import PermissionGuard from '@/components/common/share/permission-guard.component';
import AdminGuard from '@/components/common/share/admin-guard.component';
import LoggingPage from 'pages/admin/logging.page';
import LeaderboardPage from 'pages/client/leaderboard.page';
import DictionaryPage from 'pages/client/dictionary.page';
import VocabularyDetailPage from 'pages/client/vocabulary-detail.page';

const routes = [
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: <ClientLayout />,
        children: [
            {
                index: true,
                element: (
                    <HomePage />
                ),
            },
            {
                path: 'leaderboard',
                element: (
                    <LeaderboardPage />
                ),
            },
            {
                path: 'dictionary',
                element: (
                    <DictionaryPage />
                ),
            },
            {
                path: 'vocabularies/:id',
                element: (
                    <VocabularyDetailPage />
                ),
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: 'products',
                        element: (
                            <ProductsPage />
                        ),
                    },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/admin',
                element: (
                    <AdminGuard>
                        <AdminLayout />
                    </AdminGuard>
                ),
                children: [
                    {
                        index: true,
                        element: (
                            <DashboardPage />
                        ),
                    },
                    {
                        path: 'users',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/users" method="GET">
                                <UsersPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'plans',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/plans" method="GET">
                                <PlanPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'badges',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/badges" method="GET">
                                <BadgePage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'articles',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/articles" method="GET">
                                <ArticlePage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'videos',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/videos" method="GET">
                                <VideoPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'grammars',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/grammars" method="GET">
                                <GrammarPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'vocabularies',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/vocabularies" method="GET">
                                <VocabularyPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'permissions',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/permissions" method="GET">
                                <PermissionsPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'logging',
                        element: <LoggingPage />
                    }
                ],
            }
        ]
    },
    {
        path: '/403',
        element: <ForbiddenPage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
];

export const router = createBrowserRouter(routes);