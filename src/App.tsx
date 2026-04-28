import { useState } from 'react'
import { AdminDataProvider } from './components/AdminDataProvider'
import { AppShell } from './components/AppShell'
import { navItems } from './data/navigation'
import { useDarkMode } from './hooks/useDarkMode'
import { CategoriesPage } from './pages/CategoriesPage'
import { DashboardPage } from './pages/DashboardPage'
import { MenuItemsPage } from './pages/MenuItemsPage'
import { SettingsPage } from './pages/SettingsPage'
import type { PageKey } from './types'

function renderPage(page: PageKey) {
  switch (page) {
    case 'categories':
      return <CategoriesPage />
    case 'menu-items':
      return <MenuItemsPage />
    case 'settings':
      return <SettingsPage />
    case 'dashboard':
    default:
      return <DashboardPage />
  }
}

function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const pageTitle = navItems.find((item) => item.key === activePage)?.label ?? 'Dashboard'

  return (
    <AdminDataProvider>
      <AppShell
        activePage={activePage}
        isDarkMode={isDarkMode}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        onNavigate={setActivePage}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onToggleDarkMode={toggleDarkMode}
        pageTitle={pageTitle}
      >
        {renderPage(activePage)}
      </AppShell>
    </AdminDataProvider>
  )
}

export default App
