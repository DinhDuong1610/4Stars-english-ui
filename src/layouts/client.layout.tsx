import { Suspense } from 'react';
import { Layout, Spin } from 'antd';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import ClientSidebar from 'components/client-sidebar/client-sidebar.component';
import styles from './client.layout.module.scss';
import MobileBottomNav from 'components/client-sidebar/mobile-bottom-nav.component';
import Sider from 'antd/es/layout/Sider';

const { Content } = Layout;

const ClientLayout = () => {

    const isMobile = useMediaQuery({ maxWidth: 991.98 });

    const xl = useMediaQuery({ maxWidth: 1599.98 });
    const lg = useMediaQuery({ maxWidth: 1199.98 });
    const md = useMediaQuery({ maxWidth: 991.98 });
    const sm = useMediaQuery({ maxWidth: 767.98 });
    const xs = useMediaQuery({ maxWidth: 575.98 });


    return (
        <Layout className={styles.layout}>
            {!isMobile &&
                <Sider width={md ? 200 : lg ? 200 : xl ? 250 : 250} className={styles.sider}>
                    <ClientSidebar />
                </Sider>
            }

            <Layout>
                <Content className={styles.content}>
                    <Suspense fallback={<div className={styles.spinnerContainer}><Spin size="large" /></div>}>
                        <Outlet />
                    </Suspense>
                </Content>
            </Layout>

            {isMobile && <MobileBottomNav />}
        </Layout>
    );
};

export default ClientLayout;