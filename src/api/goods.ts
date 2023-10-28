import request, { Result } from '@/utils/http'

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
