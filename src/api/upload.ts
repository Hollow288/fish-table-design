import type { BaseResponse } from '@/types'

export class UploadAPI {
  private static UPLOAD_API_PREFIX = 'http://localhost:8999/fish-table-design-api/upload'

  private static EXPORT_API_PREFIX = 'http://localhost:8999/fish-table-design-api/export'

  private static headers = { 'Content-Type': 'multipart/form-data' }

  /**
   * 上传文件
   * @param data 文件数据
   * @param options 上传配置
   *
   * @todo 进度条功能暂未实现
   */
  static uploadFile(data: any, options?: any) {
    return httpRequest.post<any>(this.UPLOAD_API_PREFIX, data, {
      headers: this.headers
    })
  }


  static exportFile(data: any){
    return httpRequest.post(`${this.EXPORT_API_PREFIX}`, {data}, {responseType: 'blob' })
  }


}
