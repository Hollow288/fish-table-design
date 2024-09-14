
<script lang="ts">

import {RouterLink, useRoute, useRouter} from "vue-router"
import {MenuOption, NButton, NIcon} from 'naive-ui'
import tableDesign from "@/components/TableDesign/index.vue";
import HomeOutline from '@vicons/ionicons5/HomeOutline'
import CubeOutline from '@vicons/ionicons5/CubeOutline'
import CalendarNumberOutline from '@vicons/ionicons5/CalendarNumberOutline'
import LogoNodejs from '@vicons/ionicons5/LogoNodejs'
import LogoVue from '@vicons/ionicons5/LogoVue'
import MailOutline from '@vicons/ionicons5/MailOutline'

import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon
} from '@vicons/ionicons5'
import {Component} from "vue";

const route = useRoute()
const router = useRouter()


function renderIcon(icon: Component, size: string = '15px') {
  return () => h(NIcon, { size  }, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'navigation'
              }
            },
            { default: () => '首页' }
        ),
    key: 'navigation',
    icon: renderIcon(HomeOutline),
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'table-design'
              }
            },
            { default: () => '辅助建表' }
        ),
    key: 'table-design',
    icon: renderIcon(CubeOutline)
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'full-calendar-test'
              }
            },
            { default: () => '日历' }
        ),
    key: 'full-calendar-test',
    icon: renderIcon(CalendarNumberOutline)
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'vicons-ionicons5'
              }
            },
            { default: () => '图标' }
        ),
    key: 'vicons-ionicons5',
    icon: renderIcon(LogoNodejs)
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'Naive'
              }
            },
            { default: () => 'Naive UI' }
        ),
    key: 'Naive',
    icon: renderIcon(LogoVue)
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'WebSocket'
              }
            },
            { default: () => 'WebSocket' }
        ),
    key: 'WebSocket',
    icon: renderIcon(MailOutline)
  },

]


export default defineComponent({
  setup() {
    return {
      activeKey: ref<string | null>(null),
      menuOptions
    }
  }
})


</script>

<template>
  <footer >
    <div style="background-color: rgba(85, 85, 85, 0.4);height: 30px">
      <n-split :default-size="1" >
        <template #1 >
          <n-menu
              v-model:value="activeKey"
              mode="horizontal"
              :options="menuOptions"
              style="margin-top: -5px"
          />
        </template>
      </n-split>
    </div>
  </footer>

</template>
