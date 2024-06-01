# 安装
### npm
```console
npm i easy-descriptor
```
### yarn
```console
yarn add easy-descriptor
```
### pnpm
```console
pnpm i easy-descriptor
```
# 装饰器示例

```typescript
import {EzBaseModel, Field, useModelOptions} from "easy-descriptor";

/**
 * 定义一个带有自定义属性test的字段选项类型
 */
type TestFieldOptions = {
    test?: string
}
/**
 * 扩展FieldOption接口，引入TestFieldOptions作为可用字段选项
 */
interface ElFieldOptions extends FieldOption<TestFieldOptions> {}

/**
 * 定义一个基础模型类，扩展了EzBaseModel，允许添加jsonschema属性
 * @template T 继承自BaseModel的类型
 */
class BaseModel<T extends BaseModel<T> = BaseModel<any>> extends EzBaseModel<T, ElFieldOptions> {
    /**
     * 定义模型的ID字段，隐藏字段
     */
    @Field('ID')
    // 标记当前字段为隐藏字段
    @Field.Hidden()
    id?: number
    @Field('创建时间')
    @Field.Hidden()
    createTime?: string
}

/**
 * 定义一个系统用户模型，继承自BaseModel
 */
@Model()
class SysUser extends BaseModel<SysUser> {
    /**
     * Field未指定泛型，自定义属性test无法推断typescript类型
     */
    @Field('名称', { test: '123' })
    name?: string
    /**
     * Field指定泛型为BaseModel，推断自定义属性test的typescript类型为string
     */
    @Field<BaseModel>('年龄', { test: 'sd', label: 'age', hidden: false, labelWidth: 120 })
    age?: number
}

/**
 * 使用useModelOptions获取SysUser模型的jsonschema
 */
const userJsonSchema = useModelOptions(SysUser)
console.log('userJsonSchema: ', userJsonSchema)

// userJsonSchema: {"fields":{"id":{"hidden":true,"label":"ID","key":"id"},"createTime":{"label":"创建时间","key":"createTime"},"name":{"email":"123","label":"名称","key":"name"},"age":{"email":"sd","label":"年龄","hidden":false,"labelWidth":120,"key":"age"}},"perms":"sys-user","api":"sys/user","name":"SysUser"}
```
