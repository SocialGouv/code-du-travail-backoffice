/* eslint-disable no-undef */

global.console = {
  // eslint-disable-next-line no-console
  debug: console.debug,
  error: jest.fn(),
  info: jest.fn(),
  // eslint-disable-next-line no-console
  log: console.log,
  warn: jest.fn(),
};
