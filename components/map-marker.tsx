"use client"

import { useState } from "react"
import { Marker, type MarkerProps, Popup } from "react-map-gl"
import { MapPin } from "lucide-react"

interface MapMarkerProps extends Omit<MarkerProps, "children"> {
  title: string
  description?: string
}

export function MapMarker({ title, description, ...props }: MapMarkerProps) {
  const [showPopup, setShowPopup] = useState(false)

  return (
    <>
      <Marker
        {...props}
        longitude={props.longitude}
        latitude={props.latitude}
      >
        <div className="cursor-pointer hover:scale-110 transition-transform">
          <MapPin className="h-8 w-8 text-red-500 drop-shadow-md" onClick={() => setShowPopup(!showPopup)} />
        </div>
      </Marker>

      {showPopup && (
        <Popup
          longitude={props.longitude}
          latitude={props.latitude}
          anchor="top"
          closeButton={true}
          closeOnClick={false}
          onClose={() => setShowPopup(false)}
          className="z-10"
        >
          <div className="p-2">
            <h3 className="font-bold">{title}</h3>
            {description && <p className="text-sm">{description}</p>}
          </div>
        </Popup>
      )}
    </>
  )
}
