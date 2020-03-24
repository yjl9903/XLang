import path from 'path';
import { promises } from 'fs';
import { XLang } from '../src/xlang';

const runtime = new XLang();

async function read(name: string) {
  return await promises.readFile(path.resolve('examples', name), 'utf-8');
}

beforeAll(() => {
  runtime.addFn('print', 'voidType', ['stringType'], (text: string) => {
    console.log(text);
  });
});

test('HelloWorld', async () => {
  const helloWorld = await read('helloworld.xl');
  const code = runtime.compile(helloWorld);
  expect(code.ok).toBeTruthy();
});

test('aplusb', async () => {
  const aplusb = await read('aplusb.xl');
  const code = runtime.compile(aplusb);
  expect(code.ok).toBeTruthy();
});

test('gpa', async () => {
  const gpa = await read('gpa.xl');
  const code = runtime.compile(gpa);
  expect(code.ok).toBeTruthy();
});

test('sum', async () => {
  const sum = await read('sum.xl');
  const code = runtime.compile(sum);
  expect(code.ok).toBeTruthy();
});

test('fib', async () => {
  const fib = await read('fib.xl');
  const code = runtime.compile(fib);
  expect(code.ok).toBeTruthy();
});

test('repeator', async () => {
  const repeator = await read('repeator.xl');
  const code = runtime.compile(repeator);
  expect(code.ok).toBeTruthy();
});

test('multable', async () => {
  const multable = await read('multable.xl');
  const code = runtime.compile(multable);
  expect(code.ok).toBeTruthy();
});

test('array', async () => {
  const array = await read('array.xl');
  const code = runtime.compile(array);
  expect(code.ok).toBeTruthy();
});
