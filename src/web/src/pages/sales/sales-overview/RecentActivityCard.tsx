import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const activities = [
  {
    id: 'a1',
    text: 'INV-2025-001 sent to Acme 有限公司',
    time: '2 hours ago',
  },
  {
    id: 'a2',
    text: 'Payment received from Acme 有限公司',
    time: 'Yesterday',
  },
  {
    id: 'a3',
    text: 'QT-2025-004 accepted by Acme 有限公司',
    time: 'Jun 18',
  },
  {
    id: 'a4',
    text: 'Credit note placeholder for Gamma 咨询',
    time: 'Jun 15',
  },
]

export function RecentActivityCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Sales Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-0">
          {activities.map((item, i) => (
            <li
              key={item.id}
              className={cn(
                'relative flex gap-3 pb-4 pl-4',
                i < activities.length - 1 && 'border-l border-border',
              )}
            >
              <span className="absolute top-1.5 left-0 size-2 -translate-x-1/2 rounded-full bg-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">{item.text}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
