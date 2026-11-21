import { FileQuestion, X, type LucideIcon } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-navy sm:text-lg">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted sm:text-sm">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  icon: Icon = FileQuestion,
  action,
}: {
  title: string
  description: string
  icon?: LucideIcon
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-maroon-soft text-maroon">
        <Icon size={22} />
      </span>
      <h3 className="mt-3 text-sm font-bold text-navy">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted sm:text-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="animate-in w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-navy">{title}</h3>
            {description && <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>}
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition hover:bg-ivory hover:text-navy"
          >
            <X size={18} />
          </button>
        </div>
        {children && <div className="px-5 py-4 text-sm text-navy">{children}</div>}
        {footer && <div className="flex justify-end gap-2 border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}

export function ChangeRequestNote({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-xl border border-dashed border-gold/70 bg-gold-soft/60 text-[#7b5c1d] ${
        compact ? 'px-3 py-2.5' : 'px-4 py-3'
      }`}
    >
      <span className="cr-tag shrink-0">CR-01</span>
      <p className={`leading-relaxed ${compact ? 'text-[11px]' : 'text-xs'}`}>
        <span className="font-bold">Simulasi change request:</span> status Terlambat dihitung otomatis dari
        tanggal kembali. Fitur ini masih berupa usulan dan menunggu persetujuan pihak terkait.
      </p>
    </div>
  )
}
