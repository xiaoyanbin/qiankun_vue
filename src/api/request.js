/** 单独 制作 关于 rbac 相关的 axios */
/**  导入 axios 请求 与 rbac 权限控制相关联 */
import axios from "axios";
/** 导入 外部配置 axios 配置文件 */
import {axiosConfig} from "../config/project.config"

"use strict";
let config = {
    baseURL:axiosConfig.requestAddress,
    timeout: axiosConfig.timeOut
};
const _axios = axios.create(config);
// 设置post请求头
_axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

_axios.interceptors.request.use(
    function(config) {
        /** 增加 配置文件的请求头内容 关键词内容 */
        for(let i in axiosConfig.headers) {
            config.headers[i] = axiosConfig.headers[i]();
            // 如果为空 进行删除请求头
            if(!config.headers[i]) delete config.headers[i]
        }
        return config;
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
_axios.interceptors.response.use(
    function(response) {
        /** 确定返回头为正常返回 */
        if(response.status === 200){
            if(response.data.code != axiosConfig.errorCode){
                return Promise.resolve(response.data);
            }
            return Promise.reject(response.data)
        }else {
            return Promise.reject(response)
        }
    },
    function(error) {
        // Do something with response error
        return Promise.reject(error);
    }
);
export default _axios
