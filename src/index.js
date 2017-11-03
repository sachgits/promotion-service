import angular from 'angular';
import ngCookies from 'angular-cookies';

import 'tw-styleguide-components/dist/js/styleguide-components';

import promotionService from './promotion.service';

export default angular
  .module('Promotion', [ngCookies, 'tw.styleguide-components'])
  .service('PromotionService', promotionService).name;
