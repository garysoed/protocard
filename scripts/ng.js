import { writeFile } from './utils';

let fs = require('fs');

export default function(namespace, name) {
  let out = `TODO: ${name}`;
  writeFile(namespace, name, 'ng', out);
};
