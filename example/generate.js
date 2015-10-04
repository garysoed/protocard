var generate = require('../src/generate/generate.js');
var helpers = {
  'bg': function(type, element) {
    return 'assets/images/bg_' + type + '_' + element + '.png';
  }
};

// TODO(gs): Import from TSV
var cards = [
  {
    name: '1',
    element: 'ether',
    type: 'device',
  },
  {
    name: '2',
    element: 'fire',
    type: 'device',
  },
  {
    name: '3',
    element: 'water',
    type: 'device',
  },
  {
    name: '4',
    element: 'air',
    type: 'device',
  }
];

generate(
    './example/template.html',
    './example/out',
    '{{_card.name}}.html',
    cards,
    {
      helpers: helpers,
      resourceDir: './example/assets'
    });
