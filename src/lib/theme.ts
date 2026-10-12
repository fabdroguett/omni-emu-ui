export function initTheme() {
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = saved || (prefersDark ? 'dark' : 'light')
  applyTheme(theme)
}

export function setTheme(theme: 'light' | 'dark' | 'system') {
  localStorage.setItem('theme', theme)
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme
  applyTheme(resolved)
}

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(theme)
  document.documentElement.style.colorScheme = theme
}

export function getTheme(): 'light' | 'dark' | 'system' {
  return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system'
}