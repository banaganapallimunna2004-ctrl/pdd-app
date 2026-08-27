const fs = require('fs');
const path = require('path');

function generateHtmlReport(stats, tests, outputPath) {
  // Prepare serialized data to inject into the HTML page
  const serializedStats = JSON.stringify(stats);
  const serializedTests = JSON.stringify(tests);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgroAI Precision Crop Detection - E2E Automation Report</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  
  <style>
    /* CSS Variables for Light / Dark Mode Theme */
    :root {
      --bg-color: #030712;
      --card-bg: rgba(17, 24, 39, 0.7);
      --card-border: rgba(31, 41, 55, 0.5);
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --accent: #6366f1;
      --accent-hover: #4f46e5;
      
      --color-pass: #10b981;
      --color-fail: #ef4444;
      --color-pending: #f59e0b;
      --color-pass-bg: rgba(16, 185, 129, 0.1);
      --color-fail-bg: rgba(239, 68, 68, 0.1);
      --color-pending-bg: rgba(245, 158, 11, 0.1);
      
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      
      --backdrop-blur: blur(12px);
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    [data-theme="light"] {
      --bg-color: #f8fafc;
      --card-bg: rgba(255, 255, 255, 0.8);
      --card-border: rgba(226, 232, 240, 0.8);
      --text-main: #0f172a;
      --text-muted: #64748b;
      --accent: #4f46e5;
      --accent-hover: #4338ca;
      
      --color-pass: #059669;
      --color-fail: #dc2626;
      --color-pending: #d97706;
      --color-pass-bg: rgba(5, 150, 105, 0.08);
      --color-fail-bg: rgba(220, 38, 38, 0.08);
      --color-pending-bg: rgba(217, 119, 6, 0.08);
      
      --shadow-glass: 0 8px 32px 0 rgba(148, 163, 184, 0.15);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
    }

    body {
      background-color: var(--bg-color);
      color: var(--text-main);
      font-family: var(--font-sans);
      line-height: 1.5;
      padding: 24px;
      min-height: 100vh;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Header styling with premium glowing text */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      margin-bottom: 24px;
      background: var(--card-bg);
      backdrop-filter: var(--backdrop-blur);
      -webkit-backdrop-filter: var(--backdrop-blur);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      box-shadow: var(--shadow-glass);
    }

    .header-info h1 {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.025em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .header-info h1 span {
      background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-info p {
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .theme-toggle-btn {
      background: var(--card-border);
      border: 1px solid var(--card-border);
      color: var(--text-main);
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: var(--shadow-sm);
    }

    .theme-toggle-btn:hover {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: var(--card-bg);
      backdrop-filter: var(--backdrop-blur);
      -webkit-backdrop-filter: var(--backdrop-blur);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 20px;
      box-shadow: var(--shadow-glass);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--accent);
    }

    .stat-card.pass::before { background: var(--color-pass); }
    .stat-card.fail::before { background: var(--color-fail); }
    .stat-card.pending::before { background: var(--color-pending); }

    .stat-card h3 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      font-weight: 600;
      margin-bottom: 8px;
    }

    .stat-card .value {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.025em;
    }

    .stat-card.pass .value { color: var(--color-pass); }
    .stat-card.fail .value { color: var(--color-fail); }
    .stat-card.pending .value { color: var(--color-pending); }

    .stat-card .meta {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* Charts Container */
    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    @media (max-width: 1024px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }

    .chart-card {
      background: var(--card-bg);
      backdrop-filter: var(--backdrop-blur);
      -webkit-backdrop-filter: var(--backdrop-blur);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 24px;
      box-shadow: var(--shadow-glass);
    }

    .chart-card h2 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
      color: var(--text-main);
    }

    /* CSS/SVG Donut Chart */
    .donut-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
      height: 240px;
    }

    .donut-svg {
      transform: rotate(-90deg);
    }

    .donut-segment {
      transition: stroke-dashoffset 1s ease-in-out;
    }

    .donut-text {
      position: absolute;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .donut-pct {
      font-size: 28px;
      font-weight: 800;
      color: var(--text-main);
    }

    .donut-lbl {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .chart-legend {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .legend-color {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .legend-color.pass { background-color: var(--color-pass); }
    .legend-color.fail { background-color: var(--color-fail); }
    .legend-color.pending { background-color: var(--color-pending); }

    /* Horizontal Bar Chart Container */
    .bar-chart-scroll {
      overflow-y: auto;
      max-height: 280px;
      padding-right: 8px;
    }

    .bar-chart-scroll::-webkit-scrollbar {
      width: 6px;
    }

    .bar-chart-scroll::-webkit-scrollbar-thumb {
      background-color: var(--card-border);
      border-radius: 3px;
    }

    .bar-row {
      margin-bottom: 12px;
    }

    .bar-label-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 4px;
    }

    .bar-title {
      font-weight: 600;
      color: var(--text-main);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 75%;
    }

    .bar-value {
      font-weight: 700;
      color: var(--text-muted);
    }

    .bar-track {
      background: rgba(156, 163, 175, 0.1);
      height: 10px;
      border-radius: 9999px;
      overflow: hidden;
      position: relative;
      display: flex;
    }

    .bar-fill {
      height: 100%;
      transition: width 1s ease-out;
    }

    /* Filter and Search Section */
    .controls-card {
      background: var(--card-bg);
      backdrop-filter: var(--backdrop-blur);
      -webkit-backdrop-filter: var(--backdrop-blur);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-glass);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .search-input-wrapper {
      position: relative;
      flex: 1;
      min-width: 280px;
    }

    .search-input {
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--card-border);
      color: var(--text-main);
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 14px;
      font-family: var(--font-sans);
      outline: none;
    }

    .search-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }

    .filter-buttons {
      display: flex;
      gap: 8px;
    }

    .filter-btn {
      background: rgba(0, 0, 0, 0.1);
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
    }

    .filter-btn:hover {
      border-color: var(--accent);
      color: var(--text-main);
    }

    .filter-btn.active {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
    }

    .batch-btns {
      display: flex;
      gap: 8px;
    }

    .batch-btn {
      background: transparent;
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
    }

    .batch-btn:hover {
      border-color: var(--text-muted);
      color: var(--text-main);
    }

    /* Categories / Test Cases Grid */
    .categories-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .category-accordion {
      background: var(--card-bg);
      backdrop-filter: var(--backdrop-blur);
      -webkit-backdrop-filter: var(--backdrop-blur);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .category-header {
      padding: 16px 20px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
      background: rgba(255, 255, 255, 0.01);
    }

    .category-header:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .category-title {
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .category-chevron {
      transition: transform 0.2s ease;
      fill: var(--text-muted);
    }

    .category-accordion.open .category-chevron {
      transform: rotate(180deg);
    }

    .category-badges {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .badge-count {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 9999px;
    }

    .badge-count.pass { color: var(--color-pass); background: var(--color-pass-bg); }
    .badge-count.fail { color: var(--color-fail); background: var(--color-fail-bg); }
    .badge-count.pending { color: var(--color-pending); background: var(--color-pending-bg); }

    .category-content {
      display: none;
      border-top: 1px solid var(--card-border);
      padding: 8px 0;
      background: rgba(0, 0, 0, 0.05);
    }

    .category-accordion.open .category-content {
      display: block;
    }

    .test-case {
      padding: 12px 20px;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .test-case:last-child {
      border-bottom: none;
    }

    .test-info {
      flex: 1;
    }

    .test-title-text {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-main);
    }

    .test-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .badge-status {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }

    .badge-status.passed { color: var(--color-pass); background: var(--color-pass-bg); }
    .badge-status.failed { color: var(--color-fail); background: var(--color-fail-bg); }
    .badge-status.pending { color: var(--color-pending); background: var(--color-pending-bg); }

    .test-dur {
      font-family: var(--font-mono);
    }

    /* Error Details Stack Trace Block */
    .error-block {
      margin-top: 8px;
      background: rgba(239, 68, 68, 0.05);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 8px;
      padding: 12px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: #fca5a5;
      overflow-x: auto;
      white-space: pre-wrap;
    }

    /* Footer */
    footer {
      margin-top: 48px;
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      border-top: 1px solid var(--card-border);
      padding-top: 24px;
    }

    footer a {
      color: var(--accent);
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="header-info">
        <h1>🌱 <span>AgroAI Precision Crop Detection</span></h1>
        <p>E2E Selenium Automation Report &mdash; 1,100 Assertions</p>
      </div>
      <button class="theme-toggle-btn" id="themeToggleBtn">
        <svg id="themeIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
        <span id="themeLabel">Light Mode</span>
      </button>
    </header>

    <!-- Stats summary grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Assertions</h3>
        <div class="value" id="statTotal">0</div>
        <div class="meta" id="statMetaTime">Start: --</div>
      </div>
      <div class="stat-card pass">
        <h3>Passed</h3>
        <div class="value" id="statPassed">0</div>
        <div class="meta" id="statPassRate">Rate: 0%</div>
      </div>
      <div class="stat-card fail">
        <h3>Failed</h3>
        <div class="value" id="statFailed">0</div>
        <div class="meta">Target Gate: 0 Critical</div>
      </div>
      <div class="stat-card">
        <h3>Duration</h3>
        <div class="value" id="statDuration">0.00s</div>
        <div class="meta" id="statAvgDur">Avg: 0ms / test</div>
      </div>
    </div>

    <!-- Charts grid -->
    <div class="charts-grid">
      <!-- Donut Chart -->
      <div class="chart-card">
        <h2>Pass/Fail Distribution</h2>
        <div class="donut-container">
          <svg width="200" height="200" class="donut-svg">
            <circle cx="100" cy="100" r="80" fill="transparent" stroke="var(--card-border)" stroke-width="18"></circle>
            <!-- Passed arc segment -->
            <circle id="donutPassedArc" cx="100" cy="100" r="80" fill="transparent" stroke="var(--color-pass)" stroke-width="18" stroke-dasharray="502.65" stroke-dashoffset="502.65" class="donut-segment"></circle>
            <!-- Failed arc segment -->
            <circle id="donutFailedArc" cx="100" cy="100" r="80" fill="transparent" stroke="var(--color-fail)" stroke-width="18" stroke-dasharray="502.65" stroke-dashoffset="502.65" class="donut-segment"></circle>
          </svg>
          <div class="donut-text">
            <div class="donut-pct" id="donutPct">0%</div>
            <div class="donut-lbl">Pass Rate</div>
          </div>
        </div>
        <div class="chart-legend">
          <div class="legend-item"><div class="legend-color pass"></div>Passed (<span id="donutPassVal">0</span>)</div>
          <div class="legend-item"><div class="legend-color fail"></div>Failed (<span id="donutFailVal">0</span>)</div>
        </div>
      </div>

      <!-- Category Performance Bar Chart -->
      <div class="chart-card">
        <h2>Category Performance breakdown</h2>
        <div class="bar-chart-scroll" id="barChartContainer">
          <!-- Populated dynamically via JS -->
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="controls-card">
      <div class="search-input-wrapper">
        <input type="text" id="searchInput" class="search-input" placeholder="Search tests by description, category, error stack...">
      </div>
      <div class="filter-buttons">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="passed">Passed</button>
        <button class="filter-btn" data-filter="failed">Failed</button>
      </div>
      <div class="batch-btns">
        <button class="batch-btn" id="expandAllBtn">Expand All</button>
        <button class="batch-btn" id="collapseAllBtn">Collapse All</button>
      </div>
    </div>

    <!-- Accordion List -->
    <div class="categories-container" id="categoriesContainer">
      <!-- Populated dynamically via JS -->
    </div>

    <footer>
      <p>AgroAI Precision Crop Disease Detection System &mdash; E2E Automation Pipeline</p>
      <p style="margin-top: 4px; color: var(--text-muted);">Generated on <span id="generationTimestamp">--</span> | Run ID: <span style="font-family: var(--font-mono); font-size: 11px;">${stats.startTime || new Date().toISOString()}</span></p>
    </footer>
  </div>

  <!-- Raw Test Data Injection -->
  <script>
    window.__REPORT_DATA__ = {
      stats: ${serializedStats},
      tests: ${serializedTests}
    };
  </script>

  <!-- Interactive Dashboard App Code (0 dependencies) -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const data = window.__REPORT_DATA__;
      const { stats, tests } = data;

      // 1. Populate stats cards
      document.getElementById('statTotal').innerText = stats.total.toLocaleString();
      document.getElementById('statPassed').innerText = stats.passed.toLocaleString();
      document.getElementById('statFailed').innerText = stats.failed.toLocaleString();
      document.getElementById('statDuration').innerText = (stats.duration / 1000).toFixed(2) + 's';
      
      const passRate = stats.total > 0 ? ((stats.passed / stats.total) * 100) : 0;
      document.getElementById('statPassRate').innerText = 'Rate: ' + passRate.toFixed(1) + '%';
      document.getElementById('statAvgDur').innerText = 'Avg: ' + (stats.duration / stats.total).toFixed(1) + 'ms / test';
      
      const startTime = stats.startTime ? new Date(stats.startTime).toLocaleTimeString() : new Date().toLocaleTimeString();
      document.getElementById('statMetaTime').innerText = 'Start: ' + startTime;
      document.getElementById('generationTimestamp').innerText = new Date().toLocaleString();

      // 2. Render Donut Chart
      const circleCircumference = 2 * Math.PI * 80; // 502.65
      const passedPct = passRate / 100;
      const failedPct = stats.total > 0 ? (stats.failed / stats.total) : 0;
      
      const passedOffset = circleCircumference * (1 - passedPct);
      const failedOffset = circleCircumference * (1 - failedPct);

      const passArc = document.getElementById('donutPassedArc');
      const failArc = document.getElementById('donutFailedArc');
      
      passArc.style.strokeDashoffset = passedOffset;
      
      // The fail segment is rotated to align right after pass segment
      failArc.style.strokeDashoffset = failedOffset;
      failArc.style.transform = \`rotate(\${passedPct * 360 - 90}deg)\`;
      failArc.style.transformOrigin = '100px 100px';

      document.getElementById('donutPct').innerText = passRate.toFixed(1) + '%';
      document.getElementById('donutPassVal').innerText = stats.passed;
      document.getElementById('donutFailVal').innerText = stats.failed;

      // 3. Aggregate tests by category
      const categoriesMap = {};
      tests.forEach(test => {
        const catName = test.suite;
        if (!categoriesMap[catName]) {
          categoriesMap[catName] = {
            name: catName,
            tests: [],
            passed: 0,
            failed: 0,
            pending: 0,
            duration: 0
          };
        }
        categoriesMap[catName].tests.push(test);
        categoriesMap[catName].duration += test.duration;
        if (test.state === 'passed') categoriesMap[catName].passed++;
        else if (test.state === 'failed') categoriesMap[catName].failed++;
        else categoriesMap[catName].pending++;
      });

      const categories = Object.values(categoriesMap);

      // 4. Render Category performance chart
      const barChartContainer = document.getElementById('barChartContainer');
      barChartContainer.innerHTML = '';
      
      // Sort categories so those with failures are at the top, or sort alphabetically
      const sortedCategories = [...categories].sort((a, b) => b.failed - a.failed || a.name.localeCompare(b.name));
      
      sortedCategories.forEach(cat => {
        const total = cat.passed + cat.failed + cat.pending;
        const passWidth = (cat.passed / total) * 100;
        const failWidth = (cat.failed / total) * 100;
        const pendWidth = (cat.pending / total) * 100;
        const avgSpeed = (cat.duration / total).toFixed(1);

        const barRow = document.createElement('div');
        barRow.className = 'bar-row';
        barRow.innerHTML = \`
          <div class="bar-label-row">
            <span class="bar-title">\${cat.name}</span>
            <span class="bar-value">\${cat.passed}/\${total} passed (\${avgSpeed}ms avg)</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: \${passWidth}%; background-color: var(--color-pass);"></div>
            <div class="bar-fill" style="width: \${failWidth}%; background-color: var(--color-fail);"></div>
            <div class="bar-fill" style="width: \${pendWidth}%; background-color: var(--color-pending);"></div>
          </div>
        \`;
        barChartContainer.appendChild(barRow);
      });

      // 5. Render Accordions list
      const listContainer = document.getElementById('categoriesContainer');
      
      function renderAccordions(filter = 'all', searchQuery = '') {
        listContainer.innerHTML = '';
        const query = searchQuery.toLowerCase().trim();

        categories.forEach(cat => {
          // Filter tests inside category
          let filteredTests = cat.tests.filter(t => {
            const matchesStatus = 
              filter === 'all' || 
              (filter === 'passed' && t.state === 'passed') ||
              (filter === 'failed' && t.state === 'failed');

            const matchesSearch = 
              query === '' || 
              t.title.toLowerCase().includes(query) || 
              t.suite.toLowerCase().includes(query) ||
              (t.error && t.error.toLowerCase().includes(query));

            return matchesStatus && matchesSearch;
          });

          if (filteredTests.length === 0) return; // Hide empty category groups

          const catPass = filteredTests.filter(t => t.state === 'passed').length;
          const catFail = filteredTests.filter(t => t.state === 'failed').length;
          const catPend = filteredTests.filter(t => t.state === 'pending' || t.state === 'pending').length;

          const accordion = document.createElement('div');
          accordion.className = 'category-accordion';
          
          let badgeHtml = '';
          if (catPass > 0) badgeHtml += \`<span class="badge-count pass">\${catPass} Passed</span>\`;
          if (catFail > 0) badgeHtml += \`<span class="badge-count fail">\${catFail} Failed</span>\`;
          if (catPend > 0) badgeHtml += \`<span class="badge-count pending">\${catPend} Pending</span>\`;

          // If there are failures, expand this category automatically by default to highlight issues
          if (catFail > 0) {
            accordion.classList.add('open');
          }

          accordion.innerHTML = \`
            <div class="category-header">
              <span class="category-title">
                <svg class="category-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
                \${cat.name}
              </span>
              <div class="category-badges">
                \${badgeHtml}
              </div>
            </div>
            <div class="category-content">
              \${filteredTests.map((t, idx) => \`
                <div class="test-case">
                  <div class="test-info">
                    <div class="test-title-text">[Case #\${String(idx+1).padStart(2, '0')}] \${t.title}</div>
                    <div class="test-meta">
                      <span class="badge-status \${t.state}">\${t.state}</span>
                      <span class="test-dur">&bull; \${t.duration}ms</span>
                    </div>
                    \${t.error ? \`<div class="error-block">\${t.error}\${t.stack ? '\\n\\n' + t.stack : ''}</div>\` : ''}
                  </div>
                </div>
              \`).join('')}
            </div>
          \`;

          // Header toggle click logic
          accordion.querySelector('.category-header').addEventListener('click', () => {
            accordion.classList.toggle('open');
          });

          listContainer.appendChild(accordion);
        });

        if (listContainer.children.length === 0) {
          listContainer.innerHTML = \`
            <div style="text-align: center; padding: 40px; color: var(--text-muted); background: var(--card-bg); border-radius: 12px; border: 1px solid var(--card-border);">
              <h3>No matching tests found</h3>
              <p style="font-size: 13px; margin-top: 4px;">Adjust your search or filter options</p>
            </div>
          \`;
        }
      }

      // Initial list render
      renderAccordions();

      // 6. Search and Filter Event Listeners
      const searchInput = document.getElementById('searchInput');
      const filterBtns = document.querySelectorAll('.filter-btn');
      let currentFilter = 'all';

      searchInput.addEventListener('input', (e) => {
        renderAccordions(currentFilter, e.target.value);
      });

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentFilter = btn.getAttribute('data-filter');
          renderAccordions(currentFilter, searchInput.value);
        });
      });

      // Expand / Collapse buttons
      document.getElementById('expandAllBtn').addEventListener('click', () => {
        document.querySelectorAll('.category-accordion').forEach(acc => acc.classList.add('open'));
      });

      document.getElementById('collapseAllBtn').addEventListener('click', () => {
        document.querySelectorAll('.category-accordion').forEach(acc => acc.classList.remove('open'));
      });

      // 7. Light/Dark Theme toggle
      const themeBtn = document.getElementById('themeToggleBtn');
      const themeIcon = document.getElementById('themeIcon');
      const themeLabel = document.getElementById('themeLabel');

      themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
          document.documentElement.removeAttribute('data-theme');
          themeLabel.innerText = 'Light Mode';
          themeIcon.innerHTML = \`
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          \`;
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
          themeLabel.innerText = 'Dark Mode';
          themeIcon.innerHTML = \`
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          \`;
        }
      });
    });
  </script>
</body>
</html>`;

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, html, 'utf8');
}

module.exports = { generateHtmlReport };
