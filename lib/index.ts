import { FormDataTypeEnum, FormTypeEnum, InputTypeEnum } from './src/enums/EEnum'
import { EzBaseModel } from "./src/EzModel";

export type DataKey = string | symbol

export type IBaseModel<TB = any> = {
  $TB: TB
}
export type EnumTypes<T extends string | number> = keyof { [k in T]: unknown }

export declare type FormData<T extends EzBaseModel<T>> = Record<string, unknown> & {
  [key in keyof T]?: T[key]
}
export declare type FormType = EnumTypes<FormTypeEnum>
export declare type FormDataType = EnumTypes<FormDataTypeEnum>
export declare type InputType = EnumTypes<InputTypeEnum>

export type FieldAttrHandler = <T extends EzBaseModel<T>, P = any>(formData: FormData<T>, formType?: FormType) => P

export type FieldHiddenType = boolean | ('list' | 'form' | 'query' | 'edit' | 'add' | 'view')[]
export type FieldDisabledType = boolean | ('form' | 'edit' | 'add' | 'editTable')[]

type ModelStateRequiredAttr<T extends EzBaseModel<T>, P> = { [key in keyof Required<T>]: P } | Record<string, P>
type ModelStatePartialAttr<T extends EzBaseModel<T>, P> = { [key in keyof Partial<T>]: P } | Record<string, P>
type ModelField<T extends EzBaseModel<T>> = ModelStateRequiredAttr<T, string>

type BooleanFlag = string | 'hidden' | 'dict'

export interface ExtFieldOption extends Record<string, any> {
  key?: DataKey
  label?: string
  hidden?: FieldHiddenType
  hiddenHandler?: FieldAttrHandler
  disabled?: FieldDisabledType
  disabledHandler?: FieldAttrHandler
  dataType?: FormDataType
  inputType?: InputType
  inputProps?: Record<string, any>
  queryInputProps?: Record<string, any>
  booleanFlags?: BooleanFlag[]
  dict?: string
  formSpan?: number
  // rule?: EFormItemRule | Array<EFormItemRule>
  // $type$?: T
  render?: (...args: any[]) => any
}

export type FieldOption<T = Record<string, any>> = ExtFieldOption & Partial<T>

export type PartialFieldOption<T extends EzBaseModel> = Partial<T['$TB']>

export type TreeField<T extends EzBaseModel<T>> = {
  pid?: 'parentId' | keyof ModelField<T>
  children?: 'children' | keyof ModelField<T>
}

export declare type ModelParams<T extends EzBaseModel<T>> = Partial<EzModelOptions<T>>

export declare type EzModelOptions<T extends EzBaseModel<T> = EzBaseModel> = {
  modelKey?: DataKey
  name: string
  desc?: string
  api: string
  perms: string | boolean
  fields: ModelStatePartialAttr<T, FieldOption<T>>
  tree?: true | TreeField<T>
}

export declare type EzModelPool = {
  [key: DataKey]: EzModelOptions
}

// type FieldOption<T extends InternalRowData> = FieldOpt<T> & DataTableColumn<T>
export declare type DictDecoratorType = (dict?: string) => PropertyDecorator
export declare type HiddenDecoratorType = <T extends EzBaseModel<T> = EzBaseModel>(
  hiddenType?: FieldHiddenType,
  hiddenHandler?: FieldAttrHandler
) => PropertyDecorator
export declare type DisabledDecoratorType = <T extends EzBaseModel<T> = EzBaseModel>(
  disabledType?: FieldDisabledType,
  disabledHandler?: FieldAttrHandler
) => PropertyDecorator
export declare type DataTypeDecoratorType = (dataType?: FormDataType, inputType?: InputType) => PropertyDecorator

export interface BaseModelConstructor<T extends EzBaseModel = EzBaseModel> extends Function {
  new (...args: any[]): T
  modelKey: DataKey
}

export interface FieldDecorator<T extends EzBaseModel<T> = EzBaseModel> {
  <T extends EzBaseModel<T>>(label?: string | PartialFieldOption<T>, option?: PartialFieldOption<T>): PropertyDecorator
  Hidden: HiddenDecoratorType
  Dict: DictDecoratorType
  Disabled: DisabledDecoratorType
  DataType: DataTypeDecoratorType
}
