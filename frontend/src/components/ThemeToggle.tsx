import React, { useEffect, useState } from 'react'

/**
 * 🌓 Theme Toggle Component para Light/Dark Mode
 */
export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Verificar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const saved = localStorage.getItem('theme')
    
    const theme = saved || (prefersDark ? 'dark' : 'light')
    applyTheme(theme as 'light' | 'dark')
    setIsDark(theme === 'dark')
  }, [])

  const applyTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    applyTheme(newTheme)
    setIsDark(!isDark)
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-blue)',
        color: 'var(--white)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-lg)',
        transition: 'all var(--transition-fast)',
        zIndex: 100,
      }}
      title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-lg)';
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
