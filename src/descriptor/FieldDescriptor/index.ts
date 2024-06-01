import type {
  BaseModelConstructor,
  DataKey,
  DataTypeDecoratorType,
  DictDecoratorType,
  DisabledDecoratorType,
  FieldAttrHandler,
  FieldDecorator,
  FieldDisabledType,
  FieldHiddenType,
  FieldOption,
  FormDataType,
  HiddenDecoratorType,
  InputType,
  PartialFieldOption
} from '../../types'
import {FormDataTypeEnum, InputTypeEnum} from "../../enums";
import { cloneDeep } from 'lodash-es'
import { getModelState, setModelState } from '../../hooks/useModelOptions'
import EzBaseModel from "../../types";

/**
 * 定义一个隐藏装饰器，用于标记对象属性是否隐藏以及如何处理隐藏状态。
 *
 * @param hiddenType 确定字段是否隐藏的标志，默认为 true 表示隐藏。它可以是一个布尔值或一个函数，函数接收当前字段值和整个对象值作为参数，返回一个布尔值决定是否隐藏。
 * @param hiddenHandler 可选的属性处理函数，当字段被隐藏时调用。该函数接收当前字段值和整个对象值作为参数，无返回值。
 * @returns 返回一个属性装饰器，用于将隐藏逻辑应用到目标对象的属性上。
 */
const Hidden: HiddenDecoratorType = (hiddenType: FieldHiddenType = true, hiddenHandler?: FieldAttrHandler): PropertyDecorator => {
  return (target: Object, propertyKey: DataKey): void => {
    const constructor = target.constructor as BaseModelConstructor
    // 设置字段的隐藏属性，包括隐藏标志和处理函数
    setFieldProperty(constructor, propertyKey, { hidden: hiddenType, hiddenHandler })
  }
}

/**
 * 定义一个只读字段属性的装饰器。
 * 该装饰器用于标记类的属性为只读，并可以根据条件禁用该属性。
 * @param disabledType 禁用类型的值，默认为true，表示始终禁用。也可以使用函数进行条件判断。
 * @param disabledHandler 可选的属性，当字段被禁用时调用的处理函数。
 * @returns 返回一个属性装饰器（PropertyDecorator），用于修饰类的属性。
 */
const Disabled: DisabledDecoratorType = (disabledType: FieldDisabledType = true, disabledHandler?: FieldAttrHandler): PropertyDecorator => {
  // 装饰器函数，用于设置属性的只读和禁用状态。
  return (target: Object, propertyKey: DataKey): void => {
    // 获取目标对象的状态。
    const constructor = target.constructor as BaseModelConstructor
    // 设置字段属性，包括禁用状态和禁用处理函数。
    setFieldProperty(constructor, propertyKey, { disabled: disabledType, disabledHandler: disabledHandler })
  }
}

/**
 * 定义一个字典装饰器，用于在类的属性上标注字典信息，以便于在前端界面进行数据展示时使用。
 * @param dict 可选参数，指定字典的名称。
 * @returns 返回一个属性装饰器函数。
 */
const Dict: DictDecoratorType = (dict?: string): PropertyDecorator => {
  return (target: Object, propertyKey: DataKey): void => {
    // 获取目标对象的状态
    const constructor = target.constructor as BaseModelConstructor
    // 定义字典渲染函数，该函数将根据行对象获取对应的字典值。
    const dictRender = (row: any) => {
      return row[`${propertyKey as string}_dict`]
    }
    // 设置字段属性，包括字典名称和渲染函数，以便在界面渲染时使用。
    setFieldProperty(constructor, propertyKey, { dict: dict || (propertyKey as string), render: dictRender })
  }
}

/**
 * 设置字段的类型和输入类型
 *
 * @param dataType - 字段的数据类型，默认为字符串类型。可选类型由`FormDataType`枚举定义。
 * @param inputType - 字段的输入类型，默认为文本输入类型。可选类型由`InputType`接口定义。
 * @returns 无返回值。此装饰器用于类的属性上，用于在运行时修改属性的元数据。
 */
const DataType: DataTypeDecoratorType = (dataType: FormDataType = FormDataTypeEnum.STRING, inputType?: InputType) => {
  return (target: Object, propertyKey: DataKey): void => {
    const constructor = target.constructor as BaseModelConstructor
    // 获取目标对象的状态
    // const state = getModelState(constructor)
    let it: InputType
    // 根据dataType选择或定义默认的inputType
    switch (dataType) {
      case FormDataTypeEnum.NUMBER:
        it = inputType || InputTypeEnum.INPUT_NUMBER
        break
      case FormDataTypeEnum.DATE:
        it = inputType || InputTypeEnum.DATE
        break
      case FormDataTypeEnum.TIME:
        it = inputType || InputTypeEnum.TIME
        break
      case FormDataTypeEnum.DATETIME:
        it = inputType || InputTypeEnum.DATETIME
        break
      case FormDataTypeEnum.BOOLEAN:
        it = inputType || InputTypeEnum.SWITCH
        break
      default:
        it = inputType || InputTypeEnum.TEXT
        break
    }
    // 设置字段的属性，包括数据类型和输入类型
    setFieldProperty(constructor, propertyKey, { dataType: dataType, inputType: it })
  }
}

/**
 * 创建一列的配置信息。
 *
 * @param key 数据键，用于标识列。类型为 `DataKey`，在函数内部被转换为字符串类型。
 * @param optionTemp 列的部分字段选项，是一个泛型参数 `T` 的 `FieldOption` 的部分属性。
 * @returns 返回一个完整的 `FieldOption<T>` 对象，包含传入的 `optionTemp` 属性、`key` 作为键名和 `optionTemp.label` 作为标题。
 */
function createColunm<T extends EzBaseModel<T>>(key: DataKey, optionTemp: PartialFieldOption<T>): T['$TB'] {
  // 使用展开运算符将 `optionTemp` 的属性与默认的 `key` 和 `title` 属性合并
  return {
    ...optionTemp,
    key: key // 显式类型转换，确保 `key` 被视为字符串
    // title: optionTemp.label // 使用 `optionTemp` 中的 `label` 作为列的标题
  }
}

export function setFieldProperty<T extends EzBaseModel<T>>(constructor: BaseModelConstructor<T>, key: DataKey, property: PartialFieldOption<T>): void {
  const state = getModelState(constructor)
  // @ts-ignore
  const props = state?.['fields']?.[key.toString()] || {} // 获取当前字段的属性，如果不存在则默认为空对象
  const fields = { ...state?.['fields'], [key]: { ...props, ...property } } // 将传入的属性与当前属性合并并更新字段
  setModelState(constructor, { fields })
}

export const Field: FieldDecorator = (() => {
  const fn: FieldDecorator = <T extends EzBaseModel<T>>(label?: string | PartialFieldOption<T>, option?: PartialFieldOption<T>) => {
    // 初始化一个临时的字段配置对象
    let optionTemp: FieldOption = cloneDeep(option || {})

    // 如果传入了booleanFlags，将其设置为true
    if (option?.booleanFlags) {
      option?.booleanFlags?.forEach((item: string): void => {
        optionTemp[item] = true
      })
    }
    // 处理label参数，如果是字符串，则设置为label属性；如果是对象，则直接覆盖optionTemp
    if (typeof label === 'string') {
      optionTemp.label = label as string
    } else if (label) {
      optionTemp = cloneDeep(label)
    }

    // 返回装饰器函数，将字段配置应用到目标类的属性上
    return (target: Object, propertyKey: DataKey): void => {
      // 获取目标对象的状态
      const constructor = target.constructor as BaseModelConstructor<T>
      // const state: EzModelOptions<T> = getModelState(constructor)
      // 根据配置创建字段定义
      const colunm: FieldOption<T['$TB']> = createColunm(propertyKey, optionTemp)
      // 将字段定义设置到目标对象的状态中
      setFieldProperty<T>(constructor, propertyKey, colunm)
    }
  }
  fn.Hidden = Hidden
  fn.Dict = Dict
  fn.Disabled = Disabled
  fn.DataType = DataType
  return fn
})()
