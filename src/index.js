import angular from 'angular';

import 'angular-cookies';
import 'angular-sanitize';
import 'angular-translate';
import 'angular-translate-interpolation-messageformat';

import '@transferwise/styleguide-components/js/styleguide-components';
import '@transferwise/frontend-common/dist/tw-common';

import PromotionService from './promotion.service';

export const promotionServiceName = 'tw.promotionService';

export default angular
  .module('tw.promotion', ['tw.styleguide-components', 'tw.common.config', 'tw.common.analytics'])
  .service(promotionServiceName, PromotionService).name;
