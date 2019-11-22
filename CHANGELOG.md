# [BalmJS](https://balmjs.com/) CHANGELOG

## v2.0.3 / 2019-11-22

### Bug Fixes

- `balm:clean`: fix clean _buildDir_ bug in development for the Back-end mode

## v2.0.2 / 2019-11-21

### Update `balm.config`

- restore `scripts.extractAllVendors` from balm v1
- restore `scripts.vendorName: string = 'vendor'` from balm v1

### BREAKING CHANGES

- deprecated scripts.<del>`splitAllVendors`</del>
- deprecated scripts.<del>`vendorsName`</del>: string = <del>`'vendors'`</del>

## v2.0.1

### Update `balm.config`

- restore `extras.includes` from balm v1

## v2.0.0 / 2019-11-20

> It is a new starting point

- `balm@2.0.0` released :tada:
- Code Refactoring by TypeScript :ghost:
- `balm.config` Full Upgrade :rocket:
- [Upgrading To 2.0.0 From 1.x](https://balmjs.com/docs/v2/guide/upgrade/upgrade-2.0.html)
