<h1 align="center">
  Promotion Service 🍾💨
</h1>

[![CircleCI](https://circleci.com/gh/transferwise/promotion-service.svg?style=shield)](https://circleci.com/gh/transferwise/promotion-service)
[![PRs Welcome][prs-badge]][prs]
[![size][size-badge]][unpkg-dist]
[![gzip size][gzip-badge]][unpkg-dist]

## The problem

You want to promote various events to the user.

## This solution

With the promotion service, you register promotions in which you nominate the highlighted element for the promotion and the event that he is promoting.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API](#API)
- [Tasks](#Tasks)

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
    PromotionService.addPromotion('.promoted-element', 'right', 'Transferwise', 'Rules!');

    PromotionService.showLastPromotion();
  }
}

AwesomeController.$inject = ['PromotionService'];

export default AwesomeController;

```

## API

### addPromotion

> `function(promotedElement: String, position: String, title: String, content: String, html: String)`

Call this function to add a promotion

- `promotedElement`: CSS selector for the promoted element
- `position`: Position of the popover
- `title`: Title displayed in the popover
- `content`: Content displayed in the popover
- `html`: Template for the popover content

**returns** The promotion object

### showLastPromotion

> `function()`

Shows the last promotion in the list of promotions, if its commence date has started, otherwise it doesn't display anything and it doesn't alter the promotions array. If the commence date has started, the promotion is displayed using the `PopoverService` and the promotion is removed from the promotions array.

### Tasks

#### Install

```
npm install
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
