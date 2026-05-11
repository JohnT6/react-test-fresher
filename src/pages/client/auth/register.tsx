
import { registerAPI } from "@/services/api";
import { App, Button, Form, Input } from "antd"
import { FormProps, useForm } from "antd/es/form/Form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/global.scss"

interface FieldType {
    fullName: string,
    email: string,
    password: string,
    phone: string

}

const RegisterPage = () => {
    const [form] = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { message } = App.useApp();

    const handleSubmit: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsLoading(true);
        const { email, fullName, password, phone } = values;


        const res = await registerAPI(fullName, email, password, phone)
        if (res.data) {
            message.success("Đăng ký thành công")
            navigate("/login")
        } else {
            message.error(res.message)
        }

        setIsLoading(false);

    }

    return (
        <div className="form">
            <div className="form--label">Register Page</div>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item<FieldType>
                    name="fullName"
                    label="Họ Tên"
                    rules={[{ required: true, message: "Hãy nhập họ tên" }]}
                >
                    <Input placeholder="Hãy nhập họ tên" />
                </Form.Item>
                <Form.Item<FieldType>
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Hãy nhập Email" }]}
                >
                    <Input placeholder="Hãy nhập Email" />
                </Form.Item>
                <Form.Item<FieldType>
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: "Hãy nhập mật khẩu" }]}
                >
                    <Input.Password placeholder="Hãy nhập mật khẩu" />
                </Form.Item>
                <Form.Item<FieldType>
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Hãy nhập phone" }]}
                >
                    <Input placeholder="Hãy nhập sđt" />
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form >
        </div >
    )
}

export default RegisterPage