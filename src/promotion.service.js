class PromotionService {
  constructor($cookies, popoverService) {
    this.cookieService = $cookies;
    this.popoverService = popoverService;
  }

  /**
   * [addPromotion                     Adds a new promotion to the twPromotions
   *                                   cookie array]
   * @param  {Object} promotionObject [Object containing the promotion data and
   *                                   metadata]
   * @return {Array}                  [Promotions array]
   */
  addPromotion = (promotionObject) => {
    const pushToPromotions = curry(pushToArray)(this.getPromotions());
    const addToPromotions = compose(pushToPromotions, this.checkExistingPromotion);

    return compose(this.savePromotions, addToPromotions)(promotionObject);
  };

  /**
   * [showCommencingPromotion   Displays the popover for the last promotion
   *                            stored in the twPromotions cookies array, i.e.
   *                            the promotion that is due to commence.]
   * @return {Object}          [Last promotion object or null]
   */
  showCommencingPromotion = () =>
    compose(
      this.addViewedPromotion,
      markPromotionAsViewed,
      this.displayPromotion,
      checkDisplayStatus,
      checkPromotionCommence,
      getReverseHead,
    )(this.getPromotions());

  /**
   * [addViewedPromotion               Update the promotions cookie by adding
   *                                   back the last viewed promotion with a
   *                                   'isRead' flag]
   * @param  {Object} viewedPromotion
   * @return {Object}
   */
  addViewedPromotion = (promotion) => {
    if (promotion) {
      const filteredPromotions = this.getPromotions().filter(
        savedPromotion => savedPromotion.promotionId !== promotion.promotionId,
      );
      const pushToPromotions = curry(pushToArray)(filteredPromotions);

      return compose(this.savePromotions, pushToPromotions)(promotion);
    }

    return promotion;
  };

  /**
   * [checkExistingPromotion            Checks if the promotion that we want to
   *                                    add already exists in the promotion
   *                                    cookies array]
   * @param  {Object} promotionObject
   * @return {Object}
   */
  checkExistingPromotion = (promotionObject) => {
    const storedPromotions = this.getPromotions();
    const promotionExists = storedPromotions.some(
      storedPromotion => storedPromotion.promotionId === promotionObject.promotionId,
    );

    return promotionExists ? null : promotionObject;
  };

  /**
   * [getPromotions             Returns all the promotions stored in the
   *                            twPromotions cookie or an empty array]
   * @return {Array}
   */
  getPromotions = () => {
    const listOfPromotions = this.getCookieObject('twPromotions');

    return listOfPromotions && listOfPromotions.length ? [...listOfPromotions] : [];
  };

  /**
   * [persistPromotions          Saves the new @promotions in the twPromotions
   *                             cookie]
   * @param  {Array} promotions [Array containing all the promotions]
   * @return {Array}            [Promotions array]
   */
  persistPromotions = (promotions) => {
    this.setCookieObject('twPromotions', promotions);

    return promotions;
  };

  /**
   * [savePromotions            Sorts and persists the promotions in the
   *                            twPromotions cookie]
   * @param  {Array} promotions
   * @return {Array}
   */
  savePromotions = promotions => compose(this.persistPromotions, sortPromotions)(promotions);

  /**
   * [displayPromotion           Shows the promotion popover for the
   *                             @promotedElement]
   * @param  {Object} promotion [Promotion object]
   * @return {Object}           [Promotion object or null]
   */
  displayPromotion = (promotion) => {
    if (promotion) {
      this.popoverService.showPopover(
        document.querySelector(promotion.promotedElement),
        promotion.promotionPopover,
      );
    }
    return promotion;
  };

  /**
   * [hidePromotion Hides the promotion popover]
   */
  hidePromotion = () => {
    this.popoverService.hidePopover();
  };

  /**
   * [getCookieObject]
   * @param  {String} key    [Cookie key/id to use for lookup]
   * @return {Object}        [Returns the deserialized value of given cookie key]
   */
  getCookieObject = key => this.cookieService.getObject(key);

  /**
   * [setCookieObject         Sets a object value for the given cookie key]
   * @param {String} key     [Cookie key/id to use for lookup]
   * @param {Object} value   [Cookie object value to be stored]
   * @param {Object} options [Options object. Contains properties such as path,
   *                          domain, expires, secure]
   */
  setCookieObject = (key, value, options) => {
    this.cookieService.putObject(key, value, options);

    return value;
  };
}

/**
 * Dependency injection
 */
PromotionService.$inject = ['$cookies', 'twPopOverService'];

/**
 * [checkPromotionCommence     Checks if the promotion commence date has started]
 * @param  {Object} promotion [Promotion object]
 * @return {Object}
 */
function checkPromotionCommence(promotion) {
  return promotion && promotion.promotionCommence <= Date.now() ? promotion : null;
}

/**
 * [checkDisplayStatus         Checks if the promotion has been displayed or not]
 * @param  {Object} promotion
 * @return {Object}
 */
function checkDisplayStatus(promotion) {
  return promotion && !promotion.promotionViewed ? promotion : null;
}

/**
 * [markPromotionAsViewed            Sets a status object on the promotion
 *                                   object to mark it as displayed to the
 *                                   current user]
 * @param  {Object} promotion
 * @return {Object}
 */
function markPromotionAsViewed(promotion) {
  return promotion
    ? {
      ...promotion,
      promotionViewed: true,
    }
    : promotion;
}

/**
 * [sortPromotions              Sort the promotions array before storing it in
 *                              the cookies. Move all the viewed promotions to
 *                              the start of the array, making the first half of
 *                              the array home for the viewed promotions. The
 *                              second half contains all the promotions that are
 *                              due to be showed, ordered descending by their
 *                              commence date, so that the most recent promotion
 *                              is always last]
 * @param  {Array} promotions
 * @return {Array}
 */
function sortPromotions(promotions) {
  const sortByPromotionCommence = curry(sortArray)('promotionCommence')(true);

  const viewedPromotions = promotions.filter(promotion => promotion.promotionViewed);
  const duePromotions = promotions.filter(promotion => !promotion.promotionViewed);

  return [...viewedPromotions, ...sortByPromotionCommence(duePromotions)];
}

/**
 * [getHead               Get the head of the array]
 * @param  {Object} head [First element in the array]
 * @param  {Object} tail [Remaining elements in the array]
 * @return {Object}
 */
function getHead([head, ...tail]) {
  return head;
}

/**
 * [getTail               Get the tail of the array]
 * @param  {Object} head [First element in the array]
 * @param  {Object} tail [Remaining elements in the array]
 * @return {Array}
 */
function getTail([head, ...tail]) {
  return tail;
}

/**
 * [getReverseHead         Get the head of the array from the end, i.e. the
 *                         last element]
 * @param  {Array} array  [Input array]
 * @return {Object}
 */
function getReverseHead(array) {
  return getHead(array.reverse());
}

/**
 * [getReverseTail        Get all the elements except the last one]
 * @param  {Array} array [Input array]
 * @return {Array}
 */
function getReverseTail(array) {
  return getTail(array.reverse()).reverse();
}

/**
 * [pushToArray              Adds the @element to the end of the @array]
 * @param  {Array}  array   [Input array]
 * @param  {Object} element [Object to be pushed onto the array]
 * @return {Array}
 */
function pushToArray(array, element) {
  return element ? [...array, element] : array;
}

/**
 * [sortArray                  Sort an @array of Objects based on their @objProp,
 *                             ascending or @descSort]
 * @param  {String}  objProp  [Object property by which to sort the array]
 * @param  {Boolean} descSort [Ascending or descending sorting]
 * @param  {Array}   array    [Array of Objects to sort]
 * @return {Array}            [Sorted array]
 */
function sortArray(objProp, descSort, array) {
  return array.sort((a, b) => (descSort ? b[objProp] - a[objProp] : a[objProp] - b[objProp]));
}

/**
 * [compose                 Composes functions from right to left]
 * @param  {Functions} fns [The functions to compose. Each function is expected
 *                          to accept a single parameter. Its return value will
 *                          be provided as an argument to the function standing
 *                          to the left, and so on. The exception is the
 *                          right-most argument which can accept multiple
 *                          parameters, as it will provide the signature for
 *                          the resulting composed function.]
 * @return {Function}      [The final function obtained by composing the given
 *                         functions from right to left.]
 */
function compose(...fns) {
  return fns.reverse().reduce((fn1, fn2) => (...args) => fn2(fn1(...args)));
}

/**
 * [curry                   Translating the evaluation of a function that takes
 *                          multiple arguments (or a tuple of arguments) into
 *                          evaluating a sequence of functions, each with a
 *                          single argument]
 * @param  {Function} fn   [Input function]
 * @return {Function}
 */
function curry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return (nextArg) => {
      const args = prevArgs.concat([nextArg]);

      if (args.length >= arity) {
        return fn(...args);
      }
      return nextCurried(args);
    };
  }([]));
}

export default PromotionService;
