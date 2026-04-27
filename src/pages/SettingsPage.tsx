import { FormEvent, useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { Input, Textarea } from '../components/Input'
import { useAdminData } from '../hooks/useAdminData'
import type { RestaurantSettings } from '../types'

export function SettingsPage() {
  const { settings, updateSettings } = useAdminData()
  const [form, setForm] = useState<RestaurantSettings>(settings)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    setForm(settings)
  }, [settings])

  const updateField = (field: keyof RestaurantSettings, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateSettings(form)
    setIsSaved(true)
    window.setTimeout(() => setIsSaved(false), 1800)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">Settings</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Edit public restaurant details shown by the menu PWA.</p>
      </div>

      <form className="max-w-3xl space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Restaurant name"
            onChange={(event) => updateField('restaurantName', event.target.value)}
            required
            value={form.restaurantName}
          />
          <Input label="Phone number" onChange={(event) => updateField('phoneNumber', event.target.value)} required value={form.phoneNumber} />
          <Input
            label="WhatsApp number"
            onChange={(event) => updateField('whatsappNumber', event.target.value)}
            required
            value={form.whatsappNumber}
          />
          <Input
            label="Opening hours"
            onChange={(event) => updateField('openingHours', event.target.value)}
            required
            value={form.openingHours}
          />
        </div>
        <Textarea label="Address" onChange={(event) => updateField('address', event.target.value)} required value={form.address} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit">Save Settings</Button>
          {isSaved ? <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300">Settings saved in local state.</p> : null}
        </div>
      </form>
    </div>
  )
}
