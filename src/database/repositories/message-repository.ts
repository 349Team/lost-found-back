import { Prisma } from '..';

class MessageRepository {
    public async createMessage(message: string, idA: number, idB: number, objectId: number) {
        return await Prisma.message.create({
            data: {
                message: message,
                userA_id: idA,
                userB_id: idB,
                createdAt: new Date(),
                object_id: objectId
            }
        })
    }

    public async findMessages(idA: number, idB: number, objectId: number) {
        return await Prisma.message.findMany({
            where: {
                AND: [{
                    object_id: objectId
                },{
                    userA: {
                        OR: [
                            {id: idA},
                            {id: idB}
                        ]
                    }
                },{
                    userB: {
                        OR: [
                            {id: idA},
                            {id: idB}
                        ]
                    }
                }]
            },
            orderBy: {
                createdAt: 'asc'
            }

        })
    }
}

export const messageRepository = new MessageRepository()