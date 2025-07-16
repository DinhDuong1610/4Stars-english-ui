import { useEffect, useState } from 'react';
import { Row, Col, Card, message, List, Avatar, Space, Skeleton } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import type { IUserDashboard } from 'types/user-dashboard.type';
import { fetchUserDashboardAPI } from 'services/user-dashboard.service';
import styles from './home.page.module.scss';
import type { IUser } from 'types/user.type';
import { fetchLeaderboardAPI } from 'services/leaderboard.service';
import { Link } from 'react-router-dom';
import icon_streak from '@/assets/icons/dashboard/streak.png';
import icon_point from '@/assets/icons/dashboard/point.png';
import { useTranslation } from 'react-i18next';
import NotFoundPage from 'pages/error/404.page';

const HomePage = () => {
    const { t } = useTranslation();
    const [dashboardData, setDashboardData] = useState<IUserDashboard | null>(null);
    const [leaderboardData, setLeaderboardData] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [dashboardRes, leaderboardRes] = await Promise.all([
                    fetchUserDashboardAPI(),
                    fetchLeaderboardAPI()
                ]);

                if (dashboardRes && dashboardRes.data) {
                    setDashboardData(dashboardRes.data);
                }
                if (leaderboardRes && leaderboardRes.data) {
                    setLeaderboardData(leaderboardRes.data.result);
                }
            } catch (error) {
                message.error("Failed to fetch homepage data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <Row gutter={[24, 24]} className={styles.container}>
                <Col xs={24} lg={16}>
                    <Card style={{ height: '100%' }}>
                        <Skeleton active paragraph={{ rows: 8 }} />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card>
                            <Skeleton active avatar={false} paragraph={{ rows: 2 }} />
                        </Card>
                        <Card>
                            <Skeleton active avatar paragraph={{ rows: 4 }} />
                        </Card>
                    </Space>
                </Col>
            </Row>
        );
    }

    if (!dashboardData) {
        return <NotFoundPage />;
    }

    const vocabChartData = Object.entries(dashboardData.vocabularyLevelCounts).map(([level, count]) => ({
        level: `Level ${level}`,
        count: count,
    }));

    const vocabChartConfig = {
        data: vocabChartData,
        xField: 'level',
        yField: 'count',
        yAxis: false,
        label: {
            position: 'top',
            style: { fill: '#000', fontSize: 20, fontWeight: 600 }
        },
        colorField: 'level',
        scale: {
            color: {
                range: ['#68CDE2', '#246FB4', '#100AB6', '#130976', '#110240'],
            },
        },
    };

    const avatarColors = ['#ff7875', '#ff9c6e', '#ffd666', '#95de64', '#5cdbd3', '#69b1ff', '#b37feb', '#ff85c0'];

    return (
        <Row gutter={[24, 24]} className={styles.container}>
            <Col xs={24} lg={16}>
                <Card title={<h2 style={{ textAlign: 'center', marginTop: 10 }}><strong>{t('homepage.vocabStatsTitle')}</strong></h2>}
                    className={styles.mainCard}
                    variant="outlined"
                    style={{ height: '100%' }}
                >
                    <Column {...vocabChartConfig} />
                    <div className={styles.vocabSummary}>
                        <h2 className={styles.vocabCount}>{t('homepage.wordsToReview')} <strong>{dashboardData.wordsToReviewCount ?? 0} {t('homepage.wordsUnit')}</strong></h2>
                        <Space>
                            <button className={styles.button}>{t('homepage.reviewNow')}</button>
                        </Space>
                    </div>
                </Card>
            </Col>

            <Col xs={24} lg={8}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Card bordered={false} className={styles.statsCard}>
                        <div className={styles.statisc}>
                            <div className={styles.statiscItem}>
                                <div className={styles.statiscItemIcon}>
                                    <img src={icon_point} alt="point" />
                                </div>
                                <div className={styles.statiscItemValue}>{dashboardData.userPoints}</div>
                                <div className={styles.statiscItemTitle}>{t('homepage.points')}</div>
                            </div>
                            <div className={styles.statiscItem}>
                                <div className={styles.statiscItemIcon}>
                                    <img src={icon_streak} alt="streak" />
                                </div>
                                <div className={styles.statiscItemValue}>{dashboardData.currentStreak}</div>
                                <div className={styles.statiscItemTitle}>{t('homepage.streak')}</div>
                            </div>
                            <div className={styles.statiscItem}>
                                <div className={styles.statiscItemIcon}>
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}${dashboardData.badges?.image}`} alt="badge" />
                                </div>
                                <div className={styles.statiscItemValueRank}>{dashboardData.badges?.name}</div>
                                <div className={styles.statiscItemTitle}>{t('homepage.rank')}</div>
                            </div>
                        </div>
                    </Card>
                    <Card title={t('homepage.leaderboardTitle')} bordered={false} className={styles.rankCard} extra={<Link to="/leaderboard">{t('homepage.viewAll')} <RightOutlined /></Link>}>
                        <List
                            itemLayout="horizontal"
                            size="small"
                            className={styles.rankList}
                            dataSource={leaderboardData.slice(0, 5)}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar size={45} style={{
                                            backgroundColor: avatarColors[index % avatarColors.length],
                                            color: '#fff',
                                            fontSize: 20,
                                            fontWeight: 'bold'
                                        }}>{item.name.charAt(0).toUpperCase()}</Avatar>}
                                        title={<b>{item.name}</b>}
                                        description={`${item.point} điểm`}
                                    />
                                    <div className={styles.rankNumber}><b>{index + 1}</b></div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Space>
            </Col>
        </Row>
    );
};

export default HomePage;

