// @ts-check

const boxen = require("boxen");
const imgur = require("imgur");
const { Status } = require("cucumber");

imgur.setAPIUrl("https://api.imgur.com/3/");

/**
 * @param {import("cucumber").HookScenarioResult} testCase
 * @param {import("cucumber").World} world
 */
async function takeScreenshotOnFailure(testCase, world) {
  const { pickle, result } = testCase;

  if (result.status !== Status.FAILED || result.exception === undefined) return;

  if (result.exception === undefined) {
    console.error("Error: The {exception} is undefined (`result`) object.");

    return;
  }

  if (world.page === undefined) {
    console.error("Error: The {page} is undefined (`world`) object.");

    return;
  }

  try {
    // Get the screenshot image as a Base64 string:
    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions
    const screenshotImageBase64 = await world.page.screenshot({
      encoding: "base64",
      fullPage: true,
    });

    // Upload it to imgur:
    const {
      data: { link },
    } = await imgur.uploadBase64(screenshotImageBase64);

    const message =
      `FAILED FEATURE STEP \n\n` +
      `Feature: ${pickle.name}\n` +
      `Assertion: ${result.exception.message}\n` +
      `Screenshot: ${link}`;

    console.error();
    console.error(boxen(message, { padding: 1 }));
  } catch (err) {
    console.error(err);
    console.error(`\n\nError: ${err.message}`);

    if (err.response !== undefined) {
      console.error(`Output:\n${JSON.stringify(err.response.data, null, 2)}`);
    }
  }
}

module.exports = takeScreenshotOnFailure;
