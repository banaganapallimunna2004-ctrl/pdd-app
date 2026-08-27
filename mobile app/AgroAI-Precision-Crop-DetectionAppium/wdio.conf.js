const xlsxReporter = require('./utils/xlsxReporter');
const generateHtmlReport = require('./utils/generateHtmlReport');
const generateSummary = require('./utils/generateSummary');
const fs = require('fs');
const path = require('path');

const RESULTS_FILE = path.join(__dirname, '.wdio-results.jsonl');

exports.config = {
    runner: 'local',
    port: 4723,
    specs: [
        process.env.WDIO_CI_SPEC || './tests/**/*.test.js'
    ],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Android Emulator',
        'appium:app': process.env.APK_PATH || '../app/build/outputs/apk/debug/app-debug.apk',
        'appium:noReset': true,
        'appium:newCommandTimeout': 240,
    }],
    logLevel: 'warn',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 600000 // 10 minutes for 1,111 tests
    },

    onPrepare: function () {
        if (fs.existsSync(RESULTS_FILE)) fs.unlinkSync(RESULTS_FILE);
        xlsxReporter.startRun();
    },

    afterTest: function (test, context, { error, result, duration, passed, retries }) {
        const categoryMatch = test.fullTitle.match(/Category: (.*?) /);
        const category = categoryMatch ? categoryMatch[1] : 'Unknown';

        const testResult = {
            category,
            name: test.title,
            status: passed ? 'passed' : 'failed',
            duration,
            error: error ? error.message : ''
        };

        fs.appendFileSync(RESULTS_FILE, JSON.stringify(testResult) + '\n');
    },

    after: function (result, capabilities, specs) {
        // Intercept fatal crashes if no results were recorded
        if (!fs.existsSync(RESULTS_FILE)) {
            const fatalResult = {
                category: 'Fatal',
                name: 'WebDriverIO Setup / Appium Crash',
                status: 'failed',
                duration: 0,
                error: 'Test execution crashed before any tests completed.'
            };
            fs.appendFileSync(RESULTS_FILE, JSON.stringify(fatalResult) + '\n');
        }
    },

    onComplete: async function () {
        const results = fs.readFileSync(RESULTS_FILE, 'utf8')
            .trim()
            .split('\n')
            .map(line => JSON.parse(line));

        results.forEach(r => xlsxReporter.recordTest(r.category, r.name, r.status, r.duration, r.error));

        await xlsxReporter.generateReport('execution-report.xlsx');
        generateHtmlReport(results, 'execution-report.html');
        generateSummary(results);
    }
};
