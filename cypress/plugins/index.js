/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

const {
  addMatchImageSnapshotPlugin,
} = require("cypress-image-snapshot/plugin");

const viewPortWidth = 1200;
const viewPortHeight = 1000;

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  addMatchImageSnapshotPlugin(on, config);

  on("before:browser:launch", (browser, launchOptions) => {
    if (browser.name === "chrome" && browser.isHeadless) {
      launchOptions.args.push(
        `--window-size=${viewPortWidth},${viewPortHeight}`
      );
    }

    if (browser.name === "electron" && browser.isHeadless) {
      launchOptions.preferences.width = viewPortWidth;
      launchOptions.preferences.height = viewPortHeight;
    }

    if (browser.name === "firefox" && browser.isHeadless) {
      launchOptions.args.push(`--width=${viewPortWidth}`);
      launchOptions.args.push(`--height=${viewPortHeight}`);
    }

    return launchOptions;
  });
};
