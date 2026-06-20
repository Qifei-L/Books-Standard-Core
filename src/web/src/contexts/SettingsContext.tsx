import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export interface CompanySettings {
  companyName: string
  baseCurrency: string
  fiscalYearEnd: string
  defaultTaxRates: string
}

const STORAGE_KEY = 'bsc_company_settings'

export const defaultCompanySettings: CompanySettings = {
  companyName: '示例科技有限公司',
  baseCurrency: 'CNY',
  fiscalYearEnd: 'December 31',
  defaultTaxRates: '13% / 6%',
}

function loadSettings(): CompanySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultCompanySettings
    return { ...defaultCompanySettings, ...JSON.parse(raw) }
  } catch {
    return defaultCompanySettings
  }
}

interface SettingsContextValue {
  settings: CompanySettings
  isOpen: boolean
  refreshVersion: number
  openSettings: () => void
  closeSettings: () => void
  saveSettings: (next: CompanySettings) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CompanySettings>(loadSettings)
  const [isOpen, setIsOpen] = useState(false)
  const [refreshVersion, setRefreshVersion] = useState(0)

  const openSettings = useCallback(() => setIsOpen(true), [])
  const closeSettings = useCallback(() => setIsOpen(false), [])

  const saveSettings = useCallback((next: CompanySettings) => {
    setSettings(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setRefreshVersion((v) => v + 1)
    setIsOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      settings,
      isOpen,
      refreshVersion,
      openSettings,
      closeSettings,
      saveSettings,
    }),
    [settings, isOpen, refreshVersion, openSettings, closeSettings, saveSettings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
