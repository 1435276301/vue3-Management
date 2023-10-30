import { getGoodsCategoryAPI } from '@/api/goods'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGoodsStore = defineStore('goods', () => {
  const state = ref([])
  const getProductCategory = async () => {
    const res = await getGoodsCategoryAPI()
    state.value = res.data
      .map((item: any) => {
        return {
          ...JSON.parse(item.categoryName),
          id: item.id
        }
      })
      .map((item: any) => {
        return {
          value: item.categoryName,
          label: item.categoryName,
          children: item.children.map((item: any) => {
            return {
              value: item.categoryName,
              label: item.categoryName,
              children: item.children.map((item: any) => {
                return {
                  value: item.categoryName,
                  label: item.categoryName
                }
              })
            }
          })
        }
      })
  }

  return {
    state,
    getProductCategory
  }
})
