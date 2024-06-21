<script lang="ts">
import {h, defineComponent, ref, onMounted, onBeforeUnmount} from 'vue'
import {NButton, useMessage, NInput} from 'naive-ui'
import type {DataTableColumns} from 'naive-ui'
import AddSharp from '@vicons/ionicons5/AddSharp'
import {cloneDeep} from 'lodash-es'

type field = {
  fieldName: string
  fieldType: string
  remark: string
}

type editField = {
  fieldName: string
  fieldType: string
  remark: string,
  uuid: string,
  isChecked: boolean
}

const checkedRowKeysRef = ref<[]>([])

const basicData = ref<field[]>([
  {fieldName: 'ROW_GUID', fieldType: 'varchar(64)', remark: 'uid'},
  {fieldName: 'TO_ROW_GUID', fieldType: 'varchar(64)', remark: '主表uid'},
  {fieldName: 'CREATION_DATE', fieldType: 'datetime', remark: '申请日期'},
  {fieldName: 'CREATED_BY', fieldType: 'int', remark: '申请人id'},
  {fieldName: 'CREATED_BY_NAME', fieldType: 'varchar(50)', remark: '申请人name'},
  {fieldName: 'CREATED_BY_NUMBER', fieldType: 'varchar(50)', remark: '申请人code'},
  {fieldName: 'LAST_UPDATE_DATE', fieldType: 'datetime', remark: '最近更新时间'},
  {fieldName: 'LAST_UPDATED_BY', fieldType: 'int', remark: '最近更新人id'},
  {fieldName: 'LAST_UPDATED_BY_NAME', fieldType: 'varchar(50)', remark: '最近更新人'},
  {fieldName: 'LAST_UPDATED_BY_NUMBER', fieldType: 'varchar(50)', remark: '最近更新人code'},
  {fieldName: 'ENABLED_FLAG', fieldType: 'varchar(10)', remark: '是否逻辑删除'},
  {fieldName: 'ATTRIBUTE1', fieldType: 'varchar(500)', remark: '备用字段'},
  {fieldName: 'ATTRIBUTE2', fieldType: 'varchar(500)', remark: '备用字段'},
  {fieldName: 'ATTRIBUTE3', fieldType: 'varchar(500)', remark: '备用字段'},
  {fieldName: 'ATTRIBUTE4', fieldType: 'varchar(500)', remark: '备用字段'},
  {fieldName: 'ATTRIBUTE5', fieldType: 'varchar(500)', remark: '备用字段'},
  {fieldName: 'DEPT_ID', fieldType: 'int', remark: '申请部门id'},
  {fieldName: 'DEPT_CODE', fieldType: 'varchar(150)', remark: '申请部门code'},
  {fieldName: 'DEPT_NAME', fieldType: 'varchar(350)', remark: '申请部门name'}
])

const processData = ref<field[]>([
  {fieldName: 'BOE_TYPE_CODE', fieldType: 'varchar(500)', remark: '单据类型-code'},
  {fieldName: 'BOE_TYPE_NAME', fieldType: 'varchar(500)', remark: '单据类型-name'},
  {fieldName: 'OPERATION_TYPE_CODE', fieldType: 'varchar(100)', remark: '业务类型-code'},
  {fieldName: 'OPERATION_TYPE_NAME', fieldType: 'varchar(100)', remark: '业务类型-name'},
  {fieldName: 'BOE_NUM', fieldType: 'varchar(50)', remark: '单据编号'},
  {fieldName: 'FLOW_STATUS', fieldType: 'varchar(228)', remark: '流程状态'}
])


// const needData = [...basicData,...processData]



const generateUUID = ()=> {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}




export default defineComponent({
  setup() {
    const message = useMessage()

    const editData = ref<editField[]>([])
    const windowHeight = ref(window.innerHeight)

    const basicType = {
      fieldName: '',
      fieldType: '',
      remark: ''
    }

    const editType = {
      fieldName: '',
      fieldType: '',
      remark: '',
      uuid:'',
      isChecked:false
    }

    const basicColumns = [
      {
        type: 'selection'
      },
      {
        title: '字段名称',
        key: 'fieldName'
      },
      {
        title: '类型',
        key: 'fieldType'
      },
      {
        title: '对应列表字段',
        key: 'remark'
      }
    ]

    const editColumns = (): DataTableColumns<field> => [
      {
        type: 'selection'
      },
      {
        title: '字段名称',
        key: 'fieldName',
        render(row, index) {
          return h(NInput, {
            value: row.fieldName
          })
        }
      },
      {
        title: '类型',
        key: 'fieldType',
        render(row, index) {
          return h(NInput, {
            value: row.fieldType
          })
        }
      },
      {
        title: '对应列表字段',
        key: 'remark',
        render(row, index) {
          return h(NInput, {
            value: row.remark
          })
        }
      }
    ]

    const updateWindowHeight = () => {
      windowHeight.value = window.innerHeight
    }

    onMounted(() => {
      window.addEventListener('resize', updateWindowHeight)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateWindowHeight)
    })

    return {
      height: '700',
      windowHeight,
      AddSharp,
      needData: [...basicData.value, ...processData.value],
      editData: editData,
      editColumns: editColumns(),
      basicColumns: basicColumns,
      rowKey: (row: field) => row.fieldName,
      handleCheck(rowKeys) {
        checkedRowKeysRef.value = rowKeys
      },
      addEditData() {
        const temObj = cloneDeep(editType)
        temObj.uuid = generateUUID()
        editData.value.push(temObj)
      },
      deleteEditData(){
        editData.value = editData.value.filter(n=>!n.isChecked)
      },
      checkEditDetail(checked){
        editData.value.forEach(item => {
          item.isChecked = !!checked
        })
      },
      addBasicToEditData(){
        editData.value.unshift(...basicData.value)
      },
      addProcessToEditData(){
        editData.value.unshift(...processData.value)
      }
    }
  }
})
</script>

<template>
  <n-grid :x-gap="12" :cols="3" >
    <n-grid-item>
      <n-divider title-placement="left" style="margin-top: 10px">
        也许你需要这些字段
      </n-divider>
      <div style="margin-top: -25px; display: flex; justify-content: flex-end; gap: 10px;">
        <n-button icon-placement="left" secondary strong @click="addBasicToEditData">
          <template #icon>
            <n-icon :component="AddSharp"></n-icon>
          </template>
          {{ '基础' }}
        </n-button>
        <n-button icon-placement="left" secondary strong @click="addProcessToEditData">
          <template #icon>
            <n-icon :component="AddSharp"></n-icon>
          </template>
          {{ '流程' }}
        </n-button>
      </div>
      <n-data-table
          size="small"
          :columns="basicColumns"
          :data="needData"
          :bordered="false"
          :row-key="rowKey"
          style="margin-top: 5px;"
          :style="{ height: `${windowHeight - 100}px` }"
          flex-height
          class="table-font-size"
      />
    </n-grid-item>
    <n-grid-item>
      <n-divider title-placement="left" style="margin-top: 10px">
        最终会生成的
      </n-divider>
      <div style="margin-top: -25px; display: flex; justify-content: flex-end; gap: 10px;">
        <n-button icon-placement="left" secondary strong @click="addEditData">
          <template #icon>
            <n-icon :component="AddSharp"></n-icon>
          </template>
          {{ '新增' }}
        </n-button>
        <n-button icon-placement="left" secondary strong @click="deleteEditData">
          <template #icon>
            <n-icon :component="AddSharp"></n-icon>
          </template>
          {{ '删除' }}
        </n-button>
      </div>
      <div class="table-wrapper" :style="{ maxHeight: `${windowHeight - 100}px` }">
        <NTable class="custom-table" size="small" style="margin-top: 5px">
          <thead>
          <tr>
            <th><n-checkbox @change="checkEditDetail"/></th>
            <th>{{ '字段名称' }}</th>
            <th>{{ '类型' }}</th>
            <th>{{ '对应列表字段' }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(n, i) in editData" :key="i">
            <td><n-checkbox v-model:checked="n.isChecked"/></td>
            <td><NInput v-model:value="n.fieldName" /></td>
            <td><NInput v-model:value="n.fieldType" /></td>
            <td><NInput v-model:value="n.remark" /></td>
          </tr>
          </tbody>
        </NTable>
      </div>
    </n-grid-item>
    <n-grid-item>
      <n-divider title-placement="left" style="margin-top: 10px">
        原表中所存在的
      </n-divider>
      <div style="margin-top: -25px; display: flex; justify-content: flex-end; gap: 10px;">
        <n-button icon-placement="left" secondary strong>
          <template #icon>
            <n-icon :component="AddSharp"></n-icon>
          </template>
          {{ '基础' }}
        </n-button>
        <n-button icon-placement="left" secondary strong>
          <template #icon>
            <n-icon :component="AddSharp"></n-icon>
          </template>
          {{ '流程' }}
        </n-button>
        <n-button icon-placement="left" secondary strong>
          <template #icon>
            <n-icon :component="AddSharp"></n-icon>
          </template>
          {{ '子表' }}
        </n-button>
        <n-button icon-placement="left" secondary strong style="margin-right: 5px">
          <template #icon>
            <n-icon :component="AddSharp"></n-icon>
          </template>
          {{ '所选' }}
        </n-button>
      </div>
      <n-data-table
          size="small"
          :columns="basicColumns"
          :data="needData"
          :bordered="false"
          :row-key="rowKey"
          style="margin-top: 5px;"
          :style="{ height: `${windowHeight - 100}px` }"
          flex-height
          class="table-font-size"
      />
    </n-grid-item>
  </n-grid>
  <n-grid style="height: 26px;background-color: rgba(85, 85, 85, 0.4);"><n-grid-item><span style="color: red;"></span></n-grid-item></n-grid>
</template>

<style scoped>

.table-font-size{
  font-size: 12px;
}

.table-wrapper {
  max-height: 100%;
  overflow-y: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table thead th {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
}

.custom-table thead th {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
}

/* 设置滚动条的宽度和颜色 */
::-webkit-scrollbar {
  width: 8px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background-color: rgba(85, 85, 85, 0.4);
  border-radius: 6px;
}

/* 滚动条滑块悬停样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(85, 85, 85, 0.3);
}
</style>
