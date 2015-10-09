var generate = require('../out/generate/generate.js').default;

var colors = {
  ether: {
    lightest: '#c6afe9',
    light: '#8d5fd3'
  },
  fire: {
    lightest: '#ffaaaa',
    light: '#ff5555'
  },
  earth: {
    lightest: '#c6e9af',
    light: '#71c837'
  },
  water: {
    lightest: '#afc6e9',
    light: '#5f8dd3'
  },
  air: {
    lightest: '#ffffff',
    light: '#ececec'
  }
};

var helpers = {
  'bg': function(type, element) {
    return 'assets/images/bg_' + type + '_' + element + '.png';
  },

  'color': function(element, shade) {
    return colors[element] && colors[element][shade];
  },

  'lowercase': function(name) {
    return name.toLocaleLowerCase().replace(' ', '-');
  }
};

// TODO(gs): Import from TSV
var cards = [
  {
    name: 'Energy Orb',
    cost: 2,
    element: '{{element.ether}}',
    type: 'device',
  },
  {
    name: 'Fire Turret',
    cost: 3,
    element: '{{element.fire}}',
    type: 'device',
  },
  {
    name: 'Rest Hollow',
    cost: 3,
    element: '{{element.earth}}',
    type: 'device',
  },
  {
    name: 'Refreshing Jar',
    cost: 3,
    element: '{{element.water}}',
    type: 'device',
  },
  {
    name: 'Dust Devil',
    cost: 2,
    element: '{{element.air}}',
    type: 'device',
  },
  {
    name: 'Mind Link',
    cost: 2,
    element: '{{element.ether}}',
    type: 'enchant',
  },
  {
    name: 'Pyrophillic',
    cost: 1,
    element: '{{element.fire}}',
    type: 'enchant',
  },
  {
    name: 'Alpha Minion',
    cost: 2,
    element: '{{element.earth}}',
    type: 'enchant',
  },
  {
    name: 'Ice Armor',
    cost: 1,
    element: '{{element.water}}',
    type: 'enchant',
  },
  {
    name: 'Intimidate',
    cost: 1,
    element: '{{element.air}}',
    type: 'enchant',
  }
];

var globals = {
  element: {
    air: 'air',
    earth: 'earth',
    ether: 'ether',
    fire: 'fire',
    water: 'water'
  }
};

generate(
    './example/template.html',
    './example/out',
    '{{lowercase _local.name}}.html',
    cards,
    globals,
    helpers,
    './example/assets');
