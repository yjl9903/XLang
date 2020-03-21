import {
  Variable,
  Literal,
  ValueType,
  GlobalFunction,
  VoidType,
  UserFunction
} from './type';
import { SymbolTable } from './symbolTable';
import {
  ThreeAddressCode,
  VariableCode,
  LiteralCode,
  FunctionCallCode,
  getBinOPType,
  getUnitOPType,
  UnitOPCode,
  PushStackCode,
  FunctionReturnCode,
  ThreeAddressCodeType,
  IfGotoCode,
  GotoCode
} from './tac';

export type LeafType = 'Variable' | 'Literal';

export type BinOPType = 'Plus' | 'Minus' | 'Mul' | 'Div';

export type UnitOPType = 'Negative' | 'Assign';

export type RootType = 'Root';

export type FunctionDefType = 'FunctionDef';

export type StatementListType = 'StatementList';

export type IfStatementType = 'IfStatement';

export type DefineListType = 'DefineList';

export type DefineType = 'Define';

export type ArgDefineListType = 'ArgDefineList';

export type FunctionCallType = 'FunctionCall';

export type FunctionCallArgListType = 'FunctionCallArgList';

export type FunctionReturnType = 'FunctionReturn';

export type ASTNodeType =
  | RootType
  | FunctionDefType
  | StatementListType
  | IfStatementType
  | DefineListType
  | DefineType
  | ArgDefineListType
  | FunctionCallType
  | FunctionCallArgListType
  | FunctionReturnType
  | BinOPType
  | UnitOPType
  | LeafType;

export type ValueASTNode =
  | BinOPASTNode
  | UnitOPASTNode
  | LeafASTNode
  | FunctionCallASTNode;

export type StatementASTNode =
  | StatementListASTNode
  | ValueASTNode
  | DefineListASTNode
  | FunctionReturnASTNode
  | IfStatementASTNode;

export interface Context {
  symbols: SymbolTable;
  globalFns: Map<string, GlobalFunction>;
  fnName: string;
}

let varCnt = 0,
  labelCnt = 0;

export function clear() {
  varCnt = 0;
  labelCnt = 0;
}

type NodeVisitorReturn = {
  code: ThreeAddressCode[];
  dst?: VariableCode | LiteralCode;
};

abstract class BasicASTNode {
  type: ASTNodeType;

  constructor(type: ASTNodeType) {
    this.type = type;
  }

  abstract visit(context: Context): NodeVisitorReturn;
}

export class RootASTNode extends BasicASTNode {
  fns: FunctionASTNode[] = [];
  main?: FunctionASTNode;

  constructor() {
    super('Root');
  }

  merge(other: RootASTNode) {
    other.fns.forEach(node => this.fns.push(node));
    if (other.main) {
      this.main = other.main;
    }
  }

  visit(context: Context): NodeVisitorReturn {
    if (!this.main) {
      throw new Error('main function is not defined');
    }

    // Register User defined functions
    context.globalFns.set('main', {
      type: 'voidType',
      args: this.main.getArgsType(),
      address: 1,
      memCount: 0,
      name: 'main'
    });
    for (const fn of this.fns) {
      context.globalFns.set(fn.name, {
        type: fn.returnType,
        args: fn.getArgsType(),
        address: -1,
        memCount: 0,
        name: fn.name
      });
    }

    // Compile program entry and main function
    const start: FunctionCallCode = {
      type: ThreeAddressCodeType.FunctionCall,
      name: 'main'
    };
    const code: ThreeAddressCode[] = [start];
    code.push(...this.main.visit(context).code);
    // code.push({ type: 'FunctionReturn' as 'FunctionReturn' });
    (context.globalFns.get('main') as UserFunction).memCount = varCnt;

    // Compile other function
    for (const fn of this.fns) {
      context.fnName = fn.name;
      varCnt = 0;
      code.push({ type: ThreeAddressCodeType.NOP });

      const res = fn.visit(context);
      const fnObj = context.globalFns.get(fn.name) as UserFunction;
      fnObj.address = code.length;
      fnObj.memCount = varCnt;
      code.push(...res.code);
    }

    return { code };
  }
}

export class FunctionASTNode extends BasicASTNode {
  name: string;
  returnType: ValueType | VoidType;
  haveReturn: boolean;
  args: ArgDefineListASTNode;
  statements: StatementASTNode[] = [];

  constructor(
    name: string,
    args: ArgDefineListASTNode,
    returnType: ValueType | VoidType,
    statements: StatementListASTNode
  ) {
    super('FunctionDef');
    this.name = name;
    this.args = args;
    this.returnType = returnType;
    statements.statements.forEach(statement => this.statements.push(statement));
    this.haveReturn = statements.haveReturn;
  }

  getArgsType() {
    return this.args.defs.map(def => def.type as ValueType);
  }

  visit(context: Context): NodeVisitorReturn {
    // check whether have return statement
    if (this.returnType === 'voidType') {
      if (this.haveReturn) {
        throw new Error(`function "${this.name}" should return void`);
      }
    } else {
      if (!this.haveReturn) {
        throw new Error(
          `function "${this.name}" does not have Return statement`
        );
      }
    }

    const sTable = new SymbolTable();
    sTable.father = context.symbols;
    context = { ...context, symbols: sTable };
    this.args.visit(context);
    const code: ThreeAddressCode[] = [];
    for (const stat of this.statements) {
      code.push(...stat.visit(context).code);
    }

    // TODO: check function return
    // TODO: check every run path have return
    if (!this.haveReturn) {
      code.push({ type: ThreeAddressCodeType.FunctionReturn, name: this.name });
    }

    return { code };
  }
}

export class StatementListASTNode extends BasicASTNode {
  statements: StatementASTNode[] = [];
  createContext: boolean;
  haveReturn: boolean = false;

  constructor(createContext = false) {
    super('StatementList');
    this.createContext = createContext;
  }

  merge(other: StatementListASTNode) {
    if (other.haveReturn) {
      this.haveReturn = true;
    }
    if (other.createContext) {
      this.statements.push(other);
    } else {
      other.statements.forEach(statement => this.statements.push(statement));
    }
  }

  visit(context: Context): NodeVisitorReturn {
    if (this.createContext) {
      const sTable = new SymbolTable();
      sTable.father = context.symbols;
      context = { ...context, symbols: sTable };
    }
    const code: ThreeAddressCode[] = [];
    for (const stat of this.statements) {
      code.push(...stat.visit(context).code);
    }
    return { code };
  }
}

export class IfStatementASTNode extends BasicASTNode {
  condition: ValueASTNode;
  body: StatementASTNode;
  elseBody?: StatementASTNode;

  constructor(
    condition: ValueASTNode,
    body: StatementASTNode,
    elseBody?: StatementASTNode
  ) {
    super('IfStatement');
    this.condition = condition;
    this.body = body;
    this.elseBody = elseBody;
  }

  haveReturn() {
    if (this.elseBody !== undefined) {
      if (
        (this.body.type === 'FunctionReturn' &&
          (this.body as FunctionReturnASTNode).src !== undefined) ||
        (this.body.type === 'StatementList' &&
          (this.body as StatementListASTNode).haveReturn)
      ) {
        if (
          (this.elseBody.type === 'FunctionReturn' &&
            (this.body as FunctionReturnASTNode).src !== undefined) ||
          (this.elseBody.type === 'StatementList' &&
            (this.elseBody as StatementListASTNode).haveReturn)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  visit(context: Context): NodeVisitorReturn {
    const code: ThreeAddressCode[] = [];
    const condRes = this.condition.visit(context);
    code.push(...condRes.code);
    if (condRes.dst !== undefined) {
      const ifFalseGoto: IfGotoCode = {
        type: ThreeAddressCodeType.IfGoto,
        src: condRes.dst,
        offset: code.length
      };
      code.push(ifFalseGoto);
      const bodyRes = this.body.visit(context);
      code.push(...bodyRes.code);

      // gen else code
      if (this.elseBody) {
        const trueGoto: GotoCode = {
          type: ThreeAddressCodeType.Goto,
          offset: code.length
        };
        code.push(trueGoto);

        ifFalseGoto.offset = code.length - ifFalseGoto.offset - 1;

        const elseRes = this.elseBody.visit(context);
        code.push(...elseRes.code);
        trueGoto.offset = code.length - trueGoto.offset - 1;
      } else {
        ifFalseGoto.offset = code.length - ifFalseGoto.offset - 1;
      }
    } else {
      // throw Error
      throw new Error('void error');
    }
    return { code };
  }
}

export class DefineListASTNode extends BasicASTNode {
  defs: DefineASTNode[] = [];
  isConst: boolean = false;

  constructor() {
    super('DefineList');
  }

  merge(other: DefineListASTNode) {
    other.defs.forEach(def => this.defs.push(def));
  }

  visit(context: Context): NodeVisitorReturn {
    const code: ThreeAddressCode[] = [];
    for (const def of this.defs) {
      code.push(...def.visit(context).code);
    }
    return { code };
  }
}

export class DefineASTNode extends BasicASTNode {
  dst: Variable;
  src?: ValueASTNode;

  constructor(dst: Variable, src?: ValueASTNode) {
    super('Define');
    this.dst = dst;
    this.src = src;
  }

  visit(context: Context): NodeVisitorReturn {
    const code: ThreeAddressCode[] = [];
    if (this.src !== undefined) {
      const res = this.src.visit(context);
      code.push(...res.code);
      if (res.dst !== undefined) {
        if (this.dst.type === undefined || this.dst.type === res.dst.type) {
          const address = varCnt++;
          context.symbols.add(address, this.dst.name, res.dst.type, {
            isConst: this.dst.isConst
          });
          // gen assign code
          const assign: UnitOPCode = {
            type: 'Assign',
            dst: {
              address,
              type: res.dst.type
            },
            src: res.dst
          };
          code.push(assign);
          return { code };
        } else {
          throw new Error(`variable ${this.dst.name}'s type not match`);
        }
      } else {
        throw new Error('unknown');
      }
    } else {
      if (this.dst.isConst) {
        throw new Error(`const variable ${this.dst.name} is not initialized`);
      }
      context.symbols.add(varCnt++, this.dst.name, this.dst.type, {
        isConst: this.dst.isConst
      });
      return { code: [] };
    }
  }
}

export class ArgDefineListASTNode extends BasicASTNode {
  defs: Variable[] = [];

  constructor() {
    super('ArgDefineList');
  }

  merge(other: ArgDefineListASTNode) {
    this.defs.push(...other.defs);
  }

  visit(context: Context): NodeVisitorReturn {
    for (let i = 0; i < this.defs.length; i++) {
      const def = this.defs[i];
      context.symbols.add(
        i - this.defs.length,
        def.name,
        def.type as ValueType,
        {
          isArg: true
        }
      );
    }
    return { code: [] };
  }
}

export class LeafASTNode extends BasicASTNode {
  dst: Variable | Literal;

  constructor(item: Variable | Literal) {
    super('id' in item ? 'Variable' : 'Literal');
    this.dst = item;
  }

  visit(context: Context): NodeVisitorReturn {
    if (this.type === 'Variable') {
      const name = (this.dst as Variable).name;
      const mem = context.symbols.query(name);
      if (mem !== undefined) {
        if (mem.type !== undefined) {
          const dst = mem.isGlobal
            ? { globalAddress: mem.id, type: mem.type }
            : { address: mem.id, type: mem.type };
          return { code: [], dst };
        } else {
          throw new Error(`variable ${name} is not initialized`);
        }
      } else {
        throw new Error(`variable ${name} is not defined`);
      }
    } else if (this.type === 'Literal') {
      const dst = this.dst as Literal;
      return { code: [], dst: { value: dst.value, type: dst.type } };
    } else {
      throw new Error('unknown');
    }
  }
}

export class BinOPASTNode extends BasicASTNode {
  dst: Variable;
  x: ValueASTNode;
  y: ValueASTNode;

  constructor(
    type: BinOPType,
    dst: Variable,
    x: ValueASTNode,
    y: ValueASTNode
  ) {
    super(type);
    this.dst = dst;
    this.x = x;
    this.y = y;
  }

  visit(context: Context): NodeVisitorReturn {
    const code: ThreeAddressCode[] = [];
    const xRes = this.x.visit(context);
    const yRes = this.y.visit(context);
    code.push(...xRes.code, ...yRes.code);
    // gen BinOP
    if (xRes.dst !== undefined && yRes.dst !== undefined) {
      const tmpVar = varCnt++;
      const type = getBinOPType(
        this.type as BinOPType,
        xRes.dst.type,
        yRes.dst.type
      );
      if (type !== undefined) {
        context.symbols.add(tmpVar, '$' + tmpVar, type);
        code.push({
          type: this.type as BinOPType,
          dst: { address: tmpVar, type },
          x: xRes.dst,
          y: yRes.dst
        });
        return { code, dst: { address: tmpVar, type } };
      } else {
        // throw Error
        throw new Error('Type Error');
      }
    } else {
      throw new Error('unknown');
    }
  }
}

export class UnitOPASTNode extends BasicASTNode {
  dst: Variable;
  src: ValueASTNode;

  constructor(type: UnitOPType, dst: Variable, src: ValueASTNode) {
    super(type);
    this.dst = dst;
    this.src = src;
  }

  visit(context: Context): NodeVisitorReturn {
    const code: ThreeAddressCode[] = [];
    const res = this.src.visit(context);
    if (res.dst !== undefined) {
      code.push(...res.code);
      if (this.dst.id === -1) {
        // name variable
        const mem = context.symbols.query(this.dst.name);
        if (mem !== undefined) {
          if (mem.type === undefined) {
            mem.type = res.dst.type;
          } else if (mem.type !== res.dst.type) {
            throw new Error(
              `${mem.type} variable ${this.dst.name} can not be assigned ${res.dst.type} value`
            );
          }
          const dst = mem.isGlobal
            ? { globalAddress: mem.id, type: mem.type }
            : { address: mem.id, type: mem.type };
          code.push({
            type: this.type as UnitOPType,
            dst,
            src: res.dst
          });
          return { code, dst };
        } else {
          throw new Error(`variable ${this.dst.name} is not defined`);
        }
      } else {
        // temp variale
        const tmpVar = varCnt++;
        const type = getUnitOPType(this.type as UnitOPType, res.dst.type);
        if (type !== undefined) {
          context.symbols.add(tmpVar, '$' + tmpVar, type);
          code.push({
            type: this.type as UnitOPType,
            dst: { address: tmpVar, type },
            src: res.dst
          });
          return { code, dst: { address: tmpVar, type } };
        } else {
          throw new Error('Type Error');
        }
      }
    } else {
      throw new Error('unknown');
    }
  }
}

export class FunctionCallASTNode extends BasicASTNode {
  name: string;
  args: FunctionCallArgListASTNode;
  dst = { type: undefined };

  constructor(name: string, args: FunctionCallArgListASTNode) {
    super('FunctionCall');
    this.name = name;
    this.args = args;
  }

  visit(context: Context): NodeVisitorReturn {
    const fn = context.globalFns.get(this.name);
    if (fn !== undefined) {
      if (this.args.length() === fn.args.length) {
        const code: ThreeAddressCode[] = [];
        const res = this.args.visit(context);

        if (this.args.checkType(fn.args)) {
          code.push(...res.code);
          const callCode: FunctionCallCode = {
            type: ThreeAddressCodeType.FunctionCall,
            name: this.name
          };
          code.push(callCode);

          if (fn.type === 'voidType') {
            return { code };
          } else {
            const dst = {
              globalAddress: 0,
              type: fn.type
            };
            return { code, dst };
          }
        } else {
          throw new Error(
            `function "${this.name}" call arg list types are not matched`
          );
        }
      } else {
        throw new Error(
          `function "${this.name}" call arg list length is not matched`
        );
      }
    } else {
      throw new Error(`function "${this.name}" is not defined`);
    }
  }
}

export class FunctionCallArgListASTNode extends BasicASTNode {
  args: ValueASTNode[] = [];
  types: ValueType[] = [];

  constructor() {
    super('FunctionCallArgList');
  }

  merge(other: FunctionCallArgListASTNode) {
    this.args.push(...other.args);
  }

  length() {
    return this.args.length;
  }

  checkType(realArgs: ValueType[]) {
    if (this.types.length !== realArgs.length) {
      return false;
    }
    // TODO: function call type check
    for (let i = 0; i < realArgs.length; i++) {
      if (this.types[i] !== realArgs[i]) {
        return false;
      }
    }
    return true;
  }

  visit(context: Context): NodeVisitorReturn {
    const code: ThreeAddressCode[] = [];
    for (const arg of this.args) {
      const res = arg.visit(context);
      if (res.dst !== undefined) {
        this.types.push(res.dst.type);
        code.push(...res.code);
        const pushCode: PushStackCode = {
          type: ThreeAddressCodeType.PushStack,
          src: res.dst
        };
        code.push(pushCode);
      } else {
        throw new Error('Type Error');
      }
    }
    return { code };
  }
}

export class FunctionReturnASTNode extends BasicASTNode {
  src?: ValueASTNode;

  constructor() {
    super('FunctionReturn');
  }

  visit(context: Context): NodeVisitorReturn {
    const fnObj = context.globalFns.get(context.fnName);
    if (fnObj === undefined) {
      throw new Error('unknown');
    }
    if (this.src !== undefined) {
      const code: ThreeAddressCode[] = [];
      const res = this.src.visit(context);
      if (res.dst !== undefined) {
        code.push(...res.code);
        if (fnObj.type !== res.dst.type) {
          throw new Error(
            `function "${context.fnName}" should return <void>, but return <${res.dst.type}>`
          );
        }
        // generate function return
        const returnCode: FunctionReturnCode = {
          type: ThreeAddressCodeType.FunctionReturn,
          name: context.fnName,
          src: res.dst
        };
        code.push(returnCode);
        return { code };
      } else {
        throw new Error(`function "${context.fnName}" return value is void`);
      }
    } else {
      if (fnObj.type !== 'voidType') {
        throw new Error(
          `function "${context.fnName}" should return <${fnObj.type}>, but return <void>`
        );
      }
      const returnCode: FunctionReturnCode = {
        type: ThreeAddressCodeType.FunctionReturn,
        name: context.fnName
      };
      return { code: [returnCode] };
    }
  }
}
