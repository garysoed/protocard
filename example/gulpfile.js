var gulp = require('gulp');
var debug = require('gulp-debug');
var webshot = require('gulp-webshot');

var generate = require('../out/generate/gulp').default;
var Extract = require('../out/convert/extract');

var fs = require('fs');

var helpers = {
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

var partials = {
  'E': '<img class="icon circled" src="assets/icons/energy.svg">',
  'T': '<img class="icon" src="assets/icons/tap.svg">'
};

var globals = {
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

gulp.task('copy-assets', function() {
  return gulp.src(['assets/**'], { base: '.' })
      .pipe(debug({ title: 'copy-assets' }))
      .pipe(gulp.dest('out'));
});

gulp.task('generate', gulp.parallel(
    'copy-assets',
    function _generate() {
      var content = fs.readFileSync('./raw.tsv', 'utf8');
      var cards = Extract.fromTsv(content, 2).write(function(lineData) {
        var type = lineData[2].toLowerCase();
        var card = {
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

        if (lineData[0] === 'Psyche Mage') {
          card['attack'] = '?';
        }

        return card;
      });

      return gulp.src('template.html')
          .pipe(generate(
            '{{lowercase _.name}}.html',
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

gulp.task('default', gulp.task('generate'));
