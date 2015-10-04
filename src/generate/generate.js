var fs = require('fs');
var handlebars = require('handlebars');
var path = require('path');

// TODO(gs): Move to util class.
// TODO(gs): Enable handlebar support in CSS and external files.
function mixin(fromObj, toObj) {
  for (var key in fromObj) {
    if (toObj[key] !== undefined) {
      if (typeof toObj[key] !== 'object') {
        // TODO(gs): Trace the object.
        throw Error('Conflict at key ' + key);
      }
      mixin(fromObj[key], toObj[key]);
    } else {
      toObj[key] = JSON.parse(JSON.stringify(fromObj[key]));
    }
  }
}

// TODO(gs): Gulpify this.
function generate(templatePath, outDir, outName, cardDataList, config) {
  var globals = config.globals || {};
  var helpers = config.helpers || {};
  var resourceDir = config.resourceDir;

  // TODO(gs): Recursively resolve strings.
  // Register the helpers.
  for (var key in helpers) {
    handlebars.registerHelper(key, helpers[key]);
  }

  var templateText = fs.readFileSync(templatePath, 'utf8');
  var template = handlebars.compile(templateText, { compat: true });

  var outNameTemplate = handlebars.compile(outName, { compat: true });

  if (!fs.statSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  // Generates all the cards.
  cardDataList.forEach(function(cardData) {
    var data = {
      _pc: {
        size: {
          height: '1125px',
          width: '825px'
        }
      }
    };
    mixin({_card: cardData}, data);
    var rendered = template(data);
    var outName = outNameTemplate(data);
    fs.writeFileSync(path.join(outDir, outName), rendered);
  });

  // Copy all the resources.
  if (resourceDir) {
    var resourceName = path.basename(resourceDir);
    if (fs.statSync(resourceDir)) {
      fs.unlink(resourceDir);
    }
    fs.linkSync(resourceDir, path.join(outDir, resourceName));
  }
}

module.exports = generate;
