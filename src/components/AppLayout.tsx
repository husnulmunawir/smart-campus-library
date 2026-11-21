import { useState, type ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { getOverdueLoans } from '../lib/library'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  const { session, currentUser, logout } = useAuth()
  const { data } = useData()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!session || !currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const role = session.role
  const npm = role === 'mahasiswa' && 'npm' in currentUser ? currentUser.npm : undefined
  const overdueCount = getOverdueLoans(data, npm).length

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Sidebar
        role={role}
        userName={currentUser.nama}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={handleLogout}
      />
      <div className="lg:pl-[264px]">
        <Topbar
          role={role}
          user={currentUser}
          overdueCount={overdueCount}
          pathname={location.pathname}
          onOpenMenu={() => setMenuOpen(true)}
          onLogout={handleLogout}
        />
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function RoleGuard({ allow, children }: { allow: 'mahasiswa' | 'petugas'; children: ReactNode }) {
  const { session } = useAuth()
  if (!session || session.role !== allow) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
