import { Variable, Literal } from './type';

export type LeafType = 'Variable' | 'Literal';

export type BinOPType = 'Plus' | 'Minus' | 'Mul' | 'Div';

export interface BinOP {
  type: BinOPType;
  dst: Variable;
  x: Literal | Variable;
  y: Literal | Variable;
}

export type UnitOPType = 'Negative' | 'Assign';

export interface UnitOP {
  type: UnitOPType;
  dst: Variable;
  src: Literal | Variable;
}

export type GotoType = 'Goto';

export interface Goto {
  type: GotoType;
  dst: number;
}

export type IfGotoType = 'IfGoto';

export interface IfGoto {
  type: IfGotoType;
  condition: Literal | Variable;
  dst: number;
}

export type ParamType = 'Param';

export interface Param {
  type: ParamType;
  src: Literal | Variable;
}

export type AllocateStackType = 'Stack';

export interface AllocateStack {
  type: AllocateStackType;
  number: number;
}

export type RootType = 'Root';

export type FunctionDefType = 'FunctionDef';

export type StatementListType = 'StatementList';

export type DefineListType = 'DefineList';

export type DefineType = 'Define';

export type ASTNodeType =
  | RootType
  | FunctionDefType
  | StatementListType
  | DefineListType
  | DefineType
  | BinOPType
  | UnitOPType
  | GotoType
  | AllocateStackType
  | LeafType;

class BasicASTNode {
  type: ASTNodeType;

  constructor(type: ASTNodeType) {
    this.type = type;
  }
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
}

export class FunctionASTNode extends BasicASTNode {
  name: string;
  statements: StatementASTNode[] = [];

  constructor(name: string, statements: StatementListASTNode) {
    super('FunctionDef');
    this.name = name;
    statements.statements.forEach(statement => this.statements.push(statement));
  }
}

export class StatementListASTNode extends BasicASTNode {
  statements: StatementASTNode[] = [];
  createContext: boolean;

  constructor(createContext = false) {
    super('StatementList');
    this.createContext = createContext;
  }

  merge(other: StatementListASTNode) {
    if (other.createContext) {
      this.statements.push(other);
    } else {
      other.statements.forEach(statement => this.statements.push(statement));
    }
  }
}

export type ValueASTNode = BinOPASTNode | UnitOPASTNode | LeafASTNode;

export type StatementASTNode =
  | StatementListASTNode
  | ValueASTNode
  | DefineListASTNode;

export class DefineListASTNode extends BasicASTNode {
  defs: DefineASTNode[] = [];
  isConst: boolean = false;

  constructor() {
    super('DefineList');
  }

  merge(other: DefineListASTNode) {
    other.defs.forEach(def => this.defs.push(def));
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
}

export class LeafASTNode extends BasicASTNode {
  dst: Variable | Literal;

  constructor(item: Variable | Literal) {
    super('id' in item ? 'Variable' : 'Literal');
    this.dst = item;
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
}

export class UnitOPASTNode extends BasicASTNode {
  dst: Variable;
  src: ValueASTNode;

  constructor(type: UnitOPType, dst: Variable, src: ValueASTNode) {
    super(type);
    this.dst = dst;
    this.src = src;
  }
}
