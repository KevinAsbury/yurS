import { Photo } from './photo'

export interface Member {
  id: number
  userName: string
  photoUrl: string
  age: number
  displayAge: boolean
  alias: string
  created: Date
  lastActive: Date
  orientation: string
  gender: string
  pronouns: string
  relationshipStatus: string
  introduction: string
  lookingFor: string
  interests: string
  city: string
  country: string
  photos: Photo[]
}
