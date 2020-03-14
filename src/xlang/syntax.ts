import { config as lexConfig, KeyWordList } from './lex';
import { Literal, ValueType, Variable } from './type';
import {
  LeafASTNode,
  BinOPASTNode,
  UnitOPASTNode,
  FunctionASTNode,
  RootASTNode,
  StatementListASTNode,
  DefineListASTNode,
  DefineASTNode,
  ValueASTNode
} from './ast';

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
          'Identifier',
          'LRound',
          'RRound',
          'LBrace',
          STATEMENTList,
          'RBrace',
          PROGRAM
        ],
        reduce(
          fn,
          { value },
          L,
          R,
          LB,
          body: StatementListASTNode,
          RB,
          rest: RootASTNode
        ) {
          body.createContext = true;
          const fnNode = new FunctionASTNode(value, body);
          const root = new RootASTNode();
          root.fns.push(fnNode);
          root.merge(rest);
          return root;
        }
      },
      {
        rule: [
          'fn',
          'main',
          'LRound',
          'RRound',
          'LBrace',
          STATEMENTList,
          'RBrace'
        ],
        reduce(fn, main, L, R, LB, body: StatementListASTNode) {
          const root = new RootASTNode();
          body.createContext = true;
          root.main = new FunctionASTNode('main', body);
          return root;
        }
      }
    ]
  },
  {
    left: STATEMENTList,
    right: [
      {
        rule: [STATEMENT, STATEMENTList],
        reduce(statement, list: StatementListASTNode) {
          const sts = new StatementListASTNode();
          sts.statements.push(statement);
          sts.merge(list);
          return sts;
        }
      },
      {
        rule: [],
        reduce() {
          return new StatementListASTNode();
        }
      }
    ]
  },
  {
    left: STATEMENT,
    right: [
      {
        rule: ['let', DEFINEList, 'Semicolon'],
        reduce(lt, dList: DefineListASTNode) {
          return dList;
        }
      },
      {
        rule: ['const', DEFINEList, 'Semicolon'],
        reduce(ct, dList: DefineListASTNode) {
          dList.isConst = true;
          dList.defs.forEach(def => (def.dst.isConst = true));
          return dList;
        }
      },
      {
        rule: ['Identifier', 'Assign', EXPR, 'Semicolon'],
        reduce({ value }, assign, expr) {
          return new UnitOPASTNode(
            'Assign',
            genVariable(undefined, value),
            expr
          );
        }
      },
      {
        rule: ['LBrace', STATEMENTList, 'RBrace'],
        reduce(l, list: StatementListASTNode) {
          list.createContext = true;
          return list;
        }
      },
      {
        rule: [EXPR, 'Semicolon'],
        reduce(node) {
          return node;
        }
      }
    ]
  },
  {
    left: TYPES,
    right: [
      {
        rule: ['numberType'],
        reduce({ type }) {
          return type;
        }
      },
      {
        rule: ['floatType'],
        reduce({ type }) {
          return type;
        }
      },
      {
        rule: ['stringType'],
        reduce({ type }) {
          return type;
        }
      },
      {
        rule: ['boolType'],
        reduce({ type }) {
          return type;
        }
      }
    ]
  },
  {
    left: DEFINE,
    right: [
      {
        rule: ['Identifier'],
        reduce({ value }) {
          return new DefineASTNode(genVariable(undefined, value));
        }
      },
      {
        rule: ['Identifier', 'Colon', TYPES],
        reduce({ value }, colon, type: ValueType) {
          return new DefineASTNode(genVariable(type, value));
        }
      },
      {
        rule: ['Identifier', 'Assign', EXPR],
        reduce({ value }, assign, expr: ValueASTNode) {
          return new DefineASTNode(genVariable(expr.dst.type, value), expr);
        }
      },
      {
        rule: ['Identifier', 'Colon', TYPES, 'Assign', EXPR],
        reduce({ value }, colon, type: ValueType, assign, expr: ValueASTNode) {
          return new DefineASTNode(genVariable(type, value), expr);
        }
      }
    ]
  },
  {
    left: DEFINEList,
    right: [
      {
        rule: [DEFINE, 'Comma', DEFINEList],
        reduce(def, comma, other: DefineListASTNode) {
          const dList = new DefineListASTNode();
          dList.defs.push(def);
          dList.merge(other);
          return dList;
        }
      },
      {
        rule: [DEFINE],
        reduce(def: DefineASTNode) {
          const dList = new DefineListASTNode();
          dList.defs.push(def);
          return dList;
        }
      }
    ]
  }
];

let tmpCnt = 0;

export function clear() {
  tmpCnt = 0;
}

function genLiteral(type: ValueType, value: any): Literal {
  return { type, value };
}

function genVariable(type?: ValueType, name?: string): Variable {
  if (name) {
    return {
      id: -1,
      name,
      type,
      isArg: false,
      isConst: false
    };
  } else {
    const tot = tmpCnt++;
    return {
      id: tot,
      name: '$' + String(tot),
      type,
      isArg: false,
      isConst: true
    };
  }
}

const ExprProduction = [
  {
    left: EXPR,
    right: [
      {
        rule: [Term, 'Plus', EXPR],
        reduce(term, mul, expr) {
          const type = term.dst.type;
          return new BinOPASTNode('Plus', genVariable(type), term, expr);
        }
      },
      {
        rule: [Term, 'Minus', EXPR],
        reduce(term, mul, expr) {
          const type = term.dst.type;
          return new BinOPASTNode('Minus', genVariable(type), term, expr);
        }
      },
      {
        rule: [Term],
        reduce(node) {
          return node;
        }
      }
    ]
  },
  {
    left: Term,
    right: [
      {
        rule: [Factor, 'Mul', Term],
        reduce(factor, mul, term) {
          const type = factor.dst.type;
          return new BinOPASTNode('Mul', genVariable(type), factor, term);
        }
      },
      {
        rule: [Factor, 'Div', Term],
        reduce(factor, mul, term) {
          const type = factor.dst.type;
          return new BinOPASTNode('Div', genVariable(type), factor, term);
        }
      },
      {
        rule: [Factor],
        reduce(node) {
          return node;
        }
      }
    ]
  },
  {
    left: Factor,
    right: [
      {
        rule: ['Plus', RightValue],
        reduce(plus, node) {
          return node;
        }
      },
      {
        rule: ['Minus', RightValue],
        reduce(minus, node: ValueASTNode) {
          return new UnitOPASTNode(
            'Negative',
            genVariable(node.dst.type),
            node
          );
        }
      },
      {
        rule: [RightValue],
        reduce(node) {
          return node;
        }
      },
      {
        rule: ['LRound', EXPR, 'RRound'],
        reduce(l, node, r) {
          return node;
        }
      },
      {
        rule: ['Plus', 'LRound', EXPR, 'RRound'],
        reduce(plus, l, node, r) {
          return node;
        }
      },
      {
        rule: ['Minus', 'LRound', EXPR, 'RRound'],
        reduce(minus, l, node: ValueASTNode) {
          return new UnitOPASTNode(
            'Negative',
            genVariable(node.dst.type),
            node
          );
        }
      }
    ]
  },
  {
    left: RightValue,
    right: [
      {
        rule: ['Number'],
        reduce({ value }) {
          return new LeafASTNode(genLiteral('numberType', value));
        }
      },
      {
        rule: ['Float'],
        reduce({ value }) {
          return new LeafASTNode(genLiteral('floatType', value));
        }
      },
      {
        rule: ['String'],
        reduce({ value }) {
          return new LeafASTNode(genLiteral('stringType', value));
        }
      },
      {
        rule: ['Identifier'],
        reduce({ value }) {
          return new LeafASTNode(genVariable(undefined, value));
        }
      }
    ]
  }
];

export const config = {
  hooks: {
    beforeCreate() {
      clear();
    }
  },
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
