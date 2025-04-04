"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Footer() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <footer className={`border-t py-6 md:py-0 ${mounted && theme === "dark" ? "border-gray-800" : ""}`}>
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 MarketinIA - Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}

