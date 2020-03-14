import { Lexer, Token } from 'xlex';
import { LRParser } from '@yjl9903/xparse';

import { config as LexConfig } from './lex';
import { config as SyntaxConfig } from './syntax';

const lexer = new Lexer(LexConfig);

const parser = new LRParser(SyntaxConfig);

export class XLang {
  tokens: Token[];

  constructor(text: string) {
    this.tokens = lexer.run(text);
    const v = parser.parse(this.tokens);
    if (v.ok) {
      console.log(JSON.stringify(v.value, null, 2));
    } else {
      console.log(false);
      console.log(v.token);
    }
  }
}
