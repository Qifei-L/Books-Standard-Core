import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSalesSettings, type SalesSettings } from '@/contexts/SalesSettingsContext'

type SalesFeature = keyof Pick<
  SalesSettings,
  'enableSalesOrders' | 'enableCreditNotes' | 'enableRecurringInvoices'
>

interface SalesFeatureGateProps {
  feature: SalesFeature
  children: ReactNode
}

export function SalesFeatureGate({ feature, children }: SalesFeatureGateProps) {
  const { settings } = useSalesSettings()

  if (!settings[feature]) {
    return <Navigate to="/sales/overview" replace />
  }

  return children
}
