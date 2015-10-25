let chalk = require('chalk');
let fs    = require('fs');
let path  = require('path');

export function toClassName(name) {
  return name
      .split('-')
      .map(function(part) {
        return part[0].toUpperCase() + part.substring(1);
      })
      .join('');
};

function toFileName(namespace, name) {
  return path.join(__dirname, '..', '..', 'src', namespace, `${name}`)
};

export function writeFile(namespace, name, ext, content) {
  let filename = toFileName(namespace, `${name}.${ext}`);
  fs.writeFileSync(filename, content, 'utf8');
  console.log(chalk.blue(`Wrote: ${filename}`));
};
