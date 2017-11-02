import angular from 'angular';

import PromotionService from '../src/';
import DemoController from './demo.controller';

export default angular
  .module('promotion.service.demo', [PromotionService])
  .controller('DemoController', DemoController).name;
