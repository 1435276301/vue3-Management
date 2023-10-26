import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

// 声明ts类型
export type Result<T = any> = {
  code: number
  msg: string
  data: T
}
// 创建axios实例
const request = axios.create({
  baseURL: 'http://127.0.0.1:3030',
  timeout: 5000
})
// 请求拦截器
request.interceptors.request.use(
  (res: AxiosRequestConfig) => {
    // 在发送请求前做点什么

    res.headers['Content-Type'] =
      'application/x-www-form-urlencoded;charset=utf-8'
    return res
  },
  (error) => {
    // 对请求错误做点什么
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    return res.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
