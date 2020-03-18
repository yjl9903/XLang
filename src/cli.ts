#!/usr/bin/env node

import path from 'path';
import { readFileSync } from 'fs';
import { cac } from 'cac';

import { XLang } from './xlang';

const cli = cac('xlang');

cli.command('<Code>', 'Run XLang').action(codePath => {
  const codeText = readFileSync(codePath, 'utf-8');
  const runtime = new XLang();
  runtime.addFn('print', 'voidType', ['stringType'], (text: string) => {
    console.log(text);
  });
  const res = runtime.compile(codeText);
  if (res.ok) {
    console.log(JSON.stringify(res, null, 2));
  } else {
    console.log('Compile Fail');
  }
});

cli.help();

cli.version(
  JSON.parse(readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'))
    .version
);

cli.parse();
