import { TbMoon, TbSun } from "react-icons/tb"

import { useTheme } from './theme-provider'
import { Button } from './custom/button'
import { useEffect } from 'react'

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    metaThemeColor && metaThemeColor.setAttribute('content', themeColor)
  }, [theme])

  return (
    <Button
      size='icon'
      variant='ghost'
      className='rounded-full'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <TbMoon size={20} /> : <TbSun size={20} />}
    </Button>
  )
}
