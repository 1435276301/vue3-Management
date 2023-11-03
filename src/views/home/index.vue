<script setup lang="ts">
import Menu from './menu/index.vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/login'
import { Data } from '@/api/login'
import avatar from '@/components/avatar.vue'
import { Expand, Fold, Sunrise, Moon } from '@element-plus/icons-vue'
import { updateUserAPI } from '@/api/user'
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const isRouter = ref()

watch(
  () => userStore.permission,
  () => {
    getRoute()
  }
)
// 获取个人信息
const userInfo = ref<Data>()
const getInfo = () => {
  userInfo.value = userStore.userInfo[0]
  console.log(userInfo.value)
}

// 获取当前路由信息
const getRoute = () => {
  let route = JSON.parse(userStore.permission)

  route.level1 = JSON.parse(route.level1)
  route.level2 = JSON.parse(route.level2)
  // console.log(route)
  const item = router.options.routes.filter((item) => {
    if (item.meta?.title === '登录') {
      return false
    } else {
      return item
    }
  })
  isRouter.value = item[0].children
  permissionRouters(route)
}
const permissionRouters = (route: any) => {
  isRouter.value.forEach((item: any) => {
    if (route.level1.includes(item.name)) {
      item.meta.select = true
      if (item.children) {
        item.children.forEach((item2: any) => {
          if (route.level2.includes(item2.name)) {
            item2.meta.select = true
            if (item2.children) {
              item2.children.forEach((item3: any) => {
                if (route.level2.includes(item3.name)) {
                  item3.meta.select = true
                } else {
                  item3.meta.select = false
                }
              })
            }
          } else {
            item2.meta.select = false
          }
        })
      }
    } else {
      item.meta.select = false
    }
  })
}
// 修改资料按钮回调
const updateUserInfo = async (val) => {
  editUser.value = false
  userInfo.value.nickName = val.name
  userInfo.value.image = val.updateAvatar
  const res = await updateUserAPI(userInfo.value)
  ElMessage.success(res.msg)
}
const editUser = ref(false)

// 退出登录按钮回调
const loginOut = async () => {
  await ElMessageBox.confirm('你确定要退出登录吗', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  // 清除用户信息
  localStorage.removeItem('user')
  // 跳转登录页
  router.replace('/login')
}
onMounted(() => {
  getInfo()
  getRoute()
})

const isShrink = ref(false)
const shrink = () => {
  isShrink.value = !isShrink.value
}

const diabloSwitch = ref(false)
const header = ref()
const onSwitch = () => {
  console.log(header.value)

  const html = document.querySelector('html')
  if (diabloSwitch.value) {
    html.classList.add('dark')
    header.value.style.backgroundColor = '#000'
  } else {
    html.classList.remove('dark')
    header.value.style.backgroundColor = '#f5f5f5'
  }
}
</script>
<template>
  <div class="index">
    <!-- 左侧导航栏 -->
    <div class="leftNav">
      <!-- 导航栏 -->
      <div class="nav">
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isShrink"
          router
          :default-active="route.path"
        >
          <el-menu-item class="el-menu-li">
            <!-- logo -->
            <div class="logo">
              <img src="../../assets/logo.png" alt="" />
            </div>
          </el-menu-item>

          <Menu :isRouter="isRouter" v-if="isRouter" />
        </el-menu>
      </div>
    </div>
    <!-- 右侧主体内容 -->
    <div class="right">
      <!-- 顶部 -->
      <div class="header" ref="header">
        <div class="left-btn">
          <div @click="shrink">
            <el-icon size="28" v-if="!isShrink"><Fold /></el-icon>
            <el-icon size="28" v-else><Expand /></el-icon>
          </div>
          <div class="btn">
            <!-- 暗黑模式的切换 -->
            <el-switch
              v-model="diabloSwitch"
              class="mt-2"
              style="margin-left: 24px"
              inline-prompt
              :active-icon="Sunrise"
              :inactive-icon="Moon"
              @change="onSwitch"
            />
          </div>
        </div>
        <el-dropdown class="right-userInfo">
          <div style="display: flex">
            <p>{{ userInfo?.nickName }}</p>
            <img
              :src="
                userInfo?.image ||
                'https://gd-hbimg.huaban.com/871aa2b9b0a55be3f0738d76a15e23ebac5c586811e29-B6Aozr_fw658webp'
              "
              alt=""
            />
          </div>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="editUser = true"
                >修改资料</el-dropdown-item
              >
              <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 面包屑 -->
      <div class="bread">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item
            :to="{ path: item.path }"
            v-for="item in route.matched"
            :key="item.path"
            >{{ item.name }}</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <!-- 内容 -->
      <div class="body">
        <el-card class="card">
          <RouterView v-if="!editUser" />
          <avatar
            v-else
            :avatar="userInfo?.image"
            :name="userInfo?.nickName"
            @updateUserInfo="updateUserInfo"
          />
        </el-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.index {
  display: flex;
  .leftNav {
    width: auto;
    height: 100vh;
    .nav {
      width: 100%;
      height: 100%;
      .el-menu-vertical-demo {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .el-menu-li {
          margin-bottom: 50px;
          .logo {
            img {
              width: 100%;
              height: 50px;
            }
          }
        }
      }
    }
  }

  .right {
    flex: 1;
    .header {
      .left-btn {
        flex: 3;
        display: flex;

        justify-content: space-between;
      }
      .right-userInfo {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
      padding: 10px 10px 10px 0;
      background: #f5f5f5;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
      }
      p {
        margin-right: 20px;
      }
    }
    .bread {
      margin: 10px;
    }
    .body {
      height: calc(100vh - 110px);
      .card {
        margin: 10px auto;
        width: calc(100vw - 10vw - 50px);
        height: 100%;
      }
    }
  }
}
</style>
