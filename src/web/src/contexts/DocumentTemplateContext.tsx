import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type SalesDocType = 'Quote' | 'SalesOrder' | 'Invoice' | 'CreditNote'

export interface TemplateNumbering {
  prefix: string
  nextSequence: number
  pattern: string
}

export interface TemplateDefaults {
  paymentTermsDays?: number
  taxRatePercent?: number
  quoteValidityDays?: number
  termsAndConditions?: string
}

export interface TemplatePrint {
  showLogo: boolean
  headerTitle: string
  footerNotes: string
}

export interface DocumentTemplate {
  id: string
  docType: SalesDocType
  name: string
  isDefault: boolean
  numbering: TemplateNumbering
  defaults: TemplateDefaults
  print: TemplatePrint
}

const STORAGE_KEY = 'bsc_document_templates'

export const salesDocTypeLabels: Record<SalesDocType, string> = {
  Quote: 'Quote',
  SalesOrder: 'Sales Order',
  Invoice: 'Invoice',
  CreditNote: 'Credit Note',
}

export const salesDocTypes: SalesDocType[] = ['Quote', 'SalesOrder', 'Invoice', 'CreditNote']

function buildTemplate(
  docType: SalesDocType,
  name: string,
  isDefault: boolean,
  numbering: Partial<TemplateNumbering>,
  defaults: TemplateDefaults = {},
  print?: Partial<TemplatePrint>,
): DocumentTemplate {
  return {
    id: crypto.randomUUID(),
    docType,
    name,
    isDefault,
    numbering: {
      prefix: numbering.prefix ?? '',
      nextSequence: numbering.nextSequence ?? 1,
      pattern: numbering.pattern ?? '{prefix}{year}-{seq:3}',
    },
    defaults,
    print: {
      showLogo: print?.showLogo ?? true,
      headerTitle: print?.headerTitle ?? name,
      footerNotes: print?.footerNotes ?? '',
    },
  }
}

export const defaultDocumentTemplates: DocumentTemplate[] = [
  buildTemplate('Quote', 'Standard Quote', true, { prefix: 'QT-', nextSequence: 8 }, {
    quoteValidityDays: 30,
    taxRatePercent: 13,
    termsAndConditions: 'Valid for 30 days from issue date.',
  }),
  buildTemplate('Quote', 'Export Quote', false, { prefix: 'QT-EX-', nextSequence: 2 }, {
    quoteValidityDays: 45,
    taxRatePercent: 0,
    termsAndConditions: 'Export — prices exclude local VAT unless stated.',
  }),
  buildTemplate('SalesOrder', 'Standard Sales Order', true, { prefix: 'SO-', nextSequence: 4 }, {
    paymentTermsDays: 30,
    taxRatePercent: 13,
  }),
  buildTemplate('Invoice', 'Standard Invoice', true, { prefix: 'INV-', nextSequence: 13 }, {
    paymentTermsDays: 30,
    taxRatePercent: 13,
    termsAndConditions: 'Payment due within 30 days.',
  }),
  buildTemplate('CreditNote', 'Standard Credit Note', true, { prefix: 'CN-', nextSequence: 1 }, {
    taxRatePercent: 13,
  }),
]

function loadTemplates(): DocumentTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultDocumentTemplates
    return JSON.parse(raw) as DocumentTemplate[]
  } catch {
    return defaultDocumentTemplates
  }
}

export function formatTemplateNumber(template: DocumentTemplate, year = new Date().getFullYear()) {
  const seq = String(template.numbering.nextSequence).padStart(3, '0')
  return template.numbering.pattern
    .replace('{prefix}', template.numbering.prefix)
    .replace('{year}', String(year))
    .replace('{seq:3}', seq)
}

interface DocumentTemplateContextValue {
  templates: DocumentTemplate[]
  getTemplatesByType: (docType: SalesDocType) => DocumentTemplate[]
  getDefaultTemplate: (docType: SalesDocType) => DocumentTemplate | undefined
  getTemplate: (id: string) => DocumentTemplate | undefined
  createTemplate: (input: Omit<DocumentTemplate, 'id' | 'isDefault'> & { isDefault?: boolean }) => string
  updateTemplate: (id: string, patch: Partial<Omit<DocumentTemplate, 'id' | 'docType'>>) => void
  deleteTemplate: (id: string) => boolean
  setDefaultTemplate: (id: string) => void
  duplicateTemplate: (id: string) => string
}

const DocumentTemplateContext = createContext<DocumentTemplateContextValue | null>(null)

function persist(templates: DocumentTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
}

export function DocumentTemplateProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(loadTemplates)

  const getTemplatesByType = useCallback(
    (docType: SalesDocType) =>
      templates
        .filter((t) => t.docType === docType)
        .sort((a, b) => {
          if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1
          return a.name.localeCompare(b.name)
        }),
    [templates],
  )

  const getDefaultTemplate = useCallback(
    (docType: SalesDocType) => templates.find((t) => t.docType === docType && t.isDefault),
    [templates],
  )

  const getTemplate = useCallback((id: string) => templates.find((t) => t.id === id), [templates])

  const createTemplateFn = useCallback(
    (input: Omit<DocumentTemplate, 'id' | 'isDefault'> & { isDefault?: boolean }) => {
      const newId = crypto.randomUUID()
      setTemplates((prev) => {
        const makeDefault = input.isDefault ?? prev.filter((t) => t.docType === input.docType).length === 0
        const next = [
          ...prev.map((t) =>
            makeDefault && t.docType === input.docType ? { ...t, isDefault: false } : t,
          ),
          { ...input, id: newId, isDefault: makeDefault },
        ]
        persist(next)
        return next
      })
      return newId
    },
    [],
  )

  const updateTemplate = useCallback((id: string, patch: Partial<Omit<DocumentTemplate, 'id' | 'docType'>>) => {
    setTemplates((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
      persist(next)
      return next
    })
  }, [])

  const deleteTemplate = useCallback((id: string) => {
    let deleted = false
    setTemplates((prev) => {
      const target = prev.find((t) => t.id === id)
      if (!target) return prev
      const siblings = prev.filter((t) => t.docType === target.docType)
      if (siblings.length <= 1) return prev

      deleted = true
      let next = prev.filter((t) => t.id !== id)
      if (target.isDefault) {
        const replacement = next.find((t) => t.docType === target.docType)
        if (replacement) {
          next = next.map((t) => (t.id === replacement.id ? { ...t, isDefault: true } : t))
        }
      }
      persist(next)
      return next
    })
    return deleted
  }, [])

  const setDefaultTemplate = useCallback((id: string) => {
    setTemplates((prev) => {
      const target = prev.find((t) => t.id === id)
      if (!target) return prev
      const next = prev.map((t) => ({
        ...t,
        isDefault: t.docType === target.docType ? t.id === id : t.isDefault,
      }))
      persist(next)
      return next
    })
  }, [])

  const duplicateTemplate = useCallback(
    (id: string) => {
      const source = templates.find((t) => t.id === id)
      if (!source) return ''
      return createTemplateFn({
        docType: source.docType,
        name: `${source.name} (Copy)`,
        isDefault: false,
        numbering: { ...source.numbering, nextSequence: 1 },
        defaults: { ...source.defaults },
        print: { ...source.print, headerTitle: `${source.print.headerTitle} (Copy)` },
      })
    },
    [templates, createTemplateFn],
  )

  const value = useMemo(
    () => ({
      templates,
      getTemplatesByType,
      getDefaultTemplate,
      getTemplate,
      createTemplate: createTemplateFn,
      updateTemplate,
      deleteTemplate,
      setDefaultTemplate,
      duplicateTemplate,
    }),
    [
      templates,
      getTemplatesByType,
      getDefaultTemplate,
      getTemplate,
      createTemplateFn,
      updateTemplate,
      deleteTemplate,
      setDefaultTemplate,
      duplicateTemplate,
    ],
  )

  return (
    <DocumentTemplateContext.Provider value={value}>{children}</DocumentTemplateContext.Provider>
  )
}

export function useDocumentTemplates() {
  const ctx = useContext(DocumentTemplateContext)
  if (!ctx) throw new Error('useDocumentTemplates must be used within DocumentTemplateProvider')
  return ctx
}
