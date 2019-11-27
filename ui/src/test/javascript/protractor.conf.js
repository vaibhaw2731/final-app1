
exports.config = {
  allScriptsTimeout: 20000,

  specs: [
    './e2e/modules/account/*.spec.ts',
    './e2e/modules/administration/*.spec.ts',
    './e2e/entities/**/*.spec.ts'
    /* jhipster-needle-add-protractor-tests - JHipster will add protractors tests here */
  ],

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
	binary: "/usr/bin/google-chrome-stable",
        args:[ '--headless', '--disable-gpu', '--window-size=800,600', '--disable-gpu', '--window-size=800,600','--no-sandbox','--disable-dev-shm-usage' ]
    }
  },

  directConnect: true,

  baseUrl:'http://ui.shagun.35.188.51.171.nip.io/',

  framework: 'mocha',

  SELENIUM_PROMISE_MANAGER: false,

  mochaOpts: {
    reporter: 'spec',
    slow: 3000,
    ui: 'bdd',
    timeout: 720000
  },

  beforeLaunch () {
    require('ts-node').register({
      project: './tsconfig.e2e.json'
    });
  },

  onPrepare () {
    // @ts-ignore
    browser.driver.manage().window().setSize(1280, 1024);
    // @ts-ignore
    browser.ignoreSynchronization = true;
    // Disable animations
    // @ts-ignore
    browser.executeScript('document.body.className += " notransition";');
    const chai = require('chai');
    const chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    // @ts-ignore
    global.chai = chai;
  }
};
