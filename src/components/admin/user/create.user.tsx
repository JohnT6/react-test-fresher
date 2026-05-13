import { createUserAPI } from "@/services/api";
import { App, Form, Input, Modal } from "antd"
import { FormProps } from "antd/lib";
import { useState } from "react";

type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string;
}

interface IProp {
    openCreateModal: boolean
    setOpenCreateModal: (v: boolean) => void
    reloadTable: () => void
}

const CreateUserModal = (props: IProp) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { openCreateModal, setOpenCreateModal, reloadTable } = props

    const { message, notification } = App.useApp();

    const handleSubmit: FormProps<FieldType>["onFinish"] = async (values: FieldType) => {
        setIsLoading(true)
        const res = await createUserAPI(values.fullName, values.password, values.email, values.phone)
        if (res?.data) {
            message.success("Đăng nhập thành công")
            form.resetFields();
            setOpenCreateModal(false)
            reloadTable()
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res?.message && Array.isArray(res?.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsLoading(false)

    }

    const handleCancel = () => {
        setOpenCreateModal(false)
        form.resetFields();
    }

    return (
        <Modal
            title="Thêm mới người dùng"
            onOk={() => form.submit()}
            onCancel={handleCancel}
            confirmLoading={isLoading}
            open={openCreateModal}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item<FieldType>
                    name="fullName"
                    label="Tên hiển thị "
                    rules={[{ required: true, message: "Hãy nhập họ tên" }]}
                >
                    <Input placeholder="Hãy nhập họ tên" />
                </Form.Item>
                <Form.Item<FieldType>
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: "Hãy nhập mật khẩu" }]}
                >
                    <Input.Password placeholder="Hãy nhập mật khẩu" />
                </Form.Item>
                <Form.Item<FieldType>
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Hãy nhập Email" },
                        { type: "email", message: "Email không đúng định dạng!" }
                    ]}
                >
                    <Input placeholder="Hãy nhập Email" />
                </Form.Item>


                <Form.Item<FieldType>
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Hãy nhập phone" }]}
                >
                    <Input placeholder="Hãy nhập sđt" />
                </Form.Item>
            </Form >
        </Modal>
    )
}

export default CreateUserModal