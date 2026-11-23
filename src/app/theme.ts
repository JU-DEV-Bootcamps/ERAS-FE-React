// The one MUI theme of ERAS v3 (ADR-0016). Its values copy v2's tokens in ERAS-FE/src/styles/utils/
// (_theme-colors.scss, _theme-fonts.scss, _theme-sizes.scss, _theme-breakpoints.scss), so both clients look alike.
// Components read every color, size and breakpoint from here; none is written by hand in a component.
import { createTheme } from '@mui/material/styles';

/** A colored label: its background and its text color. */
export interface LabelColors {
  background: string;
  text: string;
}

/** The label colors of v2's alertRiskLevel.ts and StatusEvaluation.ts, with the fallback for unknown values. */
export interface LabelPalette {
  risk: Record<'Low' | 'Medium' | 'High' | 'default', LabelColors>;
  status: Record<
    | 'Pending'
    | 'Ready'
    | 'InProgress'
    | 'Completed'
    | 'Uncompleted'
    | 'default',
    LabelColors
  >;
  /** The soft tones of the key figure icons on Home, as v2 draws them. */
  kpi: Record<'students' | 'polls' | 'evaluations', string>;
  /** The "Last Updated" chip of the Overview: v2's light turquoise with dark turquoise text. */
  lastUpdated: LabelColors;
  /** The Connected Services card of Home, as v2 draws it: its icon square and its ACTIVE / INACTIVE chip. */
  service: {
    icon: LabelColors;
    active: LabelColors;
    inactive: LabelColors;
  };
}

declare module '@mui/material/styles' {
  interface Palette {
    labels: LabelPalette;
  }
  interface PaletteOptions {
    labels?: LabelPalette;
  }
}

const labels: LabelPalette = {
  risk: {
    Low: { background: '#DCFCE7', text: '#166534' },
    Medium: { background: '#FFEDD5', text: '#9A3412' },
    High: { background: '#FEE2E2', text: '#991B1B' },
    default: { background: '#DBEAFE', text: '#1E40AF' },
  },
  status: {
    Pending: { background: '#FFEDD5', text: '#9A3412' },
    Ready: { background: '#DBEAFE', text: '#1E40AF' },
    InProgress: { background: '#FEF9C3', text: '#854D0E' },
    Completed: { background: '#DCFCE7', text: '#166534' },
    Uncompleted: { background: '#FEE2E2', text: '#991B1B' },
    default: { background: '#F0EAEA', text: '#63656A' },
  },
  kpi: {
    students: '#B2DFDB',
    polls: '#C7DBFB',
    evaluations: '#E4CCFB',
  },
  lastUpdated: { background: '#D7E6E4', text: '#006A66' },
  service: {
    icon: { background: '#DBEAFE', text: '#2563EB' },
    active: { background: '#ECFDF3', text: '#15803D' },
    inactive: { background: '#FEE2E2', text: '#991B1B' },
  },
};

export const theme = createTheme({
  // v2: below 768px is mobile, 768px to 1023px tablet, 1024px and above desktop.
  breakpoints: {
    values: { xs: 0, sm: 768, md: 1024, lg: 1280, xl: 1536 },
  },
  // v2's palettes (seed primary 19BFB9, secondary 89427A), at the tones Angular Material uses for a light theme.
  palette: {
    mode: 'light',
    primary: { main: '#006a66', light: '#19bfb9', dark: '#00504d' },
    secondary: { main: '#8c457d', light: '#c576b2', dark: '#702d64' },
    error: { main: '#ba1a1a', light: '#de3730', dark: '#93000a' },
    warning: { main: '#eec609', light: '#ffe566' },
    info: { main: '#2196f3', light: '#bbdefb', dark: '#1565c0' },
    success: { main: '#166534', light: '#dcfce7' },
    background: { default: '#f5f8f7', paper: '#ffffff' },
    text: { primary: '#1c1b1b', secondary: '#605e5e' },
    divider: '#e6e1e1',
    labels,
  },
  // v2: Roboto, with the sizes of $font-size and the weights of $font-weight.
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontSize: '28px', fontWeight: 400 },
    h2: { fontSize: '24px', fontWeight: 400 },
    h3: { fontSize: '18px', fontWeight: 500 },
    subtitle1: { fontSize: '16px', fontWeight: 500 },
    body1: { fontSize: '14px' },
    body2: { fontSize: '12px' },
    caption: { fontSize: '11px' },
  },
  // v2's padding and margin steps are multiples of 4px (xs 4, s 8, md 12, lg 16, xl 20, xxl 24).
  spacing: 4,
  shape: { borderRadius: 8 },
});
