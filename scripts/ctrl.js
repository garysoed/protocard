import test from './test';
import { toClassName, toFileName } from './utils';

let fs = require('fs');

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
  fs.writeFileSync(toFileName(namespace, `${ctrlname}.js`), out, 'utf8');

  test(namespace, ctrlname);
};
