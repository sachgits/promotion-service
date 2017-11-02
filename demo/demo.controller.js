class DemoController {
  constructor(PromotionService) {
    PromotionService.addPromotion('.promoted-element', 'right', 'Transferwise', 'Rules!')

    setTimeout(function() {
      PromotionService.showLastPromotion();
    }, 1000);
  }
}

DemoController.$inject = ['PromotionService'];

export default DemoController;
