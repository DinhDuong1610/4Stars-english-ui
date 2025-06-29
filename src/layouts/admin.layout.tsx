import { Link, Outlet } from 'react-router-dom';
import ProLayout from '@ant-design/pro-layout';
import { DashboardOutlined, UserOutlined } from '@ant-design/icons';
import styles from 'styles/layout/admin.layout.module.css';

const AdminLayout = () => {
    return (
        <div className={styles.container}>
            <ProLayout
                logo="https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg"
                title="Trang Quản Trị"
                layout="mix"
                menuDataRender={() => [
                    {
                        path: '/admin/dashboard',
                        name: 'Dashboard',
                        icon: <DashboardOutlined />,
                    },
                    {
                        path: '/admin/users',
                        name: 'Quản lý Người dùng',
                        icon: <UserOutlined />,
                    },
                ]}
                menuItemRender={(menuItemProps, defaultDom) => {
                    if (menuItemProps.isUrl || !menuItemProps.path) {
                        return defaultDom;
                    }
                    return <Link to={menuItemProps.path}>{defaultDom}</Link>;
                }}
                avatarProps={{
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                    title: 'Admin',
                    size: 'small',
                }}
            >
                <Outlet />
            </ProLayout>
        </div>
    );
};

export default AdminLayout;