import test from './test';
import { toClassName, writeFile } from './utils';

let chalk = require('chalk');

function genImports(imports) {
  let importsOut = '';
  return imports
      .map(importItem => {
        let filename = importItem.split('/').pop();
        return `import ${toClassName(filename)} from '${importItem}';`
      })
      .join('\n');
}

function genMain(imports, content) {
  return (
`/**
 * @fileoverview TODO(gs)
 */
${genImports(imports)}

export default class {
  ${content}
};
`);
}

export default function(namespace, name, imports, content) {
  console.log(`${chalk.red('[BETA]')} class(${name})`);
  let out = genMain(imports, content);
  writeFile(namespace, name, 'ts', out);
  test(namespace, name);
}
