import { Crop, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react'
import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Input, Textarea } from '../components/Input'
import { Modal } from '../components/Modal'
import { Table } from '../components/Table'
import { Toggle } from '../components/Toggle'
import { useAdminData } from '../hooks/useAdminData'
import type { MenuItem, MenuTag } from '../types'
import { formatCurrency } from '../utils/format'

type AvailabilityFilter = 'all' | 'available' | 'unavailable'
type CropAspect = 'landscape' | 'square'

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

interface CropState {
  aspect: CropAspect
  offsetX: number
  offsetY: number
  source: string
  zoom: number
}

const tagOptions: MenuTag[] = ['veg', 'spicy', 'popular']
const cropDimensions: Record<CropAspect, { className: string; height: number; label: string; width: number }> = {
  landscape: { className: 'aspect-[4/3]', height: 600, label: '4:3', width: 800 },
  square: { className: 'aspect-square', height: 800, label: '1:1', width: 800 },
}

const emptyForm = (categoryId: string): ItemFormState => ({
  available: true,
  categoryId,
  description: '',
  imageUrl: '',
  name: '',
  price: '',
  tags: [],
})

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const loadImage = (source: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()

    if (!source.startsWith('data:')) {
      image.crossOrigin = 'anonymous'
    }

    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = source
  })

const createCroppedImage = async ({ aspect, offsetX, offsetY, source, zoom }: CropState) => {
  const image = await loadImage(source)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const output = cropDimensions[aspect]

  if (!context) {
    throw new Error('Canvas is unavailable.')
  }

  const imageWidth = image.naturalWidth
  const imageHeight = image.naturalHeight
  const outputAspect = output.width / output.height
  const baseCropWidth = imageWidth / imageHeight > outputAspect ? imageHeight * outputAspect : imageWidth
  const baseCropHeight = baseCropWidth / outputAspect
  const cropWidth = baseCropWidth / zoom
  const cropHeight = baseCropHeight / zoom
  const maxSourceX = Math.max(imageWidth - cropWidth, 0)
  const maxSourceY = Math.max(imageHeight - cropHeight, 0)
  const sourceX = clamp(maxSourceX / 2 + (offsetX / 100) * (maxSourceX / 2), 0, maxSourceX)
  const sourceY = clamp(maxSourceY / 2 + (offsetY / 100) * (maxSourceY / 2), 0, maxSourceY)

  canvas.width = output.width
  canvas.height = output.height
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, output.width, output.height)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, sourceX, sourceY, cropWidth, cropHeight, 0, 0, output.width, output.height)

  return canvas.toDataURL('image/jpeg', 0.9)
}

export function MenuItemsPage() {
  const { addMenuItem, categories, deleteMenuItem, menuItems, updateMenuItem } = useAdminData()
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [cropState, setCropState] = useState<CropState | null>(null)
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
    setCropState(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: MenuItem) => {
    setCropState(null)
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
    setCropState(null)
    setIsModalOpen(false)
  }

  const toggleTag = (tag: MenuTag) => {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags.filter((currentTag) => currentTag !== tag) : [...current.tags, tag],
    }))
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      window.alert('Please upload an image file.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const uploadedImage = reader.result

        setForm((current) => ({ ...current, imageUrl: uploadedImage }))
        setCropState({ aspect: 'landscape', offsetX: 0, offsetY: 0, source: uploadedImage, zoom: 1 })
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const openCropEditor = () => {
    const imageUrl = form.imageUrl.trim()

    if (!imageUrl) {
      window.alert('Add or upload an image before cropping.')
      return
    }

    setCropState({ aspect: 'landscape', offsetX: 0, offsetY: 0, source: imageUrl, zoom: 1 })
  }

  const applyCrop = async () => {
    if (!cropState) {
      return
    }

    try {
      const croppedImage = await createCroppedImage(cropState)

      setForm((current) => ({ ...current, imageUrl: croppedImage }))
      setCropState(null)
    } catch {
      window.alert('This image cannot be cropped in the browser. Upload the image file directly, then crop it.')
    }
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

  const updateAvailability = (item: MenuItem, value: string) => {
    updateMenuItem(item.id, {
      available: value === 'available',
      categoryId: item.categoryId,
      description: item.description,
      imageUrl: item.imageUrl,
      name: item.name,
      price: item.price,
      tags: item.tags,
    })
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
              <select
                aria-label={`Availability for ${item.name}`}
                className={`h-9 min-w-32 rounded-md border px-3 text-sm font-medium outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${
                  item.available
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                    : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
                onChange={(event) => updateAvailability(item, event.target.value)}
                value={item.available ? 'available' : 'unavailable'}
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
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
              onChange={(event) => {
                setForm((current) => ({ ...current, imageUrl: event.target.value }))
                setCropState(null)
              }}
              placeholder="https://..."
              required
              value={form.imageUrl}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-[180px_1fr]">
            <div>
              <p className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Preview</p>
              {form.imageUrl ? (
                <img
                  alt={form.name ? `${form.name} preview` : 'Food item preview'}
                  className="h-32 w-full rounded-md border border-slate-200 object-cover dark:border-slate-700"
                  src={form.imageUrl}
                />
              ) : (
                <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  No image
                </div>
              )}
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Upload food image</span>
              <input accept="image/*" className="sr-only" onChange={handleImageUpload} type="file" />
              <span className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm font-medium text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300">
                <Upload size={20} />
                Choose Image
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">JPG, PNG, WEBP, or GIF</span>
              </span>
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled={!form.imageUrl.trim()} icon={<Crop size={17} />} onClick={openCropEditor} variant="secondary">
              Crop Image
            </Button>
          </div>
          {cropState ? (
            <div className="space-y-4 rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                <div
                  className={`relative overflow-hidden rounded-md border border-slate-200 bg-slate-950 ${cropDimensions[cropState.aspect].className} dark:border-slate-700`}
                >
                  <img
                    alt="Crop preview"
                    className="absolute inset-0 h-full w-full object-cover"
                    src={cropState.source}
                    style={{
                      objectPosition: `${50 + cropState.offsetX / 2}% ${50 + cropState.offsetY / 2}%`,
                      transform: `scale(${cropState.zoom})`,
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 border-2 border-white/80 shadow-[inset_0_0_0_9999px_rgba(15,23,42,0.08)]" />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Crop ratio</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(cropDimensions) as CropAspect[]).map((aspect) => (
                        <button
                          className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                            cropState.aspect === aspect
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'
                          }`}
                          key={aspect}
                          onClick={() => setCropState((current) => (current ? { ...current, aspect } : current))}
                          type="button"
                        >
                          {cropDimensions[aspect].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Zoom</span>
                    <input
                      className="w-full accent-emerald-600"
                      max="3"
                      min="1"
                      onChange={(event) =>
                        setCropState((current) => (current ? { ...current, zoom: Number(event.target.value) } : current))
                      }
                      step="0.05"
                      type="range"
                      value={cropState.zoom}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Horizontal position</span>
                    <input
                      className="w-full accent-emerald-600"
                      max="100"
                      min="-100"
                      onChange={(event) =>
                        setCropState((current) => (current ? { ...current, offsetX: Number(event.target.value) } : current))
                      }
                      step="1"
                      type="range"
                      value={cropState.offsetX}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Vertical position</span>
                    <input
                      className="w-full accent-emerald-600"
                      max="100"
                      min="-100"
                      onChange={(event) =>
                        setCropState((current) => (current ? { ...current, offsetY: Number(event.target.value) } : current))
                      }
                      step="1"
                      type="range"
                      value={cropState.offsetY}
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  onClick={() => setCropState((current) => (current ? { ...current, offsetX: 0, offsetY: 0, zoom: 1 } : current))}
                  variant="secondary"
                >
                  Reset Crop
                </Button>
                <Button onClick={applyCrop} type="button">
                  Apply Crop
                </Button>
              </div>
            </div>
          ) : null}
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
