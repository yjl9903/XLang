export type ValueType = 'numberType' | 'floatType' | 'stringType' | 'boolType';

export interface Variable {
  id: number;
  name: string;
  type?: ValueType;
  value?: any;
  isArg: boolean;
  isConst: boolean;
}

export interface Literal {
  type: ValueType;
  value: any;
}
