/**
 * Saleh palette — "Dawn/Dusk".
 *
 * Dark = midnight blue + warm gold (Fəcr/Məğrib boundary times).
 * Light = cream paper + muted bronze (manuscript / sand aesthetic).
 */

export interface Palette {
  bg: string;
  bgElevated: string;
  bgCard: string;
  bgPill: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  accentSoft: string;
  divider: string;
  border: string;
}

export const darkPalette: Palette = {
  bg: '#0F1B2D',
  bgElevated: '#142239',
  bgCard: 'rgba(212, 165, 116, 0.08)',
  bgPill: 'rgba(245, 230, 200, 0.08)',
  text: '#F5E6C8',
  textSecondary: '#8A9BB0',
  textMuted: 'rgba(232, 232, 232, 0.4)',
  accent: '#D4A574',
  accentBg: 'rgba(212, 165, 116, 0.08)',
  accentBorder: 'rgba(212, 165, 116, 0.25)',
  accentSoft: 'rgba(212, 165, 116, 0.06)',
  divider: 'rgba(255, 255, 255, 0.06)',
  border: 'rgba(255, 255, 255, 0.1)',
};

export const lightPalette: Palette = {
  bg: '#FAF6EE',
  bgElevated: '#FFFFFF',
  bgCard: 'rgba(159, 122, 79, 0.06)',
  bgPill: 'rgba(159, 122, 79, 0.08)',
  text: '#1B2A40',
  textSecondary: '#6B7B8F',
  textMuted: 'rgba(27, 42, 64, 0.35)',
  accent: '#9F7A4F',
  accentBg: 'rgba(159, 122, 79, 0.06)',
  accentBorder: 'rgba(159, 122, 79, 0.25)',
  accentSoft: 'rgba(159, 122, 79, 0.05)',
  divider: 'rgba(15, 27, 45, 0.06)',
  border: 'rgba(15, 27, 45, 0.1)',
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
} as const;

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 24, pill: 999,
} as const;

export const typography = {
  brand:  { fontFamily: 'Georgia', fontSize: 26, fontWeight: '500' as const, letterSpacing: -0.5 },
  hero:   { fontSize: 28, fontWeight: '500' as const, letterSpacing: -0.5 },
  body:   { fontSize: 14, fontWeight: '400' as const },
  caption:{ fontSize: 12, fontWeight: '400' as const },
  micro:  { fontSize: 10, fontWeight: '500' as const, letterSpacing: 1.6 },
};
