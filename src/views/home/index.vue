<script setup lang="ts">
import Menu from './menu/index.vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const isRouter = ref()

// 获取当前路由信息
const getRoute = () => {
  const item = router.options.routes.filter((item) => {
    if (item.meta?.title === '登录') {
      return false
    } else {
      return item
    }
  })
  isRouter.value = item[0].children
}
onMounted(() => {
  getRoute()
})
</script>
<template>
  <div class="index">
    <!-- 左侧导航栏 -->
    <div class="leftNav">
      <!-- 导航栏 -->
      <div class="nav">
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="false"
          router
          collapse-transition
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
      <div class="header">
        <el-dropdown>
          <img src="../../assets/logo.png" alt="" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>修改资料</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <p>123</p>
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
          <RouterView />
        </el-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.index {
  display: flex;
  .leftNav {
    width: 10vw;
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
      padding: 10px 10px 10px 0;
      background: #f5f5f5;
      height: 50px;
      display: flex;
      justify-content: flex-start;
      flex-direction: row-reverse;
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
      height: 100vh;
      .card {
        margin: 10px auto;
        width: calc(100vw - 10vw - 50px);
        height: 100%;
      }
    }
  }
}
</style>
