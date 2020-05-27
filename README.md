<p align="center">
  <a href="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-brandmark-black-x.svg">
    <img src="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-brandmark-black-x.svg">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/itw-creative-works/node-powertools.svg">
  <br>
  <img src="https://img.shields.io/david/itw-creative-works/node-powertools.svg">
  <img src="https://img.shields.io/david/dev/itw-creative-works/node-powertools.svg">
  <img src="https://img.shields.io/bundlephobia/min/node-powertools.svg">
  <img src="https://img.shields.io/codeclimate/maintainability-percentage/itw-creative-works/node-powertools.svg">
  <img src="https://img.shields.io/npm/dm/node-powertools.svg">
  <img src="https://img.shields.io/node/v/node-powertools.svg">
  <img src="https://img.shields.io/website/https/itwcreativeworks.com.svg">
  <img src="https://img.shields.io/github/license/itw-creative-works/node-powertools.svg">
  <img src="https://img.shields.io/github/contributors/itw-creative-works/node-powertools.svg">
  <img src="https://img.shields.io/github/last-commit/itw-creative-works/node-powertools.svg">
  <br>
  <br>
  <a href="https://itwcreativeworks.com">Site</a> | <a href="https://www.npmjs.com/package/node-powertools">NPM Module</a> | <a href="https://github.com/itw-creative-works/node-powertools">GitHub Repo</a>
  <br>
  <br>
  <strong>Node Powertools</strong> is an NPM module for backend and frontend developers that exposes powerful utilities and tools.
</p>

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
