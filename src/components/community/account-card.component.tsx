import { Card, Avatar, Typography, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from 'stores/auth.store';
import styles from 'pages/client/community/community.page.module.scss';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const AccountCard = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const isProfile = window.location.href.toString().endsWith('profile');

    if (!user) {
        return null;
    }

    return (
        <Card className={styles.widgetCard}>
            <div className={styles.accountHeader}>
                <div className={styles.coverPhoto}></div>
                <Avatar size={80} className={styles.profileAvatar}>
                    {user.name?.charAt(0)}
                </Avatar>
            </div>
            <div className={styles.accountInfo}>
                <Title level={4}>{user.name}</Title>
                <Text type="secondary">@{user.email?.split('@')[0]}</Text>
                <div className={styles.stats}>
                    <Text><strong>{user.point || 0}</strong> {t('community.points')}</Text>
                    <Text>{t('community.rank')} <strong>{user.badge?.name || 'N/A'}</strong></Text>
                </div>

                {
                    !isProfile ? (
                        <Link to="/profile">
                            <Button style={{ width: '100%' }} type="primary" icon={<SettingOutlined />}>{t('community.editProfile')}</Button>
                        </Link>
                    ) : (
                        <Button style={{ width: '100%' }} type="primary" icon={<SettingOutlined />}>{t('community.editProfile')}</Button>
                    )

                }
            </div>
        </Card>
    );
};

export default AccountCard;
