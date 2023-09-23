// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      }, {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
      }, {
        path: '/usuarios',
        children: [
          {
            path: '',
            name: 'UsuariosIndex',
            component: () => import('@/components/usuarios/Index.vue'),
          }, {
            path: ':id',
            name: 'UsuariosForm',
            component: () => import('@/components/usuarios/Form.vue'),
          },
        ],
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
