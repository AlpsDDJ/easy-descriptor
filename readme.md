## 安装
```shell
npm i easy-descriptor
```
```shell
yarn add easy-descriptor
```
```shell
pnpm i easy-descriptor
```
## @Model 装饰器示例

```typescript
import type {FieldOption} from "easy-descriptor";
import {EzBaseModel, Field, Model, useModelOptions} from "easy-descriptor";

/**
 * 定义一个带有自定义属性test的字段选项类型
 */
interface TestFieldOptions {
    test?: string
}

/**
 * 扩展FieldOption接口，定义一个带有自定义属性test2的字段选项类型
 */
interface ElFieldOptions extends FieldOption<TestFieldOptions> {
    test2?: number
}

/**
 * 基础模型类，继承自EzBaseModel，泛型T约束为BaseModel的子类型或BaseModel<any>
 */
export class BaseModel<T extends BaseModel<T> = BaseModel<any>> extends EzBaseModel<T, ElFieldOptions> {
    @Field('ID')
    // 标记当前字段为隐藏字段
    @Field.Hidden()
    id?: number

    @Field('创建时间')
    @Field.Hidden()
    createTime?: string
}

@Model()
export class ModelTest extends BaseModel<ModelTest> {
    // Field未指定泛型，自定义属性test无法推断typescript类型
    @Field('名称', {test: '123'})
    name?: string

    // Field指定泛型为BaseModel，可以推断出自定义属性test的类型为string
    @Field<BaseModel>('年龄', {test: 'sd', test2: 123, label: 'age', hidden: false, labelWidth: 120})
    age?: number
}


/**
 * 使用useModelOptions获取SysUser模型的jsonschema
 */
export const jsonSchema = useModelOptions(ModelTest)
console.log('jsonSchema = ', jsonSchema)

```
```
userJsonSchema: {"fields":{"id":{"hidden":true,"label":"ID","key":"id"},"createTime":{"label":"创建时间","key":"createTime"},"name":{"email":"123","label":"名称","key":"name"},"age":{"email":"sd","label":"年龄","hidden":false,"labelWidth":120,"key":"age"}},"perms":"sys-user","api":"sys/user","name":"SysUser"}
```

## @Axios 装饰器示例
```typescript
import type {AxiosDescriptorConfig, HttpRequest} from "easy-descriptor";
import {Axios, AxiosDescriptorBuilder, Get, Http} from "easy-descriptor";
import axios, {AxiosInstance} from "axios";

/**
 * 定义一个MyAxiosDescriptorConfig类，用于配置默认Axios实例。
 * 该类实现了AxiosDescriptorConfig接口。
 */
@AxiosDescriptorBuilder()
export class MyAxiosDescriptorConfig implements AxiosDescriptorConfig {
    // 可选的Axios实例，默认使用空配置创建一个Axios实例
    http?: AxiosInstance = axios.create({})
}

/**
 * 定义一个MyAxiosDescriptorConfig1类，用于配置带有基础URL的Axios实例。
 * 该类实现了AxiosDescriptorConfig接口。
 */
@AxiosDescriptorBuilder('axios1')
export class MyAxiosDescriptorConfig1 implements AxiosDescriptorConfig {
    // 可选的Axios实例，使用指定的基础URL创建一个Axios实例
    http?: AxiosInstance = axios.create({
        baseURL: 'https://cn.bing.com'
    })
}

/**
 * 使用Axios装饰器和Http装饰器定义一个TestAxios类。
 */
@Axios('https://cn.bing.com/rp')
export class TestAxios {
    // 通过Get装饰器定义一个动态URL的httpGet方法
    @Get('/mSXQPT7e1TlMt8h0fagSrjh90gY.br.{ext}')
    declare httpGet: HttpRequest
}

/**
 * 使用Axios装饰器和Http装饰器定义一个TestAxios1类。该类下的所有请求方法都使用指定的Axios实例[axios1]发送请求。
 */
@Axios('/rp', 'axios1')
export class TestAxios1 {
    // 通过Http装饰器定义一个静态URL的静态方法staticGet
    @Http({url: '/mSXQPT7e1TlMt8h0fagSrjh90gY.br.js'})
    static staticGet: HttpRequest
}

// 使用TestAxios类的静态方法staticGet发送请求
TestAxios1.staticGet().then((resp: any) => {
    console.log('staticGet: ', resp.data)
})

// 创建TestAxios实例，并使用实例方法httpGet发送请求
const testAxios = new TestAxios()
// url地址包含展位参数: ext,请求参数添加相应的数据: {ext: 'js'}
testAxios.httpGet({ext: 'js'}).then((resp: any) => {
    console.log('httpGet: ', resp.data)
})
```