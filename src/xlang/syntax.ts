import { config as lexConfig, KeyWordList } from './lex';
import {
  Literal,
  ValueType,
  Variable,
  BuiltinFunction,
  VoidType,
  CmpOpType
} from './type';
import {
  LeafASTNode,
  BinOPASTNode,
  UnitOPASTNode,
  FunctionASTNode,
  RootASTNode,
  StatementListASTNode,
  DefineListASTNode,
  DefineASTNode,
  ValueASTNode,
  clear as clearAST,
  ArgDefineListASTNode,
  FunctionCallArgListASTNode,
  FunctionCallASTNode,
  FunctionReturnASTNode,
  StatementASTNode,
  IfStatementASTNode
} from './ast';
import { SymbolTable } from './symbolTable';
import { getBinOPType } from './tac';

const PROGRAM = 'Program',
  STATEMENTList = 'StatmentList',
  STATEMENT = 'Statement',
  OPENSTATEMENT = 'OpenStatement',
  TYPES = 'Types',
  ARGDEFINE = 'ArgDefine',
  ARGDEFINEList = 'ArgDefineList',
  RETURNTYPE = 'FunctionReturnType',
  FUNCTIONCALL = 'FunctionCall',
  CALLARGList = 'FunctionCallArgList',
  FUNCTIONRETURN = 'FunctionReturn',
  DEFINE = 'Define',
  DEFINEList = 'DefineList';

const EXPR = 'Expr',
  Term = 'Term',
  Factor = 'Factor',
  RightValue = 'RightValue';

const LOGICALEXPR = 'LogicalExpr',
  LOGICALAND = 'LogicalAnd',
  CMP = 'LogicalCmp',
  CMPToken = 'CmpToken';

const StatementProduction = [
  {
    left: PROGRAM,
    right: [
      {
        rule: [
          'fn',
          'Identifier',
          'LRound',
          ARGDEFINEList,
          'RRound',
          RETURNTYPE,
          'LBrace',
          STATEMENTList,
          'RBrace',
          PROGRAM
        ],
        reduce(
          fn,
          { value },
          L,
          argList: ArgDefineListASTNode,
          R,
          type: ValueType | VoidType,
          LB,
          body: StatementListASTNode,
          RB,
          rest: RootASTNode
        ) {
          body.createContext = true;
          const fnNode = new FunctionASTNode(value, argList, type, body);
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
          ARGDEFINEList,
          'RRound',
          'LBrace',
          STATEMENTList,
          'RBrace'
        ],
        reduce(
          fn,
          main,
          L,
          argList: ArgDefineListASTNode,
          R,
          LB,
          body: StatementListASTNode
        ) {
          const root = new RootASTNode();
          body.createContext = true;
          root.main = new FunctionASTNode('main', argList, 'voidType', body);
          return root;
        }
      }
    ]
  },
  {
    left: RETURNTYPE,
    right: [
      {
        rule: ['ToArrow', TYPES],
        reduce(arrow, type: ValueType) {
          return type;
        }
      },
      {
        rule: [],
        reduce() {
          return 'voidType';
        }
      }
    ]
  },
  {
    left: ARGDEFINEList,
    right: [
      {
        rule: [ARGDEFINE, 'Comma', ARGDEFINEList],
        reduce(arg: Variable, comma, other: ArgDefineListASTNode) {
          const aList = new ArgDefineListASTNode();
          aList.defs.push(arg);
          aList.merge(other);
          return aList;
        }
      },
      {
        rule: [ARGDEFINE],
        reduce(arg: Variable) {
          const aList = new ArgDefineListASTNode();
          aList.defs.push(arg);
          return aList;
        }
      },
      {
        rule: [],
        reduce() {
          return new ArgDefineListASTNode();
        }
      }
    ]
  },
  {
    left: ARGDEFINE,
    right: [
      {
        rule: ['Identifier', 'Colon', TYPES],
        reduce({ value }, colon, type: ValueType) {
          const arg = genVariable(type, value);
          arg.isArg = true;
          return arg;
        }
      }
    ]
  },
  {
    left: STATEMENTList,
    right: [
      {
        rule: [STATEMENT, STATEMENTList],
        reduce(statement: StatementASTNode, list: StatementListASTNode) {
          const sts = new StatementListASTNode();
          if (
            statement.type === 'FunctionReturn' &&
            (statement as FunctionReturnASTNode).src !== undefined
          ) {
            sts.haveReturn = true;
          } else if (statement.type === 'IfStatement') {
            if ((statement as IfStatementASTNode).haveReturn()) {
              sts.haveReturn = true;
            }
          }
          sts.statements.push(statement);
          sts.merge(list);
          return sts;
        }
      },
      {
        rule: [OPENSTATEMENT, STATEMENTList],
        reduce(statement: IfStatementASTNode, list: StatementListASTNode) {
          const sts = new StatementListASTNode();
          if (statement.haveReturn()) {
            sts.haveReturn = true;
          }
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
        reduce(node: ValueASTNode) {
          return node;
        }
      },
      {
        rule: [FUNCTIONRETURN, 'Semicolon'],
        reduce(node: FunctionReturnASTNode) {
          return node;
        }
      },
      {
        rule: [
          'if',
          'LRound',
          LOGICALEXPR,
          'RRound',
          STATEMENT,
          'else',
          STATEMENT
        ],
        reduce(
          f,
          l,
          expr: ValueASTNode,
          r,
          body: StatementASTNode,
          el,
          elseBody: StatementASTNode
        ) {
          return new IfStatementASTNode(expr, body, elseBody);
        }
      }
    ]
  },
  {
    left: OPENSTATEMENT,
    right: [
      {
        rule: ['if', 'LRound', LOGICALEXPR, 'RRound', STATEMENT],
        reduce(f, l, expr: ValueASTNode, r, body: StatementASTNode) {
          return new IfStatementASTNode(expr, body);
        }
      },
      {
        rule: ['if', 'LRound', LOGICALEXPR, 'RRound', OPENSTATEMENT],
        reduce(f, l, expr: ValueASTNode, r, body: StatementASTNode) {
          return new IfStatementASTNode(expr, body);
        }
      },
      {
        rule: [
          'if',
          'LRound',
          LOGICALEXPR,
          'RRound',
          STATEMENT,
          'else',
          OPENSTATEMENT
        ],
        reduce(
          f,
          l,
          expr: ValueASTNode,
          r,
          body: StatementASTNode,
          el,
          elseBody: StatementASTNode
        ) {
          return new IfStatementASTNode(expr, body, elseBody);
        }
      }
    ]
  },
  {
    left: FUNCTIONRETURN,
    right: [
      {
        rule: ['return'],
        reduce() {
          return new FunctionReturnASTNode();
        }
      },
      {
        rule: ['return', EXPR],
        reduce(ret, expr: ValueASTNode) {
          const rNode = new FunctionReturnASTNode();
          rNode.src = expr;
          return rNode;
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
        reduce(def: DefineASTNode, comma, other: DefineListASTNode) {
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
      isConst: false,
      isGlobal: false
    };
  } else {
    const tot = tmpCnt++;
    return {
      id: tot,
      name: '$' + String(tot),
      type,
      isArg: false,
      isConst: true,
      isGlobal: false
    };
  }
}

const ExprProduction = [
  {
    left: EXPR,
    right: [
      {
        rule: [Term, 'Plus', EXPR],
        reduce(term: ValueASTNode, mul, expr: ValueASTNode) {
          const type = getBinOPType('Plus', term.dst.type, expr.dst.type);
          return new BinOPASTNode('Plus', genVariable(type), term, expr);
        }
      },
      {
        rule: [Term, 'Minus', EXPR],
        reduce(term: ValueASTNode, mul, expr: ValueASTNode) {
          const type = getBinOPType('Minus', term.dst.type, expr.dst.type);
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
        reduce(factor: ValueASTNode, mul, term: ValueASTNode) {
          const type = getBinOPType('Mul', factor.dst.type, term.dst.type);
          return new BinOPASTNode('Mul', genVariable(type), factor, term);
        }
      },
      {
        rule: [Factor, 'Div', Term],
        reduce(factor: ValueASTNode, mul, term: ValueASTNode) {
          const type = getBinOPType('Div', factor.dst.type, term.dst.type);
          return new BinOPASTNode('Div', genVariable(type), factor, term);
        }
      },
      {
        rule: [Factor],
        reduce(node: ValueASTNode) {
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
        reduce(plus, node: ValueASTNode) {
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
        rule: ['Not', RightValue],
        reduce(not, node: ValueASTNode) {
          return new UnitOPASTNode('Not', genVariable(node.dst.type), node);
        }
      },
      {
        rule: [RightValue],
        reduce(node: ValueASTNode) {
          return node;
        }
      },
      {
        rule: ['LRound', EXPR, 'RRound'],
        reduce(l, node: ValueASTNode, r) {
          return node;
        }
      },
      {
        rule: ['Plus', 'LRound', EXPR, 'RRound'],
        reduce(plus, l, node: ValueASTNode, r) {
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
      },
      {
        rule: ['Not', 'LRound', EXPR, 'RRound'],
        reduce(minus, l, node: ValueASTNode) {
          return new UnitOPASTNode('Not', genVariable(node.dst.type), node);
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
        rule: ['True'],
        reduce() {
          return new LeafASTNode(genLiteral('boolType', true));
        }
      },
      {
        rule: ['False'],
        reduce() {
          return new LeafASTNode(genLiteral('boolType', false));
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
      },
      {
        rule: [FUNCTIONCALL],
        reduce(call: FunctionCallASTNode) {
          return call;
        }
      }
    ]
  },
  {
    left: FUNCTIONCALL,
    right: [
      {
        rule: ['Identifier', 'LRound', CALLARGList, 'RRound'],
        reduce({ value }, L, args: FunctionCallArgListASTNode) {
          const fnCall = new FunctionCallASTNode(value, args);
          return fnCall;
        }
      }
    ]
  },
  {
    left: CALLARGList,
    right: [
      {
        rule: [EXPR, 'Comma', CALLARGList],
        reduce(expr: ValueASTNode, comma, rest: FunctionCallArgListASTNode) {
          const fnaList = new FunctionCallArgListASTNode();
          fnaList.args.push(expr);
          fnaList.merge(rest);
          return fnaList;
        }
      },
      {
        rule: [EXPR],
        reduce(expr: ValueASTNode) {
          const fnaList = new FunctionCallArgListASTNode();
          fnaList.args.push(expr);
          return fnaList;
        }
      },
      {
        rule: [],
        reduce() {
          return new FunctionCallArgListASTNode();
        }
      }
    ]
  }
];

const LogicalProduction = [
  {
    left: LOGICALEXPR,
    right: [
      {
        rule: [LOGICALAND],
        reduce(expr: ValueASTNode) {
          return expr;
        }
      },
      {
        rule: [LOGICALAND, 'Or', LOGICALEXPR],
        reduce(cmp: ValueASTNode, or, expr: ValueASTNode) {
          return new BinOPASTNode('Or', genVariable('boolType'), cmp, expr);
        }
      }
    ]
  },
  {
    left: LOGICALAND,
    right: [
      {
        rule: [CMP],
        reduce(cmp: ValueASTNode) {
          return cmp;
        }
      },
      {
        rule: [CMP, 'And', LOGICALAND],
        reduce(cmp: ValueASTNode, and, expr: ValueASTNode) {
          return new BinOPASTNode('And', genVariable('boolType'), cmp, expr);
        }
      }
    ]
  },
  {
    left: CMP,
    right: [
      {
        rule: [EXPR, CMPToken, EXPR],
        reduce(lExpr: ValueASTNode, type: CmpOpType, rExpr: ValueASTNode) {
          return new BinOPASTNode(type, genVariable('boolType'), lExpr, rExpr);
        }
      }
    ]
  },
  {
    left: CMPToken,
    right: [
      {
        rule: ['Equal'],
        reduce({ type }) {
          return type;
        }
      },
      {
        rule: ['NotEqual'],
        reduce({ type }) {
          return type;
        }
      },
      {
        rule: ['LessThan'],
        reduce({ type }) {
          return type;
        }
      },
      {
        rule: ['MoreThan'],
        reduce({ type }) {
          return type;
        }
      },
      {
        rule: ['LessOrEqual'],
        reduce({ type }) {
          return type;
        }
      },
      {
        rule: ['MoreOrEqual'],
        reduce({ type }) {
          return type;
        }
      }
    ]
  }
];

export const config = {
  hooks: {
    beforeCreate() {
      clear();
      clearAST();
    },
    created(root: RootASTNode, bindedFns: Map<string, BuiltinFunction>) {
      const context = {
        symbols: new SymbolTable(),
        globalFns: new Map([...bindedFns]),
        fnName: 'main'
      };
      const res = root.visit(context);
      return { ...res, globalFns: [...context.globalFns], root };
    }
  },
  tokens: [...lexConfig.tokens.map(item => item.type), ...KeyWordList],
  types: [
    PROGRAM,
    STATEMENTList,
    STATEMENT,
    OPENSTATEMENT,
    TYPES,
    ARGDEFINE,
    ARGDEFINEList,
    RETURNTYPE,
    DEFINE,
    DEFINEList,
    EXPR,
    Term,
    Factor,
    RightValue,
    FUNCTIONCALL,
    CALLARGList,
    FUNCTIONRETURN,
    LOGICALEXPR,
    LOGICALAND,
    CMP,
    CMPToken
  ],
  start: PROGRAM,
  productions: [...StatementProduction, ...ExprProduction, ...LogicalProduction]
};
