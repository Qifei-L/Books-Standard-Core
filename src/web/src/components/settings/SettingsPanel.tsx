import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useSettings, type CompanySettings } from '@/contexts/SettingsContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SettingsPanel() {
  const { isOpen, settings, closeSettings, saveSettings } = useSettings()

  if (!isOpen) return null

  return (
    <SettingsPanelContent
      key={JSON.stringify(settings)}
      settings={settings}
      closeSettings={closeSettings}
      saveSettings={saveSettings}
    />
  )
}

function SettingsPanelContent({
  settings,
  closeSettings,
  saveSettings,
}: {
  settings: CompanySettings
  closeSettings: () => void
  saveSettings: (next: CompanySettings) => void
}) {
  const [draft, setDraft] = useState<CompanySettings>(settings)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSettings()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeSettings])

  const isDirty =
    draft.companyName !== settings.companyName ||
    draft.baseCurrency !== settings.baseCurrency ||
    draft.fiscalYearEnd !== settings.fiscalYearEnd ||
    draft.defaultTaxRates !== settings.defaultTaxRates

  const handleClose = () => {
    if (isDirty && !window.confirm('Discard unsaved changes?')) return
    closeSettings()
  }

  const handleSave = () => {
    saveSettings(draft)
  }

  const update = <K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-panel-title"
      className="absolute inset-0 z-40 flex flex-col bg-card"
    >
      <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
        <div>
          <h1 id="settings-panel-title" className="text-xl font-semibold tracking-tight">
            Settings
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Company and accounting preferences
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close settings">
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company name</Label>
                <Input
                  id="company-name"
                  value={draft.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base-currency">Base currency</Label>
                <Input
                  id="base-currency"
                  value={draft.baseCurrency}
                  onChange={(e) => update('baseCurrency', e.target.value.toUpperCase())}
                  placeholder="CNY"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Accounting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fiscal-year-end">Fiscal year end</Label>
                <Input
                  id="fiscal-year-end"
                  value={draft.fiscalYearEnd}
                  onChange={(e) => update('fiscalYearEnd', e.target.value)}
                  placeholder="December 31"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-tax-rates">Default tax rates</Label>
                <Input
                  id="default-tax-rates"
                  value={draft.defaultTaxRates}
                  onChange={(e) => update('defaultTaxRates', e.target.value)}
                  placeholder="13% / 6%"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={!isDirty}>
              Save settings
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Module-specific settings (numbering, defaults, print) are in Sales → Sales Settings.
          </p>
        </div>
      </div>
    </div>
  )
}
