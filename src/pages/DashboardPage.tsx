import { ClipboardList, FolderTree, Soup, ToggleRight } from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { Table } from '../components/Table'
import { useAdminData } from '../hooks/useAdminData'
import { formatCurrency, formatDate } from '../utils/format'

export function DashboardPage() {
  const { categories, menuItems, orders } = useAdminData()
  const availableItems = menuItems.filter((item) => item.available).length
  const recentOrders = [...orders]
    .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard accent="emerald" icon={<Soup size={22} />} label="Total menu items" value={String(menuItems.length)} />
        <StatCard accent="sky" icon={<FolderTree size={22} />} label="Total categories" value={String(categories.length)} />
        <StatCard accent="amber" icon={<ClipboardList size={22} />} label="Total orders" value={String(orders.length)} />
        <StatCard accent="rose" icon={<ToggleRight size={22} />} label="Available items" value={String(availableItems)} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">Recent Orders</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Latest simulated orders from the menu PWA.</p>
        </div>
        <Table columns={['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date']} isEmpty={recentOrders.length === 0}>
          {recentOrders.map((order) => (
            <tr className="text-slate-700 dark:text-slate-200" key={order.id}>
              <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-950 dark:text-white">{order.id}</td>
              <td className="whitespace-nowrap px-5 py-4">{order.customerName}</td>
              <td className="min-w-64 px-5 py-4 text-slate-600 dark:text-slate-300">
                {order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
              </td>
              <td className="whitespace-nowrap px-5 py-4">{formatCurrency(order.total)}</td>
              <td className="whitespace-nowrap px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    order.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-slate-500 dark:text-slate-400">{formatDate(order.date)}</td>
            </tr>
          ))}
        </Table>
      </section>
    </div>
  )
}
