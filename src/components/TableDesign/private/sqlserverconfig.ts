import {ref} from "vue";

export const basicData = ref<field[]>([
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


export const processData = ref<field[]>([
    {fieldName: 'BOE_TYPE_CODE', fieldType: 'varchar(500)', remark: '单据类型-code'},
    {fieldName: 'BOE_TYPE_NAME', fieldType: 'varchar(500)', remark: '单据类型-name'},
    {fieldName: 'OPERATION_TYPE_CODE', fieldType: 'varchar(100)', remark: '业务类型-code'},
    {fieldName: 'OPERATION_TYPE_NAME', fieldType: 'varchar(100)', remark: '业务类型-name'},
    {fieldName: 'BOE_NUM', fieldType: 'varchar(50)', remark: '单据编号'},
    {fieldName: 'FLOW_STATUS', fieldType: 'varchar(228)', remark: '流程状态'}
])



export const typeOptions = [
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
        label: 'datetime',
        value: 'datetime'
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


export const copySql = (editData,tableName):string=>{
    const resultSql = ref('create table ' + tableName.value + '(' + "\n")
    const temSql = ref('')
    editData.value.forEach((n,i)=>{
        if(n.isPrimaryKey){
            if(i == editData.value.length -1){
                temSql.value +=  n.fieldName + "  " + n.fieldType + " " + "identity primary key" + "\n"
            }else{
                temSql.value +=  n.fieldName + "  " + n.fieldType + " " + "identity primary key," + "\n"
            }
        }else{
            if(i == editData.value.length -1){
                temSql.value +=  n.fieldName + "  " + n.fieldType  + "\n"
            }else {
                temSql.value +=  n.fieldName + "  " + n.fieldType + "," + "\n"
            }
        }

    })
    resultSql.value += temSql.value
    resultSql.value = resultSql.value + "\n" +")"

    return resultSql.value
}

export const copySqlRemark = (editData,tableName):string=>{
    const resultSql = ref('')
    const temSql = ref('')
    editData.value.forEach(n=>{
        temSql.value += "exec sp_addextendedproperty 'MS_Description', N'" + n.remark + "', 'SCHEMA', 'dbo', 'TABLE', '" + tableName.value + "', 'COLUMN','" + n.fieldName + "'"
        resultSql.value += temSql.value + "\n" + "go" + "\n\n"
        temSql.value = ''
    })

    return resultSql.value
}



