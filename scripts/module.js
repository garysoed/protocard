import { toClassName, toFileName, writeFile } from './utils';

let fs = require('fs');

export function service(namespace, name) {
  let serviceName = `${name}-service`;
  let serviceClassName = toClassName(serviceName);
  let moduleName = `${name}-module`;
  let moduleClassName = toClassName(moduleName);
  let out =
`import ${serviceClassName} from './${serviceName}';

export default angular
    .module('pc.${namespace}.${moduleClassName}', [])
    .service('${serviceClassName}', ${serviceClassName});
`;

  writeFile(namespace, `${serviceName}-module`, 'ts', out);
};

export function directive(namespace, name) {
  let ctrlName = `${name}-ctrl`;
  let ctrlClassName = toClassName(ctrlName);
  let moduleName = `${name}-module`;
  let moduleClassName = toClassName(moduleName);
  let className = toClassName(name);
  let dir = namespace.replace('.', '/');
  let out =
`import ${ctrlClassName} from './${ctrlName}';

export default angular
    .module('pc.${namespace}.${moduleClassName}', [])
    .directive('pc${className}', () => {
      return {
        controller: ${ctrlClassName},
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
        },
        templateUrl: './${dir}/${name}.ng'
      };
    });
`;

  writeFile(namespace, `${name}-module`, 'ts', out);
};
