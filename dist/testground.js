const powertools = require('./index.js');

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
  await powertools.execute('ls -a', {}, {log: false})
  .then((r) => console.log('SUCCESS', r))
  .catch((e) => console.log('ERROR', e));

  await powertools.execute('ivalidcommand', {}, {log: false})
  .then((r) => console.log('SUCCESS', r))
  .catch((e) => console.log('ERROR', e));

  console.log('STOP', promises);
}());
