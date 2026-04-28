export type PageKey = 'dashboard' | 'menu-items' | 'categories' | 'settings'

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

export interface RestaurantSettings {
  restaurantName: string
  phoneNumber: string
  whatsappNumber: string
  address: string
  openingHours: string
}
