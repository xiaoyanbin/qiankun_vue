/**
 *   后台账户管理
 *   查询 ，新增 ， 删除
 */
import qs from 'qs'
import axios from "../request"

export default {
  // 查看用户列表信息
  getUserList(params){
    return axios.get(`rbac2/admin/v2/select`, {params:params});
  },
  // 更新用户信息
  updateUserInformation(params){
    return axios.post(`rbac2/admin/v2/saveOrUpdate`, qs.stringify(params),{headers:{'Content-Type' : 'application/x-www-form-urlencoded'}});
  },
  // 重置密码
  resetPassword(params){
    return axios.post(`rbac2/admin/v2/resetPassword`, params);
  },
  // 删除用户
  delete(params){
    return axios.post(`rbac2/admin/v2/delete`, params);
  },
};

