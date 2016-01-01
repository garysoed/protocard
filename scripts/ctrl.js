import test from './test';
import { toClassName, writeFile } from './utils';

let chalk = require('chalk');
let fs    = require('fs');

export default function(namespace, name) {
  let ctrlname = `${name}-ctrl`;
  let ctrlClassName = toClassName(ctrlname);
  let out =
`export default class {
  constructor() { }
}
`;
  writeFile(namespace, ctrlname, 'ts', out);

  test(namespace, ctrlname);
};
