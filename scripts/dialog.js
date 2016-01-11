import test from './test';
import { toClassName, writeFile } from './utils';
import * as module from './module';

var fs = require('fs');

export function service(namespace, name) {
  let ctrlName = `${name}-ctrl`;
  let ctrlClassName = toClassName(ctrlName);
  let serviceName = `${name}-service`;
  let serviceClassName = toClassName(serviceName);
  let out =
`import ${ctrlClassName} from './${ctrlName}';

export default class {
  private $mdDialog_: angular.material.IDialogService;

  constructor($mdDialog: angular.material.IDialogService) {
    this.$mdDialog_ = $mdDialog;
  }

  show($event: MouseEvent) {
    this.$mdDialog_.show({
      controller: ${ctrlClassName},
      controllerAs: 'ctrl',
      targetEvent: $event,
      templateUrl: '${namespace}/${name}.ng'
    });
  }
};
`;

  writeFile(namespace, serviceName, 'ts', out);
  test(namespace, serviceName);
};

export default function(namespace, name) {
  service(namespace, `${name}-dialog`);
  module.service(namespace, `${name}-dialog`);
};
