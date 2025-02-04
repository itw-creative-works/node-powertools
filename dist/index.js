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

  // Libraries
  var util;
  var cp;

  // Main
  function Powertools() {

  };

  Powertools.random = function (arg1, arg2, arg3) {
    var isArray = Array.isArray(arg1);
    var min, max, options;

    if (isArray) {
      options = arg2 || {};
      var result = _random(0, arg1.length - 1, options);
      return arg1[result];
    } else {
      min = arg1;
      max = arg2;
      options = arg3 || {};
      return _random(min, max, options);
    }
  };

  function _random(min, max, options) {
    var mode = options.mode || 'uniform';
    var skew = options.skew || 0.5;

    if (mode === 'uniform') {
      return _generateUniform(min, max);
    } else {
      return _generateGaussian(min, max, skew);
    }
  }

  function _generateGaussian(min, max, skew) {
    var mean = min + skew * (max - min);
    var stdDev = (max - min) / 6;

    var randomValue = mean + _gaussianRandom() * stdDev;

    if (randomValue < min) return min;
    if (randomValue > max) return max;
    return Math.round(randomValue);
  }

  function _generateUniform(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function _gaussianRandom() {
    var u = _safeRandom();
    var v = _safeRandom();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  function _safeRandom() {
    var r = Math.random();
    return r === 0 ? _safeRandom() : r;
  }

  // Ensure input is an array
  Powertools.arrayify = function (input) {
    return !Array.isArray(input) ? [input] : input;
  };

  // Wait for a random amount of time
  Powertools.wait = function (min, max, options) {
    return new Promise(function(resolve, reject) {
      var timeout = (typeof max === 'undefined' || max < 1)
        ? min
        : Powertools.random(min, max, options);

      // Set fallback timeout
      timeout = timeout || 0;

      setTimeout(function() {
        return resolve(timeout);
      }, timeout);
    });
  }

  // Wait for a specific amount of time
  Powertools.poll = function (fn, options) {
    options = options || {};
    options.interval = options.interval || 100;

    var endTime = Number(new Date()) + (options.timeout || 2000);
    var isAsync = fn.constructor.name === 'AsyncFunction';
    var index = 0;

    return new Promise(function (resolve, reject) {
      var p = function() {
        var attempt = function (result) {
          // If the condition is met, we're done!
          if (result) {
            return resolve();
          }

          // If the condition isn't met but the timeout hasn't elapsed, go again
          if (Number(new Date()) < endTime || options.timeout < 1) {
            index++;
            return setTimeout(p, options.interval);
          }

          // Didn't match and too much time, reject!
          return reject(new Error('Timed out for ' + fn + ': ' + arguments));
        };

        if (!isAsync) {
          attempt(fn(index));
        } else {
          fn(index).then(attempt);
        }
      };

      p();
    });
  }

  // https://github.com/sindresorhus/p-state/blob/main/index.js
  // https://stackoverflow.com/questions/30564053/how-can-i-synchronously-determine-a-javascript-promises-state
  // https://dev.to/xnimorz/101-series-promises-2-how-to-get-current-promise-status-and-build-your-own-promise-queue-18j8
  Powertools.getPromiseState = function (promise) {
    util = util || require('util');

    if (!(typeof promise === 'object' && typeof promise.then === 'function')) {
      throw new TypeError('Expected a promise, got ' + typeof promise);
    }

    var inspectedString = util.inspect(promise, {
      depth: 0,
      showProxy: false,
      maxStringLength: 0,
      breakLength: Number.POSITIVE_INFINITY,
    });

    if (inspectedString.startsWith('Promise { <pending>')) {
      return 'pending';
    }

    if (inspectedString.startsWith('Promise { <rejected>')) {
      return 'rejected';
    }

    return 'resolved';
  }

  // Wait for all promises to finish
  Powertools.waitForPendingPromises = function (promises, options) {
    return new Promise(function(resolve, reject) {
      // Fix promises
      promises = Powertools.arrayify(promises);

      // Fix options
      options = options || {};
      options.max = typeof options.max === 'undefined' ? 10 : options.max;
      options.timeout = typeof options.timeout === 'undefined' ? 60000 : options.timeout;

      // Poll for pending promises
      Powertools.poll(function () {
        var pending = promises.filter(function (promise) {
          return Powertools.getPromiseState(promise) === 'pending';
        });

        // Stop and wait
        if (pending.length >= options.max) {
          // console.log('Waiting for ' + pending.length + ' pending promises to finish...');
          return false;
        }

        // We can continue
        return true;
      }, { interval: 100, timeout: options.timeout })
      .then(resolve)
      .catch(function (e) {
        return reject(new Error('Timed out waiting for pending promises to finish'));
      })
    });
  }

  // Enqueue functions
  Powertools.queue = function (options) {
    return new FunctionQueue(options);
  }

  // Escape a string for use in a regular expression
  Powertools.escape = function (s) {
    return (s + '').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  // Turn a string into a regular expression
  Powertools.regexify = function (regex) {
    if (typeof regex === 'string') {
      var flags = regex.replace(/.*\/([gimy]*)$/, '$1');
      var pattern = regex.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
      return new RegExp(pattern, flags);
    }
    return regex;
  };

  // Format a date into a string
  Powertools.timestamp = function (input, options) {
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

  // Force a value to a specific type
  Powertools.force = function (input, type, options) {
    return forceType(input, type, options);
  };

  // Iterate over an objects keys (nested)
  // https://stackoverflow.com/a/32143089
  Powertools.getKeys = function (obj, prefix) {
    return getKeys(obj, prefix)
  };

  // Check if a value is an object (does not include null)
  Powertools.isObject = function (o) {
    return isObject(o);
  };

  // Stringify any object, including circular references
  Powertools.stringify = function (obj, replacer, spaces, cycleReplacer) {
    return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces);
  };

  // Replace instances of the settings in the input string
  // Powertools.template = function (input, settings) {
  //   if (typeof input !== 'string') {
  //     throw new Error('No string provided');
  //   }

  //   return input.replace(/\{\s*([\w\s\.]*)\s*\}/g, function (match, key) {
  //     var trimmed = key.trim();
  //     var value = getNestedValue(settings, trimmed);

  //     // If object, return JSON
  //     if (typeof value === 'object') {
  //       return JSON.stringify(value);
  //     } else {
  //       return value !== undefined ? value : match;
  //     }
  //   });
  // };
  Powertools.template = function (input, settings, options) {
    // Ensure input is a string
    if (typeof input !== 'string') {
      throw new Error('No string provided');
    }

    // Default options
    options = options || {};
    options.escape = typeof options.escape === 'undefined'
      // ? true
      ? isBrowser()
      : options.escape;

    // Replace the settings in the input string
    return input.replace(/\{\s*([\w\s\.]*)\s*\}/g, function (match, key) {
      var trimmed = key.trim();
      var value = getNestedValue(settings, trimmed);

      // Escape HTML
      if (options.escape && typeof value === 'string') {
        value = escapeHTML(value);
      }

      // If object, return JSON
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }

      // Return the value or the match
      return value !== undefined ? value : match;
    });
  };

  // Merge options and defaults/schema
  Powertools.defaults = function (user, schema) {
    var updatedSettings = {};
    var alreadyDone = [];

    getKeys(schema)
      .forEach(function (key) {
        // Get the path to this setting, minus the last key
        var pathMinusLast = key.split('.').slice(0, -1).join('.');

        // Break if we've already done this key
        if (alreadyDone.indexOf(pathMinusLast) !== -1) {
          // console.log('skip', key);
          return;
        }

        // If the user has not set a value for this setting, use the plan default
        var userSetting = getNestedValue(user, pathMinusLast);
        var schemaDefault = getNestedValue(schema, pathMinusLast);
        var workingValue;

        // If the plan default is not an object, make it one
        if (!schemaDefault || typeof schemaDefault === 'undefined') {
          schemaDefault = {
            default: getNestedValue(schema, key),
          }
        }

        // Set the schema of the plan default
        schemaDefault.types = schemaDefault.types || ['any'];
        schemaDefault.value = typeof schemaDefault.value === 'undefined' ? undefined : schemaDefault.value;
        schemaDefault.default = typeof schemaDefault.default === 'undefined' ? undefined : schemaDefault.default;
        schemaDefault.min = schemaDefault.min || 0;
        schemaDefault.max = schemaDefault.max || Infinity;

        // Prepare wether we should execute the function
        var shouldExecute = !schemaDefault.types.includes('any') && !schemaDefault.types.includes('function');

        // Run functions
        if (typeof schemaDefault.value === 'function' && shouldExecute) {
          schemaDefault.value = schemaDefault.value();
        }
        if (typeof schemaDefault.default === 'function' && shouldExecute) {
          schemaDefault.default = schemaDefault.default();
        }

        // If the user has not set a value for this setting, use the plan default
        if (typeof userSetting === 'undefined') {
          workingValue = schemaDefault.default;
        } else {
          workingValue = userSetting;
        }

        // Loop through acceptable types of default and set default if it is not one of them
        workingValue = enforceValidTypes(workingValue, schemaDefault.types, schemaDefault.default);

        // Enforce min and max values
        workingValue = enforceMinMax(workingValue, schemaDefault.min, schemaDefault.max);

        // Force to value if it is set
        if (typeof schemaDefault.value !== 'undefined') {
          workingValue = schemaDefault.value;
        }

        setNestedValue(updatedSettings, pathMinusLast, workingValue);

        alreadyDone.push(pathMinusLast);
      });


    return updatedSettings;
  }

  // Ensure an array has all unique values
  Powertools.uniquify = function (input) {
    return Array.from(new Set(input.map(JSON.stringify))).map(JSON.parse);
  };

  // Wait for each promise to finish before call the next one and callback
  Powertools.iterate = function (array, callback) {
    return array.reduce(function (promise, item, index) {
      return promise.then(function () {return callback(item, index, array)});
    }, Promise.resolve());
  };

  // execute
  Powertools.execute = function (cmd, options, setupCallback) {
    cp = cp || require('child_process');

    // Default options
    options = options || {};
    options.log = typeof options.log === 'undefined' ? false : options.log;
    options.debug = typeof options.debug === 'undefined' ? false : options.debug;

    // Default config
    options.config = options.config || {};
    options.config.stdio = options.config.stdio || (options.log ? 'inherit' : 'pipe');
    // Ensure it uses a shell to handle command chaining and maintain colors (like when using "&&" or "||")
    options.config.shell = typeof options.config.shell === 'undefined' ? true : options.config.shell;

    return new Promise(function (resolve, reject) {
      // Log if debug is enabled
      if (options.debug) {
        console.log('Running command', cmd);
      }

      // Use spawn to handle multiple commands and maintain streaming output
      var child = cp.spawn(cmd, options.config);

      // Capture the output
      var output = '';
      var errorOutput = '';

      // Handle streaming output if not logging directly
      if (child.stdout) {
        child.stdout.on('data', function (data) {
          output += data.toString();
          // process.stdout.write(data); // Maintain colors in the logs
        });
      }

      if (child.stderr) {
        child.stderr.on('data', function (data) {
          errorOutput += data.toString();
          // process.stderr.write(data); // Maintain colors in the logs
        });
      }

      // Handle the 'error' event
      child.on('error', function (e) {
        // Kill the process
        // child.kill();

        // Log
        if (options.debug) {
          console.error('Error running command', cmd, e);
        }
      });

      // Resolve or reject the promise based on the exit code
      child.on('close', function (code) {
        // Log
        if (options.debug) {
          console.error('Command completed with exit code', code, errorOutput);
        }

        if (code !== 0) {
          return reject(new Error(errorOutput || ('Command failed with exit code ' + code)));
        } else {
          return resolve(output);
        }
      });

      // Run the setup callback if it is provided
      if (typeof setupCallback === 'function') {
        setupCallback(child);
      }
    });
  };

  // Whitelist keys from an object
  Powertools.whitelist = function (obj, keys) {
    // Ensure the first argument is an object
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      throw new Error('First argument must be an object');
    }

    // Ensure the second argument is an array
    if (!Array.isArray(keys)) {
      throw new Error('Second argument must be an array of strings');
    }

    // Build the result object
    var result = {};

    // Loop through the keys
    keys.forEach(function (key) {
      var keyParts = key.split('.');
      var currentObj = obj;
      var currentResult = result;

      // Loop through the parts of the key
      for (var i = 0; i < keyParts.length; i++) {
        var part = keyParts[i];

        // If the key is not in the object, break
        if (!(part in currentObj)) {
          break;
        }

        // If we are at the end of the key, set the value
        if (i === keyParts.length - 1) {
          currentResult[part] = currentObj[part];
        } else {
          currentObj = currentObj[part];
          currentResult[part] = currentResult[part] || {};
          currentResult = currentResult[part];
        }
      }
    });

    // Return the result
    return result;
  };

  // Hyphenate a string
  Powertools.hyphenate = function (string, options) {
    options = options || {};
    options.removeNonAlphanumeric = typeof options.removeNonAlphanumeric === 'undefined' ? true : options.removeNonAlphanumeric;
    options.lowercase = typeof options.lowercase === 'undefined' ? true : options.lowercase;

    // Perform the removal of non-alphanumeric characters
    if (options.removeNonAlphanumeric) {
      string = string.replace(/[^a-zA-Z0-9 ]/g, '');
    }

    // Perform the lowercase
    if (options.lowercase) {
      string = string.toLowerCase();
    }

    // Standard hyphenation
    return string.replace(/ /g, '-').replace(/-+/g, '-');
  };

  // Parse proxies
  Powertools.parseProxy = function (proxy) {
    var result = {
      protocol: 'http',
      username: null,
      password: null,
      host: null,
      port: null,
      valid: false,
    };

    try {
      // Add a default protocol if not provided
      if (!/^(https?|socks4|socks5):\/\//.test(proxy)) {
        proxy = 'http://' + proxy;
      }

      // Parse the URL
      var url = new URL(proxy);

      // Change https to http
      if (url.protocol === 'https:') {
        url.protocol = 'http:';
      }

      // Populate the result
      result.protocol = url.protocol.replace(':', ''); // Remove the colon
      result.username = url.username || null;
      result.password = url.password || null;
      result.host = url.hostname;
      result.port = url.port;
      result.valid = Boolean(url.host && url.port); // Check if host and port are valid
    } catch (e) {
      // If the URL constructor throws an error, it's invalid
      result.valid = false;
    }

    // Add custom toString method
    result.toString = function (options) {
      options = options || {};
      options.auth = typeof options.auth === 'undefined' ? true : options.auth;

      if (!this.valid) {
        return '[Invalid Proxy]'
      };
      var auth = this.username && options.auth ? this.username + ':' + this.password + '@' : '';
      return this.protocol + '://' + auth + this.host + ':' + this.port;
    };

    // Add custom toJSON method
    result.toJSON = function () {
      return {
        protocol: this.protocol,
        username: this.username,
        password: this.password,
        host: this.host,
        port: this.port,
        valid: this.valid,
      };
    };

    // Return the result
    return result;
  };

  // Helpers
  function getKeys(obj, prefix) {
    var keys = Object.keys(obj);
    prefix = prefix ? prefix + '.' : '';
    return keys.reduce(function (result, key) {
      if (isObject(obj[key])) {
        result = result.concat(getKeys(obj[key], prefix + key));
      } else {
        result.push(prefix + key);
      }
      return result;
    }, []);
  }

  function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
  }

  // https://github.com/moll/json-stringify-safe/blob/master/stringify.js
  function serializer(replacer, cycleReplacer) {
    var stack = [], keys = []

    if (cycleReplacer == null) cycleReplacer = function (key, value) {
      if (stack[0] === value) return "[Circular ~]"
      return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
    }

    return function (key, value) {
      if (stack.length > 0) {
        var thisPos = stack.indexOf(this)
        ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
        ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
        if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
      }
      else stack.push(value)

      return replacer == null ? value : replacer.call(this, key, value)
    }
  }

  function forceType(input, type, options) {
    if (type === 'string') {
      return forceString(input);
    } else if (type === 'number') {
      return forceNumber(input);
    } else if (type === 'boolean') {
      return forceBoolean(input);
    } else if (type === 'array') {
      return forceArray(input, options);
    } else if (type === 'undefined') {
      return undefined;
    }
  }

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
      result = typeof result === 'string' ? result : (result + '');
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

  function enforceValidTypes(value, types, def) {
    var isValidType = types.some(function (type) {
      if (type === 'any') {
        return true;
      }

      return typeof value === type || (type === 'array' && Array.isArray(value));
    });

    // If only one type is allowed, force it
    if (types.length === 1 && types[0] !== 'any') {
      return isValidType ? value : forceType(value, types[0]);
    }

    // If multiple types are allowed, return the value if it is valid type, otherwise return the default
    return isValidType ? value : def;
  }

  function enforceMinMax(value, min, max) {
    var isNumber = typeof value === 'number';
    var isString = typeof value === 'string';

    if (min !== undefined) {
      if (isNumber && value < min) {
        return min;
      } else if (isString && value.length < min) {
        // return value + ' '.repeat(min - value.length);
      } else if (Array.isArray(value) && value.length < min) {
        // return value.concat(Array(min - value.length));
      }
    }

    if (max !== undefined) {
      if (isNumber && value > max) {
        return max;
      } else if (isString && value.length > max) {
        return value.slice(0, max);
      } else if (Array.isArray(value) && value.length > max) {
        return value.slice(0, max);
      }
    }

    return value;
  }

  function getNestedValue(obj, keyString) {
    var keys = keyString.split('.');
    var currentValue = obj;

    for (var key of keys) {
      if (currentValue === undefined || currentValue === null) {
        return undefined;
      }
      currentValue = currentValue[key];
    }

    return currentValue;
  }

  function setNestedValue(obj, keyString, value) {
    var keys = keyString.split('.');
    var currentObject = obj;

    for (var i = 0; i < keys.length - 1; i++) {
      var key = keys[i];

      if (typeof currentObject[key] !== 'object' || currentObject[key] === null) {
        currentObject[key] = {};
      }

      currentObject = currentObject[key];
    }

    currentObject[keys[keys.length - 1]] = value;
  }

  // Escape HTML
  // function escapeHTML(str) {
  //   return str.replace(/[&<>"']/g, function (match) {
  //     const escapeMap = {
  //       '&': '&amp;',
  //       '<': '&lt;',
  //       '>': '&gt;',
  //       '"': '&quot;',
  //       "'": '&#39;'
  //     };
  //     return escapeMap[match];
  //   });
  // }
  function escapeHTML(str) {
    // Escape HTML entities
    return str.replace(/[<>&"']/g, function (m) {
      switch (m) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case '"':
          return '&quot;';
        case "'":
          return '&#039;';
        default:
          return m;
      }
    });
  };

  function isBrowser() {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }

  // FunctionQueue.js
  function FunctionQueue(options) {
    var self = this;

    // Default options
    options = options || {};
    options.delay = typeof options.delay === 'undefined' ? 0 : options.delay;

    // Properties
    self.options = options;
    self.list = [];
    self.running = false;
  }

  FunctionQueue.prototype.add = function (fn) {
    var self = this;

    return new Promise(function (resolve, reject) {
      self.list.push({
        function: fn,
        resolve: resolve,
        reject: reject
      });

      self.process();
    });
  }

  FunctionQueue.prototype.process = function () {
    var self = this;

    return new Promise(function (resolve, reject) {
      if (self.running || !self.list.length) {
        return resolve();
      }

      self.running = true;
      var current = self.list.shift();

      function _process() {
        current
          .function()
          .then(function(result) {
            current.resolve(result);
          })
          .catch(function(e) {
            current.reject(e);
          })
          .finally(function() {
            self.running = false;
            self.process();
          });
      }

      if (self.options.delay) {
        setTimeout(_process, self.options.delay);
      } else {
        _process();
      }
    });
  }

  // Return the library
  return Powertools; // Enable if using UMD
}));
