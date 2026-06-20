interface SalesListSummaryProps {
  parts: string[]
}

export function SalesListSummary({ parts }: SalesListSummaryProps) {
  if (parts.length === 0) return null
  return (
    <div className="border-b border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
      {parts.join(' · ')}
    </div>
  )
}
