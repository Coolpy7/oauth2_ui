import Axios from "axios"

const baseURL = "https://auth2.widora.cn";

global.constants = {
    website:baseURL,
};

const http = Axios.create({
    baseURL: baseURL,
    timeout: 10000
});

http.interceptors.request.use(
    config => {
        if (sessionStorage.getItem("token")) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = "Bearer " + sessionStorage.getItem("token");
        }
        return config;
    },
    err => {
        // window.loadObj = false;
        return Promise.reject(err);
    });

export default http;