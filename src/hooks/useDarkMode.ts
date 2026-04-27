import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  return {
    isDarkMode,
    toggleDarkMode: () => setIsDarkMode((current) => !current),
  }
}
