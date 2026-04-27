import type { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
  columns: string[]
  emptyMessage?: string
  isEmpty?: boolean
}

export function Table({ children, columns, emptyMessage = 'No records found.', isEmpty = false }: TableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">
            <tr>
              {columns.map((column) => (
                <th className="whitespace-nowrap px-5 py-3 font-semibold" key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isEmpty ? (
              <tr>
                <td className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
