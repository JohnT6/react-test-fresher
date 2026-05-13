import { CloudUploadOutlined, DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { deleteUserAPI, getUserWithPaginateApi } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import ViewDetailUser from './view.detail.user';
import CreateUserModal from './create.user';
import ImportFileModal from './import.modal';
import { CSVLink } from 'react-csv';
import UpdateUser from './update.user';




type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

const TableUser = () => {
    const { message, notification } = App.useApp();
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

    const [openImportModal, setOpenImportModal] = useState<boolean>(false)
    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([])

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false)
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);
    const [isDelete, setIsDelete] = useState<boolean>(false)

    const handleDeleteUser = async (id: string) => {
        setIsDelete(true)
        const res = await deleteUserAPI(id);
        if (res?.data) {
            message.success(`Xóa user ${id} thành công`)
            actionRef.current?.reload();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsDelete(false)
    }


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
            render: (dom, entity) => (
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
            render: (dom, entity) => [
                <a style={{ color: '#f57800' }}
                    onClick={(e) => {
                        e.preventDefault()
                        setDataUpdate(entity)
                        setOpenModalUpdate(true)
                    }}
                >
                    <EditOutlined />
                </a>,
                <a style={{ color: '#ff4d4f' }}>
                    <Popconfirm
                        title="Delete user"
                        description="Bạn có chắc muốn xóa user này?"
                        onConfirm={() => handleDeleteUser(entity._id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        okButtonProps={{ loading: isDelete }}
                    >
                        <DeleteOutlined />
                    </Popconfirm>
                </a>
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
                        setCurrentDataTable(res.data?.result ?? [])
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
                        key="export"
                        icon={<ExportOutlined />}

                        type="primary"
                    >
                        <CSVLink
                            data={currentDataTable}
                            filename='export-user.csv'
                        >
                            Export
                        </CSVLink>
                    </Button>,
                    <Button
                        key="import"
                        icon={<CloudUploadOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                            setOpenImportModal(true)
                        }}
                        type="primary"
                    >
                        Import
                    </Button>,
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
                    </Button>,


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
            <ImportFileModal
                openImportModal={openImportModal}
                setOpenImportModal={setOpenImportModal}
                reloadTable={() => { actionRef.current?.reloadAndRest?.() }}
            />
            <UpdateUser
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                reloadTable={() => { actionRef.current?.reloadAndRest?.() }}
            />
        </>
    );
};

export default TableUser;