import { RouteRecordRaw, createWebHistory, createRouter } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/layouts/BaseLayout'),  // 首页组件
        children:[
            {
                path: '/',
                name: 'navigation',
                component: () => import('@/components/Navigation'),
            },
            {
                path: '/table-design',
                name: 'table-design',
                component: () => import('@/components/TableDesign')  // 建表组件
            },
            {
                path: '/full-calendar-test',
                name: 'full-calendar-test',
                component: () => import('@/components/FullCalendarTest')  // 日历组件
            }
        ]
    },

]

const router = createRouter({
    history: createWebHistory(), // 路由类型
    routes // short for `routes: routes`
})


export default router
