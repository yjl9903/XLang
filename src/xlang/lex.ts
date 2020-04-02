const KeyWord = {
  fn: 'fn',
  return: 'return',
  main: 'main',
  let: 'let',
  const: 'const',
  if: 'if',
  else: 'else',
  for: 'for',
  while: 'while',
  number: 'numberType',
  float: 'floatType',
  string: 'stringType',
  bool: 'boolType',
  true: 'True',
  false: 'False'
};

export const KeyWordList: string[] = [];
for (const token in KeyWord) {
  KeyWordList.push(KeyWord[token]);
}

const config = {
  tokens: [
    {
      type: 'Identifier',
      rule: '[_a-zA-Z][_a-zA-Z0-9]*',
      callback({ type, value }) {
        if (value in KeyWord) {
          return {
            type: KeyWord[value],
            value
          };
        } else {
          return { type, value };
        }
      }
    },
    {
      type: 'Number',
      rule: '[0-9]+.?',
      callback({ type, value }) {
        const num = Number.parseInt(value);
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
          throw new Error(`"${value}" is not an safe integer`);
        }
        return {
          type,
          value: num
        };
      }
    },
    {
      type: 'Float',
      rule: '([0-9]+.[0-9]+|.[0-9]+)',
      callback({ type, value }) {
        const num = Number.parseFloat(value);
        if (!isFinite(num)) {
          throw new Error(`"${value}" is not a leggal float number`);
        }
        return {
          type,
          value: num
        };
      }
    },
    {
      type: 'String',
      rule: '"([ !#-\\[\\[-~]|\\\\\\\\|\\\\")*"',
      callback({ type, value }) {
        const str = value.replace(/\\"/g, '"');
        return {
          type,
          value: str.substr(1, str.length - 2)
        };
      }
    },
    {
      type: 'Plus',
      rule: '\\+'
    },
    {
      type: 'Minus',
      rule: '-'
    },
    {
      type: 'Mul',
      rule: '\\*'
    },
    {
      type: 'Div',
      rule: '/'
    },
    {
      type: 'Mod',
      rule: '%'
    },
    {
      type: 'Assign',
      rule: '='
    },
    {
      type: 'Comma',
      rule: ','
    },
    {
      type: 'Colon',
      rule: ':'
    },
    {
      type: 'DoubleColon',
      rule: '::'
    },
    {
      type: 'Semicolon',
      rule: ';'
    },
    {
      type: 'Dot',
      rule: '.'
    },
    {
      type: 'Not',
      rule: '!'
    },
    {
      type: 'And',
      rule: '&&'
    },
    {
      type: 'Or',
      rule: '\\|\\|'
    },
    {
      type: 'Equal',
      rule: '=='
    },
    {
      type: 'NotEqual',
      rule: '!='
    },
    {
      type: 'LessThan',
      rule: '<'
    },
    {
      type: 'MoreThan',
      rule: '>'
    },
    {
      type: 'LessOrEqual',
      rule: '<='
    },
    {
      type: 'MoreOrEqual',
      rule: '>='
    },
    {
      type: 'LRound',
      rule: '\\('
    },
    {
      type: 'RRound',
      rule: '\\)'
    },
    {
      type: 'LBrace',
      rule: '{'
    },
    {
      type: 'RBrace',
      rule: '}'
    },
    {
      type: 'ToArrow',
      rule: '->'
    },
    {
      type: 'Comment',
      rule: '//[ -~]*',
      callback({ type, value }) {
        return {
          type: '__Comment__', // Special lexer type
          value: value.substr(2).trim()
        };
      }
    }
  ]
};

export { KeyWord, config };
