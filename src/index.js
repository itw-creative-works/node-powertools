(function (root, factory) {
  // https://github.com/umdjs/umd/blob/master/templates/returnExports.js
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  var environment = (Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]') ? 'node' : 'browser';

  if (environment === 'browser') {
    try {
      window.Powertools = Powertools;
    } catch (e) {
    }
  }

  function Powertools(options) {

  };

  Powertools.random = function (min, max, options) {
    options = options || {};
    if (Array.isArray(min)) {
      return min[Math.floor(Math.random() * min.length)];
    } else {
      let num = Math.floor(Math.random() * (max - min + 1) + min);
      options.sign = (options.sign === '$random' || options.sign === 0 ? (Math.floor(Math.random() * (100 - 1 + 1) + 1) >= 50 ? -1 : 1) : (typeof options.sign === 'undefined' ? 1 : options.sign));
      return (Math.floor(Math.random() * (max - min + 1) + min)) * options.sign;
    }
  };


  Powertools.arrayify = function (input) {
    return !Array.isArray(input) ? [input] : input;
  };


  Powertools.wait = function(ms) {
    return new Promise(function(resolve, reject) {
      setInterval(function() {
        resolve();
      }, ms || 1);
    });
  }

  Powertools.poll = function(fn, options) {
    options = options || {};
    options.interval = options.interval || 100;

    let endTime = Number(new Date()) + (options.timeout || 2000);
    let isAsync = fn.constructor.name === "AsyncFunction";
    let index = 0;

    return new Promise(function(resolve, reject) {
      (async function p() {
        // If the condition is met, we're done!
        if (!isAsync && fn(index)) {
          return resolve();
        }
        else if (isAsync && await fn(index)) {
          return resolve();
        }
        // If the condition isn't met but the timeout hasn't elapsed, go again
        else if (Number(new Date()) < endTime || options.timeout < 1) {
          // console.log('polling...');
          index++;
          setTimeout(p, options.interval);
        }
        // Didn't match and too much time, reject!
        else {
          return reject(new Error('Timed out for ' + fn + ': ' + arguments));
        }
      })();
    });
  }

  Powertools.escape = function(s) {
    return (s + '').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  Powertools.regexify = function(regex) {
    if (typeof regex === 'string') {
      let flags = regex.replace(/.*\/([gimy]*)$/, '$1');
      let pattern = regex.replace(new RegExp(`^/(.*?)/${flags}$`), '$1');
      return new RegExp(pattern, flags);
    }
    return regex;
  };

  Powertools.timestamp = function(input, options) {
    options = options || {};
    options.output = (options.output || 'string').toLowerCase();
    let date = input || new Date();

    if (typeof date === 'number') {
      date = new Date(date * 1000);
    } else if (typeof date === 'string') {
      date = new Date(date);
    }


    if (options.output === 'string') {
      return date.toISOString()
    } else if (options.output === 'unix') {
      return Math.floor((+date) / 1000);
    } else {
      return date;
    }
  };

  // TODO: Add forceType

  return Powertools; // Enable if using UMD

}));
