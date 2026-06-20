import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { TemplatePreview } from '@/components/sales/TemplatePreview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  formatTemplateNumber,
  salesDocTypeLabels,
  type DocumentTemplate,
  useDocumentTemplates,
} from '@/contexts/DocumentTemplateContext'
import { useSettings } from '@/contexts/SettingsContext'

export function TemplateEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTemplate, updateTemplate } = useDocumentTemplates()
  const { settings: company } = useSettings()
  const template = id ? getTemplate(id) : undefined
  const [draft, setDraft] = useState<DocumentTemplate | null>(template ?? null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (template) setDraft({ ...template })
  }, [template])

  if (!id || !template || !draft) {
    return <Navigate to="/sales/templates" replace />
  }

  const isDirty = JSON.stringify(draft) !== JSON.stringify(template)

  const save = () => {
    updateTemplate(id, draft)
    setSaved(true)
  }

  const parseIntField = (raw: string, fallback: number, min = 0) => {
    const n = parseInt(raw, 10)
    return Number.isFinite(n) && n >= min ? n : fallback
  }

  const companyInfo = {
    companyName: company.companyName,
    baseCurrency: company.baseCurrency,
    fiscalYearEnd: company.fiscalYearEnd,
  }

  const preview = (
    <TemplatePreview
      template={draft}
      company={companyInfo}
      compact
      unsaved={isDirty}
    />
  )

  return (
    <div>
      <Link to="/sales/settings" className="mb-4 inline-block text-sm text-link">
        ← Sales Settings
      </Link>
      <PageHeader
        title={`Edit template — ${draft.name}`}
        description={`${salesDocTypeLabels[draft.docType]} · numbering, defaults, and print`}
      >
        <Button variant="outline" render={<Link to={`/sales/templates/${id}/print`} />}>
          Full screen print
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_min(100%,22rem)] xl:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="min-w-0 space-y-6">
          <Tabs defaultValue="numbering" className="gap-4">
            <TabsList className="h-9">
              <TabsTrigger value="numbering">Numbering</TabsTrigger>
              <TabsTrigger value="defaults">Defaults</TabsTrigger>
              <TabsTrigger value="print">Print</TabsTrigger>
            </TabsList>

            <TabsContent value="numbering">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Numbering</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tpl-name">Template name</Label>
                    <Input
                      id="tpl-name"
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prefix">Prefix</Label>
                    <Input
                      id="prefix"
                      value={draft.numbering.prefix}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          numbering: { ...draft.numbering, prefix: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="next-seq">Next sequence</Label>
                    <Input
                      id="next-seq"
                      type="number"
                      min={1}
                      value={draft.numbering.nextSequence}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          numbering: {
                            ...draft.numbering,
                            nextSequence: parseIntField(
                              e.target.value,
                              draft.numbering.nextSequence,
                              1,
                            ),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pattern">Number pattern</Label>
                    <Input
                      id="pattern"
                      value={draft.numbering.pattern}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          numbering: { ...draft.numbering, pattern: e.target.value },
                        })
                      }
                      placeholder="{prefix}{year}-{seq:3}"
                    />
                  </div>
                  <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground">
                    Next number:{' '}
                    <span className="font-mono text-foreground">{formatTemplateNumber(draft)}</span>
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="defaults">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Defaults</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(draft.docType === 'Invoice' || draft.docType === 'SalesOrder') && (
                    <div className="space-y-2">
                      <Label htmlFor="payment-terms">Default payment terms (days)</Label>
                      <Input
                        id="payment-terms"
                        type="number"
                        min={0}
                        value={draft.defaults.paymentTermsDays ?? ''}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            defaults: {
                              ...draft.defaults,
                              paymentTermsDays: parseIntField(e.target.value, 0),
                            },
                          })
                        }
                      />
                    </div>
                  )}
                  {draft.docType === 'Quote' && (
                    <div className="space-y-2">
                      <Label htmlFor="quote-validity">Default quote validity (days)</Label>
                      <Input
                        id="quote-validity"
                        type="number"
                        min={1}
                        value={draft.defaults.quoteValidityDays ?? ''}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            defaults: {
                              ...draft.defaults,
                              quoteValidityDays: Math.max(
                                1,
                                parseIntField(
                                  e.target.value,
                                  draft.defaults.quoteValidityDays ?? 30,
                                  1,
                                ),
                              ),
                            },
                          })
                        }
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Default tax rate (%)</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      min={0}
                      value={draft.defaults.taxRatePercent ?? ''}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          defaults: {
                            ...draft.defaults,
                            taxRatePercent: parseIntField(e.target.value, 0),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terms">Terms & conditions</Label>
                    <Textarea
                      id="terms"
                      rows={4}
                      value={draft.defaults.termsAndConditions ?? ''}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          defaults: { ...draft.defaults, termsAndConditions: e.target.value },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="print">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Print layout</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={draft.print.showLogo}
                      onCheckedChange={(checked) =>
                        setDraft({
                          ...draft,
                          print: { ...draft.print, showLogo: checked === true },
                        })
                      }
                    />
                    Show company logo on printout
                  </label>
                  <div className="space-y-2">
                    <Label htmlFor="header-title">Document title</Label>
                    <Input
                      id="header-title"
                      value={draft.print.headerTitle}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          print: { ...draft.print, headerTitle: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="footer-notes">Footer notes</Label>
                    <Textarea
                      id="footer-notes"
                      rows={3}
                      value={draft.print.footerNotes}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          print: { ...draft.print, footerNotes: e.target.value },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="lg:hidden">{preview}</div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={save} disabled={!isDirty}>
              Save template
            </Button>
            <Button variant="outline" onClick={() => navigate('/sales/templates?type=' + draft.docType)}>
              Back to list
            </Button>
            {saved && !isDirty && <span className="text-sm text-success">Saved.</span>}
          </div>
        </div>

        <aside className="hidden lg:sticky lg:top-6 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          {preview}
        </aside>
      </div>
    </div>
  )
}
