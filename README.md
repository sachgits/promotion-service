# Promotion Service 💥🍾💨

[![CircleCI](https://circleci.com/gh/transferwise/promotion-service.svg?style=shield)](https://circleci.com/gh/transferwise/promotion-service)

A service for showing, adding, removing promotions. The promotions themselves can be serialized and stored under the `twPromotions` cookie key value, if they are added from the server or from anywhere else.

The service will pick up the last promotion, check it's commence date and display it if it meets the display criteria. The `Array` of promotions should be at all time sorted in descending order by their commence date so that the last promotion is the closest to the current date. The service also removes the last promotion after it has displayed it, so that the user doesn't get the same promotion twice.

The structure of a promotion has the following shape:

```javascript
{
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

For more details on the shape of the promotion object, check [this](https://github.com/mstaicu/promotion-service/blob/master/src/promotion.service.js#L149) factory function's comment.

The structure of the `twPromotions` cookie value is that of an `Array`.

```javascript
[{
  promotedElement,
  promotionCommence,
  promotionPopover: {
    placement,
    title,
    content,
    html,
  },
}]
```

## Usage

### Installation

```
npm install git+ssh://git@github.com/transferwise/promotion-service.git#{version-tag}
```

### Usage in `frontend-apps`

#### `Apps`

Like a normal dependency in `frontend-apps` `/apps`, specify it in the `package.json` of your app.

```
{
  "name": "tw.landing",
  "include": {
    "js": [
      ...
      "node_modules/promotion-service/promotion-service.min.js"
    ]
  }
}
```

#### `Modules`

No changes necessary, make sure the consuming apps have the dependency included.

## Development

`npm` is used as the sole package manager and its scripts in `package.json` are used for tasks, with Webpack handling module loading and bundling using loaders. ES2015 is transpiled using Babel and the ESLint config we follow is [Airbnb's](https://github.com/airbnb/javascript).

[Yarn](https://yarnpkg.com/) can be used instead of `npm`.

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

This is usually done by CircleCI, but it may be useful when trying out changes with local consumers.

### Development pipeline

All development happens on feature branches. On commits to any branch, CircleCI will run the tests. After a successful code review, Merge can be clicked and CircleCI will trigger a job again, building the bundle and releasing it to GitHub.

1. Make changes on a feature branch
1. **Bump package version** in `package.json` (we're following SemVer) and **add related new item in CHANGELOG.md**!
1. Create a Pull Request
1. Get reviews
1. Merge using GitHub UI
1. Wait for the CircleCI job to finish
1. A GitHub release should be automatically published based on your new `CHANGELOG.md` item
1. ???
1. PROFIT
