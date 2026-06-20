import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export interface SalesSettings {
  enableSalesOrders: boolean
  enableCreditNotes: boolean
  enableRecurringInvoices: boolean
  allowUnallocatedReceipts: boolean
}

const STORAGE_KEY = 'bsc_sales_settings'

export const defaultSalesSettings: SalesSettings = {
  enableSalesOrders: true,
  enableCreditNotes: true,
  enableRecurringInvoices: false,
  allowUnallocatedReceipts: true,
}

function loadSettings(): SalesSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSalesSettings
    const parsed = JSON.parse(raw) as Partial<SalesSettings> & Record<string, unknown>
    return {
      enableSalesOrders: parsed.enableSalesOrders ?? defaultSalesSettings.enableSalesOrders,
      enableCreditNotes: parsed.enableCreditNotes ?? defaultSalesSettings.enableCreditNotes,
      enableRecurringInvoices:
        parsed.enableRecurringInvoices ?? defaultSalesSettings.enableRecurringInvoices,
      allowUnallocatedReceipts:
        parsed.allowUnallocatedReceipts ?? defaultSalesSettings.allowUnallocatedReceipts,
    }
  } catch {
    return defaultSalesSettings
  }
}

interface SalesSettingsContextValue {
  settings: SalesSettings
  refreshVersion: number
  saveSettings: (next: SalesSettings) => void
}

const SalesSettingsContext = createContext<SalesSettingsContextValue | null>(null)

export function SalesSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SalesSettings>(loadSettings)
  const [refreshVersion, setRefreshVersion] = useState(0)

  const saveSettings = useCallback((next: SalesSettings) => {
    setSettings(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setRefreshVersion((v) => v + 1)
  }, [])

  const value = useMemo(
    () => ({ settings, refreshVersion, saveSettings }),
    [settings, refreshVersion, saveSettings],
  )

  return (
    <SalesSettingsContext.Provider value={value}>{children}</SalesSettingsContext.Provider>
  )
}

export function useSalesSettings() {
  const ctx = useContext(SalesSettingsContext)
  if (!ctx) throw new Error('useSalesSettings must be used within SalesSettingsProvider')
  return ctx
}
