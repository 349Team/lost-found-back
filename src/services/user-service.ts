import { User, Person } from "@prisma/client";
import { SimpleResponse } from "../models/simple-response";
import { isUserCreateRequestDTO, UserCreateRequestDTO, UserResponseDTO } from '../models/user-dtos';
import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '../models/exception-http';
import { userRepository } from '../database/repositories/user-repository';
import { personRepository } from '../database/repositories/person-repository';

class UserService {

   /**
    * Creates a user with the attributes provided by dto.
    * @returns SimpleResponse on success.
    * @throws ExceptionHttp as BadRequestException, ConflictException ou Error.
    * @param dto object with the attributes needed to create a user (User + Person).
    */
   public async createUser(dto: UserCreateRequestDTO): Promise<UserResponseDTO> {

      let user: User | undefined
      let person: Person | undefined

      if (!isUserCreateRequestDTO(dto)) throw new BadRequestException('invalid arguments')

      var exists = !!await userRepository.findUserByRA(dto.ra)

      if (exists) throw new ConflictException('user already exists')

      user = await userRepository.createUser(dto.ra, dto.password)

      person = await personRepository.createPerson(user.id, dto.fullName, dto.email, dto.campus, null)

      return new UserResponseDTO(
         user.id,
         user.ra, 
         person.full_name, 
         person.email, 
         person.campus ?? '', 
      )
   }

   /**
    * Searches for a user by id.
    * @returns UserResponseDTO em caso de sucesso .
    * @returns ExceptionHttpResponse ( BadRequestException, NotFoundException, ConflictException ou Error ).
    * @param id id do usuário
    */
   public async findUserById(id: number): Promise<UserResponseDTO> {
      let user: User | undefined
      let person: Person | undefined

      if (!id) throw new BadRequestException('invalid arguments')

      user = await userRepository.findUser(id)

      if(!user) throw new NotFoundException('user not found')

      person = await personRepository.findPersonByUserId(user.id)

      if(!person) throw new ConflictException("user exists, but user's person doesn't")

      return new UserResponseDTO(
         user.id,
         user.ra, 
         person.full_name, 
         person.email, 
         person.campus ?? '', 
      )
   }

   /**
    * Delete user by email.
    * @returns SimpleResponse on sucess.
    * @returns ExceptionHttpResponse as BadRequestException, NotFoundException, ConflictException, InternalServerErrorException or Error.
    * @param email user email to be deleted.
    */
   public async deleteUserById(id: number): Promise< SimpleResponse > {
      var user: User | undefined
      var person: Person | undefined

      if (!id) throw new BadRequestException('invalid arguments')

      user = await userRepository.findUser(id)

      if(!user) throw new NotFoundException('user not found')

      person = await personRepository.findPersonByUserId(user.id)

      if(!person) throw new ConflictException("user exists, but user's person doesn't")

      if(!personRepository.deletePerson(person.id))
         throw new InternalServerErrorException("delete user's person")

      if(!userRepository.deleteUser(user.id))
         throw new InternalServerErrorException("delete user")

      return new SimpleResponse(`user with RA '${user.ra}' deleted successfully !`)
   }

}

export const userService = new UserService()