import axios from "@/api/request";
import qs from "qs";
// 应用列表查询
export const getAppIdByDomain = data => axios.get(`always-client/application/v2/getAppIdByDomain`, {params:data});