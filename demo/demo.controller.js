class DemoController {
  constructor(PromotionService) {
    PromotionService.addPromotion('.promoted-element', 'right', 'Transferwise', 'Rules!');

    PromotionService.showLastPromotion();
  }
}

DemoController.$inject = ['PromotionService'];

export default DemoController;
