var generate = require('../out/generate/generate.js').default;
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
    element: '{{element.air}}',
    type: 'device',
  }
];

generate(
    './example/template.html',
    './example/out',
    '{{_local.name}}.html',
    cards,
    {
      'element': {
        'air': 'air'
      }
    },
    helpers,
    './example/assets');
