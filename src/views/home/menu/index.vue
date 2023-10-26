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
  <template v-for="item in isRouter" :key="item.path">
    <el-sub-menu :index="item.path" :unique-opened="true" v-if="item.children">
      <template #title>
        <span>{{ item.name }}</span>
      </template>
      <template v-for="children in item.children" :key="children.path">
        <el-menu-item :index="children.path" v-if="!children.children">
          {{ children.name }}</el-menu-item
        >
        <!-- 使用递归组件的方式重复渲染子路由 -->
        <Menu :isRouter="item.children" v-else />
      </template>
    </el-sub-menu>
  </template>
</template>

<style lang="scss" scoped></style>
