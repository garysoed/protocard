var gulp = require('gulp');
var debug = require('gulp-debug');
var webshot = require('gulp-webshot');

var generate = require('../out/generate/gulp').default;

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
    return 'assets/backgrounds/' + element + '_' + type + '.png';
  },

  'color': function(element, shade) {
    return colors[element] && colors[element][shade];
  },

  'lowercase': function(name) {
    return name.toLocaleLowerCase().replace(' ', '-');
  }
};

var partials = {
  'energy': '<img class="icon" src="assets/icons/energy.svg"></img>'
};

// TODO(gs): Import from TSV
var cards = [
  {
    name: 'Energy Orb',
    cost: 2,
    element: '{{element.ether}}',
    type: 'device',
    description: '+1 {{> energy}}'
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

gulp.task('copy-assets', function() {
  return gulp.src(['assets/**'], { base: '.' })
      .pipe(debug({ title: 'copy-assets' }))
      .pipe(gulp.dest('out'));
});

gulp.task('generate', gulp.parallel(
    'copy-assets',
    function _generate() {
      return gulp.src('template.html')
          .pipe(generate(
            '{{lowercase _local.name}}.html',
            cards,
            {
              globals: globals,
              helpers: helpers,
              partials: partials
            }
          ))
          .pipe(debug({ title: 'generate' }))
          .pipe(gulp.dest('out'));
    })
);

gulp.task('render', gulp.series(
    'generate',
    function _render() {
      return gulp.src('out/*.html')
          .pipe(webshot({ dest: 'render', root: 'out' }));
    }
));
