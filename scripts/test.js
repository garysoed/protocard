import { toClassName, writeFile } from './utils';

let fs = require('fs');

export default function(namespace, name) {
  let testname = `${name}_test`;
  let classname = toClassName(name);
  let testbaseDir = namespace
      .split('.')
      .map(part => '..')
      .join('/');
  let out =
`import TestBase from '${testbaseDir}/testbase';

import ${classname} from './${name}';

describe('${namespace}.${classname}', () => {

});
`;
  writeFile(namespace, testname, 'js', out);
};
