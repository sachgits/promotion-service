import angular from 'angular';

import 'tw-styleguide-components/dist/js/styleguide-components';

import promotionService from './promotion.service';

export default angular
  .module('tw.promotion', ['tw.styleguide-components'])
  .service('tw.promotionService', promotionService).name;
