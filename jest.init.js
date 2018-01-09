require('angular');
require('angular-mocks');
require('angular-sanitize');
require('angular-cookies');
require('angular-translate');
require('angular-translate-interpolation-messageformat');

const _ = require('underscore');
const jquery = require('jquery');

global._ = _;
global.$ = jquery;

require('./src/index');
