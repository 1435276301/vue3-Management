<!-- eslint-disable vue/no-reserved-component-names -->
<script setup lang="ts">
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
      <el-menu-item :index="item.path" v-if="!item.meta.select">
        <template #title>
          <span>
            {{ item.name }}
          </span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由，但是只有一个子路由 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item :index="item.path" v-if="!item.meta.select">
        <template #title>
          <span>{{ item.name }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由，但是有多个子路由 -->
    <el-sub-menu
      :index="item.path"
      v-if="item.children && item.children.length > 1"
    >
      <template #title>
        <span>{{ item.name }}</span>
      </template>
      <Menu :isRouter="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<style lang="scss" scoped></style>
