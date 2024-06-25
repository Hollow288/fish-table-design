import { RouteRecordRaw, createWebHistory, createRouter } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/table-design',
        component: () => import('@/components/TableDesign')  // 首页组件
    },
    {
        path: '/full-calendar-test',
        component: () => import('@/components/FullCalendarTest')  // 首页组件
    }
]

const router = createRouter({
    history: createWebHistory(), // 路由类型
    routes // short for `routes: routes`
})


export default router
