import { messageRepository } from './../database/repositories/message-repository';
import { MessageCreateRequestDTO, isMessageRequestDTO, MessageResponseDTO } from './../models/message-dtos';
import { BadRequestException, InternalServerErrorException, NotFoundException } from './../models/exception-http';
import { objectRepository } from '../database/repositories/object-repository';
import { userRepository } from '../database/repositories/user-repository';
import { Message, Person, User } from '@prisma/client';
import { response } from 'express';
import { personRepository } from '../database/repositories/person-repository';

class MessageService {
    
    // cria nova mensagem
    public async createMessage(dto: MessageCreateRequestDTO): Promise<MessageResponseDTO> {
        if (!isMessageRequestDTO(dto)) throw new BadRequestException('invalid arguments')

        var object = await objectRepository.findObject(dto.object);
        if(!object) throw new NotFoundException(`object with id ${dto.object} not found`);

        var sender = await userRepository.findUser(dto.sender);
        if(!sender) throw new NotFoundException(`user sender with id ${dto.sender} not found`);

        var recipient = await userRepository.findUser(dto.recipient);
        if(!recipient) throw new NotFoundException(`user recipient with id ${dto.recipient} not found`);

        var message = await messageRepository.createMessage(dto.message, dto.sender, dto.recipient, dto.object)

        return new MessageResponseDTO(message.id, message.userA_id, message.userB_id, message.message);
    }

    // lista as mensagens entre os usuários A e B
    public async findMessages(objectId: number, requesterId: number) {
        if(!requesterId || !objectId) throw new NotFoundException('missing user')

        var object = await objectRepository.findObject(objectId);

        if(!object) throw new NotFoundException(`object with id ${objectId} not found`);

        var requester = await userRepository.findUser(requesterId);

        if(!requester) throw new NotFoundException(`object requester with id ${requester} not found`);

        var objectRegisterId: number | null = object.type === 'FOUND' ? object.discovererId : object.ownerId;

        if(!objectRegisterId) throw new InternalServerErrorException(`error on get register of object`);

        var messages = await messageRepository.findMessages(requesterId, objectRegisterId, objectId);

        var response = messages.map((message: Message) => {
            return {
                mensagem: message.message,
                sender: message.userA_id,
                timestamp: message.createdAt.valueOf()
            }
        })

        // criar lógica para criar JSON bonitinho
        return { mensagens: response}
    }

    public async getInfo(objectId: number) {
        var object = await objectRepository.findObject(objectId);

        if(!object) throw new NotFoundException(`object with id ${objectId} not found`);

        var messages = object.messages;

        var objectRegisterId: number | null = object.type === 'FOUND' ? object.discovererId : object.ownerId;

        if(!objectRegisterId) throw new InternalServerErrorException(`error on get register of object`);

        var usersThatSendAMessageToRegisterOfObject = messages.map((message: Message) => {
            return message.userA_id == objectRegisterId ? message.userB_id : message.userA_id
        })

        var onlyUniqueIds: number[] = []

        for (let userId of usersThatSendAMessageToRegisterOfObject)
            if(!onlyUniqueIds.includes(userId)) onlyUniqueIds.push(userId)

        var uniquePersons: (Person | null)[] = await Promise.all(onlyUniqueIds.map(async (userId: number): Promise<Person | null> => {
            return await personRepository.findPersonByUserId(userId) ?? null
        }))

        var uniquePersonsWithoutNull: Person[] = (uniquePersons.filter((user: Person | null) => !!user)) as Person[]

        var response = uniquePersonsWithoutNull.map((person: Person) => {
            return {
                id: person.userId,
                nome: person.full_name
            }
        })

        return { itensChat: response}
    }
}

export const messageService = new MessageService()