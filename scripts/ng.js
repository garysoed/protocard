import { toFileName } from './utils';

let fs = require('fs');

export default function(namespace, name) {
  let out = `TODO: ${name}`;
  fs.writeFileSync(toFileName(namespace, `${name}.ng`), out, 'utf8');
};
