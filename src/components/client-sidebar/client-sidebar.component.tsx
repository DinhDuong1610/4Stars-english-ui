import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    CustomerServiceOutlined,
    BookOutlined,
    BulbOutlined,
    TranslationOutlined,
    ReadOutlined,
    MessageOutlined,
    PlaySquareOutlined,
    TeamOutlined,
    ShopOutlined,
    UserOutlined
} from '@ant-design/icons';

import styles from './client-sidebar.module.scss';
import LanguageSwitcher from '@/components/common/language-switcher/language-switcher.component';
import ThemeSwitcher from '@/components/common/theme-switcher/theme-switcher.component';

const ClientSidebar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const menuItems = [
        { key: '/', icon: <CustomerServiceOutlined />, label: t('sidebar.home') },
        { key: '/dictionary', icon: <TranslationOutlined />, label: t('sidebar.dictionary') },
        { key: '/vocabularies', icon: <BulbOutlined />, label: t('sidebar.vocabulary') },
        { key: '/notebook', icon: <BookOutlined />, label: t('sidebar.notebook') },
        { key: '/grammar', icon: <ReadOutlined />, label: t('sidebar.grammar') },
        { key: '/blog', icon: <MessageOutlined />, label: t('sidebar.blog') },
        { key: '/videos', icon: <PlaySquareOutlined />, label: t('sidebar.videoLessons') },
        { key: '/community', icon: <TeamOutlined />, label: t('sidebar.community') },
        { key: '/store', icon: <ShopOutlined />, label: t('sidebar.store') },
        { key: '/account', icon: <UserOutlined />, label: t('sidebar.account') },
    ];

    return (
        <div className={styles.sidebar}>
            <div className={styles.logo} onClick={() => navigate('/')}>
                4stars
            </div>
            <nav className={styles.menuContainer}>
                {menuItems.map(item => (
                    <NavLink
                        key={item.key}
                        to={item.key}
                        className={({ isActive }) =>
                            `${styles.menuItem} ${isActive ? styles.active : ''}`
                        }
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className={styles.bottomControls}>
                <LanguageSwitcher />
                <ThemeSwitcher />
            </div>
        </div>
    );
};

export default ClientSidebar;
