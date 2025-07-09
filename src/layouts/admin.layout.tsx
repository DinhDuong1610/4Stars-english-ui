import { Link, Outlet } from 'react-router-dom';
import ProLayout from '@ant-design/pro-layout';
import { AppstoreOutlined, BookOutlined, DashboardOutlined, PicLeftOutlined, TrophyOutlined, UserOutlined, VideoCameraOutlined, } from '@ant-design/icons';
import styles from './admin.layout.module.scss';
import Logo from 'assets/images/logo.png';

const AdminLayout: React.FC = () => {
    return (
        <div className={styles.container}>
            <ProLayout
                logo={Logo}
                title="Trang Quản Trị"
                layout="mix"
                menuDataRender={() => [
                    { path: '/admin', name: 'Dashboard', icon: <DashboardOutlined /> },
                    { path: '/admin/users', name: 'Quản lý Người dùng', icon: <UserOutlined /> },
                    { path: '/admin/plans', name: 'Plan Management', icon: <AppstoreOutlined /> },
                    { path: '/admin/badges', name: 'Badge Management', icon: <TrophyOutlined /> },
                    { path: '/admin/articles', name: 'Article Management', icon: <BookOutlined /> },
                    { path: '/admin/videos', name: 'Video Management', icon: <VideoCameraOutlined /> },
                    { path: '/admin/grammars', name: 'Grammar Management', icon: <PicLeftOutlined /> },
                ]}
                menuItemRender={(menuItemProps, defaultDom) => {
                    if (menuItemProps.isUrl || !menuItemProps.path) return defaultDom;
                    return <Link to={menuItemProps.path}>{defaultDom}</Link>;
                }}
                avatarProps={{
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                    title: 'Admin', size: 'large',
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