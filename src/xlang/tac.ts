import { ValueType, VoidType } from './type';

export type NOPCodeType = 'NOP';

export interface NOPCode {
  type: NOPCodeType;
}

export type FunctionCallCodeType = 'FunctionCall';

export interface FunctionCallCode {
  type: FunctionCallCodeType;
  name: string;
}

export type FunctionReturnCodeType = 'FunctionReturn';

export interface FunctionReturnCode {
  type: FunctionReturnCodeType;
  name: string;
  src?: VariableCode | LiteralCode;
}

export type BinOPCodeType = 'Plus' | 'Minus' | 'Mul' | 'Div';

export type UnitOPCodeType = 'Negative' | 'Assign';

export interface GlobalVariableCode {
  globalAddress: number;
  type: ValueType;
}

export interface LocalVariableCode {
  address: number;
  type: ValueType;
}

export type VariableCode = GlobalVariableCode | LocalVariableCode;

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
  } else {
    // throw new Error(`${op} is not a binary operation`);
    return undefined;
  }
}

export interface UnitOPCode {
  type: UnitOPCodeType;
  dst: VariableCode;
  src: VariableCode | LiteralCode;
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
  } else {
    return undefined;
  }
}

export type PushStackCodeType = 'PushStack';

export interface PushStackCode {
  type: PushStackCodeType;
  src: VariableCode | LiteralCode;
}

export type ThreeAddressCode =
  | NOPCode
  | FunctionCallCode
  | FunctionReturnCode
  | BinOPCode
  | UnitOPCode
  | PushStackCode;
