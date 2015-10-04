var page = require('webpage').create();

var baseDir = './src/render';

page.viewportSize = { width: 825, height: 1125 };
page.clipRect = { top: 0, left: 0, width: 825, height: 1125 };
page.open('example/out/1.html', function() {
  page.injectJs(baseDir + '/extra.js');
  page.render('test.png');
  phantom.exit();
});
