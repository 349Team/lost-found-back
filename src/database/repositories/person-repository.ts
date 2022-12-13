import { Person } from "@prisma/client";
import { Prisma } from "..";

class PersonRepository {
   public async createPerson(userId: number, fullName: string, email: string, campus: string, image: any) {
      return await Prisma.person.create({
         data: {
            userId: userId,
            full_name: fullName,
            email: email,
            campus: campus,
            imageId: undefined,
            updatedAt: new Date(),
         }
      })
   }

   public async findPersonByUserId(id: number): Promise<Person | undefined> {
      return await Prisma.person.findFirst({
         where: {
            userId: id
         }
      }) ?? undefined
   }

   public async findPersonByEmail(email: string): Promise<Person | null> {
      return await Prisma.person.findFirst({
         where: {
            email: email
         }
      }) ?? null
   }

   public async deletePerson(id: number): Promise<Boolean> {
      try {
         await Prisma.person.delete({
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

export const personRepository = new PersonRepository()