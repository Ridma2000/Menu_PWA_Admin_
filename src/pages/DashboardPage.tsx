import { FolderTree, Soup, ToggleLeft, ToggleRight } from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { Table } from '../components/Table'
import { useAdminData } from '../hooks/useAdminData'

export function DashboardPage() {
  const { categories, menuItems } = useAdminData()
  const availableItems = menuItems.filter((item) => item.available).length
  const unavailableItems = menuItems.length - availableItems
  const categoryRows = categories.map((category) => {
    const items = menuItems.filter((item) => item.categoryId === category.id)

    return {
      ...category,
      availableCount: items.filter((item) => item.available).length,
      itemCount: items.length,
      unavailableCount: items.filter((item) => !item.available).length,
    }
  })

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard accent="emerald" icon={<Soup size={22} />} label="Total menu items" value={String(menuItems.length)} />
        <StatCard accent="sky" icon={<FolderTree size={22} />} label="Total categories" value={String(categories.length)} />
        <StatCard accent="amber" icon={<ToggleRight size={22} />} label="Available items" value={String(availableItems)} />
        <StatCard accent="rose" icon={<ToggleLeft size={22} />} label="Unavailable items" value={String(unavailableItems)} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">Menu Overview</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Category-level item counts for the customer menu.</p>
        </div>
        <Table columns={['Category', 'Menu Items', 'Available', 'Unavailable']} isEmpty={categoryRows.length === 0}>
          {categoryRows.map((category) => (
            <tr className="text-slate-700 dark:text-slate-200" key={category.id}>
              <td className="px-5 py-4 font-medium text-slate-950 dark:text-white">{category.name}</td>
              <td className="whitespace-nowrap px-5 py-4">{category.itemCount}</td>
              <td className="whitespace-nowrap px-5 py-4">{category.availableCount}</td>
              <td className="whitespace-nowrap px-5 py-4">{category.unavailableCount}</td>
            </tr>
          ))}
        </Table>
      </section>
    </div>
  )
}
