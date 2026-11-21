import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastContextValue {
  notify: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const notify = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, type, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 4500)
  }, [])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-lg"
          >
            {toast.type === 'success' && <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />}
            {toast.type === 'error' && <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />}
            {toast.type === 'info' && <Info size={18} className="mt-0.5 shrink-0 text-gold" />}
            <p className="flex-1 text-sm leading-relaxed text-navy">{toast.message}</p>
            <button
              type="button"
              aria-label="Tutup notifikasi"
              onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
              className="text-muted transition hover:text-navy"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast harus digunakan di dalam ToastProvider')
  return context
}
