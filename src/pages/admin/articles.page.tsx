import { Button, Card, Col, notification, Popconfirm, Row, Space, Spin, Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import { useEffect, useRef, useState, type Key } from "react";
import type { ICategory } from "types/category.type";
import { fetchCategoriesAPI } from "services/category.service";
import type { IconType } from "antd/es/notification/interface";
import { DeleteOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import type { IArticle } from "types/article.type";
import { formatISODate } from "utils/format.util";
import { fetchArticlesAPI } from "services/article.service";
import type { IMeta } from "types/backend";
import CreateArticleModal from "components/article/create-article-modal.component";
import UpdateArticleModal from "components/article/update-article-modal.component";

const ArticlePage = () => {
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
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
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
            title: cat.name,
            key: cat.id,
            children: cat.subCategories ? mapToDataNode(cat.subCategories) : [],
        }));
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const query: string = 'type=ARTICLE';
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

    const handleFinishCreate = () => {
        setIsCreateModalOpen(false);
        actionRef.current?.reload();
    };

    const handleOpenUpdateModal = (record: IArticle) => {
        setSelectedArticle(record);
        setIsUpdateModalOpen(true);
    };

    const handleFinishUpdate = () => {
        setIsUpdateModalOpen(false);
        actionRef.current?.reload();
    };

    const columns: ProColumns<IArticle>[] = [
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
                <img src={`${import.meta.env.VITE_BACKEND_URL}${record.image}`} alt={record.title} style={{ width: '50px', height: '50px' }} />
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            sorter: true,
            render: (_, record) => (
                <a onClick={() => ''}>
                    {record.title}
                </a>
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
                        onClick={() => handleOpenUpdateModal(record)}>
                    </Button>
                    <Popconfirm
                        title="Delete the article"
                        description={`Are you sure to delete article": ${record.title}?`}
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
                    <Card title="Categories" bordered={false} extra={<Button icon={<PlusOutlined />} />}>
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
                        <ProTable<IArticle>
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

                                const res = await fetchArticlesAPI(query);

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
                                    onClick={() => setIsCreateModalOpen(true)}
                                >
                                    Create
                                </Button>,
                            ]}
                            scroll={{ x: 'max-content' }}
                            headerTitle="Article Management"
                        />
                    ) : (
                        <Card><p>Please select a category to view articles.</p></Card>
                    )}
                </Col>
            </Row>

            <CreateArticleModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onFinish={handleFinishCreate}
                categoryId={selectedCategoryId}
            />

            <UpdateArticleModal
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onFinish={handleFinishUpdate}
                initialData={selectedArticle}
            />

            {contextHolder}
        </>
    )
}

export default ArticlePage