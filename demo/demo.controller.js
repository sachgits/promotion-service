class DemoController {
  constructor(PromotionService) {
    const promotionObject = {
      promotedElement: '.promoted-element',
      promotionCommence: Date.now() + 5000,
      promotionId: 'test-promotion',
      promotionPopover: {
        placement: 'right-top',
        title: 'Transferwise',
        content: 'Rules!',
        modalMode: true,
      },
    };

    PromotionService.addPromotion(promotionObject);

    PromotionService.showCommencingPromotion();
  }
}

DemoController.$inject = ['tw.promotionService'];

export default DemoController;
