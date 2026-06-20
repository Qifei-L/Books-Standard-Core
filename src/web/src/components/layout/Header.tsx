import { Bell, HelpCircle, LogOut, Search, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { companyName } from '@/data/mock'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">{companyName}</span>
        <div className="relative hidden md:block">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索..." className="h-8 w-64 pl-8" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="通知">
          <Bell className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="帮助">
          <HelpCircle className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="size-4" />
                <span className="hidden sm:inline">{user ?? '用户'}</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={logout}>
              <LogOut className="size-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
