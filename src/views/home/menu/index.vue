<!-- eslint-disable vue/no-reserved-component-names -->
<script setup lang="ts">
import { UserFilled, Platform, GoodsFilled } from '@element-plus/icons-vue'
defineProps<{
  isRouter: Array<any>
}>()

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Menu'
})
</script>
<template>
  <template v-for="item in isRouter" :key="item">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item :index="item.path" v-if="item.meta.select" id="item">
        <el-icon v-if="item.meta.level === 1" class="item"
          ><Platform
        /></el-icon>
        <template #title>
          <span>
            {{ item.name }}
          </span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由，但是只有一个子路由 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item :index="item.path" v-if="item.meta.select">
        <template #title>
          <span>{{ item.name }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由，但是有多个子路由 -->
    <el-sub-menu
      :index="item.path"
      v-if="item.children && item.children.length > 1 && item.meta.select"
    >
      <template #title>
        <el-icon v-if="item.meta.level === 1 && item.name === '用户管理'"
          ><UserFilled
        /></el-icon>
        <el-icon v-if="item.meta.level === 1 && item.name === '产品管理'"
          ><GoodsFilled
        /></el-icon>
        <span>{{ item.name }}</span>
      </template>
      <Menu :isRouter="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<style lang="scss" scoped>
#item {
  div {
    display: flex;
    justify-content: center;
    z-index: 99;
  }
}
</style>
