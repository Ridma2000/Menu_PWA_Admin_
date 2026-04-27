import { Eye, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { Table } from '../components/Table'
import { useAdminData } from '../hooks/useAdminData'
import type { Order, OrderStatus } from '../types'
import { formatCurrency, formatDate } from '../utils/format'

type StatusFilter = 'all' | OrderStatus

export function OrdersPage() {
  const { orders, updateOrderStatus } = useAdminData()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = `${order.id} ${order.customerName} ${order.items.map((item) => item.name).join(' ')}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">Orders</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review mock customer orders and update fulfillment status.</p>
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-[1fr_190px] dark:border-slate-800 dark:bg-slate-950">
        <label className="relative block">
          <span className="sr-only">Search orders</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by order, customer, or item"
            type="search"
            value={searchTerm}
          />
        </label>
        <select
          className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          value={statusFilter}
        >
          <option value="all">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <Table columns={['Order ID', 'Items', 'Total', 'Status', 'Date', 'Actions']} isEmpty={filteredOrders.length === 0}>
        {filteredOrders.map((order) => (
          <tr className="text-slate-700 dark:text-slate-200" key={order.id}>
            <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-950 dark:text-white">{order.id}</td>
            <td className="min-w-72 px-5 py-4 text-slate-600 dark:text-slate-300">
              {order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
            </td>
            <td className="whitespace-nowrap px-5 py-4 font-medium">{formatCurrency(order.total)}</td>
            <td className="whitespace-nowrap px-5 py-4">
              <select
                className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                onChange={(event) => updateOrderStatus(order.id, event.target.value as OrderStatus)}
                value={order.status}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </td>
            <td className="whitespace-nowrap px-5 py-4 text-slate-500 dark:text-slate-400">{formatDate(order.date)}</td>
            <td className="whitespace-nowrap px-5 py-4">
              <Button icon={<Eye size={16} />} onClick={() => setSelectedOrder(order)} variant="secondary">
                View
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} title={selectedOrder ? `Order ${selectedOrder.id}` : 'Order Details'}>
        {selectedOrder ? (
          <div className="space-y-5">
            <div className="grid gap-3 rounded-lg bg-slate-50 p-4 text-sm md:grid-cols-2 dark:bg-slate-900">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Customer</p>
                <p className="mt-1 font-medium text-slate-950 dark:text-white">{selectedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Phone</p>
                <p className="mt-1 font-medium text-slate-950 dark:text-white">{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Date</p>
                <p className="mt-1 font-medium text-slate-950 dark:text-white">{formatDate(selectedOrder.date)}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Status</p>
                <p className="mt-1 font-medium text-slate-950 dark:text-white">{selectedOrder.status}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Items</h3>
              <div className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {selectedOrder.items.map((item) => (
                  <div className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3 text-sm" key={`${selectedOrder.id}-${item.menuItemId}`}>
                    <div>
                      <p className="font-medium text-slate-950 dark:text-white">{item.name}</p>
                      <p className="text-slate-500 dark:text-slate-400">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{formatCurrency(item.quantity * item.price)}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.notes ? (
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">Notes</p>
                <p className="mt-2 rounded-md bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">{selectedOrder.notes}</p>
              </div>
            ) : null}

            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold dark:border-slate-800">
              <span>Total</span>
              <span>{formatCurrency(selectedOrder.total)}</span>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
