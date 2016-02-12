var gt = require('../../gulptree/main.js')(__dirname);
var tasks = require('../../gulptasks');

tasks.allTests(gt, 'out/text', 'src/text');
