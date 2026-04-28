import { useState } from 'react'
import type { ReactNode } from 'react'
import { mockCategories, mockMenuItems, mockSettings } from '../data/mockData'
import { AdminDataContext } from '../hooks/adminDataContext'
import type { AdminDataContextValue, MenuItemInput } from '../hooks/adminDataContext'
import type { Category, MenuItem, RestaurantSettings } from '../types'

const createId = (prefix: string) => {
  const randomId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return `${prefix}-${randomId}`
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems)
  const [settings, setSettings] = useState<RestaurantSettings>(mockSettings)

  const addMenuItem = (item: MenuItemInput) => {
    setMenuItems((current) => [{ ...item, id: createId('item') }, ...current])
  }

  const updateMenuItem = (id: string, item: MenuItemInput) => {
    setMenuItems((current) => current.map((menuItem) => (menuItem.id === id ? { ...item, id } : menuItem)))
  }

  const deleteMenuItem = (id: string) => {
    setMenuItems((current) => current.filter((menuItem) => menuItem.id !== id))
  }

  const addCategory = (name: string) => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      return
    }

    setCategories((current) => [{ id: createId('cat'), name: trimmedName }, ...current])
  }

  const updateCategory = (id: string, name: string) => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      return
    }

    setCategories((current) =>
      current.map((category) => (category.id === id ? { ...category, name: trimmedName } : category)),
    )
  }

  const deleteCategory = (id: string) => {
    const remainingCategories = categories.filter((category) => category.id !== id)
    const fallbackCategoryId = remainingCategories[0]?.id ?? ''

    setCategories(remainingCategories)
    setMenuItems((current) =>
      current.map((menuItem) =>
        menuItem.categoryId === id ? { ...menuItem, categoryId: fallbackCategoryId } : menuItem,
      ),
    )
  }

  const updateSettings = (nextSettings: RestaurantSettings) => {
    setSettings(nextSettings)
  }

  const value: AdminDataContextValue = {
    categories,
    menuItems,
    settings,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
  }

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}
