const fs = require('fs');

function generateSummary(results) {
    const total = results.length;
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = total - passed;
    const passRate = ((passed / total) * 100).toFixed(2);

    const summary = `
### AgroAI Mobile E2E Test Summary
- **Total Tests**: ${total}
- **Passed**: ${passed} ✅
- **Failed**: ${failed} ❌
- **Pass Rate**: ${passRate}%
    `;

    if (process.env.GITHUB_STEP_SUMMARY) {
        fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
    }
    console.log(summary);
}

module.exports = generateSummary;
