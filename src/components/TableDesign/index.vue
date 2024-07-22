<script lang="ts">
import {h, defineComponent, ref, onMounted, onBeforeUnmount, watch, reactive} from 'vue'
import {NButton, useMessage, NInput, UploadFileInfo} from 'naive-ui'
import type {DataTableColumns,MentionOption} from 'naive-ui'
import AddSharp from '@vicons/ionicons5/AddSharp'
import Search from '@vicons/ionicons5/Search'
import KeyOutline from '@vicons/ionicons5/KeyOutline'
import TrashBinOutline from '@vicons/ionicons5/TrashBinOutline'
import CloudUploadOutline from '@vicons/ionicons5/CloudUploadOutline'
import CloudDownloadOutline from '@vicons/ionicons5/CloudDownloadOutline'
import ClipboardOutline from '@vicons/ionicons5/ClipboardOutline'
import LanguageOutline from '@vicons/ionicons5/LanguageOutline'
import {cloneDeep} from 'lodash-es'
import {TableDesignAPI} from "@/api/tableDesign";

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
  isChecked: boolean,
  isPrimaryKey: boolean
}

const editData = ref<editField[]>([])

const origData = ref<field[]>([])

const checkedRowKeysRef = ref<[]>([])

const translationRequired = ref<string>('')

const translationResult = ref<string>('')

const fileList = ref<UploadFileInfo[]>([])

const fileListRef = ref([])


const queryParams = reactive({
  searchTableText: '',
  searchFieldText: ''
})

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


const submitLoading = ref(false)


const generateUUID = ()=> {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}




export default defineComponent({
  components:{
    KeyOutline,TrashBinOutline
  },
  setup() {
    const message = useMessage()


    const windowHeight = ref(window.innerHeight)

    const editType = {
      fieldName: '',
      fieldType: '',
      remark: '',
      uuid:'',
      isChecked:false,
      isPrimaryKey:false
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


    const nameOptions = [
      {
        label: 'ID',
        value: 'ID'
      },
      {
        label: 'CODE',
        value: 'CODE'
      },
      {
        label: 'NAME',
        value: 'NAME'
      }
    ]


    const typeOptions = [
      {
        label: 'int',
        value: 'int'
      },
      {
        label: 'numeric(18, 2)',
        value: 'numeric(18, 2)'
      },
      {
        label: 'numeric(18, 6)',
        value: 'numeric(18, 6)'
      },
      {
        label: 'varchar(100)',
        value: 'varchar(100)'
      },
      {
        label: 'varchar(200)',
        value: 'varchar(200)'
      },
      {
        label: 'varchar(500)',
        value: 'varchar(500)'
      },
      {
        label: 'varchar(3000)',
        value: 'varchar(3000)'
      },
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

    const optionsRef = ref<MentionOption[]>([])


    const handleChange = (options: { fileList: UploadFileInfo[] }) => {
      const files = options.fileList.map(item => item.file)
      fileListRef.value = files.filter((n, index) => index === files.length - 1)
      const fileData = new FormData()
      fileListRef.value.forEach(file => {
        fileData.append('file', file)
      })
      UploadAPI.uploadFile(fileData).then(result=>{
        if(result.status == '200'){
          if(result.data.status == '200'){
            editData.value = result.data.data
            message.success('导入成功')
          }else{
            message.error(result.data.message)
          }
        }else{
          message.error('出错了')
        }
      })

    }


    const exportFile = () =>{

      UploadAPI.exportFile(editData.value).then(result => {

        const blob = result.data;
        // 创建一个临时 URL
        const url = window.URL.createObjectURL(blob);

        // 创建一个下载链接
        const a = document.createElement('a');
        a.href = url;
        a.download = `output.docx`; // 设置下载的文件名
        a.target = '_blank';

        // 触发点击事件，开始下载
        document.body.appendChild(a);
        a.click();

        // 清理临时 URL
        window.URL.revokeObjectURL(url);
        message.success(`导出成功：output.docx`);
      })
    }


    watch(editData, (newVal, oldVal) => {
      newVal.forEach(item => {
        if (item.fieldName) {
          item.fieldName = item.fieldName.replace(/\s+/g, '').toUpperCase();
        }
      })
    }, { deep: true })

    return {
      height: '700',
      windowHeight,
      AddSharp,
      Search,
      TrashBinOutline,
      CloudUploadOutline,
      queryParams,
      submitLoading,
      handleChange,
      CloudDownloadOutline,
      ClipboardOutline,
      LanguageOutline,
      fileList,
      origData,
      exportFile,
      translationRequired,
      translationResult,
      needData: [...basicData.value, ...processData.value],
      editData: editData,
      editColumns: editColumns(),
      basicColumns: basicColumns,
      nameOptions: optionsRef,
      typeOptions: typeOptions,
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
          item.isChecked = checked
        })
      },
      addBasicToEditData(){
        editData.value.unshift(...basicData.value)
      },
      addProcessToEditData(){
        editData.value.unshift(...processData.value)
      },
      nameHandleSearch (_: string, prefix: string) {
        if (prefix === '_') {
          optionsRef.value = nameOptions
        }
      },
      getRowStyle(row){
        return {
          backgroundColor: row.isPrimaryKey ? 'green' : ''
        };
      },
      setPrimaryKeyDblClick(n){
        n.isPrimaryKey = !n.isPrimaryKey
        n.isChecked = false
      },
      searchTableByName(){origData
        //
        TableDesignAPI.tableDesignByTableName(queryParams.searchTableText).then(result=>{
          if(result.status == 200){
            if(result.data.length > 0){
              origData.value = result.data
              message.success("搜索成功")
            }else{
              message.warning("没查到啊")
            }

          }else{
            message.error("出错了")
          }

        })

      },
      searchFieldByName(){
        message.info("2222")
      },
      generateResults(){
        translationResult.value = "h.select("+translationRequired.value+")"
      },
      copyResult(){
        navigator.clipboard.writeText(translationResult.value).then(() => {
          message.success('文本已复制到剪贴板');
        }).catch(err => {
          message.error('复制失败: ' + err);
        });
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
          :style="{ height: `${windowHeight - 400}px` }"
          flex-height
          class="table-font-size"
      />
      <n-divider title-placement="left" style="margin-top: 10px">
        翻译
      </n-divider>
      <div style=" margin-top: -15px; display: flex;">
        <div style="width: 50%;">
          <NInput
              v-model:value="translationRequired"
              placeholder="翻译"
              @keydown.enter="generateResults"
          >
            <template #suffix>
              <NIcon :component="LanguageOutline" @click="generateResults" style="cursor: pointer;" />
            </template>
          </NInput>
        </div>
        <div style="width: 50%;">
          <NInput
              v-model:value="translationResult"
              placeholder="结果"
              @keydown.enter="copyResult"
          >
            <template #suffix>
              <NIcon :component="ClipboardOutline" @click="copyResult" style="cursor: pointer;" />
            </template>
          </NInput>
        </div>
      </div>
      <n-divider title-placement="left" style="margin-top: 10px">
        其他辅助
      </n-divider>
      <div style="height: 50px; margin-top: -15px; display: flex;">
        <div style="width: 50%;">
          <n-button icon-placement="left" secondary strong style="margin-right: 5px">
            <template #icon>
              <n-icon :component="AddSharp"></n-icon>
            </template>
            {{ '复制最终SQL' }}
          </n-button>
        </div>
        <div style="width: 50%;">
        </div>
      </div>

    </n-grid-item>
    <n-grid-item >
      <n-divider title-placement="left" style="margin-top: 10px">
        最终会生成的
      </n-divider>
      <div style="margin-top: -25px; display: flex; justify-content: flex-end; gap: 10px;">
        <n-button icon-placement="left" secondary strong @click="exportFile">
          <template #icon>
            <n-icon :component="CloudDownloadOutline"></n-icon>
          </template>
          {{ '导出' }}
        </n-button>
        <n-upload
            v-model:file-list="fileList"
            ref="upload"
            @change="handleChange"
            :show-file-list="false"
        >
          <n-button icon-placement="left" secondary strong >
            <template #icon>
              <n-icon :component="CloudUploadOutline"></n-icon>
            </template>
            {{ '导入' }}
          </n-button>
        </n-upload>
        <n-button icon-placement="left" secondary strong @click="addEditData">
          <template #icon>
            <n-icon :component="AddSharp"></n-icon>
          </template>
          {{ '新增' }}
        </n-button>
        <n-button icon-placement="left" secondary strong @click="deleteEditData">
          <template #icon>
            <n-icon :component="TrashBinOutline"></n-icon>
          </template>
          {{ '删除' }}
        </n-button>
      </div>
      <div class="table-wrapper" :style="{ maxHeight: `${windowHeight - 100}px` }">
        <NTable class="custom-table" size="small" style="margin-top: 5px">
          <thead>
          <tr  >
            <th><n-checkbox @change="checkEditDetail"/></th>
            <th>{{ '字段名称' }}</th>
            <th>{{ '类型' }}</th>
            <th>{{ '对应列表字段' }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(n, i) in editData" :key="i" @dblclick="setPrimaryKeyDblClick(n)" >
            <td><n-checkbox v-model:checked="n.isChecked" v-if="!n.isPrimaryKey"/>  <n-icon size="15" v-else><key-outline/></n-icon></td>
            <td><n-mention v-model:value="n.fieldName" :options="nameOptions" :prefix="['_']" @search="nameHandleSearch"/></td>
            <td><n-select v-model:value="n.fieldType" filterable tag :options="typeOptions" /></td>
            <td><NInput v-model:value="n.remark" placeholder=""/></td>
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
        <NInput
            v-model:value="queryParams.searchTableText"

            clearable
            placeholder="表名"
            @keydown.enter="searchTableByName"
        >
          <template #suffix>
              <NIcon :component="Search" @click="searchTableByName" style="cursor: pointer;"/>
          </template>
        </NInput>
        <NInput
            v-model:value="queryParams.searchFieldText"
            clearable
            placeholder="字段/备注"
            @keydown.enter=""
        >
          <template #suffix>
            <NIcon :component="Search" @click="searchFieldByName" style="cursor: pointer;"
            />
          </template>
        </NInput>
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
          :data="origData"
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
