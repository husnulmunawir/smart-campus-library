import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { LibraryData } from '../types'
import { processLoan, processReturn, type LoanInput, type ProcessResult } from '../lib/library'
import { loadData, resetData, saveData } from '../lib/storage'

interface DataContextValue {
  data: LibraryData
  isLoading: boolean
  catatPeminjaman: (input: LoanInput) => ProcessResult
  catatPengembalian: (id: string) => ProcessResult
  resetSemuaData: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LibraryData>(() => loadData())
  const [isLoading, setIsLoading] = useState(true)
  const dataRef = useRef(data)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 160)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    dataRef.current = data
    if (!isLoading) saveData(data)
  }, [data, isLoading])

  const catatPeminjaman = useCallback((input: LoanInput): ProcessResult => {
    const result = processLoan(dataRef.current, input)
    if (result.ok) {
      dataRef.current = result.data
      setData(result.data)
    }
    return result
  }, [])

  const catatPengembalian = useCallback((id: string): ProcessResult => {
    const result = processReturn(dataRef.current, id)
    if (result.ok) {
      dataRef.current = result.data
      setData(result.data)
    }
    return result
  }, [])

  const resetSemuaData = useCallback(() => {
    const seeded = resetData()
    dataRef.current = seeded
    setData(seeded)
  }, [])

  const value = useMemo(
    () => ({ data, isLoading, catatPeminjaman, catatPengembalian, resetSemuaData }),
    [data, isLoading, catatPeminjaman, catatPengembalian, resetSemuaData],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData harus digunakan di dalam DataProvider')
  return context
}
