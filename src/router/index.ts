import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '首页',
      redirect: '/user',
      component: () => import('@/views/home/index.vue'),
      children: [
        {
          path: '/user',
          name: '用户管理',
          redirect: '/userDetail',
          component: () => import('@/views/user/index.vue'),
          meta: {
            select: false,
            level: 1
          },
          children: [
            {
              path: '/userDetail',
              name: '用户详情',
              component: () => import('@/views/user/userDetail/index.vue'),
              meta: {
                select: false,
                level: 2
              }
            },

            {
              path: '/userPermission',
              name: '用户权限',
              component: () => import('@/views/user/userPermission/index.vue'),
              meta: {
                select: false,
                level: 2
              }
            }
          ]
        },
        {
          path: '/product',
          name: '产品管理',
          component: () => import('@/views/product/index.vue'),
          meta: {
            select: false,
            level: 1
          },
          redirect: '/productList',
          children: [
            {
              path: '/productList',
              name: '产品列表',
              component: () => import('@/views/product/productList/index.vue'),
              meta: {
                select: false,
                level: 2
              }
            },
            {
              path: '/productCategory',
              name: '产品分类',
              component: () =>
                import('@/views/product/productCategory/index.vue'),
              meta: {
                select: false,
                level: 2
              },
              children: [
                {
                  path: '/abc',
                  redirect: 'abc',
                  name: '产品测试',
                  meta: {
                    select: false,
                    level: 2
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        title: '登录'
      }
    }
  ]
})

export default router