declare global {
  type DataKey = string | symbol

  type IBaseModel<TB = any> = {
    $TB: TB
  }
  // type R<T = any> = {
  //   code: number
  //   data: T
  //   success: boolean
  //   message?: string
  //   timestamp?: number
  // }
  // type PageData<T> = {
  //   records: T[]
  //   size: number
  //   current: number
  //   total: number
  //   pages: number
  // }
  // type TreeData<T> = T[]

  type HttpRequest<T = any, P = any> = {
    (data?: P, config?: AxiosRequestConfig<P>): Promise<R<T>>
  }

  type DataIdParam = {
    id: string
  }

  type EnumTypes<T extends string | number> = keyof { [k in T]: unknown }
}

export default {}
