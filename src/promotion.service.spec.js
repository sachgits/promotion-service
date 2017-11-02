import promotionService from './promotion.service';

describe('Promotion service', () => {
  var promotionServiceInstance = null;

  beforeAll(() => {
    promotionServiceInstance = new promotionService();
  });

  test('Promotion service loaded', () => {
    expect(typeof promotionServiceInstance).toBe('object');
  });
});
