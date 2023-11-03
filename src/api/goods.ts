import request, { type Result } from '@/utils/http'
import type { DataList } from './goods.d'
// 获取商品分类列表
export const getGoodsCategoryAPI = () => {
  return request.get('/goodsCategory')
}

// 添加商品分类
export const addGoodsCategoryAPI = (data: any) => {
  return request.post('/addGoodsCategory', { data: { data } })
}

// 删除商品分类
export const deleteGoodsCategoryAPI = (data: any) => {
  return request.post<any, Result>('/deleteGoodsCategory', { data })
}
// 删除一级分类
export const deleteGoodsCategoryOneAPI = (id: any) => {
  return request.delete<any, Result>('/deleteGoodsCategoryOne', {
    data: { id }
  })
}

// 获取商品列表
export const getGoodsListAPI = () => {
  return request.get<any, Result<DataList>>('/goodsList')
}

// 添加商品
export const addGoodsAPI = (data: any) => {
  return request.post<any, Result>('/addGoods', data)
}

// 删除商品
export const deleteGoodsAPI = (id: any) => {
  return request.delete<any, Result>('/deleteGoods', {
    data: { id }
  })
}

// 修改商品
export const updateGoodsAPI = (data: any) => {
  return request.post<any, Result>('/updateGoods', data)
}
