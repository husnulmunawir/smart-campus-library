import type { LucideIcon } from 'lucide-react'

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'maroon',
  cr = false,
}: {
  label: string
  value: number | string
  hint?: string
  icon: LucideIcon
  tone?: 'maroon' | 'gold' | 'navy' | 'red'
  cr?: boolean
}) {
  const tones = {
    maroon: 'bg-maroon-soft text-maroon',
    gold: 'bg-gold-soft text-[#8a6620]',
    navy: 'bg-slate-100 text-navy',
    red: 'bg-red-50 text-red-700',
  }

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
            {label}
            {cr && <span className="cr-tag">CR-01</span>}
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-navy sm:text-[28px]">{value}</p>
        </div>
        <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon size={19} strokeWidth={2} />
        </span>
      </div>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
  )
}
