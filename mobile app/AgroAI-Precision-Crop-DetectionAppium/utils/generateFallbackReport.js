const xlsxReporter = require('./xlsxReporter');
const generateHtmlReport = require('./generateHtmlReport');
const fs = require('fs');

(async () => {
    console.log('Generating fallback report...');
    const results = [{
        category: 'Setup',
        name: 'Critical Infrastructure / Appium Startup',
        status: 'failed',
        duration: 0,
        error: 'Appium or WebDriverIO failed to start correctly. Check CI logs.'
    }];

    xlsxReporter.startRun();
    results.forEach(r => xlsxReporter.recordTest(r.category, r.name, r.status, r.duration, r.error));

    const outputXlsx = 'execution-report.xlsx';
    const outputHtml = 'execution-report.html';

    await xlsxReporter.generateReport(outputXlsx);
    generateHtmlReport(results, outputHtml);

    console.log(`Fallback reports generated: ${outputXlsx}, ${outputHtml}`);
})();
