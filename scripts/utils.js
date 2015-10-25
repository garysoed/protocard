let path = require('path');

export function toClassName(name) {
  return name
      .split('-')
      .map(function(part) {
        return part[0].toUpperCase() + part.substring(1);
      })
      .join('');
};

export function toFileName(namespace, name) {
  return path.join(__dirname, '..', '..', 'src', namespace, `${name}`)
};
