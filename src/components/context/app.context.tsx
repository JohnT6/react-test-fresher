import { fetchAccountApi } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";


interface IAppContext {
    isAuthenticated: boolean,
    setIsAuthenticated: (v: boolean) => void
    setUser: (v: IUser | null) => void
    user: IUser | null
    isAppLoading: boolean
    setIsAppLoading: (v: boolean) => void
}

interface IProps {
    children: React.ReactNode
}

const CurrentAppContext = createContext<IAppContext | null>(null);

export const AppProvider = (props: IProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountApi();
            if (res.data) {
                setUser(res.data.user);
                setIsAuthenticated(true);
            }
            setIsAppLoading(false)
        }

        fetchAccount();
    }, [])

    return (
        <>
            {!isAppLoading ?
                <CurrentAppContext.Provider value={{
                    isAuthenticated, setIsAuthenticated, user, setUser, isAppLoading, setIsAppLoading
                }}>
                    {props.children}
                </CurrentAppContext.Provider>
                :
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <PuffLoader
                        color="#00faff"
                    />
                </div>
            }
        </>
    );
};



export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);

    if (!currentAppContext) {
        throw new Error(
            "CurrentAppContext has to be used within <CurrentAppContext.Provider>"
        );
    }

    return currentAppContext;
};