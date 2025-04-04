"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Cerrar automáticamente la sidebar en dispositivos móviles
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    // Ejecutar al montar
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex h-screen flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} onToggle={function (): void {
          throw new Error("Function not implemented.")
        } } />
        <main
          className={`flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out ${sidebarOpen ? "md:ml-0" : "md:ml-0"}`}
        >
          <div className="container mx-auto p-4 md:p-6">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  )
}

