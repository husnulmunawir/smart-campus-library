import { BookOpenCheck, LogOut, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { Role } from '../types'
import { NAV_ITEMS } from './navigation'

export function Sidebar({
  role,
  userName,
  open,
  onClose,
  onLogout,
}: {
  role: Role
  userName: string
  open: boolean
  onClose: () => void
  onLogout: () => void
}) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-navy/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-line bg-white transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-line px-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-maroon text-gold shadow-sm">
              <BookOpenCheck size={22} strokeWidth={1.8} />
            </span>
            <div className="leading-tight">
              <p className="text-[13px] font-extrabold tracking-tight text-maroon">Smart Campus</p>
              <p className="text-[13px] font-semibold tracking-tight text-navy">Library</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-ivory lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Menu Utama</p>
        </div>

        <nav className="mt-3 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {NAV_ITEMS[role].map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition ${
                  isActive
                    ? 'bg-maroon-soft text-maroon'
                    : 'text-muted hover:bg-ivory hover:text-navy'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-maroon" />}
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.9} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-3">
          <div className="mb-3 rounded-xl bg-gold-soft/70 px-3 py-2.5">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#8a6620]">
              <span className="cr-tag">CR-01</span> Change Request
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#7b5c1d]">
              Simulasi status Terlambat · usulan menunggu persetujuan
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg px-2 py-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-bold text-white">
              {userName
                .split(' ')
                .slice(0, 2)
                .map((part) => part[0])
                .join('')
                .toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-navy">{userName}</p>
              <p className="text-[10px] capitalize text-muted">{role}</p>
            </div>
          </div>
          <button type="button" onClick={onLogout} className="btn btn-outline mt-1 w-full justify-start">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
