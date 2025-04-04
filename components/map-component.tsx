"use client"

import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import type { Parcela } from "@/lib/api"

interface MapComponentProps {
  ubicaciones: Parcela[]
  onPlotClick: (plot: Parcela) => void
}

export default function MapComponent({ ubicaciones, onPlotClick }: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [activePopup, setActivePopup] = useState<number | null>(null)
  const { theme, resolvedTheme } = useTheme()

  // Efecto para cargar el CSS de Mapbox
  useEffect(() => {
    // Verificar si el CSS ya está cargado
    const existingLink = document.querySelector('link[href*="mapbox-gl.css"]')
    if (!existingLink) {
      const linkElement = document.createElement("link")
      linkElement.rel = "stylesheet"
      linkElement.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
      document.head.appendChild(linkElement)
    }
  }, [])

  // Efecto para manejar el cambio de tema
  useEffect(() => {
    if (mapInstance) {
      // Ajustar el estilo del mapa según el tema
      const isDark = theme === "dark" || resolvedTheme === "dark"

      // Ajustar los colores de los popups y controles según el tema
      const mapContainer = mapContainerRef.current
      if (mapContainer) {
        if (isDark) {
          mapContainer.classList.add("dark-map-theme")
        } else {
          mapContainer.classList.remove("dark-map-theme")
        }
      }
    }
  }, [theme, resolvedTheme, mapInstance])

  // Cargar Mapbox GL JS dinámicamente en el cliente
  useEffect(() => {
    let map: any

    const initializeMap = async () => {
      // Verificar si hay ubicaciones
      if (!ubicaciones || ubicaciones.length === 0) {
        console.error("No hay ubicaciones para mostrar en el mapa")
        return
      }

      try {
        // Importar mapbox-gl dinámicamente
        const mapboxgl = (await import("mapbox-gl")).default

        // Obtener el token de Mapbox desde las variables de entorno
        const mapboxToken =
          process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
          "pk.eyJ1IjoiYnJhZ25laXRvcjEyMyIsImEiOiJjbThhbG9zYmIwN2gyMmpwcWRrdXdmdTA5In0.NBlIUFoCi6ximKm1_4Oq3A"

        // Configurar el token de acceso
        mapboxgl.accessToken = mapboxToken

        // Determinar si estamos en modo oscuro
        const isDark = theme === "dark" || resolvedTheme === "dark"

        // Crear el mapa
        map = new mapboxgl.Map({
          container: mapContainerRef.current!,
          style: "mapbox://styles/mapbox/standard-satellite",
          center: [ubicaciones[0].longitud || -70.6506, ubicaciones[0].latitud || -33.4378],
          zoom: 12,
        })

        // Añadir controles de navegación
        map.addControl(new mapboxgl.NavigationControl(), "top-right")
        map.addControl(new mapboxgl.FullscreenControl(), "top-right")
        map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          "top-right",
        )
        map.addControl(new mapboxgl.ScaleControl(), "bottom-right")

        // Esperar a que el mapa se cargue
        map.on("load", () => {
          setMapLoaded(true)
          setMapInstance(map)

          // Añadir marcadores
          ubicaciones.forEach((parcela) => {
            if (!parcela.longitud || !parcela.latitud) return

            // Crear elemento para el marcador
            const markerEl = document.createElement("div")
            markerEl.className = "custom-marker"
            markerEl.innerHTML = `
              <div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-white">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            `

            // Crear popup con información detallada de la parcela
            const popup = new mapboxgl.Popup({ offset: 25, className: isDark ? "dark-theme-popup" : "" }).setHTML(`
              <div class="p-3">
                <h3 class="font-bold text-lg">${parcela.nombre}</h3>
                <div class="mt-2 space-y-1 text-sm">
                  <p><strong>Ubicación:</strong> ${parcela.ubicacion}</p>
                  <p><strong>Responsable:</strong> ${parcela.responsable}</p>
                  <p><strong>Cultivo:</strong> ${parcela.tipoCultivo}</p>
                  <p><strong>Último riego:</strong> ${new Date(parcela.ultimoRiego).toLocaleString()}</p>
                  <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p><strong>Temperatura:</strong> ${parcela.sensor.temperatura}°C</p>
                    <p><strong>Humedad:</strong> ${parcela.sensor.humedad}%</p>
                  </div>
                </div>
              </div>
            `)

            // Crear marcador
            const marker = new mapboxgl.Marker(markerEl)
              .setLngLat([parcela.longitud, parcela.latitud])
              .setPopup(popup)
              .addTo(map)

            // Añadir evento de clic
            markerEl.addEventListener("click", () => {
              setActivePopup(parcela.id)
              onPlotClick(parcela)
            })
          })
        })
      } catch (error) {
        console.error("Error al inicializar el mapa:", error)
        setMapLoaded(false)
      }
    }

    if (mapContainerRef.current) {
      initializeMap()
    }

    return () => {
      if (mapInstance) {
        mapInstance.remove()
      }
    }
  }, [ubicaciones, theme, resolvedTheme])

  return (
    <div
      ref={mapContainerRef}
      className={`h-full w-full ${theme === "dark" ? "dark-map-container" : ""}`}
      style={{ minHeight: "400px" }}
    >
      {!mapLoaded && (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      )}
    </div>
  )
}
