import { RouteRecordRaw, createWebHistory, createRouter } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../components/TableDesign/index.vue')  // 首页组件
    }, {
        path: '/about',
        component: () => import('../components/TableDesign/index.vue')  // 关于我们组件
    }
]

const router = createRouter({
    history: createWebHistory(), // 路由类型
    routes // short for `routes: routes`
})


export default router
