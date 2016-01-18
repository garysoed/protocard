import clazz from './class';
import test from './test';
import { toClassName, writeFile } from './utils';

let chalk = require('chalk');
let fs = require('fs');

export default function(namespace, name) {
  console.log(`${chalk.red('[BETA]')} ctrl(${name})`);
  clazz(namespace, `${name}-ctrl`, [], 'constructor() { }');
};
