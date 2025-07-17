import React from 'react';
import { List, Typography, Empty, Tag, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import type { IVocabulary } from 'types/vocabulary.type';
import styles from './search-result.component.module.scss';
import Logo from 'assets/images/logo.png';

const { Paragraph } = Typography;

interface SearchResultProps {
    results: IVocabulary[];
    searchTerm: string;
}

const SearchResult: React.FC<SearchResultProps> = ({ results, searchTerm }) => {
    const { t } = useTranslation();

    if (results.length === 0) {
        return <Empty
            image={Logo}
            description={
                <div className={styles.notFound}>
                    <Typography.Text strong className={styles.titleNotFound}>
                        {t('dictionary.notFound', { word: searchTerm })}
                    </Typography.Text>
                    <br></br>
                    <Typography.Text>
                        <a target='_blank' href={`https://dictionary.cambridge.org/vi/dictionary/english/${searchTerm}`}>Tìm kiếm bằng Cambridge</a>
                    </Typography.Text>
                </div>
            }
        />;
    }

    return (
        <div className={styles.searchResultContainer}>
            <List
                itemLayout="vertical"
                dataSource={results}
                className={styles.resultList}
                renderItem={(vocabulary) => (
                    <div className={styles.card}>
                        <div className={styles.row}>
                            <div className={styles.vocabImage}>
                                <img src={`${vocabulary.image}`} alt={vocabulary.word} />
                            </div>
                            <div className={styles.vocabInfo}>
                                <Tag color={
                                    vocabulary.partOfSpeech === 'noun' ? 'blue' :
                                        vocabulary.partOfSpeech === 'verb' ? 'green' :
                                            vocabulary.partOfSpeech === 'adjective' ? 'purple' :
                                                vocabulary.partOfSpeech === 'adverb' ? 'red' :
                                                    'orange'
                                } className={styles.partOfSpeech}>{vocabulary.partOfSpeech}</Tag>
                                <h2 className={styles.wordTitle}>{vocabulary.word}</h2>
                                <Paragraph ellipsis={{ rows: 2 }}
                                    className={styles.definition}>
                                    {vocabulary.definitionEn}
                                </Paragraph>
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default SearchResult;
