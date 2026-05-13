import { bulkCreateUserAPI } from "@/services/api";
import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, Upload, UploadProps } from "antd";
import { Buffer } from 'buffer';
import ExcelJS from 'exceljs';
import { useState } from "react";
import templateFile from "assets/template/user.xlsx?url";


interface IProp {
    openImportModal: boolean,
    setOpenImportModal: (v: boolean) => void
    reloadTable: () => void
}

interface IDataImport {
    fullName: string,
    email: string,
    phone: string
}

const ImportFileModal = (props: IProp) => {
    const { Dragger } = Upload;
    const { message, notification } = App.useApp();

    const { openImportModal, setOpenImportModal, reloadTable } = props

    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false)

    const handleClose = () => {
        setOpenImportModal(false)
        setDataImport([])
    }

    const propsUpload: UploadProps = {
        name: 'file',
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        multiple: false,
        maxCount: 1,

        customRequest({ file, onSuccess }) {
            // Giả vờ đang upload mất 1 giây rồi báo thành công


            setTimeout(() => {
                if (onSuccess) {
                    onSuccess("ok")
                };
            }, 1000);

        },

        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    const workbook = new ExcelJS.Workbook();
                    const arrayBuffer = await file.arrayBuffer()
                    const buffer = Buffer.from(arrayBuffer)
                    await workbook.xlsx.load(buffer);

                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        // read first row as data keys
                        const firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;
                        const keys = firstRow.values as any[];
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            const values = row.values as any
                            const obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })

                    });
                    jsonData = jsonData.map((item, index) => {
                        return { ...item, id: index + 1 }
                    })
                    setDataImport(jsonData);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleImport = async () => {
        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }))
        const res = await bulkCreateUserAPI(dataSubmit);
        if (res?.data) {
            setIsSubmit(true)
            notification.success({
                message: "Bulk Create Users",
                description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`
            })
            setOpenImportModal(false)
            setDataImport([])
            setIsSubmit(false)
            reloadTable()
        }
    }

    return (
        <Modal
            title="Import data user"
            open={openImportModal}
            onCancel={handleClose}
            onOk={handleImport}
            okButtonProps={{
                disabled: dataImport.length > 0 ? false : true,
                loading: isSubmit
            }}
            okText="Import data"
            width={"50vw"}
            maskClosable={false}
            destroyOnClose={true}
        >
            <Dragger
                {...propsUpload}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single upload. Only accept .csv, .xls, .xlsx or
                    &nbsp;
                    <a
                        onClick={e => e.stopPropagation()}
                        href={templateFile}
                        download
                    >
                        Download Sample File
                    </a>
                </p>
            </Dragger>

            <div style={{ marginTop: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Dữ liệu xem trước:</h3>
                <Table
                    rowKey={"id"}
                    dataSource={dataImport}
                    columns={[
                        { title: 'Tên hiển thị', dataIndex: 'fullName' },
                        { title: 'Email', dataIndex: 'email' },
                        { title: 'Số điện thoại', dataIndex: 'phone' },
                    ]}
                    pagination={false} // Tạm tắt phân trang cho UI gọn gàng
                />
            </div>
        </Modal >
    )
}

export default ImportFileModal