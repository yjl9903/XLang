import { Lexer, Token } from 'xlex';
import { LRParser } from '@yjl9903/xparse';

import { config as LexConfig } from './lex';
import { config as SyntaxConfig } from './syntax';
import { ThreeAddressCode, LiteralCode } from './tac';
import { BuiltinFunction, ValueType, VoidType, GlobalFunction } from './type';
import { vm } from './vm';
import { RootASTNode } from './ast';

const lexer = new Lexer(LexConfig);

const parser = new LRParser(SyntaxConfig);

interface CompileOut {
  ok: true;
  tokens: Token[];
  root: RootASTNode;
  code: ThreeAddressCode[];
  globalFns: Array<[string, GlobalFunction]>;
}

interface CompileErrorOut {
  ok: false;
  token?: Token;
  message?: string;
}

export class XLang {
  readonly bindedFns: Map<string, BuiltinFunction> = new Map();

  constructor() {}

  addFn(
    name: string,
    type: ValueType | VoidType,
    args: ValueType[],
    fn: (...args: any[]) => any
  ) {
    if (this.bindedFns.has(name)) {
      throw new Error(`function ${name} has been defined`);
    }
    const fnInfo: BuiltinFunction = {
      type,
      args,
      name,
      fn
    };
    this.bindedFns.set(name, fnInfo);
  }

  compile(text: string): CompileOut | CompileErrorOut {
    try {
      const tokens = lexer.run(text);
      const ast = parser.parse(tokens, this.bindedFns);
      if (ast.ok) {
        return { ok: true, tokens, ...ast.value };
      } else {
        return { ok: false, token: ast.token };
      }
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  run(compiled: CompileOut, args: string[] = []) {
    const code = compiled.code;
    const globalFns = new Map<string, GlobalFunction>(compiled.globalFns);
    const arg = args.map(
      (value: string): LiteralCode => {
        if (!isNaN(parseInt(value))) {
          return { value: parseInt(value), type: 'numberType' };
        } else if (!isNaN(parseFloat(value))) {
          return { value: parseFloat(value), type: 'floatType' };
        } else if (value === 'true') {
          return { value: true, type: 'boolType' };
        } else if (value === 'false') {
          return { value: false, type: 'boolType' };
        } else {
          return { value, type: 'stringType' };
        }
      }
    );
    const mainArg: ValueType[] = compiled.root.main?.getArgsType() || [];
    if (mainArg.length > arg.length) {
      throw new Error(
        `function "main" needs ${mainArg.length} args, but you only provide ${arg.length} args`
      );
    }
    arg.splice(mainArg.length);
    for (let i = 0; i < arg.length; i++) {
      if (mainArg[i] === 'stringType') {
        arg[i].value = String(arg[i].value);
        arg[i].type = 'stringType';
      } else {
        if (arg[i].type === 'stringType') {
          throw new Error('function "main" arg list is not matched');
        }
        if (mainArg[i] === 'numberType') {
          if (arg[i].type === 'floatType') {
            arg[i].value = Math.round(arg[i].value as number);
            arg[i].type = 'numberType';
          } else if (arg[i].type === 'boolType') {
            arg[i].value = Number(arg[i].value as boolean);
            arg[i].type = 'numberType';
          }
        } else if (mainArg[i] === 'floatType') {
          arg[i].value = Number(arg[i].value);
          arg[i].type = 'floatType';
        } else if (mainArg[i] === 'boolType') {
          if (arg[i].value) {
            arg[i].value = true;
          } else {
            arg[i].value = false;
          }
          arg[i].type = 'boolType';
        }
      }
    }
    vm(code, globalFns, arg);
  }
}
