/**
 *  登录使用的 路径
 * */

import qs from 'qs'
import axios from "../request"

export default {
    async checkToken(){
        return await axios.get(`rbac2/admin/v2/check`)
    },
    async goToLogin(params){
        return await axios.post(`rbac2/admin/v2/login`,qs.stringify(params))
    },
    async getMenu(){
        return await axios.get(`rbac2/admin/v2/getResource`)
    },
    async logout(){
        return await axios.get(`rbac2/admin/v2/logout`)
    }
}
