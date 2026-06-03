/**
 * Expo Config Plugin: Sets the Android APK output filename to "QuoteWise-{version}"
 *
 * By default, Gradle names the APK based on the application ID
 * (e.g. com.quotewise.app-release.apk). This plugin overrides
 * `archivesBaseName` so the output is QuoteWise-4.7.0-release.apk.
 */
const { withAppBuildGradle } = require('expo/config-plugins');

function withApkName(config) {
  return withAppBuildGradle(config, (config) => {
    const appName = config.name || 'QuoteWise';
    const version = config.version || '1.0.0';
    const baseName = `${appName}-${version}`;

    // Only inject archivesBaseName once
    if (!config.modContents.includes('archivesBaseName')) {
      config.modContents = config.modContents.replace(
        /defaultConfig\s*\{/,
        `defaultConfig {\n        archivesBaseName = "${baseName}"`
      );
    }

    return config;
  });
}

module.exports = withApkName;
