import { createContext } from 'react'
import type { Category, MenuItem, Order, OrderStatus, RestaurantSettings } from '../types'

export type MenuItemInput = Omit<MenuItem, 'id'>

export interface AdminDataContextValue {
  categories: Category[]
  menuItems: MenuItem[]
  orders: Order[]
  settings: RestaurantSettings
  addMenuItem: (item: MenuItemInput) => void
  updateMenuItem: (id: string, item: MenuItemInput) => void
  deleteMenuItem: (id: string) => void
  addCategory: (name: string) => void
  updateCategory: (id: string, name: string) => void
  deleteCategory: (id: string) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  updateSettings: (settings: RestaurantSettings) => void
}

export const AdminDataContext = createContext<AdminDataContextValue | undefined>(undefined)
