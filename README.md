<h1 align="center">
  Promotion Service 🍾💨
</h1>

[![CircleCI branch](https://img.shields.io/circleci/project/github/transferwise/promotion-service/master.svg?style=flat-square)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## The problem

You want to promote various events to the user.

## This solution

With the promotion service, you register promotions in which you nominate the highlighted element for the promotion and the event that he is promoting.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Tasks](#tasks)

## Installation

```
npm install git+ssh://git@github.com/transferwise/promotion-service.git#{version-tag}
```

## Usage

> index.js

```javascript
import awesomeController from './awesome.controller';
import promotionService from 'promotion-service';

export default angular
  .module('MyAwesomeModule', [promotionService])
  .controller('MyAwesomeController', awesomeController).name;
```

> awesome.controller.js

```javascript
class AwesomeController {
  constructor(PromotionService) {
    var promotionObject = {
      promotedElement: '.promoted-element',
      promotionCommence: Date.now() + 10000,
      promotionId: 'test-promotion',
      promotionPopover: {
        placement: 'right',
        title: 'Popover title',
        content: 'Popover content',
      },
    };

    PromotionService.addPromotion(promotionObject);

    PromotionService.showCommencingPromotion(function(promotionObject) {
      /**
       * If the promotion has commenced, the promotion object is exposed,
       * otherwise the callback is called with a null argument
       */

      if (promotionObject) {
        /**
         * Promotion commenced and its object is now available
         */
      }
    });
  }
}

AwesomeController.$inject = ['PromotionService'];

export default AwesomeController;

```

## API

### addPromotion

> `function(promotionObject: Object)`
**returns** The array of promotions

- `promotionObject`: Object containing the promotion data and metadata.

Call this function to add a promotion. The `promotionObject` should have the following shape:

```javascript
var promotionObject = {
  promotedElement,
  promotionCommence,
  promotionId,

  promotionPopover: {
    placement,

    title,
    content,
  },
}
```

Where the properties are:

- `promotedElement: String`: CSS selector for the promoted element
- `promotionCommence: Number`: Numeric value corresponding to the commence date of the promotion, i.e. from when should this promotion be displayed - **number must be in milliseconds**
- `promotionId: String`: The ID of the promotion. **This must be a unique value.**

- `title: String`: Default title
- `content: String`: Default content value
- `placement: String`: Popover placement. Possible values include [**'top', 'right', 'bottom', 'left', 'left-top', 'right-top'**]

- Optional: `image: String`: Use this property to store a relative / absolute URL. It should be used with the `template` property in order to define the image element in the popover markup.
- Optional: `template: String`: Base HTML to use when creating the popover, i.e. popover template. Ex:

```javascript
var promotionObject = {
  ...
  promotionPopover: {
    ...
    template: '<div class="popover"> \n' +
      '<h3 class="popover-title"></h3> \n' +
      '<img class="popover-image" /> \n' +
      '<div class="popover-content"></div> \n' +
    '</div>',
  }
}
```
- Optional: `contentHtml: Boolean`: Insert HTML into the popover. If false, `insertAdjacentText` method will be used to insert content into the DOM. Use text if you're worried about XSS attacks.
- Optional: `container: String`: Appends the popover to a specific element. Example: `container: 'body'`. This option is particularly useful in that it allows you to position the popover in the flow of the document near the triggering element - which will prevent the popover from floating away from the triggering element during a window resize.

- Optional: `modalMode: Boolean`: Use this flag if you want the popover to morph into a modal with overlay when the viewport width is less than 991 pixels
- Optional: `promotedElementIsFixed: Boolean`: This flag adds an inline style CSS property for `position` with the value `fixed` on the popover element.

### showCommencingPromotion

> `function(callback: function)`

Shows the last promotion in the list of promotions, if its commence date has started, otherwise it doesn't display anything and it doesn't alter the promotions array. If the commence date has started, the promotion is displayed using the `PopoverService`.

The callback passed to the `showCommencingPromotion` function is called with an argument. That argument is the promotion object (the entire promotion object that was added to the promotions).

If the promotion has commenced, i.e. it was displayed, the callback is called with the promotion object, otherwise it is called with `null`.

### Tasks

#### Install all the dependencies

```
npm install
```

#### Run in development mode

```
npm run start
```

#### Test and lint

```
npm run test
```

#### Test with watch

```
npm run test:watch
```

#### Build

```
npm run build
```
