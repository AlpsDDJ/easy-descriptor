import type {BaseModelConstructor, DataKey, ModelParams} from "../../types";
import IBaseModel from "../../types";
import {setModelState} from "../../hooks/useModelOptions";

export const Model = <T extends IBaseModel<T>>(parmas: DataKey | ModelParams<T>) => {
  return <Class extends BaseModelConstructor>(value: Class): BaseModelConstructor<T> => {
    // if (!parmas) {
    //   parmas = value.name
    // }
    if (typeof parmas === 'string' || typeof parmas === 'symbol') {
      !value.modelKey && (value.modelKey = parmas)
      setModelState(value, {
        name: parmas.toString()
      })
    } else {
      !value.modelKey && parmas.name && (value.modelKey = parmas.name)
      setModelState(value, parmas as any)
    }

    return value as unknown as BaseModelConstructor<T>
  }
}

export {setModelState}