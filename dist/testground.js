const powertools = require('./index.js');

(async function() {
  const promises = [
    powertools.wait(1000),
    powertools.wait(2000),
    powertools.wait(3000),
  ];

  console.log('START', promises);

  await powertools.waitForPendingPromises(promises, {max: 2, timeout: 2000});

  console.log('STOP', promises);
}());
