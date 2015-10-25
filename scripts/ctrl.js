import test from './test';
import { toClassName, writeFile } from './utils';

let chalk = require('chalk');
let fs    = require('fs');

export default function(namespace, name) {
  let ctrlname = `${name}-ctrl`;
  let ctrlClassName = toClassName(ctrlname);
  let out =
`/**
 * @class ${namespace}.${ctrlClassName}
 */
export default class {
  /**
   * @constructor
   */
  constructor() { }
}
`;
  writeFile(namespace, ctrlname, 'js', out);

  test(namespace, ctrlname);
};
