import React from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { ICategory } from 'types/category.type';
import styles from './category-card.module.scss';
import icon_category from 'assets/icons/category/vocabulary.png';

const { Title, Paragraph } = Typography;

interface CategoryCardProps {
    category: ICategory;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
    return (
        <Link to={`/vocabularies/category/${category.id}`}>
            <div className={styles.categoryCard}>
                <div className={styles.categoryImage}>
                    <img src={icon_category} alt={category.name} />
                </div>
                <div className={styles.categoryMeta}>
                    <Title level={4} className={styles.categoryTitle}>{category.name}</Title>
                    <Paragraph ellipsis={{ rows: 1 }} className={styles.categoryDesc}>{category.description || ''}</Paragraph>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;
