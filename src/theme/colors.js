/**
 * QuoteWise Design Tokens — Material Design 3 Color System
 * Extracted from HTML mockup designs. Supports future dark mode.
 */

const lightColors = {
  // Brand
  primary: '#FF6200',
  primaryFixed: '#FFDBCD',
  primaryFixedDim: '#FFB597',
  onPrimary: '#FFFFFF',
  onPrimaryFixed: '#360F00',
  onPrimaryFixedVariant: '#7E2C00',
  primaryContainer: '#FF6200',

  // Secondary
  secondary: '#725C00',
  secondaryFixed: '#FFE07C',
  secondaryFixedDim: '#ECC200',
  secondaryContainer: '#FDD000',
  onSecondary: '#FFFFFF',
  onSecondaryFixed: '#231B00',
  onSecondaryFixedVariant: '#564500',
  onSecondaryContainer: '#6E5900',

  // Tertiary
  tertiary: '#0061A2',
  tertiaryFixed: '#D1E4FF',
  tertiaryFixedDim: '#9DCAFF',
  tertiaryContainer: '#009AFC',
  onTertiary: '#FFFFFF',
  onTertiaryFixed: '#001D35',
  onTertiaryFixedVariant: '#00497C',
  onTertiaryContainer: '#003053',

  // Error
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onError: '#FFFFFF',
  onErrorContainer: '#93000A',

  // Success & Warning (custom additions)
  success: '#2E7D32',
  successContainer: '#C8E6C9',
  warning: '#F57F17',
  warningContainer: '#FFF9C4',

  // Surfaces
  background: '#FBF9F9',
  onBackground: '#1B1C1C',
  surface: '#FBF9F9',
  onSurface: '#1B1C1C',
  onSurfaceVariant: '#5A4137',
  surfaceDim: '#DBDADA',
  surfaceBright: '#FBF9F9',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F5F3F3',
  surfaceContainer: '#EFEDED',
  surfaceContainerHigh: '#E9E8E8',
  surfaceContainerHighest: '#E4E2E2',
  surfaceVariant: '#E4E2E2',
  surfaceTint: '#A53D00',

  // Outlines
  outline: '#8F7065',
  outlineVariant: '#E3BFB1',

  // Utility
  shadow: '#000000',

  // Inverse
  inverseSurface: '#303031',
  inverseOnSurface: '#F2F0F0',
  inversePrimary: '#FFB597',
};

const darkColors = {
  primary: '#FFB597',
  primaryFixed: '#FFDBCD',
  primaryFixedDim: '#FFB597',
  onPrimary: '#541B00',
  onPrimaryFixed: '#360F00',
  onPrimaryFixedVariant: '#7E2C00',
  primaryContainer: '#7E2C00',

  secondary: '#ECC200',
  secondaryFixed: '#FFE07C',
  secondaryFixedDim: '#ECC200',
  secondaryContainer: '#564500',
  onSecondary: '#3B2F00',
  onSecondaryFixed: '#231B00',
  onSecondaryFixedVariant: '#564500',
  onSecondaryContainer: '#6E5900',

  tertiary: '#9DCAFF',
  tertiaryFixed: '#D1E4FF',
  tertiaryFixedDim: '#9DCAFF',
  tertiaryContainer: '#00497C',
  onTertiary: '#003258',
  onTertiaryFixed: '#001D35',
  onTertiaryFixedVariant: '#00497C',
  onTertiaryContainer: '#003053',

  error: '#FFB4AB',
  errorContainer: '#93000A',
  onError: '#690005',
  onErrorContainer: '#FFDAD6',

  success: '#81C784',
  successContainer: '#1B5E20',
  warning: '#FFB300',
  warningContainer: '#E65100',

  background: '#1B1C1C',
  onBackground: '#E4E2E2',
  surface: '#1B1C1C',
  onSurface: '#E4E2E2',
  onSurfaceVariant: '#D7C3B9',
  surfaceDim: '#1B1C1C',
  surfaceBright: '#3B3B3C',
  surfaceContainerLowest: '#161616',
  surfaceContainerLow: '#232424',
  surfaceContainer: '#282929',
  surfaceContainerHigh: '#323333',
  surfaceContainerHighest: '#3D3E3E',
  surfaceVariant: '#534339',
  surfaceTint: '#FFB597',

  outline: '#9F8D83',
  outlineVariant: '#534339',

  inverseSurface: '#E4E2E2',
  inverseOnSurface: '#1B1C1C',
  inversePrimary: '#A53D00',
};

// Semantic aliases for easy usage
export const colors = lightColors;
export { lightColors, darkColors };

export default colors;
