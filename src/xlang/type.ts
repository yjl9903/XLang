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

export type BinOPType = 'Plus' | 'Minus' | 'Mul' | 'Div';

export interface BinOP {
  type: BinOPType;
  dst: Variable;
  x: Literal | Variable;
  y: Literal | Variable;
}

export type UnitOPType = 'Negative' | 'Copy';

export interface UnitOP {
  type: UnitOPType;
  dst: Variable;
  src: Literal | Variable;
}

export type GotoType = 'Goto';

export interface Goto {
  type: GotoType;
  dst: number;
}

export type IfGotoType = 'IfGoto';

export interface IfGoto {
  type: IfGotoType;
  condition: Literal | Variable;
  dst: number;
}

export type ParamType = 'Param';

export interface Param {
  type: ParamType;
  src: Literal | Variable;
}

export type AllocateStackType = 'Stack';

export interface AllocateStack {
  type: AllocateStackType;
  number: number;
}

export type ThreeAddressCode =
  | BinOP
  | UnitOP
  | Goto
  | IfGoto
  | Param
  | AllocateStack;
