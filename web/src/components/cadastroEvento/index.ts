export type RegisterEventoModel = {
  name: string
  placeId: number
  date: string
  duration: string
  fullDay: boolean
}

export type PlaceState = {
  id: number
  name: string
  latitude: number
  longitude: number
  favouriteCount: number
}
