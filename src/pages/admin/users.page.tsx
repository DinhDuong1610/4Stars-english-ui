import React, { useRef, useState } from 'react';
import { Button, Space, Switch, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { fetchUsersAPI } from 'services/user.service';
import type { IUser } from 'types/user.type';
import type { IMeta } from 'types/backend';
import { formatISODate } from 'utils/format.util';

const UsersPage = () => {
    const [meta, setMeta] = useState<IMeta>({
        page: 1,
        pageSize: 10,
        pages: 1,
        total: 0
    })

    const columns: ProColumns<IUser>[] = [
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
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: true,
            copyable: true,
        },
        {
            title: 'Role',
            dataIndex: ['role', 'name'],
            key: 'role',
            valueEnum: {
                ADMIN: { text: 'Admin', color: 'red' },
                USER: { text: 'User', color: 'blue' },
                PREMIUM: { text: 'Premium', color: 'green' },
            },
            render: (_, record) => (
                <Tag color={record.role.name === 'ADMIN' ? 'red' : record.role.name === 'USER' ? 'blue' : 'green'}>
                    {record.role.name}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'active',
            key: 'active',
            valueEnum: {
                true: { text: 'Active', status: 'Success' },
                false: { text: 'Inactive', status: 'Error' },
            },
            render: (_, record) => (
                <Switch defaultChecked={record.active} />
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
                        startTime: value[0],
                        endTime: value[1],
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
                    <Button icon={<DeleteOutlined />} danger></Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <ProTable<IUser>
                columns={columns}
                request={async (params, sort, filter) => {
                    console.log('params: ', params, 'sort: ', sort, 'filter: ', filter);
                    let query = `page=${params.current}&size=${params.pageSize}`;

                    if (sort) {
                        for (const key in sort) {
                            const value = sort[key];
                            query += `&sort=${key},${value === 'ascend' ? 'asc' : 'desc'}`;
                        }
                    }

                    const res = await fetchUsersAPI(query);

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
                    <Button type="primary" key="primary" icon={<PlusOutlined />}>
                        Create
                    </Button>,
                ]}
                scroll={{ x: 'max-content' }}
                headerTitle="List of users"
            />
        </div>
    );
};

export default UsersPage;