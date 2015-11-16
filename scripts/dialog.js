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

/**
 * @class ${namespace}.${serviceClassName}
 */
export default class {
  /**
   * @constructor
   * @param {ng.$mdDialog} $mdDialog
   */
  constructor($mdDialog) {
    this.$mdDialog_ = $mdDialog;
  }

  /**
   * Shows the dialog.

   * @method show
   * @param {ng.$event} $event The Angular event triggering the dialog.
   * @return {Promise} Promise that will be resolved when the dialog is hidden, or rejected if the
   *    dialog is cancelled.
   */
  show($event) {
    this.$mdDialog_.show({
      controller: ${ctrlClassName},
      controllerAs: 'ctrl',
      targetEvent: $event,
      templateUrl: '${namespace}/${name}.ng'
    });
  }
};
`;

  writeFile(namespace, serviceName, 'js', out);
  test(namespace, serviceName);
};

export default function(namespace, name) {
  service(namespace, `${name}-dialog`);
  module.service(namespace, `${name}-dialog`);
};
