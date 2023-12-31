import request, { type Result } from '@/utils/http'
// 定义角色列表的信息
export type Data = {
  id: number
  image: string
  nickName: string
  role: string
  roleId: number
  userName: string
  userPwd: string
}

export type DataList = Data[]

// 登录
export const loginAPI = (data: any): Promise<Result<DataList>> => {
  return request.post('/login', data)
}
