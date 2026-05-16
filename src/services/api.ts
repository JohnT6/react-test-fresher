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

export const createUserAPI = (fullName: string, password: string, email: string, phone: string) => {
    const URLBackend = "/api/v1/user"
    return axios.post<IBackendRes<IUserTable>>(URLBackend, { fullName, password, email, phone })
}

export const bulkCreateUserAPI = (data: {
    fullName: string;
    password: string;
    email: string;
    phone: string;
}[]) => {
    const URLBackend = "/api/v1/user/bulk-create"
    return axios.post<IBackendRes<IResponseImport>>(URLBackend, data)
}

export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
    const URLBackend = "/api/v1/user"
    return axios.put<IBackendRes<IUserTable>>(URLBackend, { _id, fullName, phone })
}


export const deleteUserAPI = (_id: string) => {
    const URLBackend = `/api/v1/user/${_id}`
    return axios.delete<IBackendRes<IUserTable>>(URLBackend)
}

export const getListBookWithPaginateApi = (query: string) => {
    const URLBackend = `/api/v1/book?${query}`
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(URLBackend)
}

export const getCategoryAPI = () => {
    const URLBackend = `/api/v1/database/category`
    return axios.get<IBackendRes<string[]>>(URLBackend)
}

export const uploadFileAPI = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios<IBackendRes<{
        fileUploaded: string
    }>>({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": folder
        },
    });
}

export const createBookAPI = (
    mainText: string, author: string,
    price: number, quantity: number, category: string,
    thumbnail: string, slider: string[]
) => {
    const urlBackend = "/api/v1/book";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        { mainText, author, price, quantity, category, thumbnail, slider })
}

export const updateBookAPI = (
    _id: string, mainText: string, author: string, price: number, quantity: number, category: string, thumbnail: string, slider: string[]
) => {
    const urlBackend = `/api/v1/book/${_id}`;
    return axios.put<IBackendRes<IRegister>>(urlBackend,
        { mainText, author, price, quantity, category, thumbnail, slider })
}

export const deleteBookAPI = (_id: string) => {
    const URLBackend = `/api/v1/book/${_id}`
    return axios.delete<IBackendRes<IUserTable>>(URLBackend)
}

export const getBookByIdApi = (id: string) => {
    const URLBackend = `/api/v1/book/${id}`
    return axios.get<IBackendRes<IBookTable>>(URLBackend)
}

export const createOrderAPI = (
    name: string, address: string,
    phone: string, totalPrice: number,
    type: string, detail: any,
    paymentRef?: string
) => {
    const urlBackend = "/api/v1/order";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        { name, address, phone, totalPrice, type, detail, paymentRef })
}

export const getHistoryAPI = () => {
    const urlBackend = `/api/v1/history`;
    return axios.get<IBackendRes<IHistory[]>>(urlBackend)
}

export const updateUserInfoAPI = (
    _id: string, avatar: string,
    fullName: string, phone: string) => {
    const urlBackend = "/api/v1/user";
    return axios.put<IBackendRes<IRegister>>(urlBackend,
        { fullName, phone, avatar, _id })
}

export const updateUserPasswordAPI = (
    email: string, oldpass: string, newpass: string) => {
    const urlBackend = "/api/v1/user/change-password";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        { email, oldpass, newpass })
}

export const getOrdersAPI = (query: string) => {
    const urlBackend = `/api/v1/order?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(urlBackend)
}

export const getDashboardAPI = () => {
    const urlBackend = `/api/v1/database/dashboard`;
    return axios.get<IBackendRes<{
        countOrder: number;
        countUser: number;
        countBook: number;
    }>>(urlBackend)
}