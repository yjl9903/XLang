import { Variable, ValueType } from './type';

export class SymbolTable {
  table: Map<string, Variable> = new Map();
  father?: SymbolTable;

  constructor(father?: SymbolTable) {
    this.father = father;
  }

  add(
    id: number,
    name: string,
    type?: ValueType,
    {
      isConst = true,
      isArg = false,
      isGlobal = false,
    }: { isConst?: boolean; isArg?: boolean; isGlobal?: boolean } = {}
  ) {
    if (this.table.has(name)) {
      throw new Error(`Variable ${name} has been defined`);
    } else {
      this.table.set(name, {
        id,
        name,
        type,
        isArg,
        isConst,
        isGlobal,
      });
    }
  }

  query(name: string): Variable | undefined {
    if (this.table.has(name)) {
      return this.table.get(name);
    } else if (this.father) {
      return this.father.query(name);
    } else {
      return undefined;
    }
  }
}
