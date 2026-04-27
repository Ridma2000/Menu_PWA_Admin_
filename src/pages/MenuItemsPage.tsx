import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Input, Textarea } from '../components/Input'
import { Modal } from '../components/Modal'
import { Table } from '../components/Table'
import { Toggle } from '../components/Toggle'
import { useAdminData } from '../hooks/useAdminData'
import type { MenuItem, MenuTag } from '../types'
import { formatCurrency } from '../utils/format'

type AvailabilityFilter = 'all' | 'available' | 'unavailable'

interface ItemFormState {
  available: boolean
  categoryId: string
  description: string
  id?: string
  imageUrl: string
  name: string
  price: string
  tags: MenuTag[]
}

const tagOptions: MenuTag[] = ['veg', 'spicy', 'popular']

const emptyForm = (categoryId: string): ItemFormState => ({
  available: true,
  categoryId,
  description: '',
  imageUrl: '',
  name: '',
  price: '',
  tags: [],
})

export function MenuItemsPage() {
  const { addMenuItem, categories, deleteMenuItem, menuItems, updateMenuItem } = useAdminData()
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [form, setForm] = useState<ItemFormState>(emptyForm(categories[0]?.id ?? ''))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  )

  const filteredItems = menuItems.filter((item) => {
    const categoryName = categoryById.get(item.categoryId) ?? 'Uncategorized'
    const matchesSearch = `${item.name} ${categoryName} ${item.description}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.categoryId === categoryFilter
    const matchesAvailability =
      availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && item.available) ||
      (availabilityFilter === 'unavailable' && !item.available)

    return matchesSearch && matchesCategory && matchesAvailability
  })

  const openCreateModal = () => {
    setForm(emptyForm(categories[0]?.id ?? ''))
    setIsModalOpen(true)
  }

  const openEditModal = (item: MenuItem) => {
    setForm({
      available: item.available,
      categoryId: item.categoryId,
      description: item.description,
      id: item.id,
      imageUrl: item.imageUrl,
      name: item.name,
      price: String(item.price),
      tags: item.tags,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const toggleTag = (tag: MenuTag) => {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags.filter((currentTag) => currentTag !== tag) : [...current.tags, tag],
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextItem = {
      available: form.available,
      categoryId: form.categoryId,
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      name: form.name.trim(),
      price: Number(form.price),
      tags: form.tags,
    }

    if (!nextItem.name || !nextItem.categoryId || Number.isNaN(nextItem.price)) {
      return
    }

    if (form.id) {
      updateMenuItem(form.id, nextItem)
    } else {
      addMenuItem(nextItem)
    }

    closeModal()
  }

  const handleDelete = (item: MenuItem) => {
    if (window.confirm(`Delete "${item.name}" from the menu?`)) {
      deleteMenuItem(item.id)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">Menu Items</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create, edit, filter, and remove menu items.</p>
        </div>
        <Button icon={<Plus size={17} />} onClick={openCreateModal}>
          Add Item
        </Button>
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-[1fr_180px_180px] dark:border-slate-800 dark:bg-slate-950">
        <label className="relative block">
          <span className="sr-only">Search menu items</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, category, or description"
            type="search"
            value={searchTerm}
          />
        </label>
        <select
          className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          onChange={(event) => setCategoryFilter(event.target.value)}
          value={categoryFilter}
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          onChange={(event) => setAvailabilityFilter(event.target.value as AvailabilityFilter)}
          value={availabilityFilter}
        >
          <option value="all">All availability</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      <Table columns={['Image', 'Name', 'Category', 'Price', 'Availability', 'Actions']} isEmpty={filteredItems.length === 0}>
        {filteredItems.map((item) => (
          <tr className="text-slate-700 dark:text-slate-200" key={item.id}>
            <td className="px-5 py-4">
              <img alt={item.name} className="h-14 w-20 rounded-md object-cover" src={item.imageUrl} />
            </td>
            <td className="min-w-72 px-5 py-4">
              <p className="font-medium text-slate-950 dark:text-white">{item.name}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </td>
            <td className="whitespace-nowrap px-5 py-4">{categoryById.get(item.categoryId) ?? 'Uncategorized'}</td>
            <td className="whitespace-nowrap px-5 py-4 font-medium">{formatCurrency(item.price)}</td>
            <td className="whitespace-nowrap px-5 py-4">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                  item.available
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {item.available ? 'Available' : 'Unavailable'}
              </span>
            </td>
            <td className="whitespace-nowrap px-5 py-4">
              <div className="flex gap-2">
                <Button
                  aria-label={`Edit ${item.name}`}
                  className="h-10 border-sky-200 bg-sky-50 px-3 text-sky-700 hover:bg-sky-100 focus-visible:ring-sky-500 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20"
                  icon={<Pencil size={17} strokeWidth={2.4} />}
                  onClick={() => openEditModal(item)}
                  title={`Edit ${item.name}`}
                  variant="secondary"
                >
                  Edit
                </Button>
                <Button
                  aria-label={`Delete ${item.name}`}
                  className="h-10 px-3"
                  icon={<Trash2 size={17} strokeWidth={2.4} />}
                  onClick={() => handleDelete(item)}
                  title={`Delete ${item.name}`}
                  variant="danger"
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Modal
        footer={
          <>
            <Button onClick={closeModal} variant="secondary">
              Cancel
            </Button>
            <Button form="menu-item-form" type="submit">
              {form.id ? 'Save Changes' : 'Create Item'}
            </Button>
          </>
        }
        isOpen={isModalOpen}
        onClose={closeModal}
        title={form.id ? 'Edit Menu Item' : 'Add Menu Item'}
      >
        <form className="space-y-4" id="menu-item-form" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required value={form.name} />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Category</span>
              <select
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
                required
                value={form.categoryId}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Textarea
            label="Description"
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            required
            value={form.description}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Price"
              min="0"
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
              required
              step="0.01"
              type="number"
              value={form.price}
            />
            <Input
              label="Image URL"
              onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
              placeholder="https://..."
              required
              type="url"
              value={form.imageUrl}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => {
                const isSelected = form.tags.includes(tag)

                return (
                  <button
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium capitalize transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    type="button"
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>
          <Toggle checked={form.available} label="Available to customers" onChange={(checked) => setForm((current) => ({ ...current, available: checked }))} />
        </form>
      </Modal>
    </div>
  )
}
