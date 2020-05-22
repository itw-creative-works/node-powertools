<div align="center">
  <a href="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-brandmark-black-x.svg">
    <img src="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-brandmark-black-x.svg">
  </a>
  <br>
  <br>

![GitHub package.json version](https://img.shields.io/github/package-json/v/itw-creative-works/node-powertools.svg)

![David](https://img.shields.io/david/itw-creative-works/node-powertools.svg)
![David](https://img.shields.io/david/dev/itw-creative-works/node-powertools.svg) <!-- ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/itw-creative-works/node-powertools.svg) -->
![npm bundle size](https://img.shields.io/bundlephobia/min/node-powertools.svg)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability-percentage/itw-creative-works/node-powertools.svg)
![npm](https://img.shields.io/npm/dm/node-powertools.svg) <!-- [![NPM total downloads](https://img.shields.io/npm/dt/node-powertools.svg?style=flat)](https://npmjs.org/package/node-powertools) -->
![node](https://img.shields.io/node/v/node-powertools.svg)
![Website](https://img.shields.io/website/https/itwcreativeworks.com.svg)
![GitHub](https://img.shields.io/github/license/itw-creative-works/node-powertools.svg)
![GitHub contributors](https://img.shields.io/github/contributors/itw-creative-works/node-powertools.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/itw-creative-works/node-powertools.svg)

# Node Powertools
**Node Powertools** is an NPM module for backend and frontend developers that exposes powerful utilities and tools.

[Site](https://itwcreativeworks.com) | [NPM Module](https://www.npmjs.com/package/node-powertools) | [GitHub Repo](https://github.com/itw-creative-works/node-powertools)

</div>

## Install
Install with npm:
```shell
npm install node-powertools
```

## Features
* Useful **randomization** tools
* Helpful **polling** utilities

## Example Setup
After installing via npm, simply paste this script in your `functions/index.js` file.
```js
// In your functions/index.js file
const powertools = require('node-powertools');

```
## Usage
**powertools.random(min, max, options)**
```js
powertools.random(1, 100); // 69
powertools.random(1, 100, {sign: -1}); // -69
powertools.random(1, 100, {sign: 1}); // 69
powertools.random(1, 100, {sign: 0}); // -69 (sign: 0 --> randomizes sign)
powertools.random(['Apple', 'Orange', 'Pear']); // Orange
```

## Final Words
If you are still having difficulty, we would love for you to post a question to [the Node Powertools issues page](https://github.com/itw-creative-works/node-powertools/issues). It is much easier to answer questions that include your code and relevant files! So if you can provide them, we'd be extremely grateful (and more likely to help you find the answer!)

## Projects Using this Library
[Somiibo](https://somiibo.com/): A Social Media Bot with an open-source module library. <br>
[JekyllUp](https://jekyllup.com/): A website devoted to sharing the best Jekyll themes. <br>
[Slapform](https://slapform.com/): A backend processor for your HTML forms on static sites. <br>
[Proxifly](https://proxifly.com/): A backend processor for your HTML forms on static sites. <br>
[SoundGrail Music App](https://app.soundgrail.com/): A resource for producers, musicians, and DJs. <br>
[Hammock Report](https://hammockreport.com/): An API for exploring and listing backyard products. <br>

Ask us to have your project listed! :)
