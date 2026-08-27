#!/bin/bash
set -e

echo "--- Installing APK ---"
adb install -r "${APK_PATH}"

echo "--- Starting Appium Server ---"
appium --log-level warn > /tmp/appium.log 2>&1 &

echo "--- Waiting for Appium to respond on 4723 ---"
for i in {1..30}; do
  if curl -s http://localhost:4723/status > /dev/null; then
    echo "Appium is UP!"
    break
  fi
  echo "Waiting for Appium... $i"
  sleep 2
done

echo "--- Injecting Node.js into PATH ---"
if [ -f "$GITHUB_PATH" ]; then
  while IFS= read -r line; do
    export PATH="$line:$PATH"
  done < "$GITHUB_PATH"
fi

echo "--- Running WDIO Tests ---"
if node node_modules/@wdio/cli/bin/wdio.js run wdio.conf.js; then
  echo "Tests completed successfully."
else
  echo "Tests failed or crashed. Running fallback reporter..."
  node utils/generateFallbackReport.js
  exit 1
fi
