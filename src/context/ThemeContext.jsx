import { createContext, useContext, useEffect, useState } from 'react'
const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)
export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('mb-theme') === 'dark' } catch { return false }
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('mb-theme', dark ? 'dark' : 'light') } catch {}
  }, [dark])
  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  )
}
