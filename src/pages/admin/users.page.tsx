import { useRef, useState } from 'react';
import { Button, message, notification, Popconfirm, Space, Switch, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { deleteUserAPI, fetchUsersAPI } from 'services/user.service';
import type { IUser } from 'types/user.type';
import type { IMeta } from 'types/backend';
import { formatISODate } from 'utils/format.util';
import UserDetailDrawer from 'components/user-detail-drawer/user-detail-drawer.component';
import CreateUserModal from 'components/create-user-modal/create-user-modal.component';
import UpdateUserModal from 'components/update-user-modal/update-user-modal.component';
import type { IconType } from 'antd/es/notification/interface';

const UsersPage = () => {
    const actionRef = useRef<ActionType>(null);
    const [meta, setMeta] = useState<IMeta>({
        page: 1,
        pageSize: 10,
        pages: 1,
        total: 0
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [userToUpdate, setUserToUpdate] = useState<IUser | null>(null);
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (pauseOnHover: boolean, desc: string, type: IconType = 'success') => () => {
        api.open({
            message: 'Delete user',
            description: desc,
            showProgress: true,
            pauseOnHover,
            duration: 3,
            type: type
        });
    };

    const handleOpenUpdateModal = (record: IUser) => {
        setUserToUpdate(record);
        setIsUpdateModalOpen(true);
    };

    const handleFinishUpdate = () => {
        setIsUpdateModalOpen(false);
        actionRef.current?.reload();
    };

    const handleFinishCreate = () => {
        setIsCreateModalOpen(false);
        actionRef.current?.reload();
    };

    const handleViewUser = (user: IUser) => {
        setSelectedUser(user);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedUser(null);
    };

    const handleDeleteUser = async (id: number) => {
        try {
            const res = await deleteUserAPI(id);
            if (res.status === 204) {
                openNotification(true, res.message || 'User deleted successfully!', 'success')();
                actionRef.current?.reload();
            } else {
                openNotification(true, 'Failed to delete user.', 'error')();
            }
        } catch (error) {
            message.error('An error occurred while deleting user.');
        }
    };

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
            render: (_, record) => (
                <a onClick={() => handleViewUser(record)}>
                    {record.name}
                </a>
            )
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
            filters: true,
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
                    <Button icon={<EditOutlined />} color="primary" onClick={() => handleOpenUpdateModal(record)}></Button>
                    <Popconfirm
                        title="Delete the user"
                        description={`Are you sure to delete user: ${record.name}?`}
                        onConfirm={() => handleDeleteUser(record.id)}
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
        <div>
            <ProTable<IUser>
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
                    <Button type="primary" key="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Create
                    </Button>,
                ]}
                scroll={{ x: 'max-content' }}
                headerTitle="User List"
            />

            <UserDetailDrawer
                open={isDrawerOpen}
                onClose={handleCloseDrawer}
                user={selectedUser}
            />

            <CreateUserModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onFinish={handleFinishCreate}
            />

            <UpdateUserModal
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onFinish={handleFinishUpdate}
                initialData={userToUpdate}
            />
            {contextHolder}
        </div>
    );
};

export default UsersPage;