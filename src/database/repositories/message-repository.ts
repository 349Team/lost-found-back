import { Prisma } from '..';

class MessageRepository {
    public async createMessage(message: string, idA: number, idB: number) {
        return await Prisma.message.create({
            data: {
                message: message,
                userAId: idA,
                userBId: idB,
                createdAt: new Date()
            }
        })
    }

    // public async listMessages(idA: number, idB: number) {
    //     var messages = await Prisma.message.findMany({
    //         where: {
    //             OR: [
    //                 {
    //                     userA_id: idA,
    //                     userB_id: idB
    //                 },
    //                 {
    //                     userA_id: idB,
    //                     userB_id: idA
    //                 }
    //             ]
    //         }
    //     })
    // }
}

export const messageRepository = new MessageRepository()