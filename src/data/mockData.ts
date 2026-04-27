import type { Category, MenuItem, Order, RestaurantSettings } from '../types'

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

export const mockOrders: Order[] = [
  {
    id: 'ORD-1042',
    customerName: 'Amelia Stone',
    phone: '+1 555 0198',
    items: [
      { menuItemId: 'item-chicken', name: 'Peri Peri Chicken Bowl', quantity: 2, price: 16.5 },
      { menuItemId: 'item-mojito', name: 'Mint Lime Mojito', quantity: 2, price: 6.75 },
    ],
    total: 46.5,
    status: 'Pending',
    date: '2026-04-27T10:18:00.000Z',
    notes: 'Extra garlic sauce.',
  },
  {
    id: 'ORD-1041',
    customerName: 'Noah Clarke',
    phone: '+1 555 0134',
    items: [
      { menuItemId: 'item-risotto', name: 'Wild Mushroom Risotto', quantity: 1, price: 18.75 },
      { menuItemId: 'item-cheesecake', name: 'Lemon Cheesecake', quantity: 1, price: 7.25 },
    ],
    total: 26,
    status: 'Completed',
    date: '2026-04-26T18:42:00.000Z',
  },
  {
    id: 'ORD-1040',
    customerName: 'Mia Patel',
    phone: '+1 555 0101',
    items: [
      { menuItemId: 'item-bruschetta', name: 'Tomato Basil Bruschetta', quantity: 1, price: 8.5 },
      { menuItemId: 'item-chicken', name: 'Peri Peri Chicken Bowl', quantity: 1, price: 16.5 },
    ],
    total: 25,
    status: 'Completed',
    date: '2026-04-26T12:05:00.000Z',
  },
  {
    id: 'ORD-1039',
    customerName: 'Ethan Brooks',
    phone: '+1 555 0172',
    items: [
      { menuItemId: 'item-calamari', name: 'Crispy Calamari', quantity: 1, price: 12 },
      { menuItemId: 'item-mojito', name: 'Mint Lime Mojito', quantity: 3, price: 6.75 },
    ],
    total: 32.25,
    status: 'Pending',
    date: '2026-04-25T20:12:00.000Z',
  },
  {
    id: 'ORD-1038',
    customerName: 'Sophia Bennett',
    phone: '+1 555 0184',
    items: [{ menuItemId: 'item-risotto', name: 'Wild Mushroom Risotto', quantity: 2, price: 18.75 }],
    total: 37.5,
    status: 'Completed',
    date: '2026-04-25T13:30:00.000Z',
  },
]

export const mockSettings: RestaurantSettings = {
  restaurantName: 'Harvest Table Bistro',
  phoneNumber: '+1 555 0110',
  whatsappNumber: '+1 555 0111',
  address: '214 Market Street, San Francisco, CA',
  openingHours: 'Mon-Sun, 11:00 AM - 10:00 PM',
}
