import { FORMATE_DATE_VN } from "@/services/helper"
import { Descriptions, Divider, Drawer, GetProp, Image, Upload, UploadFile, UploadProps } from "antd"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid";

interface IProp {
    isViewDetail: boolean,
    setIsDetailView: (v: boolean) => void
    isDataDetail: IBookTable | null,
    setDataDetail: (v: IBookTable | null) => void
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const ViewDetailBook = (props: IProp) => {
    const { isDataDetail, isViewDetail, setDataDetail, setIsDetailView } = props
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (isDataDetail) {
            let imgThumbnail: any = {};
            const imgSlider: any = [];
            if (isDataDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: isDataDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${props.isDataDetail?.thumbnail}`,
                }
            }
            if (isDataDetail.slider && isDataDetail.slider.length > 0) {
                isDataDetail?.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [isDataDetail, props.isDataDetail?.thumbnail])

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const onClose = () => {
        setIsDetailView(false)
        setDataDetail(null)
    }


    return (
        <Drawer
            title="Chức năng xem chi tiết"
            width={"60vw"}
            closable={{ 'aria-label': 'Close Button' }}
            onClose={onClose}
            open={isViewDetail}
        >
            <Descriptions
                title="Thông tin sách"
                bordered
                column={2}
            >
                <Descriptions.Item label="Id">{props.isDataDetail?._id}</Descriptions.Item>
                <Descriptions.Item label="Tên sách">{props.isDataDetail?.mainText}</Descriptions.Item>
                <Descriptions.Item label="Tác giả">{props.isDataDetail?.author}</Descriptions.Item>
                <Descriptions.Item label="Giá tiền">{props.isDataDetail?.price}</Descriptions.Item>
                <Descriptions.Item label="Thể loại" span={2}>{props.isDataDetail?.category}</Descriptions.Item>
                <Descriptions.Item label="CreatedAt">{props.isDataDetail?.createdAt ? dayjs(props.isDataDetail.createdAt).format(FORMATE_DATE_VN) : ''}</Descriptions.Item>
                <Descriptions.Item label="UpdatedAt">{props.isDataDetail?.updatedAt ? dayjs(props.isDataDetail.updatedAt).format(FORMATE_DATE_VN) : ''}</Descriptions.Item>

            </Descriptions>
            <Divider orientation="left">Ảnh books</Divider>
            <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                showUploadList={
                    { showRemoveIcon: false }
                }
            // onChange={handleChange}
            >

            </Upload>
            {previewImage && (
                <Image
                    style={{ display: 'none' }} // Nếu dòng này cũng báo lỗi trong project của bạn, hãy đổi thành style={{ display: 'none' }}
                    preview={{
                        visible: previewOpen, // Sửa 'open' thành 'visible'
                        onVisibleChange: (visible: boolean) => { // Sửa 'onOpenChange' thành 'onVisibleChange' và khai báo type ': boolean'
                            setPreviewOpen(visible);
                            // Gộp logic của afterOpenChange vào đây luôn vì bản cũ có thể không hỗ trợ afterVisibleChange
                            if (!visible) {
                                setPreviewImage('');
                            }
                        },
                    }}
                    src={previewImage}
                />
            )}
        </Drawer>
    )
}

export default ViewDetailBook