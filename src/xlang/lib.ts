import { BuiltinFunction } from './type';

interface XLangArray {
  name: string;
  value: any[];
  father?: XLangArray;
}

const Arrays = new Map<string, XLangArray>();

export const beforeRunHooks: Array<(...args: any[]) => any> = [
  () => {
    Arrays.clear();
  }
];

export const ArrayLib: BuiltinFunction[] = [
  {
    name: 'Array::new',
    args: ['stringType'],
    type: 'voidType',
    fn(name: string) {
      const fa = Arrays.get(name);
      const newArray = {
        name,
        value: [],
        father: fa
      };
      Arrays.set(name, newArray);
    }
  },
  {
    name: 'Array::assign',
    args: ['stringType', 'numberType'],
    type: 'voidType',
    fn(name: string, len: number) {
      if (!Arrays.has(name)) {
        throw new Error(`Array "${name}" is not defined`);
      }
      const arr = Arrays.get(name) as XLangArray;
      arr.value = [];
      for (let i = 0; i < len; i++) {
        arr.value.push(0);
      }
    }
  },
  {
    name: 'Array::length',
    args: ['stringType'],
    type: 'numberType',
    fn(name: string) {
      if (!Arrays.has(name)) {
        throw new Error(`Array "${name}" is not defined`);
      }
      return (Arrays.get(name) as XLangArray).value.length;
    }
  },
  {
    name: 'Array::push',
    args: ['stringType', 'numberType'],
    type: 'numberType',
    fn(name: string, x: number) {
      if (!Arrays.has(name)) {
        throw new Error(`Array "${name}" is not defined`);
      }
      const arr = Arrays.get(name) as XLangArray;
      arr.value.push(x);
      return arr.value.length;
    }
  },
  {
    name: 'Array::pop',
    args: ['stringType'],
    type: 'numberType',
    fn(name: string) {
      if (!Arrays.has(name)) {
        throw new Error(`Array "${name}" is not defined`);
      }
      const arr = Arrays.get(name) as XLangArray;
      return arr.value.pop();
    }
  },
  {
    name: 'Array::get',
    args: ['stringType', 'numberType'],
    type: 'numberType',
    fn(name: string, i: number) {
      if (!Arrays.has(name)) {
        throw new Error(`Array "${name}" is not defined`);
      }
      const arr = Arrays.get(name) as XLangArray;
      if (i < 0 || i >= arr.value.length) {
        throw new Error(`Array "${arr.name}" visit out of bound`);
      }
      return arr.value[i];
    }
  },
  {
    name: 'Array::set',
    args: ['stringType', 'numberType', 'numberType'],
    type: 'numberType',
    fn(name: string, i: number, x: number) {
      if (!Arrays.has(name)) {
        throw new Error(`Array "${name}" is not defined`);
      }
      const arr = Arrays.get(name) as XLangArray;
      if (i < 0 || i >= arr.value.length) {
        throw new Error(`Array "${arr.name}" visit out of bound`);
      }
      return (arr.value[i] = x);
    }
  },
  {
    name: 'Array::clear',
    args: ['stringType'],
    type: 'voidType',
    fn(name: string) {
      if (!Arrays.has(name)) {
        throw new Error(`Array "${name}" is not defined`);
      }
      const arr = Arrays.get(name) as XLangArray;
      arr.value = [];
    }
  },
  {
    name: 'Array::delete',
    args: ['stringType'],
    type: 'voidType',
    fn(name: string) {
      if (!Arrays.has(name)) {
        throw new Error(`Array "${name}" is not defined`);
      }
      const arr = Arrays.get(name) as XLangArray;
      if (arr.father) {
        Arrays.set(name, arr.father);
      } else {
        Arrays.delete(name);
      }
    }
  }
];

export const StringLib: BuiltinFunction[] = [
  {
    name: 'String::length',
    args: ['stringType'],
    type: 'numberType',
    fn(s: string) {
      return s.length;
    }
  },
  {
    name: 'String::get',
    args: ['stringType', 'numberType'],
    type: 'stringType',
    fn(s: string, i: number) {
      if (i < 0 || i >= s.length) {
        throw new Error('visit undefined memory');
      }
      return s[i];
    }
  },
  {
    name: 'String::to_number',
    args: ['stringType'],
    type: 'numberType',
    fn(s: string) {
      return parseInt(s);
    }
  },
  {
    name: 'String::to_float',
    args: ['stringType'],
    type: 'numberType',
    fn(s: string) {
      return parseFloat(s);
    }
  }
];

export const NumberLib: BuiltinFunction[] = [
  {
    name: 'Number::to_string',
    args: ['numberType'],
    type: 'stringType',
    fn(a: number) {
      return String(a);
    }
  },
  {
    name: 'Number::max',
    args: ['numberType', 'numberType'],
    type: 'numberType',
    fn(a: number, b: number) {
      return Math.max(a, b);
    }
  },
  {
    name: 'Number::min',
    args: ['numberType', 'numberType'],
    type: 'numberType',
    fn(a: number, b: number) {
      return Math.min(a, b);
    }
  },
  {
    name: 'Number::abs',
    args: ['numberType'],
    type: 'numberType',
    fn(a: number) {
      return Math.abs(a);
    }
  },
  {
    name: 'rand',
    args: ['numberType', 'numberType'],
    type: 'numberType',
    fn(l: number, r: number) {
      return Math.floor(Math.random() * (r - l + 1) + l);
    }
  }
];

export const FloatLib: BuiltinFunction[] = [
  {
    name: 'Float::to_string',
    args: ['floatType'],
    type: 'stringType',
    fn(a: number) {
      return String(a);
    }
  },
  {
    name: 'Float::floor',
    args: ['floatType'],
    type: 'numberType',
    fn(a: number) {
      return Math.floor(a);
    }
  },
  {
    name: 'Float::round',
    args: ['floatType'],
    type: 'numberType',
    fn(a: number) {
      return Math.round(a);
    }
  },
  {
    name: 'Float::ceil',
    args: ['floatType'],
    type: 'numberType',
    fn(a: number) {
      return Math.ceil(a);
    }
  },
  {
    name: 'Float::max',
    args: ['numberType', 'numberType'],
    type: 'numberType',
    fn(a: number, b: number) {
      return Math.max(a, b);
    }
  },
  {
    name: 'Float::min',
    args: ['floatType', 'floatType'],
    type: 'floatType',
    fn(a: number, b: number) {
      return Math.min(a, b);
    }
  },
  {
    name: 'Float::abs',
    args: ['floatType'],
    type: 'floatType',
    fn(a: number) {
      return Math.abs(a);
    }
  },
  {
    name: 'Float::sqrt',
    args: ['floatType'],
    type: 'floatType',
    fn(a: number) {
      return Math.sqrt(a);
    }
  }
];
