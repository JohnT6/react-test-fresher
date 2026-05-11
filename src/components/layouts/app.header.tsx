import { useCurrentApp } from "@/components/context/app.context"

const AppHeader = () => {
    const { user } = useCurrentApp()

    return (
        <div>
            <div>App Header</div>
            <div>{JSON.stringify(user)}</div>
        </div>
    )
}

export default AppHeader