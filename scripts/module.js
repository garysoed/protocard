import { toClassName, writeFile } from './utils';

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

  writeFile(namespace, `${name}-module`, 'js', out);
};

export function directive(namespace, name) {
  let ctrlName = `${name}-ctrl`;
  let ctrlClassName = toClassName(ctrlName);
  let moduleName = `${name}-module`;
  let moduleClassName = toClassName(moduleName);
  let className = toClassName(name);
  let out =
`import ${ctrlClassName} from './${ctrlName}';

export default angular
    .module('pc.${namespace}.${moduleClassName}', [])
    .directive('pc${className}', () => {
      return {
        controller: ${ctrClassName},
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
        },
        templateUrl: './${namespace}/${name}.ng'
      };
    });
`;

  writeFile(namespace, `${name}-module`, 'js', out);
};
