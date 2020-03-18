import { Lexer } from 'xlex';
import { LRParser } from '@yjl9903/xparse';

import { config as LexConfig } from './lex';
import { config as SyntaxConfig } from './syntax';
import { ThreeAddressCode } from './tac';
import { BuiltinFunction, ValueType, VoidType, GlobalFunction } from './type';

const lexer = new Lexer(LexConfig);

const parser = new LRParser(SyntaxConfig);

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

  compile(text: string) {
    try {
      const tokens = lexer.run(text);
      const ast = parser.parse(tokens, this.bindedFns);
      if (ast.ok) {
        return { ok: true, tokens, ...ast.value };
      } else {
        console.log(ast.token);
        return { ok: false, token: ast.token };
      }
    } catch (error) {
      console.log(error);
      return { ok: false, message: error.message };
    }
  }

  run(code: ThreeAddressCode[], globalFns: Map<string, GlobalFunction>) {}
}
