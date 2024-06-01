import {AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults} from "axios";

export declare type AxiosDecorator = (path?: string, axiosInstance?: string | AxiosInstance) => ClassDecorator
export declare type HttpRequest<T = any, P = any> = (data?: P, config?: AxiosRequestConfig<P>, axiosInstance?: string | AxiosInstance) => Promise<T>

export declare type HttpRequestParam<T = any, P = any> = Parameters<HttpRequest<T, P>>


export declare interface AxiosDescriptorConfig extends CreateAxiosDefaults {
    http?: AxiosInstance
}

export declare interface AxiosDescriptorConfigConstructor<T extends AxiosDescriptorConfig = AxiosDescriptorConfig> extends Function {
    new(): T
}