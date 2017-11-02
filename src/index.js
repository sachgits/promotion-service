import angular from 'angular';
import ngCookies from 'angular-cookies';

import 'tw-styleguide-components/dist/js/styleguide-components';

import promotionService from './promotion.service';

import popover from '../../styleguide-components/src/help/pop-over/'

export default angular
  .module('Promotion', [ngCookies, popover])
  .service('PromotionService', promotionService).name;
