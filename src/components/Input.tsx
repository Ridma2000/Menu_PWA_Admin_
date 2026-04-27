import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

interface FieldWrapperProps {
  children: ReactNode
  helperText?: string
  label: string
}

function FieldWrapper({ children, helperText, label }: FieldWrapperProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      {children}
      {helperText ? <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{helperText}</span> : null}
    </label>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  helperText?: string
  label: string
}

export function Input({ className = '', helperText, label, ...props }: InputProps) {
  return (
    <FieldWrapper helperText={helperText} label={label}>
      <input
        className={`h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${className}`}
        {...props}
      />
    </FieldWrapper>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  helperText?: string
  label: string
}

export function Textarea({ className = '', helperText, label, ...props }: TextareaProps) {
  return (
    <FieldWrapper helperText={helperText} label={label}>
      <textarea
        className={`min-h-28 w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${className}`}
        {...props}
      />
    </FieldWrapper>
  )
}
