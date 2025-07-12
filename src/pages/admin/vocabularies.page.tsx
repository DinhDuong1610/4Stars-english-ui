import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { useEffect, useRef, useState, type Key } from "react";
import type { IMeta } from "types/backend";
import type { DataNode } from "antd/es/tree";
import { Button, Card, Col, notification, Popconfirm, Row, Space, Spin, Tag, Tree } from "antd";
import type { IconType } from "antd/es/notification/interface";
import type { ICategory } from "types/category.type";
import { DeleteOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { fetchCategoriesAPI } from "services/category.service";
import CreateCategoryModal from "components/category/create-category-modal.component";
import UpdateCategoryModal from "components/category/update-category-modal.component";
import type { IVocabulary } from "../../types/vocabulary.type";
import { formatISODate } from "../../utils/format.util";
import { fetchVocabulariesAPI } from "../../services/vocabulary.service";

const VocabularyPage = () => {
    const actionRef = useRef<ActionType>(null);
    const [meta, setMeta] = useState<IMeta>({
        page: 1,
        pageSize: 10,
        pages: 1,
        total: 0
    });
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [categories, setCategories] = useState<DataNode[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isUpdateCategoryModalOpen, setIsUpdateCategoryModalOpen] = useState(false);
    const [categoryToUpdate, setCategoryToUpdate] = useState<ICategory | null>(null);

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (pauseOnHover: boolean, message: string, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: message,
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const mapToDataNode = (cats: ICategory[]): DataNode[] => {
        return cats.map(cat => ({
            title: (
                <Space>
                    <span>{cat.name}</span>
                    <Button icon={<EditOutlined />} size="small" type="text" onClick={() => handleOpenUpdateCategoryModal(cat)} />
                </Space>
            ),
            key: cat.id,
            value: cat.id,
            children: cat.subCategories ? mapToDataNode(cat.subCategories) : [],
        }));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategoryId) {
            actionRef.current?.reload();
        }
    }, [selectedCategoryId]);

    const onSelectCategory = (selectedKeys: Key[]) => {
        if (selectedKeys.length > 0) {
            setSelectedCategoryId(selectedKeys[0] as number);
        } else {
            setSelectedCategoryId(null);
        }
    };

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const query: string = 'type=VOCABULARY';
            const res = await fetchCategoriesAPI(query);
            if (res && res.data) {
                const dataNode = mapToDataNode(res.data.result);
                setCategories(dataNode);
            }
        } catch (error) {
            openNotification(true, 'Error fetching categories', 'An error occurred while fetching categories.', 'error')();
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinishCreateCategory = () => {
        setIsCategoryModalOpen(false);
        fetchCategories();
    };

    const handleOpenUpdateCategoryModal = (category: ICategory) => {
        setCategoryToUpdate(category);
        setIsUpdateCategoryModalOpen(true);
    };

    const handleFinishUpdateCategory = () => {
        setIsUpdateCategoryModalOpen(false);
        fetchCategories();
    };

    const columns: ProColumns<IVocabulary>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            search: false,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            hideInSearch: true,
            render: (_, record) => (
                <img src={`${import.meta.env.VITE_BACKEND_URL}${record.image}`} alt={record.word} style={{ width: '50px', height: '50px' }} />
            ),
        },
        {
            title: 'Word',
            dataIndex: 'word',
            key: 'word',
            ellipsis: true,
            sorter: true,
            render: (_, record) => (
                <a onClick={() => ''}>
                    {record.word}
                </a>
            )
        },
        {
            title: 'Pronunciation',
            dataIndex: 'pronunciation',
            key: 'pronunciation',
            ellipsis: true,
            sorter: true,
            render: (_, record) => (
                <i>
                    {record.word}
                </i>
            )
        },
        {
            title: 'Part of speech',
            dataIndex: 'partOfSpeech',
            key: 'partOfSpeech',
            ellipsis: true,
            sorter: true,
            render: (_, record) => (
                <Tag
                    color={record.partOfSpeech === 'NOUN' ? 'blue' :
                        record.partOfSpeech === 'VERB' ? 'green' :
                            record.partOfSpeech === 'ADJECTIVE' ? 'purple' :
                                record.partOfSpeech === 'ADVERB' ? 'red' :
                                    'orange'
                    }
                >
                    {record.word}
                </Tag>
            )
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: true,
            hideInSearch: true,
            render: (value) => {
                return formatISODate(value?.toString() || '');
            },
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            valueType: 'dateRange',
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        startCreatedAt: value[0],
                        endCreatedAt: value[1],
                    };
                },
            },
        },
        {
            title: 'Updated at',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            sorter: true,
            hideInSearch: true,
            render: (value) => {
                return formatISODate(value?.toString() || '');
            },
        },
        {
            title: 'Action',
            key: 'action',
            search: false,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} color="primary"
                        onClick={() => ''}>
                    </Button>
                    <Popconfirm
                        title="Delete the vocabulary"
                        description={`Are you sure to delete vocabulary": ${record.word}?`}
                        onConfirm={() => ''}
                        icon={<QuestionCircleOutlined />}
                        okText="Yes"
                        cancelText="No"
                        placement="leftTop"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card title="Categories" bordered={false} extra={<Button icon={<PlusOutlined />} onClick={() => setIsCategoryModalOpen(true)} />}>
                        {isLoading ? <Spin /> : (
                            <Tree
                                defaultExpandAll
                                showLine
                                onSelect={onSelectCategory}
                                treeData={categories}
                            />
                        )}
                    </Card>
                </Col>
                <Col span={18}>
                    {selectedCategoryId ? (
                        <ProTable<IVocabulary>
                            columns={columns}
                            actionRef={actionRef}
                            request={async (params, sort, filter) => {
                                const queryParts: string[] = [];
                                queryParts.push(`categoryId=${selectedCategoryId}`);
                                queryParts.push(`page=${params.current}`);
                                queryParts.push(`size=${params.pageSize}`);

                                for (const key in filter) {
                                    if (filter[key]) {
                                        queryParts.push(`${key}=${filter[key]}`);
                                    }
                                }

                                const searchParams = { ...params };
                                delete searchParams.current;
                                delete searchParams.pageSize;

                                for (const key in searchParams) {
                                    if (searchParams[key]) {
                                        queryParts.push(`${key}=${searchParams[key]}`);
                                    }
                                }

                                if (sort) {
                                    for (const key in sort) {
                                        const value = sort[key];
                                        queryParts.push(`sort=${key},${value === 'ascend' ? 'asc' : 'desc'}`);
                                    }
                                }

                                const query = queryParts.join('&');

                                const res = await fetchVocabulariesAPI(query);

                                if (res && res.data) {
                                    setMeta(res.data.meta);
                                    return {
                                        data: res.data.result,
                                        page: 1,
                                        success: true,
                                        total: res.data.meta.total,
                                    };
                                } else {
                                    return {
                                        data: [],
                                        success: false,
                                        total: 0,
                                    };
                                }
                            }}
                            rowKey="id"
                            pagination={{
                                current: meta.page,
                                pageSize: meta.pageSize,
                                showSizeChanger: true,
                                total: meta.total
                            }}
                            toolBarRender={() => [
                                <Button type="primary" key="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => ''}
                                >
                                    Create
                                </Button>,
                            ]}
                            scroll={{ x: 'max-content' }}
                            headerTitle="Vocabulary Management"
                        />
                    ) : (
                        <Card><p>Please select a category to view vocabularies.</p></Card>
                    )}
                </Col>
            </Row>

            <CreateCategoryModal
                open={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onFinish={handleFinishCreateCategory}
                treeData={categories}
                type="VOCABULARY"
            />

            <UpdateCategoryModal
                open={isUpdateCategoryModalOpen}
                onClose={() => setIsUpdateCategoryModalOpen(false)}
                onFinish={handleFinishUpdateCategory}
                treeData={categories}
                initialData={categoryToUpdate}
            />

            {contextHolder}
        </>
    )
}

export default VocabularyPage