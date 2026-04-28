import {
  FolderTree,
  LayoutDashboard,
  Settings,
  Soup,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PageKey } from '../types'

export const navItems: Array<{ icon: LucideIcon; key: PageKey; label: string }> = [
  { icon: LayoutDashboard, key: 'dashboard', label: 'Dashboard' },
  { icon: Soup, key: 'menu-items', label: 'Menu Items' },
  { icon: FolderTree, key: 'categories', label: 'Categories' },
  { icon: Settings, key: 'settings', label: 'Settings' },
]
