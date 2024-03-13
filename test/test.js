const package = require('../package.json');
const assert = require('assert');

beforeEach(() => {
});

before(() => {
});

after(() => {
});

/*
 * ============
 *  Test Cases
 * ============
 */
describe(`${package.name}`, () => {
  let powertools = require('../dist/index.js');

  describe('.queue()', () => {

    const queue = powertools.queue();

    queue.add(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('Hello, World!');
        }, 1000);
      });
    });

    describe('queue', () => {
      // Normal
      it('add to queue', () => {
        return queue.list === 1;
      });
    });

  });

  describe('.getPromiseState()', () => {
    describe('promise', () => {
      // Normal
      it('promise (pending) => string (pending)', () => {
        return assert.equal(powertools.getPromiseState(new Promise(() => {})), 'pending');
      });
      it('promise (resolved) => string (resolved)', () => {
        return assert.equal(powertools.getPromiseState(Promise.resolve('Hello, World!')), 'resolved');
      });
      it('promise (rejected) => string (rejected)', () => {
        return assert.equal(powertools.getPromiseState(Promise.reject('Hello, World!')), 'rejected');
      });

      // Edge
      it('promise (empty) => string (resolved)', () => {
        // should pass if getPromiseState throws an error
        return assert.throws(() => {
          powertools.getPromiseState();
        });
      });
    });
  });

  describe('.waitForPendingPromises()', () => {
    describe('promise', () => {
      // This test should pass because the promises do complete
      it('promise (pending) => string (resolved) - should pass', () => {
        // Create an array of promises that resolve after 1 second
        const promises = [powertools.wait(100), powertools.wait(100)];

        // This should not reject because the promises do resolve
        return assert.doesNotReject(powertools.waitForPendingPromises(promises, {max: 2, timeout: 1000}));
      });

      // This test should fail because it waits for two promises that never complete
      it('promise (pending) => string (resolved) - should fail', () => {
        // Create an array of promises that never resolve
        const promises = [new Promise(() => {}), new Promise(() => {})];

        // This should reject because the promises never resolve
        return assert.rejects(powertools.waitForPendingPromises(promises, {max: 2, timeout: 1000}));
      });

    });
  });

  describe('.getKeys()', () => {

    describe('keys', () => {
      // Normal
      it('object (one key) => array (one key)', () => {
        return assert.deepEqual(powertools.getKeys({name: 'ian'}), ['name']);
      });
      it('object (one key + nested) => array (one key, nested)', () => {
        return assert.deepEqual(powertools.getKeys({name: 'ian', favorites: {color: 'red'}}), ['name', 'favorites.color']);
      });


      // Edge
      it('object (empty) => array (one value + nested)', () => {
        return assert.deepEqual(powertools.getKeys({}), []);
      });
    });

  });

  describe('.force()', () => {

    describe('string', () => {
      it('string (empty) => string (empty)', () => {
        return assert.equal(powertools.force('', 'string'), '');
      });
      it('string => string', () => {
        return assert.equal(powertools.force('Hello, World!', 'string'), 'Hello, World!');
      });
      it('boolean (true) => string', () => {
        return assert.equal(powertools.force(true, 'string'), 'true');
      });
      it('boolean (false) => string', () => {
        return assert.equal(powertools.force(false, 'string'), 'false');
      });
      it('number (1) => string', () => {
        return assert.equal(powertools.force(1, 'string'), '1');
      });
      it('number (0) => string', () => {
        return assert.equal(powertools.force(0, 'string'), '0');
      });

      // Edge
      it('object ({}) => string (empty)', () => {
        return assert.equal(powertools.force({}, 'string'), '');
      });
      it('object (1 key) => string (empty)', () => {
        return assert.equal(powertools.force({key: 'value'}, 'string'), '');
      });
      it('array ([]) => string (empty)', () => {
        return assert.equal(powertools.force([], 'string'), '');
      });
      it('array (1 item) => string (empty)', () => {
        return assert.equal(powertools.force(['item'], 'string'), '');
      });
      it('undefined => string (empty)', () => {
        return assert.equal(powertools.force(undefined, 'string'), '');
      });
      it('null => string (empty)', () => {
        return assert.equal(powertools.force(null, 'string'), '');
      });
      it('NaN => string (empty)', () => {
        return assert.equal(powertools.force(NaN, 'string'), '');
      });
    });

    describe('number', () => {
      it('number => number', () => {
        return assert.equal(powertools.force(0, 'number'), 0);
      });
      it('number => number', () => {
        return assert.equal(powertools.force(1, 'number'), 1);
      });
      it('string => number', () => {
        return assert.equal(powertools.force('1', 'number'), 1);
      });
      it('string => number', () => {
        return assert.equal(powertools.force('0', 'number'), 0);
      });
      it('string (float) => number', () => {
        return assert.equal(powertools.force('0.0', 'number'), 0);
      });
      it('string (float) => number', () => {
        return assert.equal(powertools.force('1.0', 'number'), 1.0);
      });
      it('string (float) => number', () => {
        return assert.equal(powertools.force('1.234', 'number'), 1.234);
      });

      // Edge
      it('string => number', () => {
        return assert.equal(powertools.force('a random string', 'number'), 1);
      });
      it('true => number', () => {
        return assert.equal(powertools.force(true, 'number'), 1);
      });
      it('false => number', () => {
        return assert.equal(powertools.force(false, 'number'), 0);
      });
      it('object ({}) => string (empty)', () => {
        return assert.equal(powertools.force({}, 'number'), 0);
      });
      it('object (1 key) => number (1)', () => {
        return assert.equal(powertools.force({key: 'value'}, 'number'), 1);
      });
      it('array ([]) => number (empty)', () => {
        return assert.equal(powertools.force([], 'number'), 0);
      });
      it('array (1 item) => number (1)', () => {
        return assert.equal(powertools.force(['item'], 'number'), 1);
      });
      it('undefined => number', () => {
        return assert.equal(powertools.force(undefined, 'number'), 0);
      });
      it('null => number', () => {
        return assert.equal(powertools.force(null, 'number'), 0);
      });
      it('NaN => number', () => {
        return assert.equal(powertools.force(NaN, 'number'), 0);
      });
    });

    describe('boolean', () => {
      it('boolean (true) => boolean (true)', () => {
        return assert.equal(powertools.force(true, 'boolean'), true);
      });
      it('boolean (false) => boolean (false)', () => {
        return assert.equal(powertools.force(false, 'boolean'), false);
      });
      it('string (true) => boolean (true)', () => {
        return assert.equal(powertools.force('true', 'boolean'), true);
      });
      it('string (false) => boolean (false)', () => {
        return assert.equal(powertools.force('false', 'boolean'), false);
      });
      it('string (1) => boolean (true)', () => {
        return assert.equal(powertools.force('1', 'boolean'), true);
      });
      it('number (1) => boolean (true)', () => {
        return assert.equal(powertools.force(1, 'boolean'), true);
      });
      it('string (0) => boolean (false)', () => {
        return assert.equal(powertools.force('0', 'boolean'), false);
      });
      it('number (0) => boolean (false)', () => {
        return assert.equal(powertools.force(0, 'boolean'), false);
      });
      it('number (-1) => boolean (true)', () => {
        return assert.equal(powertools.force(-1, 'boolean'), true);
      });

      // Edge
      it('string => boolean (true)', () => {
        return assert.equal(powertools.force('Hello, World!', 'boolean'), true);
      });
      it('object ({}) => boolean (true)', () => {
        return assert.equal(powertools.force({}, 'boolean'), false);
      });
      it('object (1 key) => boolean (true)', () => {
        return assert.equal(powertools.force({key: 'value'}, 'boolean'), true);
      });
      it('array (empty) => boolean (true)', () => {
        return assert.equal(powertools.force([], 'boolean'), false);
      });
      it('array (1 item) => boolean (true)', () => {
        return assert.equal(powertools.force(['item'], 'boolean'), true);
      });
      it('undefined => boolean (false)', () => {
        return assert.equal(powertools.force(undefined, 'boolean'), false);
      });
      it('null => boolean (false)', () => {
        return assert.equal(powertools.force(null, 'boolean'), false);
      });
    });

    describe('array', () => {
      let result_number = [1, 2, 3];
      let result_string = ['1', '2', '3'];
      let result_boolean = [true, false, true];
      let result_empty = [];

      it('array (number) => array (number)', () => {
        return assert.deepStrictEqual(powertools.force([1, 2, 3], 'array'), result_number);
      });
      it('array (string) => array (string)', () => {
        return assert.deepStrictEqual(powertools.force('1,2,3', 'array'), result_string);
      });
      it('array (number + spaces) => array (string)', () => {
        return assert.deepStrictEqual(powertools.force('1, 2, 3', 'array'), result_string);
      });
      it('array (number + spaces) => array (number)', () => {
        return assert.deepStrictEqual(powertools.force('1, 2, 3', 'array', {force: 'number'}), result_number);
      });
      it('array (boolean) => array (boolean)', () => {
        return assert.deepStrictEqual(powertools.force('true,false,true', 'array', {force: 'boolean'}), result_boolean);
      });
      it('array (boolean) => array (boolean)', () => {
        return assert.deepStrictEqual(powertools.force('true, false, true', 'array', {force: 'boolean'}), result_boolean);
      });
      it('array (boolean) => array (boolean)', () => {
        return assert.deepStrictEqual(powertools.force([true, false, true], 'array', {force: 'boolean'}), result_boolean);
      });

      // Edge
      it('boolean => array', () => {
        return assert.deepStrictEqual(powertools.force(true, 'array', {force: 'boolean'}), [true]);
      });
      it('boolean => array', () => {
        return assert.deepStrictEqual(powertools.force(false, 'array', {force: 'boolean'}), [false]);
      });
      it('empty string => empty array', () => {
        return assert.deepStrictEqual(powertools.force('', 'array'), result_empty);
      });
      it('undefined => empty array', () => {
        return assert.deepStrictEqual(powertools.force(undefined, 'array'), result_empty);
      });
      it('null => empty array', () => {
        return assert.deepStrictEqual(powertools.force(null, 'array'), result_empty);
      });
    });

  });

  describe('.template()', () => {

    describe('template', () => {
      // Normal
      it('string (one key)', () => {
        return assert.deepEqual(powertools.template('My favorite color is {color}', {color: 'purple'}), 'My favorite color is purple');
      });

      // Normal
      it('string (nested key)', () => {
        return assert.deepEqual(powertools.template('My favorite color is {ian.color}', {ian: {color: 'purple'}}), 'My favorite color is purple');
      });

      // Object
      it('string (object key)', () => {
        return assert.deepEqual(powertools.template('Expanded object: {settings}', {settings: {color: 'purple'}}), 'Expanded object: {"color":"purple"}');
      });
    });

  });

  describe('defaults()', () => {
    const defaults = {
      basic: {
        name: {
          types: ['string'],
          default: '',
          max: 10,
        },
        preference: {
          types: ['string', 'undefined'],
          default: undefined,
        },
        time: {
          types: ['string'],
          default: () => '2999-01-01T00:00:00.000Z',
        },
        stats: {
          level: {
            types: ['number'],
            default: 1,
            min: 1,
            max: 10,
          },
          admin: {
            types: ['boolean'],
            default: false,
            value: false,
          },
        },
      },
      premium: {
        name: {
          types: ['string'],
          default: '',
          max: 10,
        },
        preference: {
          types: ['string', 'undefined'],
          default: undefined,
        },
        time: {
          types: ['string'],
          value: () => '2999-01-01T00:00:00.000Z',
        },
        stats: {
          level: {
            types: ['number'],
            default: 1,
            min: 1,
            max: 10,
          },
        },
      },
    };

    it('should fill in unset values', () => {
      const user = {
      };

      const planId = 'basic';

      const result = powertools.defaults(user, defaults[planId]);

      assert.strictEqual(result.name, defaults[planId].name.default);
      assert.strictEqual(result.stats.level, defaults[planId].stats.level.default);
      assert.strictEqual(result.stats.admin, defaults[planId].stats.admin.default);
    });

    it('should remove keys not defined in defaults', () => {
      const user = {
        name: 'John',
        stats: {
          level: 1,
        },
        unacceptable: {
          value: 'test',
        },
      };

      const planId = 'basic';

      const result = powertools.defaults(user, defaults[planId]);

      assert(!result.hasOwnProperty('unacceptable'));
    });

    it('should allow undefined values', () => {
      const user = {
      };

      const planId = 'basic';

      const result = powertools.defaults(user, defaults[planId]);

      assert.strictEqual(result.preference, undefined);
    });

    it('should disallow unacceptable types', () => {
      const user = {
        name: 123,
        stats: {
          level: 'invalid',
        },
      };

      const planId = 'basic';

      const result = powertools.defaults(user, defaults[planId]);

      assert.strictEqual(result.name, `${user.name}`);
      assert.strictEqual(result.stats.level, defaults[planId].stats.level.default);
    });

    it('should enforce acceptable types', () => {
      const user = {
        stats: {
          level: '3',
        },
      };

      const planId = 'basic';

      const result = powertools.defaults(user, defaults[planId]);
      assert.strictEqual(typeof result.stats.level, typeof defaults[planId].stats.level.default);
      assert.strictEqual(result.stats.level, parseInt(user.stats.level));
    });

    it('should enforce min and max constraints', () => {
      const user = {
        name: 'John but too long',
        stats: {
          level: 50,
        },
      };

      const planId = 'basic';

      const result = powertools.defaults(user, defaults[planId]);

      assert.strictEqual(result.stats.level, defaults[planId].stats.level.max);
      assert.strictEqual(result.name, user.name.slice(0, defaults[planId].name.max));
    });

    it('should enforce value constraint', () => {
      const user = {
        stats: {
          admin: true,
        },
      };

      const planId = 'basic';

      const result = powertools.defaults(user, defaults[planId]);
      assert.strictEqual(result.stats.admin, defaults[planId].stats.admin.value);
    });

    it('should work with nested properties', () => {
      const user = {
        name: 'John',
        stats: {
          level: 10,
          invalid: 'test',
        },
      };

      const planId = 'premium';

      const result = powertools.defaults(user, defaults[planId]);

      assert.strictEqual(result.name, user.name);
      assert.strictEqual(result.stats.level, user.stats.level);
      assert(!result.stats.hasOwnProperty('invalid'));
    });

    it('should work with functions', () => {
      const user = {
        time: '2999-01-01T00:00:00.000Z',
      };

      const planId = 'premium';

      const result = powertools.defaults(user, defaults[planId]);

      assert.strictEqual(result.time, user.time);
    });

    // it('should work without requiring strict defaults', () => {
    //   const user = {
    //     name: 'John',
    //     stats: {
    //       level: 10,
    //       invalid: 'test',
    //     },
    //   };
    //   const defaults = {
    //     requests: 2,
    //     devices: 1,
    //   }
    //   const planId = 'basic';

    //   const result = powertools.defaults(user, defaults[planId]);
    //   assert.strictEqual(result.requests, user.requests);
    // });
  });


})
