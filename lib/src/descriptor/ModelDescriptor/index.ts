import { EzBaseModel, setModelState } from '../../EzModel'
import { BaseModelConstructor, DataKey, ModelParams } from '../../../types'

export const Model = <T extends EzBaseModel<T>>(parmas?: DataKey | ModelParams<T>) => {
  return <Class extends BaseModelConstructor>(value: Class, context: ClassDecoratorContext): BaseModelConstructor<T> => {
    console.log('context ---> ', context)
    if (!parmas) {
      parmas = value.name
    }
    if (typeof parmas === 'string' || typeof parmas === 'symbol') {
      setModelState(value, {
        name: parmas.toString()
      })
    } else {
      setModelState(value, parmas as ModelParams<T>)
    }

    return value
  }
}
