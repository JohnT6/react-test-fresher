import axios from "@/services/axios.customize"


export const LoginAPI = (username: string, password: string) => {
    const URLBackend = "/api/v1/auth/login"
    return axios.post<IBackendRes<ILogin>>(URLBackend, { username, password }, {
        headers: {
            delay: 3000,
        }
    })
}

export const registerAPI = (fullName: string, email: string, password: string, phone: string) => {
    const URLBackend = "/api/v1/user/register"
    return axios.post<IBackendRes<IRegister>>(URLBackend, { fullName, email, password, phone })
}

export const fetchAccountApi = () => {
    const URLBackend = "/api/v1/auth/account"
    return axios.get<IBackendRes<IFetchAccount>>(URLBackend, {
        headers: {
            delay: 1000
        }
    })
}

export const logOutAPI = () => {
    const URLBackend = "/api/v1/auth/logout"
    return axios.post<IBackendRes<IRegister>>(URLBackend)
}

export const getUserWithPaginateApi = (query: string) => {
    const URLBackend = `/api/v1/user?${query}`
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(URLBackend)
}