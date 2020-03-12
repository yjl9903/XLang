import { Variable, ValueType } from './type';

export class SymbolTable {
  table: Map<string, Variable> = new Map();
  father?: SymbolTable;

  constructor(father?: SymbolTable) {
    this.father = father;
  }

  add(id: number, name: string, isConst = true, type?: ValueType) {
    if (this.table.has(name)) {
      throw new Error(`Variable ${name} has been defined`);
    } else {
      this.table.set(name, {
        id,
        name,
        type,
        isArg: false,
        isConst
      });
    }
  }

  setType(name: string, type: ValueType) {
    const v = this.query(name);
    if (v) {
      if (v.type) {
        if (v.type !== type) {
          throw new Error(
            `${v.type} variable ${name} can not be assigned ${type} value`
          );
        }
      } else {
        v.type = type;
      }
    } else {
      throw new Error(`Variable ${name} does not exist`);
    }
  }

  query(name: string) {
    if (this.table.has(name)) {
      return this.table.get(name);
    } else if (this.father) {
      return this.father.query(name);
    } else {
      return undefined;
    }
  }
}
