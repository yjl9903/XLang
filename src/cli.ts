#!/usr/bin/env node

import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { cac } from 'cac';

import { XLang } from './xlang';

const cli = cac('xlang');

cli
  .command('<codePath> [...args]', 'Run XLang')
  .option('-o, --out <outputPath>', 'Compile Output')
  .action((codePath, args: string[], option: { out?: string }) => {
    const codeText = readFileSync(codePath, 'utf-8');
    const runtime = new XLang();
    runtime.addFn('print', 'voidType', ['stringType'], (text: string) => {
      console.log(text);
    });
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
    runtime.run(res, args);
  });

cli.help();

cli.version(
  JSON.parse(readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'))
    .version
);

cli.parse();
