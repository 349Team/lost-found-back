
export type MessageCreateRequestDTO = {
    message: string, 
}

export class MessageResponseDTO {
    constructor( id: number, userA_id: number, userB_id: number, message: string){
        this.id = id
        this.userA_id = userA_id
        this.userB_id = userB_id
        this.message = message
    }

    id: number
    userA_id: number
    userB_id: number
    message: string
}

export const isMessageRequestDTO = (mes: any): mes is MessageResponseDTO =>
    !!(mes.message)