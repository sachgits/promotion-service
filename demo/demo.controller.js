class DemoController {
  constructor(PromotionService) {
    const promotionObject = {
      promotedElement: '.promoted-element',
      promotionCommence: Date.now(),
      promotionPopover: {
        placement: 'right-top',
        title: 'Transferwise',
        content: 'Rules!',
        modalMode: true,
      },
    };

    PromotionService.addPromotion(promotionObject);

    PromotionService.showLastPromotion();
  }
}

DemoController.$inject = ['tw.promotionService'];

export default DemoController;
