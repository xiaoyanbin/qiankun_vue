import {Message,Loading} from "element-ui";
import request from "../../api/request"
/** axios mixins */
/**
 * 公共的权限内容的 控制的请求
 * 通过路由来获取当前的页面操作者是否拥有 该 api 权限
 */
export const AxiosMixins = {
    methods: {
        get(url){
            if(this.getUserRole().hasOwnProperty(url)){
                return request.get(url)
            }
            console.warn(`暂无操作 ${url} 的权利`)
            return Promise.reject(`暂无操作 ${url} 的权利`)
        },
        post(url){
            if(this.getUserRole().hasOwnProperty(url)){
                return request.post(url)
            }
            console.warn(`暂无操作 ${url} 的权利`)
            return Promise.reject(`暂无操作 ${url} 的权利`)
        },
        axios(config){
            if(this.getUserRole().hasOwnProperty(config.url)){
                return request(config)
            }
            console.warn(`暂无操作 ${config.url} 的权利`)
            return Promise.reject(`暂无操作 ${config.url} 的权利`)
        },
        getUserRole(){
            return localStorage.getItem('userRole')
        }
    }
};
