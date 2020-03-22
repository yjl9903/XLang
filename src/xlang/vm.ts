import {
  ThreeAddressCode,
  LiteralCode,
  ThreeAddressCodeType,
  VariableCode,
  FunctionCallCode,
  FunctionReturnCode,
  PushStackCode,
  UnitOPCode,
  BinOPCode,
  GotoCode,
  IfGotoCode
} from './tac';
import { GlobalFunction, UserFunction } from './type';

interface CallStackRecord {
  name: string;
  pc: number;
  sp: number;
}

export function vm(
  code: ThreeAddressCode[],
  globalFns: Map<string, GlobalFunction>,
  args: LiteralCode[] = []
) {
  const varStk: any[] = [];
  const callStk: CallStackRecord[] = [];
  const globalVar: any = [undefined];

  let pc = 0,
    sp = 0,
    fnName = '__ENTRY__';

  const allocateStack = (cnt: number) => {
    while (cnt--) {
      varStk.push(undefined);
    }
  };
  const releaseStack = (cnt: number) => {
    while (cnt--) {
      varStk.pop();
    }
  };

  const getValue = (pos: VariableCode | LiteralCode) => {
    if ('address' in pos) {
      const val = varStk[sp + pos.address];
      if (val === undefined) {
        throw new Error('visit undefined memory');
      }
      return val;
    } else if ('globalAddress' in pos) {
      const val = globalVar[pos.globalAddress];
      if (val === undefined) {
        throw new Error('visit undefined memory');
      }
      return val;
    } else {
      return pos.value;
    }
  };
  const setValue = (pos: VariableCode, val: any) => {
    if ('address' in pos) {
      const address = sp + pos.address;
      if (address < 0 || address >= varStk.length) {
        throw new Error('visit out of stack range');
      }
      varStk[address] = val;
    } else {
      const address = pos.globalAddress;
      if (address < 0 || address >= globalVar.length) {
        throw new Error('visit out of global memory range');
      }
      globalVar[address] = val;
    }
  };

  const action = {
    [ThreeAddressCodeType.NOP]() {},
    [ThreeAddressCodeType.FunctionCall](code: ThreeAddressCode) {
      const name = (code as FunctionCallCode).name;
      const fnObj = globalFns.get(name);
      if (fnObj !== undefined) {
        if ('address' in fnObj) {
          callStk.push({
            name: fnName,
            sp,
            pc
          });
          fnName = name;
          sp = varStk.length;
          pc = fnObj.address - 1;
          allocateStack(fnObj.memCount);
        } else {
          const args = varStk.splice(varStk.length - fnObj.args.length);
          const value = fnObj.fn(...args);
          globalVar[0] = value;
        }
      } else {
        throw new Error(`function "${name}" is not defined`);
      }
    },
    [ThreeAddressCodeType.FunctionReturn](code: ThreeAddressCode) {
      const returnCode = code as FunctionReturnCode;
      const name = returnCode.name;
      if (returnCode.src !== undefined) {
        globalVar[0] = getValue(returnCode.src);
      }

      const fnObj = globalFns.get(name) as UserFunction;
      releaseStack(fnObj.memCount + fnObj.args.length);

      if (callStk.length === 0) {
        throw new Error('call stack is empty');
      }
      const record = callStk.pop() as CallStackRecord;
      fnName = record.name;
      pc = record.pc;
      sp = record.sp;
    },
    [ThreeAddressCodeType.PushStack](code: ThreeAddressCode) {
      const pushStackCode = code as PushStackCode;
      const value = getValue(pushStackCode.src);
      varStk.push(value);
    },
    [ThreeAddressCodeType.Goto](code: ThreeAddressCode) {
      const gotoCode = code as GotoCode;
      pc += gotoCode.offset;
    },
    [ThreeAddressCodeType.IfGoto](code: ThreeAddressCode) {
      const ifGotoCode = code as IfGotoCode;
      const value = getValue(ifGotoCode.src);
      if (typeof value === 'number') {
        if (value === 0) {
          pc += ifGotoCode.offset;
        }
      } else if (typeof value === 'string') {
        if (value.length === 0) {
          pc += ifGotoCode.offset;
        }
      } else if (typeof value === 'boolean') {
        if (!value) {
          pc += ifGotoCode.offset;
        }
      } else {
        pc += ifGotoCode.offset;
      }
    },
    [ThreeAddressCodeType.Assign](code: ThreeAddressCode) {
      const assginCode = code as UnitOPCode;
      const value = getValue(assginCode.src);
      setValue(assginCode.dst, value);
    },
    [ThreeAddressCodeType.Not](code: ThreeAddressCode) {
      const notCode = code as UnitOPCode;
      const value = getValue(notCode.src);
      if (typeof value === 'boolean') {
        setValue(notCode.dst, !value);
      } else if (typeof value === 'number') {
        setValue(notCode.dst, value === 0);
      } else if (typeof value === 'string') {
        setValue(notCode.dst, value.length === 0);
      } else {
        // TODO: type may be error
        setValue(notCode.dst, !value);
      }
    },
    [ThreeAddressCodeType.Negative](code: ThreeAddressCode) {
      const negativeCode = code as UnitOPCode;
      const value = getValue(negativeCode.src);
      setValue(negativeCode.dst, -value);
    },
    [ThreeAddressCodeType.Plus](code: ThreeAddressCode) {
      const plusCode = code as BinOPCode;
      const valueX = getValue(plusCode.x);
      const valueY = getValue(plusCode.y);
      setValue(plusCode.dst, valueX + valueY);
    },
    [ThreeAddressCodeType.Minus](code: ThreeAddressCode) {
      const minusCode = code as BinOPCode;
      const valueX = getValue(minusCode.x);
      const valueY = getValue(minusCode.y);
      setValue(minusCode.dst, valueX - valueY);
    },
    [ThreeAddressCodeType.Mul](code: ThreeAddressCode) {
      const mulCode = code as BinOPCode;
      const valueX = getValue(mulCode.x);
      const valueY = getValue(mulCode.y);
      setValue(mulCode.dst, valueX * valueY);
    },
    [ThreeAddressCodeType.Div](code: ThreeAddressCode) {
      const divCode = code as BinOPCode;
      const valueX = getValue(divCode.x);
      const valueY = getValue(divCode.y);
      setValue(divCode.dst, valueX / valueY);
    }
  };

  for (const arg of args) {
    varStk.push(arg.value);
  }
  sp = varStk.length;

  for (; pc < code.length; pc++) {
    action[code[pc].type](code[pc]);
    if (callStk.length === 0) {
      return;
    }
  }
}
