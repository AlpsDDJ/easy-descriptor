import EzBaseModel, {BaseModelConstructor, DataKey, ModelParams} from "../../types/EasyDescriptorTypes";
import {setModelState} from "../../hooks/useModelOptions";

export const Model = <T extends EzBaseModel<T>>(parmas?: DataKey | ModelParams<T>) => {
  return <Class extends BaseModelConstructor>(value: Class): BaseModelConstructor<T> => {
    if (!parmas) {
      parmas = value.name
    }
    if (typeof parmas === 'string' || typeof parmas === 'symbol') {
      setModelState(value, {
        name: parmas.toString()
      })
    } else {
      setModelState(value, parmas as any)
    }

    return value as unknown as BaseModelConstructor<T>
  }
}
