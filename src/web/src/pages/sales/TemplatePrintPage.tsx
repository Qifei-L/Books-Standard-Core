import { Link, Navigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { TemplatePreview } from '@/components/sales/TemplatePreview'
import { useDocumentTemplates } from '@/contexts/DocumentTemplateContext'
import { useSettings } from '@/contexts/SettingsContext'

export function TemplatePrintPage() {
  const { id } = useParams()
  const { getTemplate } = useDocumentTemplates()
  const { settings: company } = useSettings()
  const template = id ? getTemplate(id) : undefined

  if (!id || !template) {
    return <Navigate to="/sales/templates" replace />
  }

  return (
    <div>
      <Link to="/sales/settings" className="mb-4 inline-block text-sm text-link">
        ← Sales Settings
      </Link>
      <PageHeader title="Print preview" description={`Mock preview for "${template.name}"`}>
        <Button variant="outline" onClick={() => window.print()}>
          Print
        </Button>
        <Button variant="outline" render={<Link to={`/sales/templates/${id}/edit`} />}>
          Edit template
        </Button>
      </PageHeader>

      <div className="mx-auto max-w-3xl">
        <TemplatePreview
          template={template}
          company={{
            companyName: company.companyName,
            baseCurrency: company.baseCurrency,
            fiscalYearEnd: company.fiscalYearEnd,
          }}
          showLabel={false}
        />
      </div>
    </div>
  )
}
