import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)

const Area = () => import('../pages/area/index.vue');
const Draw = () => import('@/pages/draw/index.vue');

const router = new VueRouter({
  mode:'history',
  routes:[
    { path: '/area', component: Area },
    { path: '/draw', component: Draw }
  ]
})

export default router;
