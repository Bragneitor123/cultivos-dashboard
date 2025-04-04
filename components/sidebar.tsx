"use client"

import type React from "react"
import { cn } from "@/lib/utils"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, BarChart3, Trash2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { theme } = useTheme()

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-all duration-300 ease-in-out md:relative",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >

      <ScrollArea className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          <SidebarItem href="/dashboard" icon={Home} label="Inicio" active={pathname === "/dashboard"} />
          <SidebarItem
            href="/dashboard/parcelas-eliminadas"
            icon={Trash2}
            label="Parcelas Eliminadas"
            active={pathname === "/dashboard/parcelas-eliminadas"}
          />
          <SidebarItem
            href="/dashboard/estadisticas"
            icon={BarChart3}
            label="Estadísticas"
            active={pathname === "/dashboard/estadisticas"}
          />
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/login">
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Link>
        </Button>
      </div>
    </aside>
  )
}

interface SidebarItemProps {
  href: string
  icon: React.ElementType
  label: string
  active?: boolean
}

function SidebarItem({ href, icon: Icon, label, active }: SidebarItemProps) {
  return (
    <Link href={href} passHref>
      <Button
        variant={active ? "default" : "ghost"}
        className={cn(
          "w-full justify-start transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/20",
          active && "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
        )}
      >
        <Icon className="mr-2 h-5 w-5" />
        {label}
      </Button>
    </Link>
  )
}

function LogOut(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}
