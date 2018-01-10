import { cbToCb } from './utils';

class PromotionService {
  constructor($rootScope, AnalyticsService, Config, popoverService) {
    this.$rootScope = $rootScope;

    this.AnalyticsService = AnalyticsService;
    this.Config = Config;

    this.popoverService = popoverService;

    this.registerMixpanelEventListeners();
  }

  /**
   * [addPromotion                     Adds a new promotion to the twPromotions
   *                                   local storage array]
   * @param  {Object} promotionObject [Object containing the promotion data and
   *                                   metadata]
   * @return {Array}                  [Promotions array]
   */
  addPromotion = (promotionObject) => {
    const pushToPromotions = curry(pushToArray)(getPromotions());
    const addToPromotions = compose(pushToPromotions, checkExistingPromotion);

    return compose(savePromotions, addToPromotions)(promotionObject);
  };

  /**
   * [showCommencingPromotion   Displays the popover for the last promotion
   *                            stored in the twPromotions local storage array,
   *                            i.e. the promotion that is due to commence.]
   * @return {Object}          [Last promotion object or null]
   */
  showCommencingPromotion = cb =>
    compose(
      curry(callCommencingCallback)(cbToCb(cb)),

      this.reportPromotionOpen,
      this.displayPromotion,

      addViewedPromotion,
      markPromotionAsViewed,

      this.cachePromotionObject,

      checkDisplayStatus,
      checkPromotionCommence,
      getReverseHead,
    )(getPromotions());

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
   * [cachePromotionObject Cache the promotion object in order to access it from
   *                       additional functions, such as mixpanel event trackers]
   * @type {Object}
   */
  cachePromotionObject = (promotion) => {
    if (promotion) {
      this.cachedPromotion = promotion;
    }

    return promotion;
  };

  /**
   * [reportPromotionOpen        Submit a mixpanel event when the promotion is
   *                             displayed to the user]
   * @param  {Object} promotion
   * @return {Object}           [Promotion object or null]
   */
  reportPromotionOpen = (promotion) => {
    if (promotion) {
      this.reportMixpanelEvent('open', promotion);
    }

    return promotion;
  };

  /**
   * [reportPromotionClick       Submit a mixpanel event when the user interacts
   *                             with the promotion]
   * @param  {Object} promotion
   * @return {Object}           [Promotion object or null]
   */
  reportPromotionClick = () => {
    if (this.cachedPromotion) {
      this.reportMixpanelEvent('click', this.cachedPromotion);
    }

    return this.cachedPromotion;
  };

  /**
   * [reportPromotionClose       Submit a mixpanel event when the user closes
   *                             the promotion]
   * @param  {Object} promotion
   * @return {Object}           [Promotion object or null]
   */
  reportPromotionClose = () => {
    if (this.cachedPromotion) {
      this.reportMixpanelEvent('close', this.cachedPromotion);
    }

    return this.cachedPromotion;
  };

  /**
   * [reportMixpanelEvent       Submit mixpanel events regarding different
   *                            interactions with the promotion popover]
   * @param  {String} event
   * @param  {Object} promotion
   * @return {Object}
   */
  reportMixpanelEvent = (event, promotion) => {
    if (promotion) {
      const params = {
        userId: this.Config.get('userId'),
        promotionId: promotion.promotionId,
      };

      const mixpanelEvent = `promotion:${event}`;

      this.AnalyticsService.trackMixpanelEvent(mixpanelEvent, params);
    }

    return promotion;
  };

  /**
   * [registerMixpanelEventListeners  Popover component broadcasts the following
   *                                  events, which we need in order to report
   *                                  the interaction with the promotion popover]
   * @return {void}
   */
  registerMixpanelEventListeners = () => {
    this.$rootScope.$on('promotion:click', this.reportPromotionClick);
    this.$rootScope.$on('promotion:close', this.reportPromotionClose);
  }
}

/**
 * Dependency injection
 */
PromotionService.$inject = ['$rootScope', 'AnalyticsService', 'Config', 'twPopOverService'];

/**
 * [getPromotions             Returns all the promotions stored in the
 *                            twPromotions local storage or an empty array]
 * @return {Array}
 */
function getPromotions() {
  const listOfPromotions = getLocalStorageObject('twPromotions');

  return listOfPromotions && listOfPromotions.length ? [...listOfPromotions] : [];
}

/**
 * [persistPromotions          Saves the new @promotions in the twPromotions
 *                             local storage key]
 * @param  {Array} promotions [Array containing all the promotions]
 * @return {Array}            [Promotions array]
 */
function persistPromotions(promotions) {
  return setLocalStorageObject('twPromotions', promotions);
}

/**
 * [savePromotions            Sorts and persists the promotions in the
 *                            twPromotions local storage]
 * @param  {Array} promotions
 * @return {Array}
 */
function savePromotions(promotions) {
  return compose(persistPromotions, sortPromotions)(promotions);
}

/**
 * [checkExistingPromotion            Checks if the promotion that we want to
 *                                    add already exists in the promotion array]
 * @param  {Object} promotionObject
 * @return {Object}
 */
function checkExistingPromotion(promotionObject) {
  const storedPromotions = getPromotions();
  const promotionExists = storedPromotions.some(
    storedPromotion => storedPromotion.promotionId === promotionObject.promotionId,
  );

  return promotionExists ? null : promotionObject;
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
 * [addViewedPromotion               Update the promotions by adding
 *                                   back the last viewed promotion with a
 *                                   'promotionViewed' flag]
 * @param  {Object} viewedPromotion
 * @return {Object}                 [Promotion object or null]
 */
function addViewedPromotion(promotion) {
  if (promotion) {
    const filteredPromotions = getPromotions().filter(
      savedPromotion => savedPromotion.promotionId !== promotion.promotionId,
    );
    const pushToPromotions = curry(pushToArray)(filteredPromotions);

    compose(savePromotions, pushToPromotions)(promotion);
  }

  return promotion;
}

/**
 * [callCommencingCallback           Provide a callback to the @showCommencingPromotion,
 *                                   call it with the commencing promotion object]
 * @param  {Function} callback
 * @param  {Object}   promotion
 * @return {Object}
 */
function callCommencingCallback(callback, promotion) {
  if (promotion) {
    callback(promotion);
  }

  return promotion;
}

/**
 * [sortPromotions              Sort the promotions array before storing it in.
 *                              Move all the viewed promotions to the start of
 *                              the array, making the first half of the array
 *                              home for the viewed promotions.
 *                              The second half contains all the promotions that
 *                              are due to be showed, ordered descending by their
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
 * [getLocalStorageObject        Get the UTF-16 String value stored at @key in
 *                               the local storage]
 * @param  {String} key         [A DOMString containing the name of the key you
 *                               want to create/update.]
 * @return {Array}
 */
function getLocalStorageObject(key) {
  return JSON.parse(localStorage.getItem(key));
}

/**
 * [setLocalStorageObject       Add that key to the storage, or update that key's
 *                              value if it already exists.]
 * @param {String} key         [A DOMString containing the name of the key you
 *                              want to create/update.]
 * @param {Object} value       [An object that will get serialized and added to
 *                              the @key value]
 */
function setLocalStorageObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value));

  return value;
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
