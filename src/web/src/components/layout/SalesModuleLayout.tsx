import { useMemo } from 'react'
import { ModuleLayout } from './ModuleLayout'
import { buildSalesSubNav } from '@/config/navigation'
import { useSalesSettings } from '@/contexts/SalesSettingsContext'

export function SalesModuleLayout() {
  const { settings } = useSalesSettings()
  const items = useMemo(() => buildSalesSubNav(settings), [settings])

  return <ModuleLayout items={items} />
}
