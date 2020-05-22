import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('../views/rbac/main.vue'),
    children:[
      {
        path: '/rbac/account',
        name: 'account',
        component: () => import('../views/rbac/account.vue'),
        children:[
          {
            path: '/rbac/addAccount',
            name: 'account',
            component: () => import('../views/rbac/addAccount.vue')
          },
        ],
      },
      {
        path: '/rbac/role',
        name: 'role',
        component: () => import('../views/rbac/role.vue'),
        children:[
          {
            path: '/rbac/addRole',
            name: 'role',
            component: () => import('../views/rbac/addRole.vue')
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/rbac/login.vue')
  },
];
const router = new VueRouter({
  routes
});

export default router
