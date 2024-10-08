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
            },
            {
                path: '/vicons-ionicons5',
                name: 'vicons-ionicons5',
                component: () => import('@/components/ViconsIonicons5')  // 图标
            },
            {
                path: '/Naive',
                name: 'Naive',
                component: () => import('@/components/Naive')  // Naive
            },
            {
                path: '/WebSocket',
                name: 'WebSocket',
                component: () => import('@/components/WebSocket')  // Naive
            }
        ]
    },

]

const router = createRouter({
    history: createWebHistory(), // 路由类型
    routes // short for `routes: routes`
})


export default router
