const powertools = require('./index.js');

// WORKS but no colors
// powertools.execute = function(cmd, options) {
//   var cp = require('child_process');

//   // Default options
//   options = options || {};
//   options.log = typeof options.log === 'undefined' ? false : options.log;
//   options.debug = typeof options.debug === 'undefined' ? false : options.debug;

//   // Default config
//   options.config = options.config || {};
//   options.config.shell = true; // Ensure it uses a shell to handle command chaining

//   return new Promise(function (resolve, reject) {
//     // Log if debug is enabled
//     if (options.debug) {
//       console.log('Running command', cmd);
//     }

//     // Use exec to handle multiple commands and maintain color output
//     var child = cp.exec(cmd, options.config);

//     // Capture the output
//     var output = '';
//     var errorOutput = '';

//     // Handle streaming output
//     child.stdout.on('data', function (data) {
//       output += data.toString();
//       if (options.log) {
//         process.stdout.write(data); // Maintain colors in the logs
//       }
//     });

//     child.stderr.on('data', function (data) {
//       errorOutput += data.toString();
//       if (options.log) {
//         process.stderr.write(data); // Maintain colors in the logs
//       }
//     });

//     // Handle the 'error' event
//     child.on('error', function (e) {
//       return reject(new Error('Failed to execute command: ' + e.message));
//     });

//     // Resolve or reject the promise based on the exit code
//     child.on('close', function (code) {
//       if (code !== 0) {
//         return reject(new Error(errorOutput || ('Command failed with exit code ' + code)));
//       } else {
//         return resolve(output);
//       }
//     });
//   });
// };

powertools.execute = function(cmd, options) {
  var cp = require('child_process');

  // Default options
  options = options || {};
  options.log = typeof options.log === 'undefined' ? false : options.log;
  options.debug = typeof options.debug === 'undefined' ? false : options.debug;

  // Default config
  options.config = options.config || {};
  options.config.stdio = options.config.stdio || (options.log ? 'inherit' : 'pipe');
  options.config.shell = true; // Ensure it uses a shell to handle command chaining and maintain colors

  return new Promise(function (resolve, reject) {
    // Log if debug is enabled
    if (options.debug) {
      console.log('Running command', cmd);
    }

    // Use spawn to handle multiple commands and maintain streaming output
    var child = cp.spawn(cmd, {
      shell: true,
      stdio: options.config.stdio,
    });

    // Capture the output
    var output = '';
    var errorOutput = '';

    // Handle streaming output if not logging directly
    if (!options.log) {
      child.stdout.on('data', function (data) {
        output += data.toString();
        process.stdout.write(data); // Maintain colors in the logs
      });

      child.stderr.on('data', function (data) {
        errorOutput += data.toString();
        process.stderr.write(data); // Maintain colors in the logs
      });
    }

    // Handle the 'error' event
    child.on('error', function (e) {
      return reject(new Error('Failed to execute command: ' + e.message));
    });

    // Resolve or reject the promise based on the exit code
    child.on('close', function (code) {
      if (code !== 0) {
        return reject(new Error(errorOutput || ('Command failed with exit code ' + code)));
      } else {
        return resolve(output);
      }
    });
  });
};


(async function() {
  const promises = [
    powertools.wait(1000),
    powertools.wait(2000),
    powertools.wait(3000),
  ];

  console.log('START', promises);

  // Test: waitForPendingPromises()
  // await powertools.waitForPendingPromises(promises, {max: 2, timeout: 2000});

  // Test: execute()
  // await powertools.execute('ls -a', {}, {log: false})
  // .then((r) => console.log('SUCCESS', r))
  // .catch((e) => console.log('ERROR', e));

  // await powertools.execute('ivalidcommand', {}, {log: false})
  // .then((r) => console.log('SUCCESS', r))
  // .catch((e) => console.log('ERROR', e));

  await powertools.execute('echo "Hello, World" && echo "Goodbye"', {}, {log: true})
  .then((r) => console.log('SUCCESS', r))
  .catch((e) => console.log('ERROR', e));

  // await powertools.execute('ls -a && ls -a', {}, {log: true})
  // .then((r) => console.log('SUCCESS', r))
  // .catch((e) => console.log('ERROR', e));

  console.log('STOP', promises);
}());
