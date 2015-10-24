import Extract from '../convert/extract';
import Generator from './generator';

const __$document__ = Symbol('$document');
const __$scope__ = Symbol('$scope');
const __generated__ = Symbol('generated');
const __loadFile__ = Symbol('loadFile');
const __localStorage__ = Symbol('localStorage');

var GLOBALS = {
  element: {
    air: 'air',
    earth: 'earth',
    base: 'ether',
    fire: 'fire',
    water: 'water'
  },
  type: {
    d: 'device',
    e: 'enchant',
    m: 'minion',
    s: 'spell'
  }
};

var HELPERS = {
  'bg': function(type, element) {
    return 'assets/backgrounds/' + element + '_' + type + '.png';
  },

  'frame': function(element) {
    return 'assets/backgrounds/' + element + '_frame.png';
  },

  // TODO(gs): Make this built in.
  'ifeq': function(a, b, options) {
    if (a == b) {
      return options.fn(this);
    }
  },

  'lowercase': function(name) {
    return name.toLocaleLowerCase().replace(' ', '-');
  }
};

const PARTIALS = {
  'E': '<img class="icon circled" src="assets/icons/energy.svg">',
  'T': '<img class="icon" src="assets/icons/tap.svg">'
};

const GENERATOR = new Generator(Handlebars, {
  globals: GLOBALS,
  helpers: HELPERS,
  partials: PARTIALS
});

export default class {
  constructor($document, $scope, $window) {
    this[__$document__] = $document[0];
    this[__$scope__] = $scope;
    this[__generated__] = [];
    this[__localStorage__] = $window.localStorage;
  }

  [__loadFile__](inputName, storageKey) {
    // TODO(gs): Move this to convert/
    let file = this[__$document__]
        .querySelector(`input[type="file"][name="${inputName}"]`)
        .files[0];
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.addEventListener('loadend', () => {
        this[__localStorage__].setItem(storageKey, fileReader.result);
        resolve();
      });
      fileReader.readAsText(file);
    });
  }

  onLoadClick() {
    Promise.all([
      this[__loadFile__]('data', 'data'),
      this[__loadFile__]('template', 'template')
    ]).then(() => {
      this[__$scope__].$apply(() => {});
    });
  }

  onGenerateClick() {
    let content = this[__localStorage__].getItem('data');
    let cards = Extract
        .fromTsv(content, 2)
        .write(lineData => {
          let type = lineData[2].toLowerCase();
          let card = {
            'name': lineData[0],
            'cost': lineData[8],
            'element': '{{element.' + lineData[1].toLowerCase() + '}}',
            'type': '{{type.' + type.substr(0, 1) + '}}',
            'description': lineData[7]
          };

          if (type === 'device' || type === 'minion') {
            card['life'] = lineData[4] || 0;
          }

          if (type === 'minion') {
            card['attack'] = lineData[5] || 0;
            card['armor'] = lineData[6] || 0;
          }

          if (lineData[0] === 'Poltergeist') {
            card['attack'] = '?';
          }

          return card;
        });
    this[__generated__] = GENERATOR.generate(
        this[__localStorage__].getItem('template'),
        '{{lowercase _.name}}.html',
        cards);
  }

  getGenerated() {
    return this[__generated__];
  }

  getGeneratedData(key) {
    return this.getGenerated()[key];
  }

  hasData() {
    return !!this[__localStorage__].getItem('data')
        && !!this[__localStorage__].getItem('template');
  }
};
