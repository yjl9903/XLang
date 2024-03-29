export type ValueType = 'numberType' | 'floatType' | 'stringType' | 'boolType';

export type CmpOpType =
  | 'Equal'
  | 'NotEqual'
  | 'LessThan'
  | 'MoreThan'
  | 'LessOrEqual'
  | 'MoreOrEqual';

export type VoidType = 'voidType';

export interface Variable {
  id: number;
  name: string;
  type?: ValueType;
  value?: any;
  isArg: boolean;
  isConst: boolean;
  isGlobal: boolean;
}

export interface Literal {
  type: ValueType;
  value: any;
}

export interface UserFunction {
  type: ValueType | VoidType;
  args: ValueType[];
  address: number;
  memCount: number;
  name: string;
}

export interface BuiltinFunction {
  type: ValueType | VoidType;
  args: ValueType[];
  fn: (...args: any[]) => any;
  name: string;
}

export type GlobalFunction = UserFunction | BuiltinFunction;
