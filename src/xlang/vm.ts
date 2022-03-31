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
  IfGotoCode,
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
            pc,
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
      let flag: boolean = Boolean(value);
      if (typeof value === 'number') {
        if (value === 0) {
          flag = false;
        }
      } else if (typeof value === 'string') {
        if (value.length === 0) {
          flag = false;
        }
      } else if (typeof value === 'boolean') {
        if (!value) {
          flag = false;
        }
      }
      if (flag === ifGotoCode.target) {
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
    [ThreeAddressCodeType.And](code: ThreeAddressCode) {
      const andCode = code as BinOPCode;
      const valueX = getValue(andCode.x);
      const valueY = getValue(andCode.y);
      setValue(andCode.dst, valueX && valueY);
    },
    [ThreeAddressCodeType.Or](code: ThreeAddressCode) {
      const orCode = code as BinOPCode;
      const valueX = getValue(orCode.x);
      const valueY = getValue(orCode.y);
      setValue(orCode.dst, valueX || valueY);
    },
    [ThreeAddressCodeType.Equal](code: ThreeAddressCode) {
      const equalCode = code as BinOPCode;
      const valueX = getValue(equalCode.x);
      const valueY = getValue(equalCode.y);
      setValue(equalCode.dst, valueX === valueY);
    },
    [ThreeAddressCodeType.NotEqual](code: ThreeAddressCode) {
      const notEqualCode = code as BinOPCode;
      const valueX = getValue(notEqualCode.x);
      const valueY = getValue(notEqualCode.y);
      setValue(notEqualCode.dst, valueX !== valueY);
    },
    [ThreeAddressCodeType.LessOrEqual](code: ThreeAddressCode) {
      const leCode = code as BinOPCode;
      const valueX = getValue(leCode.x);
      const valueY = getValue(leCode.y);
      setValue(leCode.dst, valueX <= valueY);
    },
    [ThreeAddressCodeType.LessThan](code: ThreeAddressCode) {
      const lCode = code as BinOPCode;
      const valueX = getValue(lCode.x);
      const valueY = getValue(lCode.y);
      setValue(lCode.dst, valueX < valueY);
    },
    [ThreeAddressCodeType.MoreOrEqual](code: ThreeAddressCode) {
      const geCode = code as BinOPCode;
      const valueX = getValue(geCode.x);
      const valueY = getValue(geCode.y);
      setValue(geCode.dst, valueX >= valueY);
    },
    [ThreeAddressCodeType.MoreThan](code: ThreeAddressCode) {
      const gCode = code as BinOPCode;
      const valueX = getValue(gCode.x);
      const valueY = getValue(gCode.y);
      setValue(gCode.dst, valueX > valueY);
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
      const value =
        mulCode.x.type === 'numberType' && mulCode.y.type === 'numberType'
          ? Math.floor(valueX * valueY)
          : valueX * valueY;
      setValue(mulCode.dst, value);
    },
    [ThreeAddressCodeType.Div](code: ThreeAddressCode) {
      const divCode = code as BinOPCode;
      const valueX = getValue(divCode.x);
      const valueY = getValue(divCode.y);
      const value =
        divCode.x.type === 'numberType' && divCode.y.type === 'numberType'
          ? Math.floor(valueX / valueY)
          : valueX / valueY;
      setValue(divCode.dst, value);
    },
    [ThreeAddressCodeType.Mod](code: ThreeAddressCode) {
      const modCode = code as BinOPCode;
      const valueX = getValue(modCode.x);
      const valueY = getValue(modCode.y);
      const value = valueX % valueY;
      setValue(modCode.dst, value);
    },
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
