// import {EzBaseModel} from "@/descriptor";

import {FieldOption} from "../lib/types/types.ts";
import {EzBaseModel} from "../lib/src/hooks/EzModel.ts";
import {Field} from "../lib/src/descriptor/FieldDescriptor";

type TestFieldOptions = {
  email?: string
}

interface ElFieldOptions extends FieldOption<TestFieldOptions> {}

// export const Prop: FieldDecorator<MyBaseModel> = (() => {
//   const fn: FieldDecorator = (label?: string | PartialFieldOption<MyBaseModel>, option?: PartialFieldOption<MyBaseModel>): PropertyDecorator => {
//     return Field<MyBaseModel>(label, option)
//   }
//   fn.Hidden = Field.Hidden
//   fn.Dict = Field.Dict
//   fn.Disabled = Field.Disabled
//   fn.DataType = Field.DataType
//   return fn
// })()

export class BaseModel<T extends BaseModel<T>> extends EzBaseModel<T, ElFieldOptions> {
  @Field('ID')
  @Field.Hidden()
  id?: number
  @Field('创建时间')
  createTime?: string
}
