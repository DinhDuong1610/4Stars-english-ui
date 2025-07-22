import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from 'layouts/admin.layout';
import ClientLayout from 'layouts/client.layout';
import HomePage from '@/pages/client/home/home.page';
import DashboardPage from 'pages/admin/dashboard.page';
import UsersPage from 'pages/admin/users.page';
import PlanPage from 'pages/admin/plans.page';
import BadgePage from 'pages/admin/badges.page';
import ArticlePage from 'pages/admin/articles.page';
import VideoPage from 'pages/admin/videos.page';
import VocabularyPage from 'pages/admin/vocabularies.page';
import LoginPage from 'pages/auth/login.page';
import ProtectedRoute from '@/components/common/share/protected-route.component';
import PermissionsPage from 'pages/admin/permissions.page';
import ForbiddenPage from 'pages/error/403.page';
import NotFoundPage from 'pages/error/404.page';
import PermissionGuard from '@/components/common/share/permission-guard.component';
import AdminGuard from '@/components/common/share/admin-guard.component';
import LoggingPage from 'pages/admin/logging.page';
import LeaderboardPage from '@/pages/client/leaderboard/leaderboard.page';
import DictionaryPage from '@/pages/client/dictionary/dictionary.page';
import VocabularyDetailPage from '@/pages/client/vocabulary/vocabulary-detail.page';
import VocabularyListPage from '@/pages/client/vocabulary/vocabulary-list.page';
import NotebookPage from '@/pages/client/notebook/notebook.page';
import GrammarListPage from '@/pages/client/grammar/grammar-list.page';
import GrammarPage from 'pages/admin/grammars.page';
import GrammarDetailPage from '@/pages/client/grammar/grammar-detail.page';
import ArticleListPage from '@/pages/client/article/article-list.page';
import ArticleDetailPage from '@/pages/client/article/article-detail.page';
import VideoListPage from '@/pages/client/video/video-list.page';
import VideoDetailPage from '@/pages/client/video/video-detail.page';
import CommunityPage from 'pages/client/community/community.page';
import PostDetailPage from 'pages/client/community/post-detail.page';
import ProfilePage from 'pages/client/profile/profile.page';
import StorePage from 'pages/client/store/store.page';
import PremiumPage from 'pages/client/premium/premium.page';
import SubscriptionPage from 'pages/admin/subscription.page';
import RevenueStatisticPage from 'pages/admin/statistic.page';
import ReviewPage from 'pages/client/review/review.page';
import ProcessingPage from 'pages/client/review/processing.page';
import ResultPage from 'pages/client/review/result.page';

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
                path: 'vocabularies',
                element: (
                    <VocabularyListPage />
                ),
            },
            {
                path: 'vocabularies/category/:categoryId',
                element: (
                    <VocabularyListPage />
                ),
            },
            {
                path: 'vocabularies/:id',
                element: (
                    <VocabularyDetailPage />
                ),
            },
            {
                path: 'notebook',
                element: (
                    <NotebookPage />
                ),
            },
            {
                path: 'grammars',
                element: (
                    <GrammarListPage />
                ),
            },
            {
                path: 'grammars/category/:categoryId',
                element: (
                    <GrammarListPage />
                ),
            },
            {
                path: 'grammars/:id',
                element: (
                    <GrammarDetailPage />
                ),
            },
            {
                path: 'articles',
                element: (
                    <ArticleListPage />
                ),
            },
            {
                path: 'articles/category/:categoryId',
                element: (
                    <ArticleListPage />
                ),
            },
            {
                path: 'articles/:id',
                element: (
                    <ArticleDetailPage />
                ),
            },
            {
                path: 'videos',
                element: (
                    <VideoListPage />
                ),
            },
            {
                path: 'videos/category/:categoryId',
                element: (
                    <VideoListPage />
                ),
            },
            {
                path: 'videos/:id',
                element: (
                    <VideoDetailPage />
                ),
            },
            {
                path: 'community',
                element: (
                    <CommunityPage />
                ),
            },
            {
                path: 'posts/:id',
                element: (
                    <PostDetailPage />
                ),
            },
            {
                path: 'profile',
                element: (
                    <ProfilePage />
                ),
            },
            {
                path: 'store',
                element: (
                    <StorePage />
                ),
            },
            {
                path: 'premium',
                element: (
                    <PremiumPage />
                ),
            },
            {
                path: 'review/quiz',
                element: (
                    <ReviewPage />
                ),
            },
            {
                path: 'review/processing',
                element: (
                    <ProcessingPage />
                ),
            },
            {
                path: 'quiz/results/:attemptId',
                element: (
                    <ResultPage />
                ),
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
                        path: 'subscriptions',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/subscriptions" method="GET">
                                <SubscriptionPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'statistics',
                        element: (
                            // <PermissionGuard apiPath="/api/v1/admin/statistics/revenue" method="GET">
                            <RevenueStatisticPage />
                            // </PermissionGuard>
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