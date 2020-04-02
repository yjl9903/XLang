import { ValueType, VoidType, CmpOpType } from './type';

export interface GlobalVariableCode {
  globalAddress: number;
  type: ValueType;
}

export interface LocalVariableCode {
  address: number;
  type: ValueType;
}

export type VariableCode = GlobalVariableCode | LocalVariableCode;

export enum ThreeAddressCodeType {
  NOP = 'NOP',
  FunctionCall = 'FunctionCall',
  FunctionReturn = 'FunctionReturn',
  Goto = 'Goto',
  IfGoto = 'IfGoto',
  Plus = 'Plus',
  Minus = 'Minus',
  Mul = 'Mul',
  Div = 'Div',
  Mod = 'Mod',
  Negative = 'Negative',
  Not = 'Not',
  And = 'And',
  Or = 'Or',
  NotEqual = 'NotEqual',
  Equal = 'Equal',
  LessThan = 'LessThan',
  MoreThan = 'MoreThan',
  LessOrEqual = 'LessOrEqual',
  MoreOrEqual = 'MoreOrEqual',
  Assign = 'Assign',
  PushStack = 'PushStack'
}

export type NOPCodeType = typeof ThreeAddressCodeType.NOP;

export type FunctionCallCodeType = typeof ThreeAddressCodeType.FunctionCall;

export type FunctionReturnCodeType = typeof ThreeAddressCodeType.FunctionReturn;

export type GotoCodeType = typeof ThreeAddressCodeType.Goto;

export type IfGotoCodeType = typeof ThreeAddressCodeType.IfGoto;

export type BinOPCodeType =
  | 'Plus'
  | 'Minus'
  | 'Mul'
  | 'Div'
  | 'Mod'
  | 'And'
  | 'Or'
  | CmpOpType;

export type UnitOPCodeType = 'Negative' | 'Not' | 'Assign';

export type PushStackCodeType = typeof ThreeAddressCodeType.PushStack;

export interface NOPCode {
  type: NOPCodeType;
}

export interface FunctionCallCode {
  type: FunctionCallCodeType;
  name: string;
}

export interface FunctionReturnCode {
  type: FunctionReturnCodeType;
  name: string;
  src?: VariableCode | LiteralCode;
}

export interface GotoCode {
  type: GotoCodeType;
  offset: number;
}

export interface IfGotoCode {
  type: IfGotoCodeType;
  src: VariableCode | LiteralCode;
  // when src is equal to target, goto
  target: boolean;
  offset: number;
}

export interface LiteralCode {
  value: number | string | boolean;
  type: ValueType;
}

export interface BinOPCode {
  type: BinOPCodeType;
  dst: VariableCode;
  x: VariableCode | LiteralCode;
  y: VariableCode | LiteralCode;
}

export interface UnitOPCode {
  type: UnitOPCodeType;
  dst: VariableCode;
  src: VariableCode | LiteralCode;
}

export interface PushStackCode {
  type: PushStackCodeType;
  src: VariableCode | LiteralCode;
}

export type ThreeAddressCode =
  | NOPCode
  | FunctionCallCode
  | FunctionReturnCode
  | GotoCode
  | IfGotoCode
  | BinOPCode
  | UnitOPCode
  | PushStackCode;

export function getBinOPType(
  op: BinOPCodeType,
  a?: ValueType | VoidType,
  b?: ValueType | VoidType
): ValueType | undefined {
  if (!a || !b) return undefined;
  if (a === 'voidType' || b === 'voidType') return undefined;
  if (op === 'Plus') {
    if (a === 'stringType' || b === 'stringType') {
      return 'stringType';
    } else if (a === 'floatType' || b === 'floatType') {
      return 'floatType';
    } else {
      return 'numberType';
    }
  } else if (op === 'Minus') {
    if (a === 'stringType' || b === 'stringType') {
      // throw new Error('string can not minus');
      return undefined;
    } else if (a === 'floatType' || b === 'floatType') {
      return 'floatType';
    } else {
      return 'numberType';
    }
  } else if (op === 'Mul') {
    if (a === 'stringType' || b === 'stringType') {
      // throw new Error('string can not mul');
      return undefined;
    } else if (a === 'floatType' || b === 'floatType') {
      return 'floatType';
    } else {
      return 'numberType';
    }
  } else if (op === 'Div') {
    if (a === 'stringType' || b === 'stringType') {
      // throw new Error('string can not div');
      return undefined;
    } else if (a === 'floatType' || b === 'floatType') {
      return 'floatType';
    } else {
      return 'numberType';
    }
  } else if (op === 'Mod') {
    if (a === 'stringType' || b === 'stringType') {
      return undefined;
    } else if (a === 'floatType' || b === 'floatType') {
      return 'floatType';
    } else {
      return 'numberType';
    }
  } else if (
    op === 'And' ||
    op === 'Or' ||
    op === 'Equal' ||
    op === 'NotEqual' ||
    op === 'LessOrEqual' ||
    op === 'LessThan' ||
    op === 'MoreOrEqual' ||
    op === 'MoreThan'
  ) {
    return 'boolType';
  } else {
    // throw new Error(`${op} is not a binary operation`);
    return undefined;
  }
}

export function getUnitOPType(
  op: UnitOPCodeType,
  src: ValueType | VoidType
): ValueType | undefined {
  if (!src) return undefined;
  if (src === 'voidType') return undefined;
  if (op === 'Assign') {
    return src;
  } else if (op === 'Negative') {
    if (src === 'stringType') {
      return undefined;
    }
    return src;
  } else if (op === 'Not') {
    return 'boolType';
  } else {
    return undefined;
  }
}
