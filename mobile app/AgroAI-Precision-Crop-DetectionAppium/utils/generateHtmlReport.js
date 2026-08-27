const fs = require('fs');
const path = require('path');

function generateHtmlReport(results, outputPath) {
    const total = results.length;
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = total - passed;
    const passRate = ((passed / total) * 100).toFixed(2);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AgroAI Mobile E2E Execution Report</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #121212; color: #e0e0e0; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: auto; }
        h1 { color: #4caf50; text-align: center; }
        .summary-cards { display: flex; gap: 20px; justify-content: center; margin-bottom: 30px; }
        .card { background: #1e1e1e; padding: 20px; border-radius: 8px; border-left: 5px solid #4caf50; min-width: 150px; text-align: center; }
        .card.failed { border-left-color: #f44336; }
        .card h2 { margin: 0; font-size: 2em; }
        .card p { margin: 5px 0 0; color: #aaa; }
        table { width: 100%; border-collapse: collapse; background: #1e1e1e; border-radius: 8px; overflow: hidden; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #333; }
        th { background-color: #333; color: #4caf50; }
        tr:hover { background-color: #2a2a2a; }
        .status-passed { color: #4caf50; font-weight: bold; }
        .status-failed { color: #f44336; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>AgroAI Mobile E2E Execution Report</h1>
        <div class="summary-cards">
            <div class="card"><h2>${total}</h2><p>Total Tests</p></div>
            <div class="card"><h2>${passed}</h2><p>Passed</p></div>
            <div class="card failed"><h2>${failed}</h2><p>Failed</p></div>
            <div class="card"><h2>${passRate}%</h2><p>Pass Rate</p></div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Test Case</th>
                    <th>Status</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                ${results.map(r => `
                <tr>
                    <td>${r.category}</td>
                    <td>${r.name}</td>
                    <td class="status-${r.status}">${r.status.toUpperCase()}</td>
                    <td>${r.duration}ms</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>
    `;

    fs.writeFileSync(outputPath, html);
}

module.exports = generateHtmlReport;
