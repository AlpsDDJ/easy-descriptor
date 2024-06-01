import {AxiosDescriptorConfigConstructor, HttpRequest, HttpRequestParam} from "./types";
import axios, {AxiosInstance} from "axios";

const AXIOS_INSTANCE_POOL: Record<string, AxiosInstance> = {}

export function httpRequest<T = any, P = any>(...[data, config = {}, axiosInstance]: HttpRequestParam<T, P>): ReturnType<HttpRequest<T, P>> {
    const method = config.method?.toUpperCase() || 'GET'
    config.method = method
    if (data) {
        config[['DELETE', 'GET'].some((key) => key === method) ? 'params' : 'data'] = data
        if (config.url) {
            config.url = config.url.replace(/{\s*(.*?)\s*}/g, (_, objKey: keyof typeof data) => {
                const val = data[objKey]
                if (val === undefined) {
                    throw new Error(`${config.url} 缺少参数: [${objKey.toString()}]`)
                }
                // 删除URL中匹配的参数
                delete data[objKey]
                return encodeURIComponent(val as any)
            })
        }
    }
    if (typeof axiosInstance === 'string') {
        const http = AXIOS_INSTANCE_POOL[axiosInstance];
        if (!http) {
            throw new Error(`未找到[${axiosInstance}]的axios实例`)
        }
        return http<P, T>(config || {})
    } else if (!!axiosInstance) {
        return axiosInstance<P, T>(config || {})
    } else {
        const http = AXIOS_INSTANCE_POOL['default'];
        if (!http) {
            throw new Error('未找到默认的axios实例')
        }
        return http<P, T>(config || {})
    }

}

export const AxiosDescriptorBuilder = (name?: string) => {
    return <Class extends AxiosDescriptorConfigConstructor>(value: Class): AxiosDescriptorConfigConstructor => {
        const {http, ...axiosConfig} = new value()
        if (http) {
            AXIOS_INSTANCE_POOL[name || 'default'] = http
        } else {
            axios.create(axiosConfig || {})
        }
        return value
    }
}