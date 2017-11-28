import angular from 'angular';
import ngCookies from 'angular-cookies';

import 'tw-styleguide-components/dist/js/styleguide-components';

import promotionService from './promotion.service';

export default angular
  .module('tw.promotion', [ngCookies, 'tw.styleguide-components'])
  .service('tw.promotionService', promotionService).name;
