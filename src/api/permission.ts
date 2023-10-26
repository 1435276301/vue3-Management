import request from '@/utils/http'
// 设置角色的权限
export const setRolePermissionAPI = (data: any) => {
  return request.post<any, any>('/setAuth', data)
}
// 获取当前角色的权限
export const getRolePErmissionAPI = (id) => {
  return request.get('/defaultAuth', { params: { id } })
}