import { Outlet } from 'react-router-dom'
import { ModuleSubNav } from './ModuleSubNav'
import type { SubNavItem } from '@/config/navigation'

interface ModuleLayoutProps {
  items: SubNavItem[]
}

export function ModuleLayout({ items }: ModuleLayoutProps) {
  return (
    <>
      <ModuleSubNav items={items} />
      <Outlet />
    </>
  )
}
