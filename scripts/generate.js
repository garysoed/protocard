import ctrl from './ctrl';
import dialog from './dialog';
import { directive } from './module';
import test from './test';
import ng from './ng';

var args = process.argv.slice(2);
var type = args[0];
var namespace = args[1];
var name = args[2];

switch(type) {
  case 'dialog':
    ctrl(namespace, name);
    dialog(namespace, name);
    ng(namespace, name);
    break;
  case 'directive':
    ctrl(namespace, name);
    ng(namespace, name);
    directive(namespace, name);
    break;
  case 'test':
    test(namespace, name);
    break;
  default:
    throw Error('Unsupported type: ' + type);
}
