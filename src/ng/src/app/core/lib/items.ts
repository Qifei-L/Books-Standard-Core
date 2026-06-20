import { accounts, items } from '../data/mock'
import type { Item, ItemType, LineItem } from '../types'

export function getItem(id: string | undefined): Item | undefined {
  if (!id) return undefined
  return items.find((i) => i.id === id)
}

export function getActiveItems(): Item[] {
  return items.filter((i) => i.isActive)
}

export function getAccountLabel(accountId: string): string {
  const account = accounts.find((a) => a.id === accountId)
  return account ? `${account.code} ${account.name}` : accountId
}

export function itemTypeLabel(type: ItemType): string {
  return type === 'Tracked' ? 'Tracked' : 'Service / untracked'
}

export function lineHasTrackedItem(line: Pick<LineItem, 'itemId'>): boolean {
  const item = getItem(line.itemId)
  return item?.itemType === 'Tracked'
}

export function invoiceHasTrackedItems(lines: Pick<LineItem, 'itemId'>[]): boolean {
  return lines.some(lineHasTrackedItem)
}
