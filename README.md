<p align="center">
  <a href="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-brandmark-black-x.svg">
    <img src="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-brandmark-black-x.svg" width="100px">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/itw-creative-works/node-powertools.svg">
  <br>
  <img src="https://img.shields.io/librariesio/release/npm/node-powertoolsto.svg">
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

## Node Powertools Works in Node AND browser environments
Yes, this module works in both Node and browser environments, including compatibility with [Webpack](https://www.npmjs.com/package/webpack) and [Browserify](https://www.npmjs.com/package/browserify)!

## Features
* Useful **randomization** tools to mix things up
* Helpful **polling** utilities to wait for variables or events
* Powerful **regexify** and **escape** functions to go work with `RegExp`

## Install Node Powertools
### Install via npm
Install with npm if you plan to use **Node Powertools** in a Node.js project or in the browser.
```shell
npm install node-powertools
```
If you plan to use `node-powertools` in a browser environment, you will probably need to use [Webpack](https://www.npmjs.com/package/webpack), [Browserify](https://www.npmjs.com/package/browserify), or a similar service to compile it.

```js
const powertools = require('node-powertools');
```

### Install via CDN
Install with CDN if you plan to use **Node Powertools** only in a browser environment.
```html
<script src="https://cdn.jsdelivr.net/npm/node-powertools@latest/dist/index.min.js"></script>
<script type="text/javascript">
  var powertools = Powertools(); // The script above exposes the global variable 'Powertools'
</script>
```


## Usage
### powertools.random(min, max, options)

Generate a random number between two numbers `min` and `max`. You can use `options` to supply a sign or randomize the sign as well. If an array is supplied, a random element from the array is returned.
The default `options.mode` is `uniform` but you can also supply `gaussian` which will generate random values on a gaussian bell curve.
```js
powertools.random(0, 100, {mode: 'uniform'}); // Possible output: 69
powertools.random(-100, 100, {mode: 'uniform'}); // Possible output: -69
powertools.random(-100, 100, {mode: 'gaussian'}); // Possible output: -69
powertools.random(['Apple', 'Orange', 'Pear']); // Possible output: Orange (random element)
```

### powertools.arrayify(input)

Transform the `input` into an array if it is not already.
```js
powertools.arrayify(1); // Output: [1]
powertools.arrayify([1]); // Output: [1]
```

### powertools.wait(time)

Asynchronously wait for the specified `time` in milliseconds.
```js
await powertools.wait(1000); // waits for 1000 ms (1 second)
```

### powertools.poll(fn, options)

Asynchronously wait for the specified `fn` to return `true`. You can use `options` to supply a polling interval and timeout in milliseconds. The promise **rejects** if the timeout is reached.
```js
// Call this function every 100 ms until it returns true or 30000 ms passes
await powertools.poll(function (index) {
  return something === somethingElse;
}, {interval: 100, timeout: 30000});
```

### powertools.escape(str)

Add the escape character `\` before any character in `str` that needs to be escaped for a `RegExp`.
```js
powertools.escape('*'); // Output: \*
powertools.escape('/'); // Output: \/
powertools.escape('\\'); // Output: \\
powertools.escape('.$^'); // Output: \.\$\^
```

### powertools.regexify(str)

Revive a `str` into a `RegExp`. Supports flags. Depending on how you want special characters to be treated, you can use `powertools.escape(str)` prior to using `powertools.regexify(str)`.
```js
powertools.regexify('/Apple/'); // Output: RegExp /Apple/
powertools.regexify('/Apple/i'); // Output: RegExp /Apple/i
powertools.regexify('Apple'); // Output: Throws error (needs to start and end with /)
powertools.regexify('/Apple/x'); // Output: Throws error (x is not a valid flag)

powertools.regexify('/Ap.le/'); // Output: RegExp /Ap.le/
powertools.regexify(`/${powertools.escape('Ap.le')}/`); // Output: RegExp /Ap\.le/
```

### powertools.timestamp(date, options)

Convert a `date` to a timestamp in 3 formats: an ISO `string`, a UNIX `number`, or a plain-ol' JS `Date` (as specified in `options`).
The first argument `date`  can be a JS `Date`, a UNIX timestamp `number`, or a `string` that will be parsed by the `new Date()` method.
```js
powertools.timestamp(new Date('2999/12/31'), {output: 'string'}); // Output: "2999-12-31T08:00:00.000Z"
powertools.timestamp(new Date('2999/12/31'), {output: 'unix'}); // Output: 32503622400
powertools.timestamp(new Date('2999/12/31'), {output: 'date'}); // Output: Tue Dec 31 2999 00:00:00 GMT-0800 (Pacific Standard Time)

powertools.timestamp(32503622400, {output: 'string'}); // Output: "2999-12-31T08:00:00.000Z"
powertools.timestamp(32503622400, {output: 'unix'}); // Output: 32503622400
powertools.timestamp(32503622400, {output: 'date'}); // Output: Tue Dec 31 2999 00:00:00 GMT-0800 (Pacific Standard Time)
```

### powertools.force(value, type, options)

Intelligently converts a `value` to a `type` how JavaScript **should**. The acceptable types are `string`, `number`, `boolean`, `array`.
```js
powertools.force(undefined, 'string'); // Output: ''
powertools.force('true', 'boolean'); // Output: true
powertools.force('false', 'boolean'); // Output: false
powertools.force('0', 'boolean'); // Output: false
powertools.force('1,2,3', 'array'); // Output: ['1', '2', '3']
powertools.force('1,2,3', 'array', {force: 'number'}); // Output: [1, 2, 3]
```

### powertools.getKeys(obj)
Walk through any `obj` and get an array of every key, including nested keys.
```js
powertools.getKeys({}); // Output: []
powertools.getKeys({name: 'Jon Snow'}); // Output: ['name']
powertools.getKeys({name: 'Jon Snow', favorites: {color: 'red'}}); // Output: ['name', 'favorites.color']
```

### powertools.isObject(obj)
Check if `obj` is a good ol... object. In JavaScript, `null` is, unfortunately, considered an object.
```js
powertools.isObject({}); // Output: true
powertools.isObject(null); // Output: false
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
