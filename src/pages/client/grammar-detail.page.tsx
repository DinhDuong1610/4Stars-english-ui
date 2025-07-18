import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, message, Skeleton, Button, Tag, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './grammar-detail.page.module.scss';
import { fetchGrammarDetailClientAPI } from 'services/grammar.service';
import type { IGrammar } from 'types/grammar.type';

const { Title } = Typography;

const GrammarDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [grammar, setGrammar] = useState<IGrammar | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const getGrammarDetail = async () => {
            setIsLoading(true);
            try {
                const res = await fetchGrammarDetailClientAPI(parseInt(id));
                if (res && res.data) {
                    setGrammar(res.data);
                } else {
                    message.error(t('errors.fetchGrammarDetail'));
                }
            } catch (error) {
                message.error(t('errors.fetchGrammarDetail'));
            } finally {
                setIsLoading(false);
            }
        };

        getGrammarDetail();
    }, [id, t]);

    if (isLoading) {
        return <Card className={styles.detailContainer}><Skeleton active paragraph={{ rows: 10 }} /></Card>;
    }

    if (!grammar) {
        return <Card bordered={false} className={styles.detailContainer}>
            <Empty >
                {t('errors.grammarNotFound')}
            </Empty>
        </Card>;
    }

    return (
        <Card bordered={false} className={styles.detailContainer}>
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className={styles.backButton}
            >
                {t('common.back')}
            </Button>

            <div className={styles.grammarDetail}>
                <Title level={2} className={styles.grammarTitle}>{grammar.name}</Title>

                <div
                    className={styles.grammarContent}
                    dangerouslySetInnerHTML={{ __html: grammar.content }}
                />
            </div>
        </Card>
    );
};

export default GrammarDetailPage;
