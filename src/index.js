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

  // TODO: Add forceType
  // TODO: Add wait
  // TODO: Add poll

  return Powertools; // Enable if using UMD

}));
