<script lang="ts">
import {h, defineComponent,ref} from 'vue'
import {NButton, useMessage, NInput} from 'naive-ui'
import type {DataTableColumns} from 'naive-ui'
import AddSharp from '@vicons/ionicons5/AddSharp'
import {cloneDeep} from 'lodash-es'
// import {AddSharp,TrashBinOutline} from '@vicons/ionicons5/AddSharp'
import Money16Regular from '@vicons/fluent/Money16Regular'

type field = {
  fieldName: string
  fieldType: string
  remark: string
}

const checkedRowKeysRef = ref<[]>([])

const basicData: field[] = [
  {fieldName: 'ROW_GUID', fieldType: 'varchar(64)', remark: 'uid'},
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
]

const processData: field[] = [
  {fieldName: 'BOE_TYPE_CODE', fieldType: 'varchar(500)', remark: '单据类型-code'},
  {fieldName: 'BOE_TYPE_NAME', fieldType: 'varchar(500)', remark: '单据类型-name'},
  {fieldName: 'OPERATION_TYPE_CODE', fieldType: 'varchar(100)', remark: '业务类型-code'},
  {fieldName: 'OPERATION_TYPE_NAME', fieldType: 'varchar(100)', remark: '业务类型-name'},
  {fieldName: 'BOE_NUM', fieldType: 'varchar(50)', remark: '单据编号'},
  {fieldName: 'FLOW_STATUS', fieldType: 'varchar(228)', remark: '流程状态'}
]

const childData: field[] = [
  {fieldName: 'TO_ROW_GUID', fieldType: 'varchar(64)', remark: '主表uid'},
]

const editData = ref<[]>([])


export default defineComponent({
  setup() {
    const message = useMessage()

    const basicType ={
      fieldName: '',
      fieldType: '',
      remark: ''
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
        render (row, index) {
          return h(NInput, {
            value: row.fieldName,
            onUpdateValue (v) {
              editData.value[index].fieldName = v
            }
          })
        }
      },
      {
        title: '类型',
        key: 'fieldType',
        render (row, index) {
          return h(NInput, {
            value: row.fieldType,
            onUpdateValue (v) {
              editData.value[index].fieldType = v
            }
          })
        }
      },
      {
        title: '对应列表字段',
        key: 'remark',
        render (row, index) {
          return h(NInput, {
            value: row.remark,
            onUpdateValue (v) {
              editData.value[index].remark = v
            }
          })
        }
      }
    ]


    return {
      height: '700',
      AddSharp,
      needData: [...basicData, ...processData, ...childData],
      editData,
      editColumns: editColumns(),
      basicColumns: basicColumns,
      rowKey: (row: field) => row.fieldName,
      handleCheck (rowKeys) {
        checkedRowKeysRef.value = rowKeys
      },
      addEditData(){
        debugger
        const temObj = cloneDeep(basicType)
        editData.value.push(temObj)
      }
    }
  }
})
</script>


<template>
  <n-grid :x-gap="12" :y-gap="8" :cols="3">
    <n-grid-item>
      <n-divider title-placement="left" style="margin-top: 10px">
        也许你需要这些字段
      </n-divider>
      <div style="margin-top: -25px; display: flex; justify-content: flex-end; gap: 10px;">

        <n-button icon-placement="left" secondary strong>
          <template #icon>
            <n-icon :component="AddSharp">
              <!--                <AddSharp-icon />-->
            </n-icon>
          </template>
          {{ '基础' }}
        </n-button>

        <n-button icon-placement="left" secondary strong>
          <template #icon>
            <n-icon :component="AddSharp">
            </n-icon>
          </template>
          {{ '流程' }}
        </n-button>

        <n-button icon-placement="left" secondary strong>
          <template #icon>
            <n-icon :component="AddSharp">
            </n-icon>
          </template>
          {{ '子表' }}
        </n-button>

        <n-button icon-placement="left" secondary strong>
          <template #icon>
            <n-icon :component="AddSharp">
            </n-icon>
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
          :style="{ height: `${height}px` }"
          flex-height
      />
    </n-grid-item>
    <n-grid-item>
      <n-divider title-placement="left" style="margin-top: 10px">
        最终会生成的
      </n-divider>
      <div style="margin-top: -25px; display: flex; justify-content: flex-end; gap: 10px;">

        <n-button icon-placement="left" secondary strong>
          <template #icon>
            <n-icon :component="AddSharp" @click="addEditData">
              <!--                <AddSharp-icon />-->
            </n-icon>
          </template>
          {{ '新增' }}
        </n-button>

        <n-button icon-placement="left" secondary strong>
          <template #icon>
            <n-icon :component="AddSharp">
            </n-icon>
          </template>
          {{ '删除' }}
        </n-button>

      </div>

      <n-data-table
          remote
          size="small"
          :columns="editColumns"
          :data="editData"
          :row-key="rowKey"
          style="margin-top: 5px;"
          max-height="650px"
          @update:checked-row-keys="handleCheck"
      />
    </n-grid-item>
    <n-grid-item>
      <n-divider title-placement="left" style="margin-top: 10px">
        原表中所存在的
      </n-divider>
      <n-data-table
          size="small"
          :columns="basicColumns"
          :data="needData"
          :bordered="false"
          :row-key="rowKey"
          style="margin-top: 5px;"
          :style="{ height: `${height}px` }"
          flex-height
      />
    </n-grid-item>
  </n-grid>
</template>



