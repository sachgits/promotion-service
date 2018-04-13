class DemoController {
  constructor(PromotionService) {
    const testPromotion = {
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

    const differentPromotion = {
      promotedElement: '.promoted-element',
      promotionCommence: Date.now() + 10000,
      promotionId: 'different-promotion',

      promotionPopover: {
        placement: 'bottom',

        title: 'Some title',
        content: 'Some content',
        image: 'https://lienzo.s3.amazonaws.com/images/spreadsheet.png',

        template:
          '<div class="popover popover-promotion"> \n' +
          '<img class="popover-image m-b-2 m-t-0" /> \n' +
          '<h3 class="popover-title text-xs-center m-b-1"></h3> \n' +
          '<div class="popover-content text-xs-center"></div> \n' +
          '</div>',

        container: 'body',
      },
    };

    PromotionService.addPromotion(testPromotion);
    PromotionService.addPromotion(differentPromotion);

    PromotionService.showCommencingPromotion();
  }
}

DemoController.$inject = ['tw.promotionService'];

export default DemoController;
