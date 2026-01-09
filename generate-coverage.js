const fs = require('fs').promises;
const path = require('path');
const v8toIstanbul = require('v8-to-istanbul');
const reports = require('istanbul-reports');
const { createContext } = require('istanbul-lib-report');
const { createCoverageMap } = require('istanbul-lib-coverage');

const coverageDir = path.join(process.cwd(), 'coverage/temp'); // Playwright v8 coverage
const istanbulCoverageDir = path.join(process.cwd(), 'coverage/frontend'); // Final report output

async function convertCoverage() {
  // Exit if no coverage data exists
  try {
    await fs.access(coverageDir);
  } catch {
    console.log('No coverage data found.');
    return;
  }

  const coverageMap = createCoverageMap();
  const files = await fs.readdir(coverageDir);

  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    const v8Coverage = JSON.parse(
      await fs.readFile(path.join(coverageDir, file), 'utf-8')
    );

    for (const entry of v8Coverage) {
      if (!entry.url || !entry.source) continue;

      // Skip non-JS files, node_modules, or external URLs (except localhost)
      let pathname;
      try {
        pathname =
          entry.url.startsWith('http') || entry.url.startsWith('file://')
            ? new URL(entry.url).pathname
            : entry.url;
      } catch {
        pathname = entry.url;
      }

      if (
        !pathname.endsWith('.js') ||
        (entry.url.startsWith('http') && !entry.url.includes('localhost')) ||
        entry.url.includes('node_modules')
      ) {
        console.warn(`Skipping file: ${entry.url}`);
        continue;
      }

      // Handle Windows file paths
      const filePath = entry.url.startsWith('file://')
        ? pathname.replace(/^\/([a-zA-Z]:)/, '$1')
        : pathname;

      try {
        const converter = v8toIstanbul(
          'public/' + filePath,
          0,
          { source: entry.source }
        );
        await converter.load();
        converter.applyCoverage(entry.functions);
        coverageMap.merge(converter.toIstanbul());
      } catch (err) {
        console.warn(`Skipping coverage for ${entry.url}: ${err.message}`);
      }
    }
  }

  if (!Object.keys(coverageMap.data).length) {
    console.log('No coverage data was converted.');
    return;
  }

  // Ensure output directory exists
  try {
    await fs.access(istanbulCoverageDir);
  } catch {
    await fs.mkdir(istanbulCoverageDir, { recursive: true });
  }

  // Generate HTML and lcov reports
  const context = createContext({ dir: istanbulCoverageDir, coverageMap });
  ['html', 'lcovonly'].forEach(type =>
    reports.create(type).execute(context)
  );

  // ================= ADDITIONAL FEATURE =================
  // Frontend Coverage Threshold Enforcement

  const summary = coverageMap.getCoverageSummary();

  const thresholds = {
    statements: 90,
    branches: 90,
    functions: 90,
    lines: 90
  };

  const actual = {
    statements: summary.statements.pct,
    branches: summary.branches.pct,
    functions: summary.functions.pct,
    lines: summary.lines.pct
  };

  let failed = false;

  console.log('\nFrontend Coverage Threshold Check:');

  for (const key in thresholds) {
    if (actual[key] < thresholds[key]) {
      console.error(
        `${key} coverage ${actual[key]}% is below threshold (${thresholds[key]}%)`
      );
      failed = true;
    } else {
      console.log(
        `${key} coverage ${actual[key]}% meets threshold (${thresholds[key]}%)`
      );
    }
  }

  if (failed) {
    console.error('\nCoverage thresholds not met.');
    process.exitCode = 1;
  } else {
    console.log('\nAll coverage thresholds met.');
  }

  console.log(`\nCoverage report generated in ${istanbulCoverageDir}`);
}

convertCoverage();
