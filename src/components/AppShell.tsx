import {
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { navItems } from '../data/navigation'
import type { PageKey } from '../types'
import { Button } from './Button'

interface AppShellProps {
  activePage: PageKey
  children: ReactNode
  isDarkMode: boolean
  isSidebarOpen: boolean
  onCloseSidebar: () => void
  onNavigate: (page: PageKey) => void
  onOpenSidebar: () => void
  onToggleDarkMode: () => void
  pageTitle: string
}

export function AppShell({
  activePage,
  children,
  isDarkMode,
  isSidebarOpen,
  onCloseSidebar,
  onNavigate,
  onOpenSidebar,
  onToggleDarkMode,
  pageTitle,
}: AppShellProps) {
  const handleNavigate = (page: PageKey) => {
    onNavigate(page)
    onCloseSidebar()
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm transition md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onCloseSidebar}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col border-r border-slate-200 bg-white transition duration-200 md:translate-x-0 dark:border-slate-800 dark:bg-slate-950 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div>
            <p className="text-base font-semibold text-slate-950 dark:text-white">Menu PWA Admin</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Menu content admin</p>
          </div>
          <Button aria-label="Close sidebar" className="h-9 w-9 px-0 md:hidden" icon={<X size={18} />} onClick={onCloseSidebar} variant="ghost" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.key === activePage

            return (
              <button
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                }`}
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                type="button"
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="rounded-md bg-slate-100 p-3 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-900 dark:text-white">Admin: Olivia Carter</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Owner account</p>
          </div>
        </div>
      </aside>

      <div className="md:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6 dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex min-w-0 items-center gap-3">
            <Button aria-label="Open sidebar" className="h-10 w-10 px-0 md:hidden" icon={<Menu size={19} />} onClick={onOpenSidebar} variant="ghost" />
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-white">{pageTitle}</h1>
              <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">Manage menu item details and categories.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              aria-label="Toggle dark mode"
              className="h-10 w-10 px-0"
              icon={isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              onClick={onToggleDarkMode}
              variant="secondary"
            />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Olivia Carter</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Restaurant owner</p>
            </div>
            <Button icon={<LogOut size={16} />} onClick={() => window.alert('Logout is mocked for this local admin demo.')} variant="secondary">
              Logout
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  )
}
