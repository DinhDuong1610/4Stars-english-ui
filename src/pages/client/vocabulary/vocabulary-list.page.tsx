import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Typography, Input, Breadcrumb, message, Skeleton, Card, Button } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './vocabulary-list.page.module.scss';
import type { ICategory } from 'types/category.type';
import type { IVocabulary } from 'types/vocabulary.type';
import CategoryCard from 'components/category/category-card.component';
import VocabularyCard from 'components/vocabulary/vocabulary-card.component';
import { fetchCategoriesClientAPI } from 'services/category.service';
import { fetchVocabulariesClientAPI } from 'services/vocabulary.service';
const { Title } = Typography;


const VocabularyListPage = () => {
    const { categoryId } = useParams<{ categoryId?: string }>();
    const { t } = useTranslation();
    const [categoryTree, setCategoryTree] = useState<ICategory[]>([]);
    const [currentSubCategories, setCurrentSubCategories] = useState<ICategory[]>([]);
    const [vocabularies, setVocabularies] = useState<IVocabulary[]>([]);
    const [filteredVocabularies, setFilteredVocabularies] = useState<IVocabulary[]>([]);
    const [breadcrumbPath, setBreadcrumbPath] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentCategoryName, setCurrentCategoryName] = useState<string>('');

    useEffect(() => {
        const getCategoryTree = async () => {
            setIsLoading(true);
            try {
                const res = await fetchCategoriesClientAPI('type=VOCABULARY');
                if (res && res.data) {
                    setCategoryTree(res.data.result);
                }
            } catch (error) {
                message.error(t('errors.fetchDataError'));
            } finally {
                setIsLoading(false);
            }
        };
        getCategoryTree();
    }, [t]);

    useEffect(() => {
        if (categoryTree.length === 0) return;

        setIsLoading(true);
        const id = categoryId ? parseInt(categoryId) : undefined;

        if (id) {
            const { category, path } = findCategoryAndPath(categoryTree, id);
            if (category) {
                setCurrentCategoryName(category.name);
                setCurrentSubCategories(category.subCategories || []);
                setBreadcrumbPath(path);

                const getVocabs = async () => {
                    try {
                        const vocabRes = await fetchVocabulariesClientAPI(`categoryId=${category.id}`);
                        setVocabularies(vocabRes.data.result);
                        setFilteredVocabularies(vocabRes.data.result);
                    } catch (error) {
                        message.error(t('errors.fetchDataError'));
                    } finally {
                        setIsLoading(false);
                    }
                };
                getVocabs();
            } else {
                setIsLoading(false);
            }
        } else {
            setCurrentCategoryName(t('vocabulary.pageTitle'));
            setCurrentSubCategories(categoryTree);
            setBreadcrumbPath([]);
            setVocabularies([]);
            setFilteredVocabularies([]);
            setIsLoading(false);
        }
    }, [categoryId, categoryTree, t]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = vocabularies.filter(v =>
            v.word.toLowerCase().includes(searchTerm) ||
            v.meaningVi.toLowerCase().includes(searchTerm)
        );
        setFilteredVocabularies(filtered);
    };

    const findCategoryAndPath = (nodes: ICategory[], nodeId: number, path: ICategory[] = []): { category: ICategory | null; path: ICategory[] } => {
        for (const node of nodes) {
            const currentPath = [...path, node];
            if (node.id === nodeId) {
                return { category: node, path: currentPath };
            }
            if (node.subCategories && node.subCategories.length > 0) {
                const result = findCategoryAndPath(node.subCategories, nodeId, currentPath);
                if (result.category) {
                    return result;
                }
            }
        }
        return { category: null, path: [] };
    };

    const renderBreadcrumb = () => (
        <>
            <Breadcrumb className={styles.breadcrumb}>
                <Breadcrumb.Item>
                    <Link to="/vocabularies"><HomeOutlined /></Link>
                </Breadcrumb.Item>
                {breadcrumbPath.map(cat => (
                    <Breadcrumb.Item key={cat.id}>
                        {cat.id === breadcrumbPath[breadcrumbPath.length - 1]?.id ? (
                            <span>{cat.name}</span>
                        ) : (
                            <Link to={`/vocabularies/category/${cat.id}`}>{cat.name}</Link>
                        )}
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
        </>
    );

    if (isLoading) {
        const skeletons = [1, 2, 3, 4, 5, 6, 7, 8];
        return (
            <>
                <Card className={styles.pageContainer}>
                    <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                        {skeletons.map(item => (
                            <Col key={item} xs={24} sm={12} md={8} lg={8}>
                                <Skeleton active paragraph={{ rows: 2 }} className={styles.pageContainer} />;
                            </Col>
                        ))}
                    </Row>
                </Card>
            </>
        )

    }

    return (
        <Card className={styles.pageContainer}>
            <Title level={2} className={styles.pageTitle}>{currentCategoryName}</Title>

            {categoryId && renderBreadcrumb()}

            {currentSubCategories.length > 0 && (
                <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                    {currentSubCategories.map(cat => (
                        <Col key={cat.id} xs={24} sm={12} md={8} lg={8}>
                            <CategoryCard category={cat} basePath="vocabularies" />
                        </Col>
                    ))}
                </Row>
            )}

            {categoryId && currentSubCategories.length === 0 && (
                <div className={styles.vocabContainer}>
                    <Row className={styles.rowSearch}>
                        <Input.Search
                            size="large"
                            placeholder={t('vocabulary.searchPlaceholder')}
                            enterButton={<Button type="primary" icon={<SearchOutlined />}>{t('dictionary.search')}</Button>}
                            onChange={handleSearch}
                            className={styles.searchBar}
                            loading={isLoading}
                            allowClear
                        />
                    </Row>
                    <Row gutter={[12, 12]} className={styles.vocabCards}>
                        {filteredVocabularies.map(vocab => (
                            <Col key={vocab.id} xs={24} sm={12} md={8} lg={6}>
                                <VocabularyCard vocabulary={vocab} />
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        </Card>
    );
};

export default VocabularyListPage;
