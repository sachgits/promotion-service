import angular from 'angular';

import 'angular-cookies';
import 'angular-sanitize';
import 'angular-translate';
import 'angular-translate-interpolation-messageformat';

import 'tw-styleguide-components/dist/js/styleguide-components';
import '@transferwise/frontend-common/dist/tw-common';

import promotionService from './promotion.service';

export default angular
  .module('tw.promotion', ['tw.styleguide-components', 'tw.common.config', 'tw.common.analytics'])
  .service('tw.promotionService', promotionService).name;
