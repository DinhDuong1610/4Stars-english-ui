import { useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import ProLayout from '@ant-design/pro-layout';
import {
    AppstoreOutlined,
    BookOutlined,
    CodeOutlined,
    DashboardOutlined,
    LockOutlined,
    PicCenterOutlined,
    PicLeftOutlined,
    TrophyOutlined,
    UserOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import styles from './admin.layout.module.scss';
import Logo from 'assets/images/logo.png';
import { useAuthStore } from 'stores/auth.store';

const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: <DashboardOutlined /> },
    { path: '/admin/logging', name: 'Monitor', icon: <CodeOutlined /> },
    { path: '/admin/permissions', name: 'Permission', icon: <LockOutlined /> },
    { path: '/admin/users', name: 'User', icon: <UserOutlined /> },
    { path: '/admin/plans', name: 'Plan', icon: <AppstoreOutlined /> },
    { path: '/admin/badges', name: 'Badge', icon: <TrophyOutlined /> },
    { path: '/admin/articles', name: 'Article', icon: <BookOutlined /> },
    { path: '/admin/videos', name: 'Video', icon: <VideoCameraOutlined /> },
    { path: '/admin/grammars', name: 'Grammar', icon: <PicLeftOutlined /> },
    { path: '/admin/vocabularies', name: 'Vocabulary', icon: <PicCenterOutlined /> },
];

const AdminLayout = () => {
    const location = useLocation();
    const { user } = useAuthStore();

    return (
        <div className={styles.container}>
            <ProLayout
                logo={Logo}
                title="ADMIN PAGE"
                layout="mix"
                location={{
                    pathname: location.pathname,
                }}
                menuDataRender={() => menuItems}
                menuItemRender={(menuItemProps, defaultDom) => {
                    if (menuItemProps.isUrl || !menuItemProps.path) return defaultDom;
                    return <Link to={menuItemProps.path}>{defaultDom}</Link>;
                }}
                avatarProps={{
                    title: user?.name,
                    icon: <UserOutlined />
                }}
            >
                <div className={styles.content}>
                    <Outlet />
                </div>
            </ProLayout>
        </div>
    );
};

export default AdminLayout;
