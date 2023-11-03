import router from '@/router'
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/login'
// 声明ts类型
export type Result<T = any> = {
  code: number
  msg: string
  data: T
}

const baseIP = import.meta.env.BASE_IP
console.log(baseIP)
// 创建axios实例
const request = axios.create({
  baseURL: baseIP,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json' // 设置请求头
  }
})
// 请求拦截器
request.interceptors.request.use(
  (res: AxiosRequestConfig) => {
    // 在发送请求前做点什么
    // 携带token
    const userStore = useUserStore()
    const token = userStore.token
    if (token) {
      res.headers.Authorization = `Bearer ${token}`
    }
    return res
  },
  (error) => {
    // 对请求错误做点什么
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (res: AxiosResponse<Result<any>>) => {
    if (res.data.code == 401) {
      ElMessage.error('登录过期，请重新登录')
      router.replace('/login')
      return Promise.reject(res.data.msg)
    }
    return res.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
