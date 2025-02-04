<p align="center">
  <a href="https://itwcreativeworks.com">
    <img src="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-brandmark-black-x.svg" width="100px">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/itw-creative-works/node-powertools.svg">
  <br>
  <img src="https://img.shields.io/librariesio/release/npm/node-powertools.svg">
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

## 🌐 Node Powertools Works in Node AND browser environments
Yes, this module works in both Node and browser environments, including compatibility with [Webpack](https://www.npmjs.com/package/webpack) and [Browserify](https://www.npmjs.com/package/browserify)!

## 🦄 Features
* Useful **randomization** tools to mix things up
* Helpful **polling** utilities to wait for variables or events
* Powerful **regexify** and **escape** functions to go work with `RegExp`

## 📦 Install Node Powertools
### Option 1: Install via npm
Install with npm if you plan to use **Node Powertools** in a Node.js project or in the browser.
```shell
npm install node-powertools
```
If you plan to use `node-powertools` in a browser environment, you will probably need to use [Webpack](https://www.npmjs.com/package/webpack), [Browserify](https://www.npmjs.com/package/browserify), or a similar service to compile it.

```js
const powertools = require('node-powertools');
```

### Option 2: Install via CDN
Install with CDN if you plan to use **Node Powertools** only in a browser environment.
```html
<script src="https://cdn.jsdelivr.net/npm/node-powertools@latest/dist/index.min.js"></script>
<script type="text/javascript">
  var powertools = Powertools(); // The script above exposes the global variable 'Powertools'
</script>
```


## ⚡️ Usage
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

### powertools.queue(options)
Returns a `Queue` which you can run `.add(fn)` where `fn` is an Asynchronous function. The queue will process the functions in FIFO (first in, first out) order and will only process the next async function after the one before it resolves or rejects.
```js
// Queue options
const options = {
  delay: 100, // Delay between each function in milliseconds
}

// Create the queue
const queue = powertools.queue(options)

// Queue the first function
queue.add(async () => {
  console.log('Queue 1 started');
  await powertools.wait(1000)
  console.log('Queue 1 finished');
})

// Queue the second function
// This will only begin executing after the first function completes
queue.add(async () => {
  console.log('Queue 2 started');
  await powertools.wait(1000)
  console.log('Queue 2 finished');
})
```

### powertools.getPromiseState(promise)
Returns `pending`, `resolved`, or `rejected` based on the state of the `promise`. This is useful for checking if a promise has been resolved or rejected.

This method depends on `util` from Node.js, so it will not work in the browser.
```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('done');
  }, 1000);
});

powertools.getPromiseState(promise); // Output: 'pending'
await promise;
powertools.getPromiseState(promise); // Output: 'resolved'
```

### powertools.waitForPendingPromises(promises, options)
Wait for `options.max` promises to resolve before continuing. This is useful for when you have a large number of promises and you want to limit the number of concurrent promises that are running at any given time. This promise **rejects** if the `options.timeout` is reached.

This method depends on `util` from Node.js, so it will not work in the browser.
```js
const promises = [
  powertools.wait(1000),
  powertools.wait(2000),
  powertools.wait(3000),
];

console.log('Starting processing', promises);

await powertools.waitForPendingPromises(promises, {max: 2, timeout: 2000});

console.log('Finished processing', promises);
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
Intelligently converts a `value` to a `type` how JavaScript **should**. The acceptable types are `string`, `number`, `boolean`, `array`. This is useful for helping to validate user input, such as considering `'true'` (string) to be `true` (boolean) or `'0'` (string of a number) to be `false` (boolean).
```js
powertools.force('true', 'boolean'); // Output: true
powertools.force('false', 'boolean'); // Output: false
powertools.force('0', 'boolean'); // Output: false
powertools.force('1,2,3', 'array'); // Output: ['1', '2', '3']
powertools.force('1,2,3', 'array', {force: 'number'}); // Output: [1, 2, 3]
powertools.force(undefined, 'string'); // Output: ''
```

### powertools.defaults(settings, defaults)
Easily structure your `settings` object by validating them with a `defaults` object. This function automatically fills in any missing keys in `settings` with the corresponding key in `defaults`, removes any keys in `settings` that are not in `defaults`, and converts any values in `settings` to the same type as the corresponding key in `defaults`.

#### How to Define Defaults
- `types`: An array of valid types for the value.
- `default`: Any value that will be used if the key is missing.
- `min`: A number limiting the minimum value if the value is a number, or the minimum length if the value is a string.
- `max`: A number limiting the maximum value if the value is a number, or the maximum length if the value is a
- `value`: Any value that will override the value in `settings` regardless of what it is (force the value).

```js
const defaults = {
  name: {
    types: ['string'],
    default: '',
    min: 0,
    max: 10,
  },
  stats: {
    level: {
      types: ['number'],
      default: 1,
      min: 1,
      max: 2,
    },
    index: {
      value: 1,
    },
  },
}
powertools.defaults({}, defaults); // Output: {name: '', stats: {level: 1}}
powertools.defaults({name: 'What a long name!'}, defaults); // Output: {name: 'What a lon', stats: {level: 1}}
powertools.defaults({stats: {level: 3}}, defaults); // Output: {name: '', stats: {level: 2}}
```

### powertools.getKeys(obj)
Walk through any `obj` and get an array of every key, including nested keys.
```js
powertools.getKeys({name: 'Jon Snow'}); // Output: ['name']
powertools.getKeys({name: 'Jon Snow', favorites: {color: 'red'}}); // Output: ['name', 'favorites.color']
powertools.getKeys({}); // Output: []
```

### powertools.isObject(obj)
Check if `obj` is a good ol... object. In JavaScript, `null` is, unfortunately, considered an object. This function does not consider `null` to be an object.
```js
powertools.isObject({}); // Output: true
powertools.isObject(null); // Output: false
```

### powertools.stringify(obj)
Stringify an `obj` into a JSON string even if it has circular references.
```js
powertools.stringify({}); // Output: '{}'
```

### powertools.template(str, data, options)
Replace all instances of `{key}` in `str` with the corresponding value in `data`. You can use `options` to customize the template. `options.escape` will escape any HTML characters, and defaults to `true` if we're in a browser environment.
```js
powertools.template(
  'My favorite color is {color}',
  {color: 'purple'}
); // Output: 'My favorite color is purple'
powertools.template(
  'Ian\'s favorite color is {ian.color}',
  {ian: {color: 'purple'}
); // Output: 'Ian\'s favorite color is purple'
powertools.template(
  'My favorite color is {color}',
  {color: '<b>purple</b>'},
  {escape: true}
); // Output: 'My favorite color is &lt;b&gt;purple&lt;/b&gt;'
```

### powertools.uniquify(arr)
Return an array `arr` with all duplicates removed.
```js
powertools.uniquify([{id: 1}, {id: 1}, {id: 2}]); // Output: [{id: 1}, {id: 2}]
```

### powertools.iterate(arr, callback)
Asynchronously iterate through an array `arr` and call `callback` on each element. This function is useful for when you need to wait for asynchronous functions to complete before moving on to the next element in the array.
```js
const sampleArray = [1, 2, 3, 4, 5];

// Simulate an async operation like a database call
const asyncTask = (item, index) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Processing item ${item} at index ${index}`);
      return resolve();
    }, 1000);
  });
};

// Process each item in the array asynchronously
Powertools.iterate(sampleArray, asyncTask)
  .then(() => console.log('All tasks completed.'));
```

### powertools.execute(command, options, setupCallback)
Asynchronously execute a `command` in the terminal. This function is useful for when you need to run a command in the terminal and wait for it to complete before moving on to the next step in your code.
```js
// Run a simple command
await powertools.execute('ls -a')
.then((output) => {
  console.log('Files:', output);
})

// Run a command with config
await powertools.execute('ls -a', {
  config: {cwd: '/path/to/directory'},
})
.then((output) => {
  console.log('Files:', output);
})

// Run a command with options like options.log
// This will write the command's output to process.stdout and process.stderr
// This is useful if you're running an intensive command and want to see the output in real-time
await powertools.execute('ls -a', {
  log: true,
})
.then((output) => {
  console.log('Files:', output);
})

// Run with a setupCallback
await powertools.execute('ls -a', {
  log: true,
}, (child) => {
  console.log('Child process:', child);
})
.then((output) => {
  console.log('Files:', output);
})
```

### powertools.whitelist(obj, keys)
Return a new object with only the keys in `keys` from `obj`.
```js
powertools.whiteList({name: 'Jon Snow', age: 25}, ['name']); // Output: {name: 'Jon Snow'}
```

### powertools.hyphenate(str, options)
Convert a `str` to hyphenated case. You can use `options` to customize the hyphenation.
```js
powertools.hyphenate('Jon Snow'); // Output: 'jon-snow'
powertools.hyphenate('Jon Snow', {lowercase: false}); // Output: 'Jon-Snow'
powerTools.hyphenate('Jon Snow!', {removeNonAlphanumeric: true}); // Output: 'jon-snow'
```

### powertools.parseProxy(proxy)
Parse a `proxy` string into an object with `protocol`, `host`, `port`, `username`, and `password` keys.
```js
const proxy = powertools.parseProxy('http://username:password@1.2.3.4:8080'); // Output: {protocol: 'http', host: '1.2.3.4', port: '8080', username: 'username', password: 'password'}

// Stringify it
console.log(proxy.toString()); // Output: 'http://username:password@1.2.3.4:8080'

// Stringify it without the auth
console.log(proxy.toString({auth: false})); // Output: 'http://1.2.3.4:8080'
```

## 🗨️ Final Words
If you are still having difficulty, we would love for you to post a question to [the Node Powertools issues page](https://github.com/itw-creative-works/node-powertools/issues). It is much easier to answer questions that include your code and relevant files! So if you can provide them, we'd be extremely grateful (and more likely to help you find the answer!)

## 📚 Projects Using this Library
[Somiibo](https://somiibo.com/): A Social Media Bot with an open-source module library. <br>
[JekyllUp](https://jekyllup.com/): A website devoted to sharing the best Jekyll themes. <br>
[Slapform](https://slapform.com/): A backend processor for your HTML forms on static sites. <br>
[Proxifly](https://proxifly.com/): A backend processor for your HTML forms on static sites. <br>
[SoundGrail Music App](https://app.soundgrail.com/): A resource for producers, musicians, and DJs. <br>
[Hammock Report](https://hammockreport.com/): An API for exploring and listing backyard products. <br>

Ask us to have your project listed! :)
