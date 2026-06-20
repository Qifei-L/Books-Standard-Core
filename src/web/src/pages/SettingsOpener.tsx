import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSettings } from '@/contexts/SettingsContext'

/** Opens the settings overlay and returns to the previous page (or dashboard). */
export function SettingsOpener() {
  const { openSettings } = useSettings()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  useEffect(() => {
    openSettings()
  }, [openSettings])

  return <Navigate to={from} replace />
}
