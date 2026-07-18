/**
 * 🏥 Healthcare Design System
 * Paleta de cores e estilos profissionais para clínicas/hospitais
 */

export const colors = {
  primary: 'var(--primary-blue)',
  secondary: 'var(--secondary-teal)',
  success: 'var(--success-green)',
  error: 'var(--error-red)',
  warning: 'var(--warning-yellow)',
  info: 'var(--info-blue)',
  
  lightBg: 'var(--light-bg)',
  textDark: 'var(--text-dark)',
  white: 'var(--white)',
  
  gray: {
    light: 'var(--gray-light)',
    medium: 'var(--gray-medium)',
    dark: 'var(--gray-dark)',
  },
  
  border: 'var(--border-color)',
  disabled: {
    bg: 'var(--disabled-bg)',
    text: 'var(--disabled-text)',
  }
}

export const spacing = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
}

export const radius = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  full: 'var(--radius-full)',
}

export const shadows = {
  xs: 'var(--shadow-xs)',
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
}

export const transitions = {
  fast: 'var(--transition-fast)',
  base: 'var(--transition-base)',
  slow: 'var(--transition-slow)',
}

export const fonts = {
  main: 'var(--font-main)',
  headings: 'var(--font-headings)',
}

/* Common Style Objects */
export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary,
    color: colors.white,
    boxShadow: shadows.sm,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: `${spacing.sm} ${spacing.lg}`,
    borderRadius: radius.sm,
    transition: `all ${transitions.fast}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  
  secondary: {
    backgroundColor: colors.secondary,
    color: colors.white,
    boxShadow: shadows.sm,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: `${spacing.sm} ${spacing.lg}`,
    borderRadius: radius.sm,
    transition: `all ${transitions.fast}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  
  danger: {
    backgroundColor: colors.error,
    color: colors.white,
    boxShadow: shadows.sm,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: `${spacing.sm} ${spacing.lg}`,
    borderRadius: radius.sm,
    transition: `all ${transitions.fast}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
}

export const cardStyles = {
  base: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.sm,
    padding: spacing.lg,
    transition: `all ${transitions.fast}`,
  },
  
  header: {
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottom: `1px solid ${colors.border}`,
  },
  
  body: {
    padding: 0,
  },
  
  footer: {
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTop: `1px solid ${colors.border}`,
    display: 'flex',
    gap: spacing.md,
    justifyContent: 'flex-end',
  }
}

export const inputStyles = {
  base: {
    display: 'block' as const,
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    marginBottom: spacing.md,
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.sm,
    fontFamily: fonts.main,
    fontSize: '0.95rem',
    color: colors.textDark,
    backgroundColor: colors.white,
    transition: `all ${transitions.fast}`,
  },
  
  focus: {
    borderColor: colors.primary,
    boxShadow: '0 0 0 3px rgba(10, 105, 146, 0.1)',
    backgroundColor: '#FAFBFF',
  },
  
  disabled: {
    backgroundColor: colors.disabled.bg,
    color: colors.disabled.text,
    cursor: 'not-allowed',
    borderColor: colors.gray.light,
  }
}

export const labelStyles = {
  display: 'block' as const,
  marginBottom: spacing.xs,
  fontWeight: '600' as const,
  color: colors.textDark,
  fontSize: '0.95rem',
}

export const alertStyles = {
  success: {
    backgroundColor: '#D5F4E6',
    borderLeftColor: colors.success,
    color: '#0A5F3D',
  },
  
  error: {
    backgroundColor: '#FADBD8',
    borderLeftColor: colors.error,
    color: '#78281F',
  },
  
  warning: {
    backgroundColor: '#FCF3CF',
    borderLeftColor: colors.warning,
    color: '#7D6608',
  },
  
  info: {
    backgroundColor: '#D6EAF8',
    borderLeftColor: colors.info,
    color: '#1A5276',
  }
}

export const badgeStyles = {
  success: {
    backgroundColor: '#D5F4E6',
    color: '#0A5F3D',
  },
  
  error: {
    backgroundColor: '#FADBD8',
    color: '#78281F',
  },
  
  warning: {
    backgroundColor: '#FCF3CF',
    color: '#7D6608',
  },
  
  info: {
    backgroundColor: '#D6EAF8',
    color: '#1A5276',
  },
  
  primary: {
    backgroundColor: '#D1E7F0',
    color: colors.primary,
  }
}

/* Section styling for forms */
export const sectionStyles = {
  title: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottom: `2px solid ${colors.border}`,
    fontFamily: fonts.headings,
  },
  
  container: {
    marginBottom: spacing.xl,
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing.lg,
  }
}

export const formGroupStyles = {
  marginBottom: spacing.lg,
}

export const errorStyles = {
  color: colors.error,
  fontSize: '0.85rem',
  marginTop: spacing.xs,
  fontWeight: '500',
}

export const successStyles = {
  color: colors.success,
  fontSize: '0.85rem',
  marginTop: spacing.xs,
  fontWeight: '500',
}
