import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined, CloudDownloadOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useRef, useState } from "react";
import type { IMeta } from "types/backend";
import type { IPlan } from "../../types/plan.type";
import { Button, Popconfirm, Space, Switch } from "antd";
import { formatISODate } from "../../utils/format.util";
import { fetchPlansAPI } from "../../services/plan.service";

const PlanPage = () => {
    const actionRef = useRef<ActionType>(null);
    const [meta, setMeta] = useState<IMeta>({
        page: 1,
        pageSize: 10,
        pages: 1,
        total: 0
    });
    const [currentPageData, setCurrentPageData] = useState<IPlan[]>([]);


    const columns: ProColumns<IPlan>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            search: false,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            render: (_, record) => (
                <a>
                    {record.name}
                </a>
            )
        },
        {
            title: 'Duration',
            dataIndex: 'durationInDays',
            key: 'durationInDays',
            sorter: true,
            hideInSearch: true,
            render: (_, record) => (
                <b> {record.durationInDays} days</b>
            ),
        },
        {
            title: 'Duration',
            dataIndex: 'durationInDays',
            valueType: 'digitRange',
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        minDuration: value[0],
                        maxDuration: value[1],
                    };
                },
            },
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            valueType: 'digitRange',
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        minPrice: value[0],
                        maxPrice: value[1],
                    };
                },
            },
        },
        {
            title: 'Status',
            dataIndex: 'active',
            key: 'active',
            filters: true,
            valueEnum: {
                true: { text: 'Active', status: 'Success' },
                false: { text: 'Inactive', status: 'Error' },
            },
            render: (_, record) => (
                <Switch defaultChecked={record.active} disabled />
            ),
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
                    <Button icon={<EditOutlined />} color="primary"></Button>
                    <Button icon={<DeleteOutlined />} danger>
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <ProTable<IPlan>
                columns={columns}
                actionRef={actionRef}
                request={async (params, sort, filter) => {
                    const queryParts: string[] = [];
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

                    const res = await fetchPlansAPI(query);

                    if (res && res.data) {
                        setMeta(res.data.meta);
                        setCurrentPageData(res.data.result);
                        return {
                            data: res.data.result,
                            page: 1,
                            success: true,
                            total: res.data.meta.total,
                        };
                    } else {
                        setCurrentPageData([]);
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
                    >
                        Create
                    </Button>,
                ]}
                scroll={{ x: 'max-content' }}
                headerTitle="Plan Management"
            />
        </>
    );
}

export default PlanPage