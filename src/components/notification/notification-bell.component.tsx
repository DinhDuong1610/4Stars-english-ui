import { useState, useEffect } from 'react';
import { Badge, Button, Drawer, List, message, Skeleton, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import styles from './notification-bell.module.scss';
import type { INotification } from 'types/notification.type';
import { fetchNotificationsAPI, fetchUnreadCountAPI, markNotificationAsReadAPI } from 'services/notification.service';

dayjs.extend(relativeTime);

const { Text } = Typography;

const NotificationBell = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getUnreadCount = async () => {
            try {
                const res = await fetchUnreadCountAPI();
                if (res && res.data) {
                    setUnreadCount(res.data.unreadCount);
                }
            } catch (error) {
                console.error("Failed to fetch unread count", error);
            }
        };

        getUnreadCount();
    }, []);

    const showDrawer = async () => {
        setOpen(true);
        setIsLoading(true);
        try {
            const res = await fetchNotificationsAPI();
            if (res && res.data) {
                setNotifications(res.data.result);
            }
        } catch (error) {
            message.error(t('errors.fetchNotificationsError'));
        } finally {
            setIsLoading(false);
        }
    };

    const onClose = () => {
        setOpen(false);
    };

    const handleNotificationClick = async (notification: INotification) => {
        if (!notification.read) {
            try {
                await markNotificationAsReadAPI(notification.id);
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (error) {
                message.error(t('errors.markAsReadError'));
            }
        }

        navigate(notification.link);
        onClose();
    };

    return (
        <>
            <Badge count={unreadCount} size="small">
                <Button
                    type="text"
                    size="large"
                    icon={<BellOutlined />}
                    onClick={showDrawer}
                    className={styles.bellIcon}
                />
            </Badge>
            <Drawer
                title={t('notifications.title')}
                placement="right"
                onClose={onClose}
                open={open}
                width={380}
            >
                {isLoading ? (
                    <Skeleton active paragraph={{ rows: 5 }} />
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={notifications}
                        renderItem={item => (
                            <List.Item
                                className={`${styles.notificationItem} ${!item.read ? styles.unread : ''}`}
                                onClick={() => handleNotificationClick(item)}
                            >
                                <List.Item.Meta
                                    title={<Text strong={!item.read}>{item.message}</Text>}
                                    description={<Text type="secondary">{dayjs(item.createdAt).fromNow()}</Text>}
                                />
                                {!item.read && <div className={styles.unreadDot} />}
                            </List.Item>
                        )}
                    />
                )}
            </Drawer>
        </>
    );
};

export default NotificationBell;
