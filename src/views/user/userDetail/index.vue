<script setup lang="ts">
import {
  addUserAPI,
  deleteUserAPI,
  getRoleAPI,
  getUserAPI,
  updateUserAPI
} from '@/api/user'
import { Search, Edit, Delete } from '@element-plus/icons-vue'

import { nextTick, onMounted, reactive, ref } from 'vue'
// 定义用户列表
const userList = ref([])
// 获取用户列表
const getUserList = async () => {
  const res = await getUserAPI()
  // 先筛选出搜索框是否输入了值，输入了值的话就把新数据传给res，没输入就传入他本身，之后将筛选出来的长度给分页的总长度
  res.data = res.data.filter((item: any) => {
    if (searchList.value !== '')
      return (
        item.userName.includes(searchList.value) ||
        item.nickName.includes(searchList.value) ||
        item.role.includes(searchList.value)
      )
    else return item
  })
  // 用筛选出来的新数据使用slice进行分页处理，之后传给nserList
  userList.value = res.data.slice(
    (page.value - 1) * pageSize.value, // 默认是0*10 = 0
    page.value * pageSize.value // 默认是1*10 = 10
  )
  // 获取用户列表的总长度
  total.value = res.data.length
}

onMounted(() => {
  getUserList()
})
const total = ref(0)
const userDisplay = ref(false)
const isEdit = ref(false)
// 点击添加用户回调
const addUser = (row) => {
  userDisplay.value = true
  getRoleList()
  nextTick(() => {
    userRef.value.resetFields()
    if (row.id) {
      isEdit.value = true
      Object.assign(user, row)
    } else {
      delete user.id

      isEdit.value = false
    }
  })
}

const roleList = ref()
const getRoleList = async () => {
  const res = await getRoleAPI()
  roleList.value = res.data
}
const userRef = ref(null)
// 表单
const user = reactive({
  nickName: '',
  userName: '',
  userPwd: '',
  role: '',
  id: '',
  image:
    'https://gd-hbimg.huaban.com/871aa2b9b0a55be3f0738d76a15e23ebac5c586811e29-B6Aozr_fw658webp'
})
//表单校验规则
const userRules = {
  nickName: [
    {
      required: true,
      max: 6,
      message: '请输入不超过6位的昵称',
      trigger: 'blur'
    }
  ],
  userName: [
    {
      required: true,
      min: 5,
      max: 11,
      message: '请输入5-11位的账户名',
      trigger: 'blur'
    }
  ],
  userPwd: [
    {
      required: true,
      min: 6,
      max: 16,
      message: '请输入6-16位的密码',
      trigger: 'blur'
    },
    {
      pattern: /^[0-9a-zA-Z]+$/,
      message: '密码只能包含数字和字母',
      trigger: 'blur'
    }
  ],
  role: [
    {
      required: true,
      message: '请选择角色',
      trigger: 'change'
    }
  ]
}
// 添加用户确定按钮
const addUserConfirm = async () => {
  await userRef.value.validate()
  const item = userList.value.some(
    (item: any) => item.userName === user.userName
  )
  if (isEdit.value) await updateUserAPI(user)
  else {
    if (item) ElMessage.error('账号已存在!')
    else await addUserAPI(user)
  }
  if (!item) ElMessage.success('操作成功')
  getUserList()
  userDisplay.value = false
}

// 删除用户回调按钮
const deleteUser = async (id) => {
  console.log(id)

  await ElMessageBox.confirm('确定删除该用户吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  const res = await deleteUserAPI(id)
  getUserList()
  ElMessage.success(res.msg)
}
// 获取当前页数触发
const handleCurrentChange = (eve) => {
  page.value = eve
  getUserList()
}
const page = ref(1)
const pageSize = ref(10)
// 改变页面大小触发
const handleSizeChange = (eve) => {
  pageSize.value = eve
  page.value = 1
  getUserList()
}

// 搜索功能
const searchList = ref('')

// 点击搜索按钮回调
const goSeacrh = () => {
  if (searchList.value !== '') {
    getUserList()
  }
}
</script>
<template>
  <div>
    <!-- 搜索和添加 -->
    <div class="search">
      <el-input
        placeholder="请输入姓名"
        class="input-with-select"
        v-model="searchList"
      >
        <template #append>
          <el-button :icon="Search" @click="goSeacrh" />
        </template>
      </el-input>
      <el-button type="primary" class="btn" @click="addUser"
        >添加用户</el-button
      >
    </div>
    <!-- 主体内容 -->
    <div class="table">
      <el-table border :data="userList">
        <el-table-column prop="id" width="50" type="index" />
        <el-table-column prop="nickName" label="姓名" width="180" />
        <el-table-column prop="userName" label="账号" width="200" />
        <el-table-column prop="userPwd" label="密码" width="200" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="address" label="操作" width="200">
          <!-- eslint-disable-next-line vue/valid-attribute-name -->
          <template #="{ row }">
            <el-button
              :icon="Edit"
              type="primary"
              @click="addUser(row)"
            ></el-button>
            <el-button
              :icon="Delete"
              type="danger"
              @click="deleteUser(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 10]"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>

  <!-- 添加用户弹出层 -->
  <el-dialog :title="isEdit ? '修改用户' : '添加用户'" v-model="userDisplay">
    <div class="role">
      <el-form
        ref="userRef"
        label-width="80px"
        :inline="false"
        size="default"
        :model="user"
        :rules="userRules"
      >
        <el-form-item label="姓名" prop="nickName">
          <el-input v-model="user.nickName"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="userName">
          <el-input v-model="user.userName" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPwd">
          <el-input v-model="user.userPwd"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select placeholder="请选择角色" v-model="user.role">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :value="item.role"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUserConfirm">
            {{ isEdit ? '确认修改' : '立即添加' }}
          </el-button>
          <el-button @click="userDisplay = false">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.search {
  .input-with-select {
    width: 15%;
  }
  .btn {
    margin-left: 10px;
  }
}
.table {
  margin-top: 10px;
}
.role {
  display: flex;
  justify-content: center;
}
</style>
