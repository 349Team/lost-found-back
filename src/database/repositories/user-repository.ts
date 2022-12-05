import { Prisma } from '..'
import { User, Person } from "@prisma/client";
import { personRepository } from './person-repository';


class UserRepository {
   public async createUser(ra: string, password: string): Promise<User> {
      return await Prisma.user.create({
         data: {
            ra,
            password,
            updatedAt: new Date()
         }
      })
   }

   public async findUserByRA(ra: string): Promise<User | undefined> {
      return await Prisma.user.findFirst({
         where: {
            ra: ra
         }
      }) ?? undefined
   }

   public async findUser(id: number): Promise <User | undefined> {
      return await Prisma.user.findFirst({
         where: {
            id: id
         }
      }) ?? undefined
   }

   public async deleteUser(id: number): Promise<Boolean> {
      try {
         await Prisma.user.delete({
            where: {
               id: id
            }
         })

         return true
      } catch (error) {
         return false
      }
   }
}

export const userRepository = new UserRepository()