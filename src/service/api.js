import qs from 'qs';
import {get, post} from './index'

export const loginApi = (params) => post('/loginapi/users/login', qs.stringify(params), {"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'}) // 用户登录
export const getNodeApi = (params) => get('/api/map/showNode', params) // 获取节点
export const mapinfoApi = params => post('/api/mapinfo', params) // 上传地图信息
export const getmapApi = (params) => get('/api/mapinfo', params) // 获取地图信息
