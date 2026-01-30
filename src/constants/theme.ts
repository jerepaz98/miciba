import { colors } from './colors';

export const theme = {
  colors,
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 28
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    pill: 999
  },
  shadow: {
    light: {
      shadowColor: '#0B1E2D',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3
    },
    medium: {
      shadowColor: '#0B1E2D',
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6
    }
  }
};
