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
    options.mode = options.mode || 'gaussian';
    if (Array.isArray(min)) {
      return min[Math.floor(Math.random() * min.length)];
    } else if (options.mode === 'gaussian') {
      var rand = 0;
      options.samples = options.samples || 3;

      for (var i = 0; i < options.samples; i++) {
        rand += Math.random() + (options.flux || 0);
      }

      rand = rand / options.samples;
      rand = Math.floor(min + rand * (max - min + 1));
      rand = rand < min ? min : rand;
      rand = rand > max ? max : rand;

      return rand;
    } else {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  };
  // var num = Math.floor(Math.random() * (max - min + 1) + min);
  // options.sign = (options.sign === '$random' || options.sign === 0 ? (Math.floor(Math.random() * (100 - 1 + 1) + 1) >= 50 ? -1 : 1) : (typeof options.sign === 'undefined' ? 1 : options.sign));
  // return (Math.floor(Math.random() * (max - min + 1) + min)) * options.sign;


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

    var endTime = Number(new Date()) + (options.timeout || 2000);
    var isAsync = fn.constructor.name === 'AsyncFunction';
    var index = 0;

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
      var flags = regex.replace(/.*\/([gimy]*)$/, '$1');
      var pattern = regex.replace(new RegExp(`^/(.*?)/${flags}$`), '$1');
      return new RegExp(pattern, flags);
    }
    return regex;
  };

  Powertools.timestamp = function(input, options) {
    options = options || {};
    options.output = (options.output || 'string').toLowerCase();
    var date = input || new Date();

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


  Powertools.force = function(input, type, options) {
    if (type === 'string') {
      return forceString(input);
    } else if (type === 'number') {
      return forceNumber(input);
    } else if (type === 'boolean') {
      return forceBoolean(input);
    } else if (type === 'array') {
      return forceArray(input, options);
    }
  };

  function forceString(input) {
    if (typeof input === 'string') {
      return input;
    } else if (typeof input === 'undefined' || input == null || isNaN(input)) {
      return '';
    } else {
      return input + '';
    }
  }

  function forceNumber(input) {
    if (typeof input === 'number' && !isNaN(input)) {
      return input;
    } else if (typeof input === 'string') {
      var n = parseFloat(input)
      return isNaN(n) ? 1 : n;
    } else if (typeof input === 'undefined' || input == null) {
      return 0;
    } else if (typeof input === 'object') {
      if (Array.isArray(input)) {
        return input.length;
      } else if (isNaN(input) && typeof input === 'number') {
        return 0;
      } else {
        return Object.keys(input).length;
      }
    } else if (input === false) {
      return 0;
    } else if (input === true) {
      return 1;
    } else {
      return 0;
    }
  }

  function forceBoolean(input) {
    if (input === 'true') {
      return true;
    } else if (input === 'false' || input === '0') {
      return false;
    } else if (typeof input === 'object') {
      var length;
      if (Array.isArray(input)) {
        length = input.length;
      } else if (isNaN(input) && typeof input === 'number') {
        length = 0;
      } else if (input == null) {
        length = 0;
      } else {
        length = Object.keys(input).length;
      }
      return length !== 0;
    } else {
      return !!input;
    }
  }

  function forceArray(input, options) {
    options = options || {};
    var result = input;
    if (typeof result === 'undefined' || result == null) {
      return [];
    } else if (!Array.isArray(result)) {
      result = typeof result === 'string' ? result : `${result}`;
      result = result.split(',');
    }

    for (var i = 0, l = result.length; i < l; i++) {
      if (options.trim !== false && typeof result[i] === 'string') {
        result[i] = result[i].trim();
      }
      if (options.force === 'string' && typeof result[i] !== 'string') {
        result[i] = forceString(result[i]);
      } else if (options.force === 'number' && typeof result[i] !== 'number') {
        result[i] = forceNumber(result[i]);
      } else if (options.force === 'boolean' && typeof result[i] !== 'boolean') {
        result[i] = forceBoolean(result[i]);
      }
    }

    return result.filter(function (item) {
      return item !== '' && typeof item !== 'undefined';
    });
  }

  return Powertools; // Enable if using UMD

}));
