<template>
  <n-grid :x-gap="12" :y-gap="8" :cols="3">
    <n-grid-item>
      <n-divider title-placement="left" style="margin-top: 10px">
          也许你需要这些字段
      </n-divider>
      <n-data-table
          size="small"
          :columns="columns"
          :data="data"
          :pagination="pagination"
          :bordered="false"
          style="margin-top: -15px"
      />
    </n-grid-item>
    <n-grid-item>
      <n-divider title-placement="left" style="margin-top: 10px">
        最终会生成的
      </n-divider>
      <n-data-table
          size="small"
          :columns="columns"
          :data="data"
          :pagination="pagination"
          :bordered="false"
          style="margin-top: -15px"
      />
    </n-grid-item>
    <n-grid-item>
      <n-divider title-placement="left" style="margin-top: 10px">
        原表中所存在的
      </n-divider>
      <n-data-table
          size="small"
          :columns="columns"
          :data="data"
          :pagination="pagination"
          :bordered="false"
          style="margin-top: -15px"
      />
    </n-grid-item>
  </n-grid>
</template>



<script lang="ts">
import { h, defineComponent } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

type Song = {
  no: number
  title: string
  length: string
}

const createColumns = ({
                         play
                       }: {
  play: (row: Song) => void
}): DataTableColumns<Song> => {
  return [
    {
      type: 'selection'
    },
    {
      title: '字段名称',
      key: 'title'
    },
    {
      title: '类型',
      key: 'length'
    },
    {
      title: '对应列表字段',
      key: 'actions'
    }
  ]
}

const data: Song[] = [
  { no: 3, title: 'Wonderwall', length: '4:18' },
  { no: 4, title: "Don't Look Back in Anger", length: '4:48' },
  { no: 12, title: 'Champagne Supernova', length: '7:27' }
]

export default defineComponent({
  setup () {
    const message = useMessage()
    return {
      data,
      columns: createColumns({
        play (row: Song) {
          message.info(`Play ${row.title}`)
        }
      }),
      pagination: false as const
    }
  }
})
</script>