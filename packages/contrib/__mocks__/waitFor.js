global.waitFor = delayInMs =>
  new Promise(resolve => setTimeout(resolve, delayInMs));
