import {AxiosDecorator} from "./types";
import {AxiosInstance, AxiosRequestConfig} from "axios";
import {cloneDeep} from "lodash-es";
import {httpRequest, AxiosDescriptorBuilder} from "./request";

const Axios: AxiosDecorator = (path?: string, axiosInstance?: string | AxiosInstance) => {
    return (constructor) => {
        constructor.prototype.path = path || ''
        axiosInstance && (constructor.prototype.axiosInstance = axiosInstance)
        return constructor
    }
}

const Http = (config: AxiosRequestConfig) => {
    return function (target: any, propertyKey: string): any {
        const isStatic = typeof target === 'function'

        if (isStatic) {
            target[propertyKey] = (data: any, _conf = {}) => {

                const httpConfig = cloneDeep({ ...config, ..._conf })
                const module = target.prototype.path
                const axiosInstance = target.prototype.axiosInstance
                httpConfig.url = module + httpConfig.url
                return httpRequest(data, httpConfig, axiosInstance)
            }
        } else {
            Object.defineProperty(target, propertyKey, {
                get() {
                    return (data: any, _conf = {}) => {
                        const httpConfig = cloneDeep({ ...config, ..._conf })
                        const module = target.constructor.prototype.path + (this.modelPath || '')
                        const axiosInstance = target.constructor.prototype.axiosInstance
                        httpConfig.url = module + httpConfig.url
                        return httpRequest(data, httpConfig, axiosInstance)
                    }
                },
                set(v: any) {
                    this[propertyKey] = v
                }
            })
        }
    }
}

const Get = (url = '', config: AxiosRequestConfig = {}) => {
    const httpConfig = Object.assign(config, {
        url,
        method: 'GET'
    } as AxiosRequestConfig)
    return Http(httpConfig)
}

const Post = (url = '', config: AxiosRequestConfig = {}) => {
    const httpConfig = Object.assign(config, {
        url,
        method: 'POST'
    } as AxiosRequestConfig)
    return Http(httpConfig)
}

const Put = (url = '', config: AxiosRequestConfig = {}) => {
    const httpConfig = Object.assign(config, {
        url,
        method: 'PUT'
    } as AxiosRequestConfig)
    return Http(httpConfig)
}

const Delete = (url = '', config: AxiosRequestConfig = {}) => {
    const httpConfig = Object.assign(config, {
        url,
        method: 'DELETE'
    } as AxiosRequestConfig)
    return Http(httpConfig)
}

export { Axios, Http, Get, Post, Put, Delete, AxiosDescriptorBuilder }