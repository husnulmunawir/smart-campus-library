import { AlertTriangle, CheckCircle2, Clock3, BookMarked } from 'lucide-react'
import type { Buku, StatusPinjaman } from '../types'

export function BookStatusBadge({ status }: { status: Buku['status'] }) {
  const available = status === 'Tersedia'
  return (
    <span
      className={`badge ${available ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}
    >
      {available ? <CheckCircle2 size={12} /> : <BookMarked size={12} />}
      {status}
    </span>
  )
}

export function LoanStatusBadge({ status, showCR = false }: { status: StatusPinjaman; showCR?: boolean }) {
  if (status === 'Terlambat') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="badge bg-red-50 text-red-700">
          <AlertTriangle size={12} />
          Terlambat
        </span>
        {showCR && (
          <span className="cr-tag" title="Simulasi Change Request CR-01 — usulan, menunggu persetujuan">
            CR-01
          </span>
        )}
      </span>
    )
  }

  if (status === 'Dikembalikan') {
    return (
      <span className="badge bg-emerald-50 text-emerald-700">
        <CheckCircle2 size={12} />
        Dikembalikan
      </span>
    )
  }

  return (
    <span className="badge bg-sky-50 text-sky-700">
      <Clock3 size={12} />
      Dipinjam
    </span>
  )
}
