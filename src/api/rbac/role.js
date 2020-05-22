/**
 *   后台角色管理
 *   查询 ，新增 ， 删除
 */
import qs from 'qs'
import axios from "../request"

export default {
  // 查看用户列表信息
  getRoleList (params) {
    return axios.get(`rbac2/role/v2/select`,{params:params});
  },
  addRole(params){
    return axios.post(`rbac2/role/v2/saveOrUpdate`, qs.stringify(params));
  },
  delRole(params){
    return axios.get(`rbac2/role/v2/delete`, {params:params});
  },
};
