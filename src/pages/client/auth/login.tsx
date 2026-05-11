import { LoginAPI } from "@/services/api";
import { GooglePlusOutlined } from "@ant-design/icons"
import { App, Button, Divider, Form, FormProps, Input } from "antd"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import './login.scss';
import { useCurrentApp } from "@/components/context/app.context";

type FieldType = {
    username: string;
    password: string;
};

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const { message, notification } = App.useApp();
    const { setIsAuthenticated, setUser } = useCurrentApp();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true);

        const { username, password } = values;

        const res = await LoginAPI(username, password);

        if (res?.data) {
            setIsAuthenticated(true);
            setUser(res?.data?.user)
            localStorage.setItem("access_token", res.data.access_token)
            message.success("Đăng nhập thành công")
            navigate("/")

        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res?.message && Array.isArray(res?.message) ? res.message[0] : res.message,
                duration: 5
            })
        }

        setIsSubmit(false);
    }

    return (
        <div className="login-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng Nhập</h2>
                            <Divider />

                        </div>
                        <Form
                            name="login-form"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="username"
                                rules={[
                                    { required: true, message: 'Email không được để trống!' },
                                    { type: "email", message: "Email không đúng định dạng!" }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <div
                                // onClick={() => loginGoogle()}
                                title='Đăng nhập với tài khoản Google'
                                style={{
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", gap: 10,
                                    textAlign: "center", marginBottom: 25,
                                    cursor: "pointer"
                                }}>
                                Đăng nhập với
                                <GooglePlusOutlined
                                    style={{ fontSize: 30, color: "orange" }} />
                            </div>

                            <p className="text text-normal" style={{ textAlign: "center" }}>
                                Chưa có tài khoản ?
                                <span>
                                    <Link to='/register' > Đăng Ký </Link>
                                </span>
                            </p>
                            <br />
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default LoginPage