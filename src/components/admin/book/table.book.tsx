import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { deleteBookAPI, getListBookWithPaginateApi } from '@/services/api';
// import { dateRangeValidate } from '@/services/helper';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';
import ViewDetailBook from './view.detail.book';
import CreateBook from './create.book';
import UpdateBook from './update.book';





type TSearch = {
    mainText: string;
    author: string;
    updatedAt: string;
}

const TableBook = () => {
    const { message, notification } = App.useApp();
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })

    const [isViewDetail, setIsDetailView] = useState<boolean>(false);
    const [isDataDetail, setDataDetail] = useState<IBookTable | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([])

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false)
    const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);
    const [isDelete, setIsDelete] = useState<boolean>(false)

    const handleDeleteUser = async (id: string) => {
        setIsDelete(true)
        const res = await deleteBookAPI(id);
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


    const columns: ProColumns<IBookTable>[] = [
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
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            sorter: true,
            hideInSearch: true

        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true,

        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: true,
            hideInSearch: true,
            render: (dom, entity) => {
                // Sử dụng hàm Intl.NumberFormat của JavaScript để format chuẩn tiền Việt
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(entity.price);
            }

        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            valueType: "date",
            sorter: true,
            hideInSearch: true,
            render(dom, entity) {
                return (
                    <>
                        {dayjs(entity.updatedAt).format("DD-MM-YYYY")}
                    </>
                )
            },
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
                        title="Delete book"
                        description="Bạn có chắc muốn xóa sách này này?"
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

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(sort);
                    console.log(filter);

                    let query = ""
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.author) {
                            query += `&author=/${params.author}/i`
                        }
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`
                        }

                        // if (sort.createdAt === "descend") {
                        //     query += `&sort=-createdAt`
                        // }
                        // if (sort.createdAt === "ascend") {
                        //     query += `&sort=createdAt`
                        // }

                        if (sort && sort.updatedAt) {
                            query += `&sort=${sort.updatedAt === "ascend" ? "updatedAt" : "-updatedAt"}`
                        } else {
                            query += "&sort=-updatedAt"
                        }

                        if (sort && sort.author) {
                            query += `&sort=${sort.author === "ascend" ? "author" : "-author"}`
                        }

                        if (sort && sort.mainText) {
                            query += `&sort=${sort.mainText === "ascend" ? "mainText" : "-mainText"}`
                        }

                        if (sort && sort.category) {
                            query += `&sort=${sort.category === "ascend" ? "category" : "-category"}`
                        }

                        if (sort && sort.price) {
                            query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`
                        }

                        // const createdDateRange = dateRangeValidate(params.createdAtRange);
                        // if (createdDateRange) {
                        //     query += `&createdAt>=${createdDateRange[0]}&createdAt<=${createdDateRange[1]}`
                        // }
                    }
                    const res = await getListBookWithPaginateApi(query);
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
                headerTitle="Table book"
                toolBarRender={() => [

                    <CSVLink
                        data={currentDataTable}
                        filename='export-user.csv'
                    >
                        <Button
                            key="export"
                            icon={<ExportOutlined />}

                            type="primary"
                        >
                            Export
                        </Button>
                    </CSVLink>
                    ,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                            setOpenModalCreate(true)
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>,


                ]}
            />
            <ViewDetailBook
                isViewDetail={isViewDetail}
                setIsDetailView={setIsDetailView}
                isDataDetail={isDataDetail}
                setDataDetail={setDataDetail}
            />
            <CreateBook
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <UpdateBook
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    );
};

export default TableBook;