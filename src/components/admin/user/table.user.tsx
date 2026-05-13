import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import { getUserWithPaginateApi } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import ViewDetailUser from './view.detail.user';
import CreateUserModal from './create.user';




type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })

    const [isViewDetail, setIsDetailView] = useState<boolean>(false);
    const [isDataDetail, setDataDetail] = useState<IUserTable | null>(null);

    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);



    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'id',
            dataIndex: '_id',
            hideInSearch: true,
            render: (dom, entity, index, action, schema) => (
                <a href='#!' onClick={(e) => {
                    e.preventDefault();
                    setIsDetailView(true);
                    setDataDetail(entity);

                }}>{entity._id}</a>
            )
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,

        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: "date",
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: "dateRange",
            defaultSortOrder: 'descend',
            hideInTable: true
        },
        {
            title: "Action",
            valueType: "option",
            key: "option",
            render: () => [
                <a style={{ color: '#f57800' }}><EditOutlined /></a>,
                <a style={{ color: '#ff4d4f' }}><DeleteOutlined /></a>
            ]
        },

    ];

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(sort);
                    console.log(filter);

                    let query = ""
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }

                        // if (sort.createdAt === "descend") {
                        //     query += `&sort=-createdAt`
                        // }
                        // if (sort.createdAt === "ascend") {
                        //     query += `&sort=createdAt`
                        // }

                        if (sort && sort.createdAt) {
                            query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                        } else {
                            query += "&sort=-createdAt"
                        }

                        const createdDateRange = dateRangeValidate(params.createdAtRange);
                        if (createdDateRange) {
                            query += `&createdAt>=${createdDateRange[0]}&createdAt<=${createdDateRange[1]}`
                        }
                    }
                    const res = await getUserWithPaginateApi(query);
                    if (res?.data) {
                        setMeta(res.data.meta);
                    }
                    return {
                        // data: data.data,
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta?.total
                    }

                }}

                rowKey="_id"
                pagination={{
                    total: meta.total,
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} of {total} items</div>) }
                }}
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                            setOpenCreateModal(true)
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
            <ViewDetailUser
                isViewDetail={isViewDetail}
                setIsDetailView={setIsDetailView}
                isDataDetail={isDataDetail}
                setDataDetail={setDataDetail}
            />
            <CreateUserModal
                openCreateModal={openCreateModal}
                setOpenCreateModal={setOpenCreateModal}
                reloadTable={() => { actionRef.current?.reloadAndRest?.() }}
            />
        </>
    );
};

export default TableUser;