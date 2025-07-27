import { Button, Card, Col, notification, Popconfirm, Row, Space, Spin, Tree } from "antd";
import { useEffect, useRef, useState, type Key } from "react";
import type { DataNode } from "antd/es/tree";
import { fetchCategoriesAPI } from "services/category.service";
import type { ICategory } from "types/category.type";
import { DeleteOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { formatISODate } from "utils/format.util";
import type { IMeta } from "types/backend";
import { deleteDictationAPI, fetchDictationsAPI } from "services/dictation.service";
import type { IDictationTopic } from "types/dictation.type";
import type { IconType } from "antd/es/notification/interface";

const DictationPage = () => {
    const actionRef = useRef<ActionType>(null);
    const [meta, setMeta] = useState<IMeta>({ page: 1, pageSize: 10, pages: 1, total: 0 });
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [categories, setCategories] = useState<DataNode[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [selectedTopic, setSelectedTopic] = useState<IDictationTopic | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

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
                    <Button icon={<EditOutlined />} size="small" type="text" onClick={() => ''} />
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

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const query: string = 'type=DICTATION';
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

    const onSelectCategory = (selectedKeys: Key[]) => {
        setSelectedCategoryId(selectedKeys.length > 0 ? selectedKeys[0] as number : null);
    };

    return (
        <Row gutter={[16, 16]}>
            <Col span={6}>
                <Card title="Categories" bordered={false} extra={<Button icon={<PlusOutlined />} onClick={() => ''} />}>
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
                    <></>
                ) : (
                    <Card><p>Please select a category to view dictation topics.</p></Card>
                )}
            </Col>

        </Row>
    );
};
export default DictationPage;