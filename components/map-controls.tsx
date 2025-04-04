import { NavigationControl, FullscreenControl, ScaleControl, GeolocateControl } from "react-map-gl"

export function MapControls() {
  return (
    <>
      <div className="absolute top-4 right-4 z-10">
        <NavigationControl />
        <FullscreenControl />
        <GeolocateControl />
      </div>
      <div className="absolute bottom-4 right-4 z-10">
        <ScaleControl maxWidth={100} unit="metric" />
      </div>
    </>
  )
}
