import type {
    BaseModelConstructor,
    EzModelOptions,
    EzModelPool,
    ModelParams,
    TreeField
} from '../types'
import IBaseModel from "../types";
import {assign, cloneDeep, snakeCase, uniqueId} from 'lodash-es'

const EZ_MODEL_POOL: EzModelPool = {}
export const getEzModelPool = () => {
    return cloneDeep(EZ_MODEL_POOL)
}


export const useModelOptions = <T extends IBaseModel<T>>(instance: BaseModelConstructor<T>): EzModelOptions<T> => {
    return EZ_MODEL_POOL[instance.modelKey] as EzModelOptions<T>
}

export const setModelState = <T extends IBaseModel>(constructor: BaseModelConstructor<T>, state: ModelParams<T>) => {
    const modelName = state.name || constructor.name
    const snakeCaseName: string = snakeCase(modelName)
    // @ts-ignore
    state['perms'] = state['perms'] || snakeCaseName.replace(/_+/g, '-')
    // @ts-ignore
    state['api'] = state['api'] || snakeCaseName.replace(/_+/g, '/')
    const {tree} = state

    const defaultTreeField: TreeField<T> = {
        pid: 'parentId',
        children: 'children'
    }
    if (tree === true) {
        state['tree'] = defaultTreeField
    } else if (tree) {
        state['tree'] = {
            ...defaultTreeField,
            ...tree
        }
    }

    const baseModelKey = 'BaseModel'
    if (!constructor.modelKey) {
        constructor.modelKey = baseModelKey
    } else if (constructor.modelKey === baseModelKey && modelName !== baseModelKey) {
        constructor.modelKey = uniqueId(`${modelName}_`)
    }
    const mk = constructor.modelKey
    EZ_MODEL_POOL[mk] = assign(EZ_MODEL_POOL[mk] || {}, state)
}

export const getModelState = <T extends IBaseModel>(constructor: BaseModelConstructor<T>) => {
    return EZ_MODEL_POOL[constructor.modelKey] as EzModelOptions<T>
}
