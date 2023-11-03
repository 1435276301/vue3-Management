import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getRolePErmissionAPI } from '@/api/permission'
import { DataList } from '@/api/login'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref()
    const userInfo = ref<DataList>()
    const getUserInfo = (data: DataList) => {
      userInfo.value = data.data
      setToken(data.token)
      setPermissionId(data.data[0].roleId)
    }
    const setToken = (id: string | number) => {
      token.value = id
    }
    const permission = ref()
    const setPermissionId = async (id: string | number) => {
      const res = await getRolePErmissionAPI(id)
      console.log(res)

      permission.value = JSON.stringify(res.data[0])
    }

    return {
      token,
      setToken,
      setPermissionId,
      getUserInfo,
      userInfo,
      permission
    }
  },
  {
    persist: true
  }
)
