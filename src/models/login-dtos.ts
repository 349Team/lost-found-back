export type LoginRequestDTO = {
  ra: string,
  password: string
}

export const isLoginRequestDto = (obj: any): obj is LoginRequestDTO => !!(obj.ra && obj.password)

export class LoginResponseDTO {
  constructor(id: number, token: string){
    this.id = id
    this.token = token
  }

  id: number
  token: string
}