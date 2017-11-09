class DemoController {
  constructor(PromotionService) {
    var promotionObject = {
      promotedElement: '.promoted-element',
      promotionCommence: Date.now(),
      promotionPopover: {
        placement: 'right-top',
        title: 'Transferwise',
        content: 'Rules!',
      },
    };

    PromotionService.addPromotion(promotionObject);

    PromotionService.showLastPromotion();
  }
}

DemoController.$inject = ['PromotionService'];

export default DemoController;
