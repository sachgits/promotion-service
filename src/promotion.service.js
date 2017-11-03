class PromotionService {
  constructor($cookies, popoverService) {
    this.cookieService = $cookies;
    this.popoverService = popoverService;

    this.persistPromotions = this.persistPromotions.bind(this);
    this.displayPromotion = this.displayPromotion.bind(this);
    this.removeLastPromotion = this.removeLastPromotion.bind(this);
    this.hidePromotion = this.hidePromotion.bind(this);
  }

  /**
   * [addPromotion                Adds a new promotion to the twPromotions cookie
   *                              array]
   * @param  {String} promotedElement [CSS selector for the promoted element]
   * @param  {String} position        [Position of the popover]
   * @param  {String} title           [Title displayed in the popover]
   * @param  {String} content         [Content displayed in the popover]
   * @param  {String} html            [Template for the popover]
   * @return {Object}                 [Promotion object]
   */
  addPromotion(promotedElement, position, title, content, html) {
    const sortByPromotionCommence = curry(sortArray)('promotionCommence')(true);
    const pushToPromotions = curry(pushToArray)(this.getPromotions());

    const addToPromotions = compose(sortByPromotionCommence, pushToPromotions);

    return compose(
      this.persistPromotions,

      addToPromotions,
      createPromotion
    )
    (
      promotedElement,
      position,
      title,
      content,
      html,
    );
  }

  /**
   * [showLastPromotion         Displays the popover for the last promotion
   *                            stored in the twPromotions cookies array]
   * @return {Object}          [Last promotion object or null]
   */
  showLastPromotion() {
    return compose(
      this.removeLastPromotion,
      this.displayPromotion,

      checkPromotionCommence,
      getReverseHead,
    )(this.getPromotions());
  }

  /**
   * [removeLastPromotion                    Removes the last promotion and saves
   *                                         the new promotions state in the
   *                                        'twPromotions' cookie]
   * @param  {Object} hasDisplayedPromotion [Promotion object or null]
   * @return {Array}                        [Returns the list of promotions except
   *                                        the last one]
   */
  removeLastPromotion(hasDisplayedPromotion) {
    if (hasDisplayedPromotion) {
      const sortByPromotionCommence = curry(sortArray)('promotionCommence')(true);

      return compose(
        this.persistPromotions,

        sortByPromotionCommence,
        getReverseTail)
      (this.getPromotions());
    }

    return hasDisplayedPromotion;
  }

  /**
   * [getPromotions             Returns all the promotions stored in the
   *                            twPromotions cookie or an empty array]
   * @return {Array}
   */
  getPromotions() {
    const listOfPromotions = this.getCookieObject('twPromotions');

    return listOfPromotions && listOfPromotions.length ? listOfPromotions : [];
  }

  /**
   * [persistPromotions          Saves the new @promotions in the twPromotions
   *                             cookie]
   * @param  {Array} promotions [Array containing all the promotions]
   * @return {Array}            [Promotions array]
   */
  persistPromotions(promotions) {
    this.setCookieObject('twPromotions', promotions);

    return promotions;
  }

  /**
   * [displayPromotion           Shows the promotion popover for the
   *                             @promotedElement]
   * @param  {Object} promotion [Promotion object]
   * @return {Object}
   */
  displayPromotion(promotion) {
    if (promotion) {
      this.popoverService.showPopover(
        document.querySelector(promotion.promotedElement),
        promotion.promotionPopover,
      );
    }
    return promotion;
  }

  /**
   * [hidePromotion Hides the promotion popover]
   */
  hidePromotion() {
    this.popoverService.hidePopover();
  }

  /**
   * [getCookieObject]
   * @param  {String} key [Cookie key/id to use for lookup]
   * @return {Object}     [Returns the deserialized value of given cookie key]
   */
  getCookieObject(key) {
    return this.cookieService.getObject(key);
  }

  /**
   * [setCookieObject         Sets a object value for the given cookie key]
   * @param {String} key     [Cookie key/id to use for lookup]
   * @param {Object} value   [Cookie object value to be stored]
   * @param {Object} options [Options object. Contains properties such as path,
   *                          domain, expires, secure]
   */
  setCookieObject(key, value, options) {
    this.cookieService.putObject(key, value, options);

    return value;
  }
}

/**
 * [createPromotion                           Creates the promotion object, with
 *                                            the promotion commence date and
 *                                            popover metadata. Factory function]
 * @param  {String} promotedElement          [CSS selector for the promoted element]
 * @param  {String} position                 [Position of the popover]
 * @param  {String} title                    [Title displayed in the popover]
 * @param  {String} content                  [Content displayed in the popover]
 * @param  {String} html                     [Template for the popover]
 * @return {Object}                          [Promotion object]
 */
function createPromotion(promotedElement, placement, title, content, html) {
  const promotionCommence = Date.now();

  return {
    promotedElement,
    promotionCommence,
    promotionPopover: {
      placement,
      title,
      content,
      html,
    },
  };
}

/**
 * [checkPromotionCommence     Checks if the promotion commence date has started]
 * @param  {Object} promotion [Promotion object]
 * @return {Object}
 */
function checkPromotionCommence(promotion) {
  return promotion && promotion.promotionCommence <= Date.now() ? promotion : null;
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
  return [...array, element];
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
  return array.sort(
    (a, b) => (descSort ? b[objProp] - a[objProp] : a[objProp] - b[objProp])
  );
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
function curry(fn, arity = fn.length, nextCurried) {
  return (nextCurried = prevArgs => (nextArg) => {
    const args = [...prevArgs, nextArg];

    if (args.length >= arity) {
      return fn(...args);
    }
    return nextCurried(args);
  })([]);
}

/**
 * Dependency injection
 */
PromotionService.$inject = ['$cookies', 'twPopOverService'];

export default PromotionService;
