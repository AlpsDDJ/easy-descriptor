import {Model} from "../lib/src/descriptor/ModelDescriptor";
import {Field} from "../lib/src/descriptor/FieldDescriptor";
import {BaseModel} from "./BaseModel.ts";

@Model()
export class SysUser extends BaseModel<SysUser> {
  @Field('名称')
  name?: string
  @Field<SysUser>('年龄', { email: 'sd', label: 'age', hidden: false, labelWidth: 120 })
  age?: number
}

@Model()
export class SysRole extends BaseModel<SysRole> {
  @Field('名称')
  name?: string
  @Field<SysUser>('年龄', { email: 'sd', label: 'age', hidden: false, labelWidth: 120, sasd: false })
  age?: number
}
