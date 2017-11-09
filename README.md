<h1 align="center">
  Promotion Service 🍾💨
</h1>

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
      promotionCommence: Date.now(),
      promotionPopover: {
        placement: 'right',
        title: 'Popover title',
        content: 'Popover content',
      },
    };

    PromotionService.addPromotion(promotionObject);

    PromotionService.showLastPromotion();
  }
}

AwesomeController.$inject = ['PromotionService'];

export default AwesomeController;

```

## API

### addPromotion

> `function(promotionObject: Object)`

- `promotionObject`: Object containing the promotion data and metadata.

Call this function to add a promotion. The `promotionObject` should have the following shape:

```javascript
var promotionObject = {
  promotedElement,
  promotionCommence,
  promotionPopover: {
    placement,

    title,
    content,

    html,
  },
}
```

Where the properties are:

- `promotedElement: String`: CSS selector for the promoted element
- `promotionCommence: Number`: Numeric value corresponding to the commence date of the promotion, i.e. from when should this promotion be displayed - **number must be in milliseconds**

- Optional: `placement: String`: Popover placement. Possible values include [**'top', 'right', 'bottom', 'left'**]
- `title: String`: Popover title
- `content: String`: Popover content
- Optional: `html: String`: Popover template

When passing a custom template to the popover via the `html` property, the binding between the *template placeholders* and the *popover variables* are resolved in the following manner. Given the template:

```javascript
var promotionObject = {
  ...
  promotionPopover: {
    ...
    html: "
      <button class='close popover-close'>&times;</button> \
      <div className='popover-logo'> \
        <img src='__logo__' alt='Logo' /> \
      </div> \
      <h3 class='popover-title'>__title__</h3> \
      <div class='popover-content'> \
        __content__ \
      </div>",
  },
}
```

All the prefixed and suffixed words in the template by **double underscores** are mapped to the values of their equivalent properties in the `promotionPopover` object. For the following promotion object:

```javascript
var promotionObject = {
  ...
  promotionPopover: {
    logo: 'Relative/Absolute path to the logo image',
    title: 'Popover title',
    content: 'Popover content',

    html: "
      <button class='close popover-close'>&times;</button> \
      <div className='popover-logo'> \
        <img src='__logo__' alt='Logo' /> \
      </div> \
      <h3 class='popover-title'>__title__</h3> \
      <div class='popover-content'> \
        __content__ \
      </div>",
  },
}
```

We will get the following popover content:

```html
<button class='close popover-close'>&times;</button>
<div className='popover-logo'>
  <img src='Relative/Absolute path to the logo image' alt='Logo' />
</div>
<h3 class='popover-title'>Popover title</h3>
<div class='popover-content'>
  Popover content
</div>
```

⚠️ If you're planing on using `img` elements in the popover template, make sure you use the `height` attribute as part of the `img` element in order to precompute the correct height of the popover element and ensure the right positioning. Otherwise, you will **break** _space-time continuum_.

**returns** The promotion object

### showLastPromotion

> `function()`

Shows the last promotion in the list of promotions, if its commence date has started, otherwise it doesn't display anything and it doesn't alter the promotions array. If the commence date has started, the promotion is displayed using the `PopoverService` and the promotion is removed from the promotions array.

### Tasks

#### Install all the dependencies

```
npm install
```

#### Run in development mode

```
npm run dev
```

#### Test and lint

```
npm test
```

#### Test with watch

```
npm run test:watch
```

#### Build

```
npm run build
```
