import { Bell, LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Mahasiswa, Petugas, Role } from '../types'
import { formatDateTime } from '../lib/date'
import { titleForPath } from './navigation'

export function Topbar({
  role,
  user,
  overdueCount,
  pathname,
  onOpenMenu,
  onLogout,
}: {
  role: Role
  user: Mahasiswa | Petugas | undefined
  overdueCount: number
  pathname: string
  onOpenMenu: () => void
  onLogout: () => void
}) {
  const navigate = useNavigate()
  const notificationTarget = role === 'petugas' ? '/pinjaman-aktif?status=Terlambat' : '/pinjaman-saya?status=Terlambat'

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between gap-4 border-b border-line bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Buka menu"
          onClick={onOpenMenu}
          className="rounded-lg border border-line p-2 text-navy lg:hidden"
        >
          <Menu size={19} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold text-navy sm:text-lg">{titleForPath(pathname)}</h1>
          <p className="hidden text-[11px] text-muted sm:block">{formatDateTime()}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => navigate(notificationTarget)}
          aria-label={`Notifikasi: ${overdueCount} pinjaman terlambat`}
          title="Lihat pinjaman terlambat (simulasi CR-01)"
          className="relative grid size-10 place-items-center rounded-lg border border-line text-navy transition hover:border-maroon hover:text-maroon"
        >
          <Bell size={18} />
          {overdueCount > 0 && (
            <span className="absolute -right-1 -top-1 grid size-[18px] place-items-center rounded-full bg-maroon text-[10px] font-bold text-white">
              {overdueCount > 9 ? '9+' : overdueCount}
            </span>
          )}
        </button>

        <div className="hidden items-center gap-2.5 border-l border-line pl-3 sm:flex">
          <span className="grid size-9 place-items-center rounded-full bg-maroon-soft text-xs font-bold text-maroon">
            {user
              ? user.nama
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase()
              : '?'}
          </span>
          <div className="max-w-[150px] leading-tight">
            <p className="truncate text-xs font-bold text-navy">{user?.nama ?? 'Pengguna'}</p>
            <p className="text-[10px] capitalize text-muted">
              {role === 'petugas' && 'username' in (user ?? {}) ? (user as Petugas).username : (user as Mahasiswa | undefined)?.npm ?? ''}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          aria-label="Logout"
          title="Logout"
          className="grid size-10 place-items-center rounded-lg border border-line text-navy transition hover:border-maroon hover:text-maroon lg:hidden"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
