export type UserCreateRequestDTO = {
  ra: string
  password: string
  fullName: string
  email: string
  campus: string
}

export const isUserCreateRequestDTO = (obj: any): obj is UserCreateRequestDTO => !!(obj.ra && obj.password && obj.fullName && obj.email && obj.campus)

export class UserResponseDTO {

  constructor( id: number, ra: string, fullName: string, email: string, campus: string){
    this.id = id
    this.ra = ra
    this.fullName = fullName
    this.email = email
    this.campus = campus
  }
  
  id: number
  ra: string
  fullName: string
  email: string
  campus: string
}