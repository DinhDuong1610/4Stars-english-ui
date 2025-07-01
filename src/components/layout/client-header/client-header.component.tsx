import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import styles from './client-header.module.scss';

const { Header } = Layout;

const ClientHeader = () => {
    return (
        <Header className={styles.header}>
            <div className={styles.logo}>My App</div>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="1"><Link to="/">Trang Chủ</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/products">Sản Phẩm</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/about">Giới Thiệu</Link></Menu.Item>
            </Menu>
        </Header>
    );
};

export default ClientHeader;