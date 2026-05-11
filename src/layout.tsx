import { Outlet } from "react-router-dom"
import AppHeader from "./components/layouts/app.header"
import { useEffect } from "react"
import { fetchAccountApi } from "services/api"
import { useCurrentApp } from "components/context/app.context"
import PuffLoader from "react-spinners/PuffLoader"


function Layout() {
  const { setUser, isAppLoading, setIsAppLoading, setIsAuthenticated } = useCurrentApp();

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountApi();
      if (res?.data?.user) {
        setUser(res?.data.user)
        setIsAuthenticated(true)
      }
      setIsAppLoading(false)
    }
    fetchAccount();
  }, [])

  return (
    <>
      {!isAppLoading ?
        <div>
          <AppHeader />
          <Outlet />
        </div>
        :
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <PuffLoader
            color="#00faff"
          />
        </div>
      }
    </>
  )
}

export default Layout
