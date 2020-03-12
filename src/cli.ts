#!/usr/bin/env node

import path from 'path';
import { readFileSync } from 'fs';
import { cac } from 'cac';

import { XLang } from './xlang';

const cli = cac('xlang');

cli.command('<Code>', 'Run XLang').action(codePath => {
  const code = readFileSync(codePath, 'utf-8');
  new XLang(code);
});

cli.help();

cli.version(
  JSON.parse(readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'))
    .version
);

cli.parse();
