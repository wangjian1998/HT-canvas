import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: ()=>import('@/views/login/login.vue'),
  },
  {
    path: '/main',
    // name: 'main',
    component: ()=>import('@/views/main/main.vue'),
    children: [
      {
        path: '/',
        name: 'mapEdit',
        component: ()=>import('@/views/mapEdit/mapEdit.vue')
      },
      {
        path: 'infoEdit',
        name: 'totalInstall',
        component: ()=>import('@/views/infoEdit/infoEdit.vue')
      },
      {
        path: 'separateInstall',
        name: 'separateInstall',
        component: ()=>import('@/views/separateInstall/SeparateInstall.vue')
      },
      {
        path: 'mapEdit',
        name: 'mapEdit',
        component: ()=>import('@/views/mapEdit/mapEdit.vue')
      },
    ]
  },
  {
    path: '/totalInstall',
    name: 'totalInstall',
    component: ()=>import('@/views/totalInstall/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: ()=>import('@/views/login/login.vue')
  },
  {
    path: '/separateInstall',
    name: 'separateInstall',
    component: ()=>import('@/views/separateInstall/SeparateInstall.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/not-found/not-found.vue')
  }
]

const router = new VueRouter({
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// eslint-disable-next-line consistent-return
router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    const token = localStorage.getItem('account')
    !token ? next('/login') : next()
  } else {
    next()
  }
})

export default router
