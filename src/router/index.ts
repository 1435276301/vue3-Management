import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/login'
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
              },
              children: [
                {
                  path: '/addProduct',
                  name: '添加产品',
                  component: () =>
                    import('@/views/product/productList/addProduct.vue'),
                  meta: {
                    select: false,
                    level: 3
                  }
                }
              ]
            },
            {
              path: '/productCategory',
              name: '产品分类',
              component: () =>
                import('@/views/product/productCategory/index.vue'),
              meta: {
                select: false,
                level: 2
              }
            }
          ]
        },
        {
          path: '/echarts',
          name: '数据流图',
          component: () => import('@/views/echarts/index.vue'),
          meta: {
            select: false,
            level: 1
          }
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

// 路由守卫拦截
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') {
    ElMessage.error('请先登录')
    return router.push('/login')
  } else if (
    to.path !== '/login' &&
    (userStore.permission === '' || userStore.permission === 'undefined')
  ) {
    ElMessage.warning('权限不足')
    return router.push('/login')
  }
})
export default router
