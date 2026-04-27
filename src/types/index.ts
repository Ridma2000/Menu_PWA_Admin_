export type PageKey = 'dashboard' | 'menu-items' | 'categories' | 'orders' | 'settings'

export type MenuTag = 'veg' | 'spicy' | 'popular'

export interface Category {
  id: string
  name: string
}

export interface MenuItem {
  id: string
  name: string
  categoryId: string
  description: string
  price: number
  imageUrl: string
  tags: MenuTag[]
  available: boolean
}

export type OrderStatus = 'Pending' | 'Completed'

export interface OrderLineItem {
  menuItemId: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerName: string
  phone: string
  items: OrderLineItem[]
  total: number
  status: OrderStatus
  date: string
  notes?: string
}

export interface RestaurantSettings {
  restaurantName: string
  phoneNumber: string
  whatsappNumber: string
  address: string
  openingHours: string
}
