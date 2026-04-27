import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Modal } from '../components/Modal'
import { Table } from '../components/Table'
import { useAdminData } from '../hooks/useAdminData'
import type { Category } from '../types'

export function CategoriesPage() {
  const { addCategory, categories, deleteCategory, menuItems, updateCategory } = useAdminData()
  const [categoryName, setCategoryName] = useState('')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editName, setEditName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const categoryRows = categories
    .map((category) => ({
      ...category,
      itemCount: menuItems.filter((item) => item.categoryId === category.id).length,
    }))
    .filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addCategory(categoryName)
    setCategoryName('')
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setEditName(category.name)
  }

  const handleEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (editingCategory) {
      updateCategory(editingCategory.id, editName)
      setEditingCategory(null)
    }
  }

  const handleDelete = (category: Category) => {
    if (categories.length === 1) {
      window.alert('At least one category is required before deleting this category.')
      return
    }

    if (window.confirm(`Delete "${category.name}"? Existing items will move to another category.`)) {
      deleteCategory(category.id)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">Categories</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Keep the customer menu grouped into clear sections.</p>
      </div>

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft lg:grid-cols-[1fr_320px] dark:border-slate-800 dark:bg-slate-950">
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleAdd}>
          <Input
            label="New category"
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="Breakfast specials"
            required
            value={categoryName}
          />
          <Button className="mt-0 sm:mt-7" icon={<Plus size={17} />} type="submit">
            Add Category
          </Button>
        </form>

        <label className="relative block lg:mt-7">
          <span className="sr-only">Search categories</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search categories"
            type="search"
            value={searchTerm}
          />
        </label>
      </div>

      <Table columns={['Category', 'Items', 'Actions']} isEmpty={categoryRows.length === 0}>
        {categoryRows.map((category) => (
          <tr className="text-slate-700 dark:text-slate-200" key={category.id}>
            <td className="px-5 py-4 font-medium text-slate-950 dark:text-white">{category.name}</td>
            <td className="whitespace-nowrap px-5 py-4">{category.itemCount}</td>
            <td className="whitespace-nowrap px-5 py-4">
              <div className="flex gap-2">
                <Button aria-label={`Edit ${category.name}`} className="h-9 w-9 px-0" icon={<Pencil size={16} />} onClick={() => openEditModal(category)} variant="secondary" />
                <Button aria-label={`Delete ${category.name}`} className="h-9 w-9 px-0" icon={<Trash2 size={16} />} onClick={() => handleDelete(category)} variant="danger" />
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Modal
        footer={
          <>
            <Button onClick={() => setEditingCategory(null)} variant="secondary">
              Cancel
            </Button>
            <Button form="category-edit-form" type="submit">
              Save Changes
            </Button>
          </>
        }
        isOpen={Boolean(editingCategory)}
        onClose={() => setEditingCategory(null)}
        title="Edit Category"
      >
        <form id="category-edit-form" onSubmit={handleEdit}>
          <Input label="Category name" onChange={(event) => setEditName(event.target.value)} required value={editName} />
        </form>
      </Modal>
    </div>
  )
}
