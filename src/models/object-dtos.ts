import { ObjectStatus, ObjectType, Image } from "@prisma/client"
import { env } from 'process'
import { stringify } from "uuid"
import { TagResumeDTO } from "./tag-dtos"

export type ObjectCreateRequestDTO = {
   title: string,
   description: string,
   location: string,
   type: ObjectType,
   image: any,
   ownerId?: number,
   tags: number[],
   discovererId?: number
}

export type ObjectResponseDTO = {
   id: number
   title: string
   description: string
   location: string
   type: ObjectType
   tags: TagResumeDTO[]
   images: string[]
   image?: string
   owner: number | null
   discoverer: number | null
   status: ObjectStatus
}

export type ObjectResumeResponseDTO = {
   id: number
   title: string
}

export const isObjectResponseDTO = (obj: any): obj is ObjectResponseDTO => 
   !!(obj.title && obj.description && obj.location && obj.type && obj.images && (obj.owner || obj.discoverer))

export const isObjectCreateRequestDTO = (obj: any): obj is ObjectCreateRequestDTO =>
   !!(obj.title && obj.description && obj.location && obj.type && obj.tags)

export const imageToLink = (image: Image): string => {
   return `${env.IMAGES_HOST}/images/image/${image.id}`
}

export const objectToObjectResponseDTO = (obj: any): ObjectResponseDTO => {
   var images: string[] = obj?.images?.map(imageToLink) ?? []

   var tags: TagResumeDTO[] = obj?.tags?.map((tag: any) => {
      return {
         id: tag.id,
         title: tag.title
      }
   }) ?? []

   return {
      id: obj.id ?? -1,
      title: obj.title ?? '',
      description: obj.description ?? '',
      owner: obj.ownerId,
      discoverer: obj.discovererId,
      location: obj.location ?? '',
      type: obj.type,
      status: obj.status,
      images: images,
      image: images?.[0] ?? '',
      tags: tags
   }
}

export const objectToObjectResumeResponseDTO = (obj: any): ObjectResumeResponseDTO => {
   return {
      id: obj.id ?? -1,
      title: obj.title ?? ''
   }
}



export enum ObjectStatusV2 {
   LOST = "LOST",
   FOUND = "FOUND",
   FINISHED = "FINISHED",
}

export type ObjectResponseDTO_V2 = {
   id: number
   title: string
   description: string
   location: string
   type: ObjectType
   tags: TagResumeDTO[]
   images: string[]
   image?: string
   owner: number | null,
   discoverer: number | null,
   status: ObjectStatusV2
}

export const objectReponseDTOtoV2 = (obj: ObjectResponseDTO) => {
   return { ...obj, status: obj.status === ObjectStatus.FINISHED ? ObjectStatusV2.FINISHED : obj.type} as ObjectResponseDTO_V2
}