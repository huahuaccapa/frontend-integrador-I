import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
import useIsCollapsed from './hooks/use-is-collapsed'

// import { Search } from '@/components/search'
import ThemeSwitch from './theme-switch'
import { TopNav } from './top-nav'
import { UserNav } from './user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'

export default function AppShell() {

  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={`
          overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 
          ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <Layout>
          {/* ===== Top Heading ===== */}
          <LayoutHeader>
            <TopNav links={topNav} />
            <div className='ml-auto flex items-center space-x-4'>
              {/* <Search /> */}
              <ThemeSwitch />
              <UserNav />
            </div>
          </LayoutHeader>

          {/* ===== Main ===== */}
          <LayoutBody className='space-y-4'>
            <Outlet />
          </LayoutBody>
        </Layout>

      </main>
    </div>
  )
}

const topNav = [
  {
    title: 'General',
    href: '/student/dashboard',
    isActive: true,
  },
  {
    title: 'Programas',
    href: '/student/mis_cursos',
    isActive: false,
  },
  {
    title: 'Ajustes',
    href: 'ajustes/cuenta',
    isActive: false,
  },
]

