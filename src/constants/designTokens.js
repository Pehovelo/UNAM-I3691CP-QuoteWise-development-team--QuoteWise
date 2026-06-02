import { Platform, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

// Responsive scaling based on design baseline (390px wide)
const BASELINE_WIDTH = 390;
const scale = Math.min(SCREEN_WIDTH / BASELINE_WIDTH, 1.3); // cap at 1.3 for tablets
export const rs = (size) => Math.round(size * scale);

export const COLORS = {
  brand: '#F05A00',
  brandDeep: '#C24600',
  brandLight: '#FF7A2F',
  brandGlow: 'rgba(240,90,0,0.12)',
  brandMist: 'rgba(240,90,0,0.06)',
  ink: '#1A0A00',
  inkMid: '#5C3A1E',
  inkLight: '#A07050',
  inkFaint: '#C4A88A',
  surface: '#FFFAF7',
  card: '#FFFFFF',
  cardBorder: 'rgba(240,90,0,0.10)',
  pending: '#F05A00',
  pendingBg: 'rgba(240,90,0,0.10)',
  draft: '#8B6914',
  draftBg: 'rgba(139,105,20,0.10)',
  saved: '#1A6B4A',
  savedBg: 'rgba(26,107,74,0.10)',
  shadow: 'rgba(240,90,0,0.15)',
  divider: 'rgba(240,90,0,0.08)',
  overlay: 'rgba(240,90,0,0.55)',
  overlayDeep: 'rgba(26,10,0,0.65)',
  overlayLight: 'rgba(255,250,247,0.85)',
  error: '#DC2626',
  errorBg: 'rgba(220,38,38,0.08)',
  success: '#16A34A',
  successBg: 'rgba(22,163,74,0.08)',
};

export const FONTS = {
  display: isIOS ? 'Georgia' : 'serif',
  body: isIOS ? 'Helvetica Neue' : 'sans-serif',
  mono: isIOS ? 'Courier New' : 'monospace',
};

export const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
};

export const RADII = {
  sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, pill: 999,
};

export const IMAGES = {
  splashBg: require('../../assets/images/splash_bg.jpg'),
  homeHeader: require('../../assets/images/home_header.jpg'),
  quotationsHeader: require('../../assets/images/quotations_header.jpg'),
  savedHeader: require('../../assets/images/saved_header.jpg'),
  draftsHeader: require('../../assets/images/drafts_header.jpg'),
  desertShadow: require('../../assets/images/desert_shadow.jpg'),
};

export { SCREEN_WIDTH as width, SCREEN_HEIGHT as height, isIOS, scale };
