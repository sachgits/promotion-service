describe('Promotion service', () => {
  let promotionServiceInstance = null;
  let popover = null;

  const promotedElementTemplate =
    "<a class='promoted-element'>Show a popover next to this element</a>";

  const popoverOptions = {
    title: '<span>Transferwise</span>',
    content: '<span>Rules</span>',
    contentHtml: true,
    image: 'http://transferwise.com/logo.png',
    template:
      '<div class="popover"> \n' +
      '<h3 class="popover-title"></h3> \n' +
      '<img class="popover-image" /> \n' +
      '<div class="popover-content"></div> \n' +
      '</div>',
  };

  beforeEach(angular.mock.module('tw.promotion'));

  beforeEach(() => {
    angular.mock.inject(($injector) => {
      promotionServiceInstance = $injector.get('tw.promotionService');
    });
  });

  test('Promotion service loaded', () => {
    expect(typeof promotionServiceInstance).toBe('object');
  });

  describe('when we add a promotion and show the last promotion', () => {
    beforeEach(() => {
      document.body.insertAdjacentHTML('beforeend', promotedElementTemplate);

      const promotionObject = {
        promotedElement: '.promoted-element',
        promotionCommence: Date.now(),
        promotionId: `promotion-${Math.random()}`,
        promotionPopover: popoverOptions,
      };

      promotionServiceInstance.addPromotion(promotionObject);

      promotionServiceInstance.showCommencingPromotion();

      popover = document.body.querySelector('.popover');
    });

    afterEach(() => {
      document.body.removeChild(document.querySelector('.promoted-element'));
      document.body.removeChild(document.querySelector('.popover'));
    });

    test('promotion is added and visible', () => {
      const popoverAppended = document.body.contains(popover);
      const popoverVisible = !popover.classList.contains('scale-down');
      const popoverVisibility = popoverAppended && popoverVisible;

      expect(popoverVisibility).toBe(true);
    });

    test('promotion has the right title', () => {
      const popoverTitleElement = popover.querySelector('.popover-title');
      const popoverTitle = popoverTitleElement && popoverTitleElement.innerHTML.trim();

      expect(popoverTitle).toBe(popoverOptions.title);
    });

    test('promotion has the right image', () => {
      const popoverImageElement = popover.querySelector('.popover-image');
      const popoverImageURL = popoverImageElement && popoverImageElement.getAttribute('src');

      expect(popoverImageURL).toBe(popoverOptions.image);
    });

    describe('when clicking on the body element', () => {
      beforeEach(() => {
        document.body.click();
      });

      test('promotion popover should not be visible', () => {
        const popoverAppended = document.body.contains(popover);
        const popoverNotVisible = popover.classList.contains('scale-down');

        expect(popoverAppended && popoverNotVisible).toBe(true);
      });
    });
  });
});
