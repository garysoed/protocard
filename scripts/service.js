import clazz from './class';
import { service as serviceModule } from './module';

let chalk = require('chalk');

function main(namespace, name) {
  clazz(namespace, `${name}-service`, [], 'constructor() {}');
}

export default function(namespace, name) {
  console.log(`${chalk.red('[BETA]')} service(${name})`);
  main(namespace, name);
  serviceModule(namespace, name);
};
