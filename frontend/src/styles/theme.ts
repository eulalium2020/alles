/**
 * 🏥 Healthcare Theme Utilities
 * Funções auxiliares para aplicar estilos healthcare
 */

export const themeUtils = {
  // Button hover effects
  applyPrimaryButtonHover: (e: HTMLElement) => {
    (e as any).style.backgroundColor = '#084A6E'
    (e as any).style.boxShadow = 'var(--shadow-md)'
    (e as any).style.transform = 'translateY(-2px)'
  },
  
  resetPrimaryButton: (e: HTMLElement) => {
    (e as any).style.backgroundColor = 'var(--primary-blue)'
    (e as any).style.boxShadow = 'var(--shadow-sm)'
    (e as any).style.transform = 'translateY(0)'
  },

  // Input focus effects
  applyInputFocus: (e: HTMLInputElement) => {
    e.style.borderColor = 'var(--primary-blue)'
    e.style.boxShadow = '0 0 0 3px rgba(10, 105, 146, 0.1)'
    e.style.backgroundColor = '#FAFBFF'
  },
  
  resetInputFocus: (e: HTMLInputElement) => {
    e.style.borderColor = 'var(--border-color)'
    e.style.boxShadow = 'none'
    e.style.backgroundColor = 'var(--white)'
  },

  // Card hover effects
  applyCardHover: (e: HTMLElement) => {
    (e as any).style.boxShadow = 'var(--shadow-md)'
    (e as any).style.transform = 'translateY(-2px)'
  },
  
  resetCard: (e: HTMLElement) => {
    (e as any).style.boxShadow = 'var(--shadow-sm)'
    (e as any).style.transform = 'translateY(0)'
  },

  // Success state
  applySuccessStyle: (e: HTMLElement) => {
    (e as any).style.borderColor = 'var(--success-green)'
    (e as any).style.backgroundColor = '#D5F4E6'
  },

  // Error state
  applyErrorStyle: (e: HTMLElement) => {
    (e as any).style.borderColor = 'var(--error-red)'
    (e as any).style.backgroundColor = '#FADBD8'
  },
}

export const commonStyles = {
  formContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: 'var(--spacing-lg)',
    backgroundColor: 'var(--white)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-sm)',
  },

  formSection: {
    marginBottom: 'var(--spacing-xl)',
  },

  formSectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--primary-blue)',
    marginBottom: 'var(--spacing-lg)',
    paddingBottom: 'var(--spacing-md)',
    borderBottom: '2px solid var(--border-color)',
    fontFamily: 'var(--font-headings)',
  },

  formGroup: {
    marginBottom: 'var(--spacing-lg)',
    display: 'block' as const,
  },

  formGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--spacing-lg)',
  },

  label: {
    display: 'block' as const,
    marginBottom: 'var(--spacing-xs)',
    fontWeight: '600',
    color: 'var(--text-dark)',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-headings)',
  },

  input: {
    display: 'block' as const,
    width: '100%',
    padding: `var(--spacing-sm) var(--spacing-md)`,
    marginBottom: 'var(--spacing-md)',
    border: '1.5px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-main)',
    fontSize: '0.95rem',
    color: 'var(--text-dark)',
    backgroundColor: 'var(--white)',
    transition: 'all var(--transition-fast)',
  },

  textarea: {
    display: 'block' as const,
    width: '100%',
    minHeight: '100px',
    padding: `var(--spacing-sm) var(--spacing-md)`,
    marginBottom: 'var(--spacing-md)',
    border: '1.5px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-main)',
    fontSize: '0.95rem',
    color: 'var(--text-dark)',
    backgroundColor: 'var(--white)',
    transition: 'all var(--transition-fast)',
    resize: 'vertical' as const,
  },

  errorMessage: {
    color: 'var(--error-red)',
    fontSize: '0.85rem',
    marginTop: 'var(--spacing-xs)',
    fontWeight: '500',
  },

  successMessage: {
    color: 'var(--success-green)',
    fontSize: '0.85rem',
    marginTop: 'var(--spacing-xs)',
    fontWeight: '500',
  },

  alertBanner: {
    padding: 'var(--spacing-md) var(--spacing-lg)',
    marginBottom: 'var(--spacing-lg)',
    borderRadius: 'var(--radius-sm)',
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 'var(--spacing-md)',
    fontSize: '0.95rem',
  },

  alertError: {
    backgroundColor: '#FADBD8',
    borderLeftColor: 'var(--error-red)',
    color: '#78281F',
    borderLeft: '4px solid var(--error-red)',
  },

  alertSuccess: {
    backgroundColor: '#D5F4E6',
    borderLeftColor: 'var(--success-green)',
    color: '#0A5F3D',
    borderLeft: '4px solid var(--success-green)',
  },

  formActions: {
    display: 'flex' as const,
    gap: 'var(--spacing-md)',
    justifyContent: 'flex-end' as const,
    paddingTop: 'var(--spacing-lg)',
    marginTop: 'var(--spacing-lg)',
    borderTop: '1px solid var(--border-color)',
  },

  button: {
    padding: `var(--spacing-sm) var(--spacing-lg)`,
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 'var(--spacing-sm)',
    fontFamily: 'var(--font-main)',
  },

  buttonPrimary: {
    backgroundColor: 'var(--primary-blue)',
    color: 'var(--white)',
    boxShadow: 'var(--shadow-sm)',
  },

  buttonSecondary: {
    backgroundColor: 'var(--secondary-teal)',
    color: 'var(--white)',
    boxShadow: 'var(--shadow-sm)',
  },

  buttonDanger: {
    backgroundColor: 'var(--error-red)',
    color: 'var(--white)',
    boxShadow: 'var(--shadow-sm)',
  },
}
