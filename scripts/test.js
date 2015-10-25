import { toClassName, toFileName } from './utils';

let fs = require('fs');

export default function(namespace, name) {
  let testname = `${name}_test`;
  let classname = toClassName(name);
  let out =
`import TestBase from '../testbase';

import ${classname} from './${name}';

describe('${namespace}.${classname}', () => {

});
`;
  // TODO(gs): Print out the file name.
  fs.writeFileSync(toFileName(namespace, `${testname}.js`), out, 'utf8');
};
