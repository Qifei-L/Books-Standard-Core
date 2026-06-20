import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Copy, Pencil, Printer, Star, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  formatTemplateNumber,
  salesDocTypeLabels,
  salesDocTypes,
  type SalesDocType,
  useDocumentTemplates,
} from '@/contexts/DocumentTemplateContext'
import { useSalesSettings } from '@/contexts/SalesSettingsContext'

function isDocTypeEnabled(type: SalesDocType, settings: ReturnType<typeof useSalesSettings>['settings']) {
  if (type === 'SalesOrder') return settings.enableSalesOrders
  if (type === 'CreditNote') return settings.enableCreditNotes
  return true
}

function TemplateList({ docType }: { docType: SalesDocType }) {
  const navigate = useNavigate()
  const { settings } = useSalesSettings()
  const {
    getTemplatesByType,
    createTemplate,
    deleteTemplate,
    setDefaultTemplate,
    duplicateTemplate,
  } = useDocumentTemplates()

  const items = getTemplatesByType(docType)
  const moduleEnabled = isDocTypeEnabled(docType, settings)

  const handleNew = () => {
    const sample = items[0]
    const id = createTemplate({
      docType,
      name: `New ${salesDocTypeLabels[docType]}`,
      numbering: {
        prefix: sample?.numbering.prefix ?? '',
        nextSequence: 1,
        pattern: sample?.numbering.pattern ?? '{prefix}{year}-{seq:3}',
      },
      defaults: { ...sample?.defaults },
      print: {
        showLogo: true,
        headerTitle: `New ${salesDocTypeLabels[docType]}`,
        footerNotes: '',
      },
    })
    navigate(`/sales/templates/${id}/edit`)
  }

  return (
    <div className="space-y-4">
      {!moduleEnabled && (
        <p className="text-sm text-muted-foreground">
          This document type is disabled in{' '}
          <Link to="/sales/settings" className="text-link">
            Sales Settings
          </Link>
          . Templates remain available for when you re-enable the module.
        </p>
      )}

      <div className="flex justify-end">
        <Button onClick={handleNew}>+ New template</Button>
      </div>

      <div className="space-y-3">
        {items.map((template) => (
          <Card key={template.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">{template.name}</span>
                  {template.isDefault && (
                    <Badge variant="secondary" className="gap-1 border-transparent bg-primary-soft text-primary">
                      <Star className="size-3 fill-current" />
                      Default
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Next number:{' '}
                  <span className="font-mono text-foreground">{formatTemplateNumber(template)}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {!template.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => setDefaultTemplate(template.id)}>
                    Set default
                  </Button>
                )}
                <Button variant="outline" size="sm" render={<Link to={`/sales/templates/${template.id}/edit`} />}>
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const id = duplicateTemplate(template.id)
                    if (id) navigate(`/sales/templates/${id}/edit`)
                  }}
                >
                  <Copy className="size-3.5" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm" render={<Link to={`/sales/templates/${template.id}/print`} />}>
                  <Printer className="size-3.5" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={items.length <= 1}
                  onClick={() => {
                    if (window.confirm(`Delete template "${template.name}"?`)) {
                      deleteTemplate(template.id)
                    }
                  }}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function TemplatesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeType = salesDocTypes.includes(searchParams.get('type') as SalesDocType)
    ? (searchParams.get('type') as SalesDocType)
    : 'Quote'

  return (
    <div>
      <Link to="/sales/settings" className="mb-4 inline-block text-sm text-link">
        ← Sales Settings
      </Link>
      <PageHeader
        title="Document Templates"
        description="Numbering, defaults, and print layout per document type — one default template each"
      />

      <Tabs
        value={activeType}
        onValueChange={(v) => setSearchParams({ type: v })}
        className="gap-4"
      >
        <TabsList className="h-9 flex-wrap">
          {salesDocTypes.map((type) => (
            <TabsTrigger key={type} value={type}>
              {salesDocTypeLabels[type]}
            </TabsTrigger>
          ))}
        </TabsList>
        {salesDocTypes.map((type) => (
          <TabsContent key={type} value={type}>
            <TemplateList docType={type} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
