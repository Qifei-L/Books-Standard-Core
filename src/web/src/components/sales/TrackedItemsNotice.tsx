import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface TrackedItemsNoticeProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApproveOnly: () => void
  onCreateDeliveryNote: () => void
  trackedCount: number
}

export function TrackedItemsNotice({
  open,
  onOpenChange,
  onApproveOnly,
  onCreateDeliveryNote,
  trackedCount,
}: TrackedItemsNoticeProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-600" />
            Tracked items on this invoice
          </DialogTitle>
          <DialogDescription>
            This invoice includes {trackedCount} tracked item
            {trackedCount === 1 ? '' : 's'}. No delivery note is linked — inventory and COGS
            will not be updated. Revenue and AR will still post from this invoice.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCreateDeliveryNote} className="sm:mr-auto">
            Create delivery note
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onApproveOnly}>Approve invoice only</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
