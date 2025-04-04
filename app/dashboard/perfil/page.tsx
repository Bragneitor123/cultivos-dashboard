"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Lock, Moon, Sun, Upload } from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function PerfilPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [nombre, setNombre] = useState("Roberto Vega")
  const [email, setEmail] = useState("roberto.vega@ejemplo.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Perfil actualizado",
      description: "La información de tu perfil ha sido actualizada correctamente.",
    })
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido actualizada correctamente.",
    })

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Por favor selecciona un archivo de imagen válido.",
          variant: "destructive",
        })
        return
      }

      // Crear URL para la imagen
      const imageUrl = URL.createObjectURL(file)
      setAvatarUrl(imageUrl)

      toast({
        title: "Foto actualizada",
        description: "Tu foto de perfil ha sido actualizada correctamente.",
      })
    }
  }

  if (!mounted) {
    return null // Evitar renderizado durante la hidratación
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mi Perfil</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-4">
            <CardTitle className="text-lg">Información de Perfil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            <Avatar className="h-32 w-32 cursor-pointer" onClick={handleAvatarClick}>
              <AvatarImage src={avatarUrl} alt={nombre} />
              <AvatarFallback className="bg-blue-600 text-white text-2xl">
                {nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            <div className="text-center">
              <h3 className="text-xl font-semibold">{nombre}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
            </div>
            <Button variant="outline" className="w-full" onClick={handleAvatarClick}>
              <Upload className="mr-2 h-4 w-4" />
              Cambiar foto
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-4">
            <CardTitle className="text-lg">Configuración de Cuenta</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <User className="mr-2 h-4 w-4" />
                  Personal
                </TabsTrigger>
                <TabsTrigger
                  value="seguridad"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Seguridad
                </TabsTrigger>
                <TabsTrigger
                  value="apariencia"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Apariencia
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <form onSubmit={handleInfoSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
                  >
                    Guardar Cambios
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="seguridad">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña actual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
                  >
                    Cambiar Contraseña
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="apariencia">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Modo oscuro</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cambia entre el tema claro y oscuro</p>
                    </div>
                    <Switch
                      id="darkMode"
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => {
                        setTheme(checked ? "dark" : "light")
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <Button
                      variant="outline"
                      className={`flex flex-col items-center justify-center gap-2 p-4 h-auto ${theme === "light" ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : ""}`}
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-6 w-6" />
                      <span>Claro</span>
                    </Button>
                    <Button
                      variant="outline"
                      className={`flex flex-col items-center justify-center gap-2 p-4 h-auto ${theme === "dark" ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : ""}`}
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-6 w-6" />
                      <span>Oscuro</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}

