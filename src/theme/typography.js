/**
 * QuoteWise Typography Tokens
 * Maps to system fonts since custom fonts require loading.
 * Newsreader → serif system fallback, Geist → sans-serif system fallback.
 */

import { Platform } from 'react-native';

const fontFamily = {
  headline: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'sans-serif-medium',
  }),
  body: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),
  label: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'sans-serif-medium',
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const fontSizes = {
  display: 48,
  headlineLg: 32,
  headlineMd: 24,
  headlineLgMobile: 28,
  headlineMdMobile: 22,
  bodyLg: 18,
  bodyMd: 16,
  bodySm: 14,
  labelMd: 14,
  labelSm: 12,
  caption: 11,
};

export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export default { fontFamily, fontSizes, fontWeights, lineHeight };
