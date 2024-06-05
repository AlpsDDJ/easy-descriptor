import {FormDataTypeEnum, FormTypeEnum, InputTypeEnum} from "../enums";

export type * from '../descriptor/AxiosDescriptor/types'

export type DataKey = string | symbol

export default class IBaseModel<T extends IBaseModel<T> = IBaseModel<any>, TB extends ExtFieldOption = FieldOption> {
    $TB?: TB
    declare static modelKey: DataKey
}

export type EnumTypes<T extends string | number> = keyof { [k in T]: unknown }

export declare type IFormData<T extends IBaseModel<T>> = Record<string, unknown> & {
    [key in keyof T]?: T[key]
}
export declare type FormType = EnumTypes<FormTypeEnum>
export declare type FormDataType = EnumTypes<FormDataTypeEnum>
export declare type InputType = EnumTypes<InputTypeEnum>

export type FieldAttrHandler<P = any, T extends IBaseModel<T> = IBaseModel> = (formData: IFormData<T>, formType?: FormType) => P

export type FieldHiddenType = boolean | ('list' | 'form' | 'query' | 'edit' | 'add' | 'view')[]
export type FieldDisabledType = boolean | ('form' | 'edit' | 'add' | 'editTable')[]

type ModelStateRequiredAttr<T extends IBaseModel<T>, P> = { [key in keyof Required<T>]: P } | Record<string, P>
type ModelStatePartialAttr<T extends IBaseModel<T>, P> = { [key in keyof Partial<T>]: P } | Record<string, P>
type ModelField<T extends IBaseModel<T>> = ModelStateRequiredAttr<T, string>

type BooleanFlag = string | 'hidden' | 'dict'

export interface ExtFieldOption extends Record<string, any> {
    key?: DataKey
    label?: string
    hidden?: FieldHiddenType
    hiddenHandler?: FieldAttrHandler<boolean>
    disabled?: FieldDisabledType
    disabledHandler?: FieldAttrHandler<boolean>
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

export type PartialFieldOption<T extends IBaseModel> = Partial<T['$TB']>

export type TreeField<T extends IBaseModel<T>> = {
    pid?: 'parentId' | keyof ModelField<T>
    children?: 'children' | keyof ModelField<T>
}

export declare type ModelParams<T extends IBaseModel<T>> = Partial<EzModelOptions<T>>

export declare type EzModelOptions<T extends IBaseModel<T> = IBaseModel> = {
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
export declare type DictDecoratorType = (dict?: string) => PropertyDecorator
export declare type HiddenDecoratorType = (
    hiddenType?: FieldHiddenType,
    hiddenHandler?: FieldAttrHandler<boolean>
) => PropertyDecorator
export declare type DisabledDecoratorType = (
    disabledType?: FieldDisabledType,
    disabledHandler?: FieldAttrHandler<boolean>
) => PropertyDecorator
export declare type DataTypeDecoratorType = (dataType?: FormDataType, inputType?: InputType) => PropertyDecorator

export interface BaseModelConstructor<T extends IBaseModel = IBaseModel> extends Function {
    new(...args: any[]): T

    modelKey: DataKey
}

export interface FieldDecorator<T extends IBaseModel<T> = IBaseModel> {
    <T extends IBaseModel<T>>(label?: string | PartialFieldOption<T>, option?: PartialFieldOption<T>): PropertyDecorator

    Hidden: HiddenDecoratorType
    Dict: DictDecoratorType
    Disabled: DisabledDecoratorType
    DataType: DataTypeDecoratorType
}
