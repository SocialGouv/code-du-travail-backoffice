const boxen = require('boxen');
const { Status } = require("cucumber");
const imgur = require("imgur");

imgur.setAPIUrl("https://api.imgur.com/3/");

module.exports = async (testCase, world) => {
  const { pickle, result } = testCase;

  if (result.status !== Status.FAILED) return;

  try {
    // Get the screenshot image as a Base64 string:
    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions
    const screenshotImageBase64 = await world.page.screenshot({
      encoding: "base64",
      fullPage: true
    });

    // Upload it to imgur:
    const { data: { link } } = await imgur.uploadBase64(screenshotImageBase64);

    const message = `FAILED FEATURE STEP \n\n` +
                    `Feature: ${pickle.name}\n` +
                    `Assertion: ${result.exception.message}\n` +
                    `Screenshot: ${link}`

    console.log();
    console.log(boxen(message, { padding: 1 }));
  } catch(err) {
    console.log(err);
    console.log(`\n\nError: ${err.message}`);

    if (err.response !== undefined) {
      console.log(`Output:\n${JSON.stringify(err.response.data, null, 2)}`);
    }
  }
}
