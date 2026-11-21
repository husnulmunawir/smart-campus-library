import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BookOpenCheck } from 'lucide-react'
import { AppLayout, RoleGuard } from './components/AppLayout'
import { useData } from './context/DataContext'
import { ActiveLoansPage } from './pages/ActiveLoansPage'
import { BookDetailPage } from './pages/BookDetailPage'
import { CatalogPage } from './pages/CatalogPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { MyLoansPage } from './pages/MyLoansPage'
import { ProfilePage } from './pages/ProfilePage'
import { RecordLoanPage } from './pages/RecordLoanPage'
import { RecordReturnPage } from './pages/RecordReturnPage'

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-ivory">
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-maroon text-gold">
          <BookOpenCheck size={24} />
        </span>
        <p className="mt-4 text-sm font-bold text-navy">Smart Campus Library</p>
        <p className="mt-1 text-xs text-muted">Menyiapkan data perpustakaan...</p>
      </div>
    </div>
  )
}

export default function App() {
  const { isLoading } = useData()

  if (isLoading) return <LoadingScreen />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/katalog" element={<CatalogPage />} />
          <Route path="/buku/:id" element={<BookDetailPage />} />
          <Route path="/pinjaman-saya" element={<RoleGuard allow="mahasiswa"><MyLoansPage /></RoleGuard>} />
          <Route path="/catat-peminjaman" element={<RoleGuard allow="petugas"><RecordLoanPage /></RoleGuard>} />
          <Route path="/catat-pengembalian" element={<RoleGuard allow="petugas"><RecordReturnPage /></RoleGuard>} />
          <Route path="/pinjaman-aktif" element={<RoleGuard allow="petugas"><ActiveLoansPage /></RoleGuard>} />
          <Route path="/profil" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
