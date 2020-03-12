import { config as lexConfig, KeyWordList } from './lex';

const PROGRAM = 'Program',
  STATEMENTList = 'StatmentList',
  STATEMENT = 'Statement',
  TYPES = 'Types',
  DEFINE = 'Define',
  DEFINEList = 'DefineList';

const EXPR = 'Expr',
  Term = 'Term',
  Factor = 'Factor',
  RightValue = 'RightValue';

const StatementProduction = [
  {
    left: PROGRAM,
    right: [
      {
        rule: [
          'fn',
          'main',
          'LRound',
          'RRound',
          'LBrace',
          STATEMENTList,
          'RBrace'
        ]
      }
    ]
  },
  {
    left: STATEMENTList,
    right: [
      {
        rule: [STATEMENT, STATEMENTList]
      },
      {
        rule: []
      }
    ]
  },
  {
    left: STATEMENT,
    right: [
      {
        rule: ['let', DEFINEList, 'Semicolon']
      },
      {
        rule: ['const', DEFINEList, 'Semicolon']
      },
      {
        rule: ['Identifier', 'Assign', EXPR, 'Semicolon']
      },
      {
        rule: ['LBrace', STATEMENTList, 'RBrace']
      }
    ]
  },
  {
    left: TYPES,
    right: [
      {
        rule: ['numberType']
      },
      {
        rule: ['floatType']
      },
      {
        rule: ['stringType']
      },
      {
        rule: ['boolType']
      }
    ]
  },
  {
    left: DEFINE,
    right: [
      {
        rule: ['Identifier']
      },
      {
        rule: ['Identifier', 'Colon', TYPES]
      },
      {
        rule: ['Identifier', 'Assign', EXPR]
      },
      {
        rule: ['Identifier', 'Colon', TYPES, 'Assign', EXPR]
      }
    ]
  },
  {
    left: DEFINEList,
    right: [
      {
        rule: [DEFINE, 'Comma', DEFINEList]
      },
      {
        rule: [DEFINE]
      }
    ]
  }
];

const ExprProduction = [
  {
    left: EXPR,
    right: [
      {
        rule: [Term, 'Plus', EXPR]
      },
      {
        rule: [Term, 'Minus', EXPR]
      },
      {
        rule: [Term]
      }
    ]
  },
  {
    left: Term,
    right: [
      {
        rule: [Factor, 'Mul', Term]
      },
      {
        rule: [Factor, 'Div', Term]
      },
      {
        rule: [Factor]
      }
    ]
  },
  {
    left: Factor,
    right: [
      {
        rule: ['Plus', RightValue]
      },
      {
        rule: ['Minus', RightValue]
      },
      {
        rule: [RightValue]
      },
      {
        rule: ['LRound', EXPR, 'RRound']
      },
      {
        rule: ['Plus', 'LRound', EXPR, 'RRound']
      },
      {
        rule: ['Minus', 'LRound', EXPR, 'RRound']
      }
    ]
  },
  {
    left: RightValue,
    right: [
      {
        rule: ['Number']
      },
      {
        rule: ['Float']
      },
      {
        rule: ['String']
      },
      {
        rule: ['Identifier']
      }
    ]
  }
];

const config = {
  tokens: [...lexConfig.tokens.map(item => item.type), ...KeyWordList],
  types: [
    PROGRAM,
    STATEMENTList,
    STATEMENT,
    TYPES,
    DEFINE,
    DEFINEList,
    EXPR,
    Term,
    Factor,
    RightValue
  ],
  start: PROGRAM,
  productions: [...StatementProduction, ...ExprProduction]
};

export { config };
