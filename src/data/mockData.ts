import type { Category, MenuItem, RestaurantSettings } from '../types'

export const mockCategories: Category[] = [
  { id: 'cat-starters', name: 'Starters' },
  { id: 'cat-mains', name: 'Mains' },
  { id: 'cat-desserts', name: 'Desserts' },
  { id: 'cat-drinks', name: 'Drinks' },
]

export const mockMenuItems: MenuItem[] = [
  {
    id: 'item-bruschetta',
    name: 'Tomato Basil Bruschetta',
    categoryId: 'cat-starters',
    description: 'Toasted sourdough with marinated tomato, basil, garlic, and olive oil.',
    price: 8.5,
    imageUrl:
      'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=500&q=80',
    tags: ['veg', 'popular'],
    available: true,
  },
  {
    id: 'item-calamari',
    name: 'Crispy Calamari',
    categoryId: 'cat-starters',
    description: 'Lightly fried calamari with lemon aioli and smoked paprika.',
    price: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=80',
    tags: ['popular'],
    available: true,
  },
  {
    id: 'item-risotto',
    name: 'Wild Mushroom Risotto',
    categoryId: 'cat-mains',
    description: 'Arborio rice, mixed mushrooms, parmesan, thyme, and truffle oil.',
    price: 18.75,
    imageUrl:
      'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=500&q=80',
    tags: ['veg'],
    available: true,
  },
  {
    id: 'item-chicken',
    name: 'Peri Peri Chicken Bowl',
    categoryId: 'cat-mains',
    description: 'Grilled peri peri chicken, saffron rice, greens, pickles, and garlic sauce.',
    price: 16.5,
    imageUrl:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80',
    tags: ['spicy', 'popular'],
    available: true,
  },
  {
    id: 'item-cheesecake',
    name: 'Lemon Cheesecake',
    categoryId: 'cat-desserts',
    description: 'Baked cheesecake with lemon curd, shortbread crumb, and fresh berries.',
    price: 7.25,
    imageUrl:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80',
    tags: ['veg'],
    available: false,
  },
  {
    id: 'item-mojito',
    name: 'Mint Lime Mojito',
    categoryId: 'cat-drinks',
    description: 'Fresh mint, lime, sparkling soda, and cane sugar served over crushed ice.',
    price: 6.75,
    imageUrl:
      'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=500&q=80',
    tags: ['veg', 'popular'],
    available: true,
  },
]

export const mockSettings: RestaurantSettings = {
  restaurantName: 'Harvest Table Bistro',
  phoneNumber: '+1 555 0110',
  whatsappNumber: '+1 555 0111',
  address: '214 Market Street, San Francisco, CA',
  openingHours: 'Mon-Sun, 11:00 AM - 10:00 PM',
}
