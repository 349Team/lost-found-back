import { messageRepository } from './../database/repositories/message-repository';
import { MessageCreateRequestDTO, isMessageRequestDTO, MessageResponseDTO } from './../models/message-dtos';
import { BadRequestException, NotFoundException } from './../models/exception-http';

class MessageService {
    
    // cria nova mensagem
    public async createMessage(dto: MessageCreateRequestDTO) {
        if (!isMessageRequestDTO(dto)) throw new BadRequestException('invalid arguments')

        var message = await messageRepository.createMessage(
            dto.message,
            dto.userA_id,
            dto.userB_id,
        )

        // return new MessageResponseDTO(
        //     message.id,
        //     message.userA_id,
        //     message.userB_id,
        //     message.message
        // )
        return message
    }

    // lista as mensagens entre os usuários A e B
    // public async findMessages(idA: number, idB: number) {
    //     if(!idA || !idB) throw new NotFoundException('missing user')

    //     var messages = await messageRepository.listMessages(idA, idB)
    //     // criar lógica para criar JSON bonitinho
    //     return messages
    // }
}

export const messageService = new MessageService()