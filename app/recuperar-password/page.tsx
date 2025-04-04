"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogoIcon } from "@/components/logo-icon"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("")
  const [enviado, setEnviado] = useState(false)

  const handleRecuperar = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de recuperación
    setEnviado(true)
    toast({
      title: "Correo enviado",
      description: "Se ha enviado un enlace de recuperación a tu correo electrónico.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-blue-700 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <LogoIcon className="h-16 w-16 text-white" />
          <h1 className="text-3xl font-bold text-white">Cultivos del Sur</h1>
          <p className="text-white/80">Recupera el acceso a tu cuenta</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">Recuperar Contraseña</CardTitle>
            <CardDescription className="text-center">
              Ingresa tu correo electrónico para recibir un enlace de recuperación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRecuperar} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-[1.02]"
                disabled={enviado}
              >
                {enviado ? "Enlace Enviado" : "Enviar Enlace de Recuperación"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              <Link href="/login" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                Volver al inicio de sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}

