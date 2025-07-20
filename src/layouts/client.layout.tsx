import React, { Suspense } from 'react';
import { Layout, Spin } from 'antd';
import { Outlet } from 'react-router-dom';
import ClientSidebar from 'components/client-sidebar/client-sidebar.component';
import styles from './client.layout.module.scss';

const { Sider, Content } = Layout;

const ClientLayout = () => {
    return (
        <Layout className={styles.layout}>
            <Sider width={250} className={styles.sider}>
                <ClientSidebar />
            </Sider>
            <Layout>
                <Content className={styles.content}>
                    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Spin size="large" /></div>}>
                        <Outlet />
                    </Suspense>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ClientLayout;