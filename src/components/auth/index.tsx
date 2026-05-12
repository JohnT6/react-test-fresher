import { Button, Result } from "antd";
import { useCurrentApp } from "../context/app.context"
import { Link, useLocation } from "react-router-dom";

interface IProp {
    children: React.ReactNode
}

const ProtectedRoute = (props: IProp) => {
    const location = useLocation();
    const { isAuthenticated, user } = useCurrentApp();

    if (!isAuthenticated) {
        return (
            <Result
                status="404"
                title="Not Login"
                subTitle="bạn vui lòng đăng nhập để sử dụng tính năng này."
                extra={<Button type="primary"><Link to={"/login"}>Đăng nhập</Link></Button>}
            />
        )
    }

    const isAdminRoute = location.pathname.includes("admin")
    if (isAuthenticated && isAdminRoute) {
        const role = user?.role
        if (role === "USER") {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary">Back Home</Button>}
                />
            )
        }
    }

    return (
        <>

            {props.children}
        </>
    )
}

export default ProtectedRoute