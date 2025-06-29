import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import ClientHeader from 'components/client-header/client-header.component';
import ClientFooter from 'components/client-footer/client-footer.component';
import styles from './client.layout.module.scss';

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