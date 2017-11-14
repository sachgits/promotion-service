describe('Promotion service', () => {
  let promotionServiceInstance = null;
  let popover = null;

  const promotedElementTemplate =
    "<a class='promoted-element'>Show a popover next to this element</a>";

  const popoverOptions = {
    placement: 'right',
    title: 'Transferwise',
    content: 'Rules',
    info: 'More info',
    template:
      '<div class="popover-title">__title__</div>\n' +
      '<div class="popover-content">__content__</div>\n' +
      '<div class="popover-info">__info__</div>',
  };

  beforeEach(angular.mock.module('Promotion'));

  beforeEach(
    angular.mock.inject(($injector) => {
      promotionServiceInstance = $injector.get('PromotionService');
    }),
  );

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', promotedElementTemplate);

    const promotionObject = {
      promotedElement: '.promoted-element',
      promotionCommence: Date.now(),
      promotionPopover: {
        placement: 'right-top',
        title: 'Transferwise',
        content: 'Rules!',
      },
    };

    promotionServiceInstance.addPromotion(promotionObject);

    promotionServiceInstance.showLastPromotion();

    popover = document.body.querySelector('.popover');
  });

  afterEach(() => {
    document.body.removeChild(document.querySelector('.promoted-element'));
    document.body.removeChild(document.querySelector('.popover'));
  });

  test('Promotion service loaded', () => {
    expect(typeof promotionServiceInstance).toBe('object');
  });

  test('Promotion is added and visible', () => {
    const popoverAppended = document.body.contains(popover);
    const popoverVisible = !popover.classList.contains('scale-down');
    const popoverVisibility = popoverAppended && popoverVisible;

    expect(popoverVisibility).toBe(true);
  });

  test('Promotion has the right title', () => {
    const popoverTitleElement = popover.querySelector('.popover-title');
    const popoverTitle = popoverTitleElement && popoverTitleElement.innerHTML.trim();

    expect(popoverTitle).toBe(popoverOptions.title);
  });
});
