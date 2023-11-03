import request, { type Result } from '@/utils/http'
// 获取用户列表
export const getUserAPI = () => {
  return request.get('/user')
}
// 获取角色列表
export const getRoleAPI = () => {
  return request.get('/role')
}

// 添加角色
export const addRoleAPI = (data: any) => {
  return request.post<any, any>('/addRole', data)
}

// 删除角色
export const deleteRoleAPI = (id: number) => {
  return request.delete(`/delRole`, { data: { id } })
}

// 添加用户
export const addUserAPI = (data: any) => {
  return request.post<any, Result>('/addUser', data)
}

// 修改用户
export const updateUserAPI = (data: any) => {
  return request.post<any, Result>('/updateUser', data)
}

// 删除用户
export const deleteUserAPI = (id: number) => {
  return request.delete<any, Result>(`/deleteUser`, { data: { id } })
}
