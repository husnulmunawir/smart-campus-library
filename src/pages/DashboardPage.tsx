import { useAuth } from '../context/AuthContext'
import { StudentDashboardPage } from './StudentDashboardPage'
import { StaffDashboardPage } from './StaffDashboardPage'

export function DashboardPage() {
  const { session } = useAuth()
  return session?.role === 'petugas' ? <StaffDashboardPage /> : <StudentDashboardPage />
}
