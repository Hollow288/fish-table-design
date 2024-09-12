export class TableDesignAPI {
    private static BASIC_API_PREFIX = 'http://localhost:8999/fish-table-design-api/tableDesign'


    private static headers = { 'Content-Type': 'multipart/form-data' }


    static tableDesignByTableName(tableName: string,dataBase: string) {
        return httpRequest.get(`${this.BASIC_API_PREFIX}/${tableName}/${dataBase}`)
    }


    static tableDesignByTranslate(fieldName: string) {
        return httpRequest.get(`${this.BASIC_API_PREFIX}/translate/${fieldName}`)
    }


}