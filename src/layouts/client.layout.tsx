import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import ClientHeader from 'components/ClientHeader';
import ClientFooter from 'components/ClientFooter';

import styles from 'styles/layout/client.layout.module.css';

const { Content } = Layout;

const ClientLayout = () => {
    return (
        <Layout>
            <ClientHeader />

            <Content className={styles.content}>
                <div className={styles.contentBackground}>
                    <Outlet />
                </div>
            </Content>

            <ClientFooter />
        </Layout>
    );
};

export default ClientLayout;