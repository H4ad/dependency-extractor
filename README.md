<h1 align="center">
  🚀 Dependency Extractor
</h1>

<p align="center">
  <a href="#usage">Usage</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#credits">Credits</a>
</p>

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

Retrieves the (flat) list of package dependencies from the package manager lock file.

Currently, we support these package managers:

- npm using ([NpmExtractor](./src/npm-extractor.ts)).

# Usage

First, install the library with:

```bash
npm i @h4ad/dependency-extractor
```

Then, you need to read and parse the `package-lock.json`:

```js
import { NpmExtractor } from '@h4ad/dependency-extractor';
import { readFileSync } from 'fs';

const extractor = new NpmExtractor();
const packageLock = readFileSync('package-lock.json').toString('utf-8');

const dependencyContainer = extractor.parse(packageLock);
```

Then, you can use the information collected from your dependencies with:

```js
const allDependencies = dependencyContainer.getAllDependencies();
const productionDependencies = dependencyContainer.getProductionDependencies();
const developmentDependencies = dependencyContainer.getDevelopmentDependencies();
const peerDependencies = dependencyContainer.getPeerDependencies();
const optionalDependencies = dependencyContainer.getOptionalDependencies();

const firstDependency = allDependencies[0];

console.log(firstDependency.name);
console.log(firstDependency.version);
console.log(firstDependency.isProduction);
console.log(firstDependency.isDevelopment);
console.log(firstDependency.isOptional);
console.log(firstDependency.isPeer);
```

# Credits

This library was based on [npm-dependencies-extractor](https://github.com/philips-software/npm-dependencies-extractor).

[build-img]:https://github.com/H4ad/dependency-extractor/actions/workflows/release.yml/badge.svg

[build-url]:https://github.com/H4ad/dependency-extractor/actions/workflows/release.yml

[downloads-img]:https://img.shields.io/npm/dt/dependency-extractor

[downloads-url]:https://www.npmtrends.com/@h4ad/dependency-extractor

[npm-img]:https://img.shields.io/npm/v/@h4ad/dependency-extractor

[npm-url]:https://www.npmjs.com/package/@h4ad/dependency-extractor

[issues-img]:https://img.shields.io/github/issues/H4ad/dependency-extractor

[issues-url]:https://github.com/H4ad/dependency-extractor/issues

[codecov-img]:https://codecov.io/gh/H4ad/dependency-extractor/branch/main/graph/badge.svg

[codecov-url]:https://codecov.io/gh/H4ad/dependency-extractor

[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

[semantic-release-url]:https://github.com/semantic-release/semantic-release

[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg

[commitizen-url]:http://commitizen.github.io/cz-cli/
