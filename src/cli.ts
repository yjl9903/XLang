#!/usr/bin/env node

import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { cac } from 'cac';

import { XLang } from './xlang';
import { BuiltinFunction } from './xlang/type';

const cli = cac('xlang');

cli
  .command('<codePath> [...args]', 'Run XLang')
  .option('-o, --out <outputPath>', 'Compile Output')
  .option('-i, --input <intputPath>', 'Run input')
  .option('-l, --lib <libPath>', 'Import library functions')
  .action(
    async (
      codePath,
      args: string[],
      option: { out?: string; input?: string; lib?: string }
    ) => {
      const codeText = readFileSync(codePath, 'utf-8');
      const runtime = new XLang();
      runtime.addFn('print', 'voidType', ['stringType'], (text: string) => {
        console.log(text);
      });
      if (option.lib !== undefined) {
        const fns: Array<BuiltinFunction> = (
          await import(path.resolve(process.cwd(), option.lib))
        ).lib;
        for (const fn of fns) {
          runtime.addFn(fn.name, fn.type, fn.args, fn.fn);
        }
      }
      const res = runtime.compile(codeText);
      if (res.ok) {
        if (option.out) {
          writeFileSync(option.out, JSON.stringify(res, null, 2), 'utf8');
        }
      } else {
        console.log('Compile Fail');
        if (res.token) {
          console.log(res.token);
        }
        if (res.message) {
          console.log(res.message);
        }
        return;
      }
      if (option.input === undefined) {
        runtime.run(res, args);
      } else {
        const text = readFileSync(option.input, 'utf-8')
          .split('\n')
          .map(row =>
            row
              .trim()
              .split(' ')
              .filter(s => s.length > 0)
          )
          .reduce((pre, cur) => (pre.push(...cur), pre), [] as string[]);
        runtime.run(res, args, text);
      }
    }
  );

cli.help();

cli.version(
  JSON.parse(readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'))
    .version
);

cli.parse();
