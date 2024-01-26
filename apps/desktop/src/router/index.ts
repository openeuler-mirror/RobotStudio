import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'project',
    path: '/project',
    component: ()=>import('../views/ProjectWindow.vue')
  },
  {
    name: 'window',
    path: '/window',
    component: ()=>import('../views/NormalWindow.vue'),
    children: [
      {
        name: 'welcome',
        path: 'welcome',
        component: ()=>import('../views/WelcomeView.vue')
      },
      {
        name: 'project_list',
        path: 'projectList',
        component: ()=>import('../views/ProjectList.vue')
      },
      {
        name: 'project_setting',
        path: 'projectSetting',
        component: ()=>import('@rosc/common/components/project_setting/ProjectSetting.vue')
      },
      {
        name: 'version',
        path: 'version',
        component: ()=>import('@rosc/common/components/Version.vue')
      }
    ]
  },
  {
    name: 'window_default',
    path: '/',
    component: ()=>import('../views/NormalWindow.vue'),
    children: [{
      path: '',
      name: 'welcome_default',
      component: ()=>import('../views/WelcomeView.vue')
    }
    ]
  }
]

const router = createRouter({
  history: import.meta.env.VITE_APP_IS_ELECTRON === 'true' ? createWebHashHistory() : createWebHistory(),
  routes
})

export default router
