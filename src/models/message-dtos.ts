
export type MessageCreateRequestDTO = {
    message: string, 
    sender: number,
    recipient: number,
    object: number
}

export class MessageResponseDTO {
    constructor( id: number, sender: number, recipient: number, message: string){
        this.id = id
        this.sender = sender
        this.recipient = recipient
        this.message = message
    }

    id: number
    sender: number
    recipient: number
    message: string
}

export const isMessageRequestDTO = (obj: any): obj is MessageResponseDTO =>
    !!(obj.message) && !!(obj.sender) && !!(obj.recipient) && !!(obj.object)