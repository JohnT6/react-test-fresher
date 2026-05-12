import { FORMATE_DATE_VN } from "@/services/helper"
import { Avatar, Badge, Descriptions, Drawer } from "antd"
import dayjs from "dayjs"

interface IProp {
    isViewDetail: boolean,
    setIsDetailView: (v: boolean) => void
    isDataDetail: IUserTable | null,
    setDataDetail: (v: IUserTable | null) => void
}

const ViewDetailUser = (props: IProp) => {


    const onClose = () => {
        props.setIsDetailView(false)
        props.setDataDetail(null)
    }

    const firstLetter = props.isDataDetail?.fullName?.charAt(0)?.toUpperCase() || 'U';
    const avatarURL = props.isDataDetail?.avatar ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${props.isDataDetail?.avatar}` : undefined;


    return (
        <Drawer
            title="Chức năng xem chi tiết"
            width={"50vw"}
            closable={{ 'aria-label': 'Close Button' }}
            onClose={onClose}
            open={props.isViewDetail}
        >
            <Descriptions
                title="Thông tin user"
                bordered
                column={2}
            >
                <Descriptions.Item label="Id">{props.isDataDetail?._id}</Descriptions.Item>
                <Descriptions.Item label="Tên hiển thị">{props.isDataDetail?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{props.isDataDetail?.email}</Descriptions.Item>
                <Descriptions.Item label="phone">{props.isDataDetail?.phone}</Descriptions.Item>
                <Descriptions.Item label="Role">
                    <Badge status="processing" text={props.isDataDetail?.role} />
                </Descriptions.Item>
                <Descriptions.Item label="Avatar">
                    <Avatar size={40} src={avatarURL}>{firstLetter}</Avatar>
                </Descriptions.Item>
                <Descriptions.Item label="CreatedAt">{props.isDataDetail?.createdAt ? dayjs(props.isDataDetail.createdAt).format(FORMATE_DATE_VN) : ''}</Descriptions.Item>
                <Descriptions.Item label="UpdatedAt">{props.isDataDetail?.updatedAt ? dayjs(props.isDataDetail.updatedAt).format(FORMATE_DATE_VN) : ''}</Descriptions.Item>
            </Descriptions>;
        </Drawer>
    )
}

export default ViewDetailUser