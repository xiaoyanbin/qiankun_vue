/**
 *  左侧导航树 菜单栏 展示
 *  不受 main.js api 限制
 * */
import qs from 'qs'
import axios from "../request"

export default {
  // 查询全部 的左侧导航菜单
  getRbac(type,roleId){
    let role = roleId ? `&roleId=${roleId}` : '';
    return axios.get(`rbac2/resource/v2/tree?type=${type}${role}`)
  },
  addRbac(params){
    return axios.post(`rbac2/resource/v2/saveOrUpdate`,qs.stringify(params))
  },
  //保存树rbac2/admin/resource/v2/saveOrUpdate/terminal/{key}
  addSiteRbac(type,params){
    return axios.post(`rbac2/admin/resource/v2/saveOrUpdate/terminal/${type}`,qs.stringify(params))
  },
}
