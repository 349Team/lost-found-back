import { objectRepository } from "../database/repositories/object-repository"
import { BadRequestException, NotFoundException, UnsupportedMediaTypeException } from "../models/exception-http"
import { isObjectCreateRequestDTO, ObjectCreateRequestDTO, ObjectResponseDTO, ObjectResumeResponseDTO, objectToObjectResponseDTO, objectToObjectResumeResponseDTO } from "../models/object-dtos"
import { ImageUse, ObjectType, Tag } from "@prisma/client"
import { imageRepository } from "../database/repositories/image-repository"
import { userRepository } from "../database/repositories/user-repository"
import { imageService } from "./image-service"
import { SimpleResponse } from "../models/simple-response"
import { removeFile } from "../tools/files"


class ObjectService {

  public async createObject(dto: ObjectCreateRequestDTO): Promise<ObjectResponseDTO> {

    if (!isObjectCreateRequestDTO(dto)) throw new BadRequestException('invalid arguments')

    if (dto.type === ObjectType.FOUND) {
      if (!dto.discovererId || dto.discovererId && !(await userRepository.findUser(dto.discovererId)))
        throw new BadRequestException("object of type FOUND need a valid user a discoverer")
    }

    if(dto.type === ObjectType.LOST) {
      if (!dto.ownerId || dto.ownerId && !(await userRepository.findUser(dto.ownerId)))
        throw new BadRequestException("object of type LOST need a valid user as owner")
    }

    var object = await objectRepository.createObject(
      dto.title,
      dto.description,
      dto.location,
      dto.type,
      dto.tags,
      dto.ownerId,
      dto.discovererId
    )

    var response = objectToObjectResponseDTO(object)

    return response
  }

  public async addImagesToObject(files: Express.Multer.File[] | undefined, objectId: number) {

    if (!files) throw new BadRequestException('no files available for download')
      
    if (!files.length) throw new UnsupportedMediaTypeException()

    var object = await objectRepository.findObject(objectId)

    if(!object) {
      files.forEach(file => removeFile(file.path))
      throw new NotFoundException('object not found')
    }

    var fileInfos = (files as any[]).map((file: any) => { return { name: file.originalname, path: file.path } as { name: string, path: string } })

    var persistedFiles: ({ id: number, source: string, originalName: string, type: string })[] = []

    for (let file of fileInfos) {
        var image = await imageRepository.createImage(file.path, ImageUse.OBJECT, objectId)
        persistedFiles.push({
          id: image.id,
          source: '/image/' + image.id,
          originalName: file.name,
          type: image.use?.toString() ?? 'NOT'
        })
    }

    return persistedFiles
  }

  public async getObjectById(id: number): Promise<ObjectResponseDTO> {
    var object = await objectRepository.findObject(id)
    if(!object)   throw new NotFoundException('object not found')

    var tags: Tag[] = []

    for (var tag of object.tags){
      var res = await objectRepository.findTag(tag.tagId)
      if(res) tags.push(res)
    }

    var obj = {...object, tags: tags}

    var response = objectToObjectResponseDTO(obj)
    return response
  }

  public async findObjectsByUserId(id: number): Promise<ObjectResponseDTO[]> {
    var objects: any = await objectRepository.findObjectsByUserId(id)


    var objectsAndTags: any[] = []

    for (var object of objects){
      var tags: Tag[] = []

      for (var tag of object.tags){
        var res = await objectRepository.findTag(tag.tagId)
        if(res) tags.push(res)
      }

       objectsAndTags.push({...object, tags: tags})
    }

    var response = objectsAndTags.map(objectToObjectResponseDTO)
    return response
  }

  public async deleteObjectById(id: number) {
    var object = await objectRepository.findObject(id)

    if(!object) throw new NotFoundException('object not found')

    var imagesToDelete: number[] = object.images.map(img => img.id)

    imagesToDelete.forEach(imageService.deleteImage)

    /**
     * @todo delete tag on object delete
     */

    await objectRepository.deleteObject(id)

    return new SimpleResponse(`object '${object.title}' deleted successfully !`)
 }

  public async searchOnObjects(search: string): Promise<ObjectResumeResponseDTO[]> {
    var objects: any[] = []

    var tagsFinded = await objectRepository.searchOnTags(search)

    if(tagsFinded.length)
      for(var tag of tagsFinded)
        objects = [ ...objects, ...(await objectRepository.findObjectsByTag(tag.id)) ]

    objects = [ ...objects, ...(await objectRepository.searchOnObjects(search)) ]

    var response = objects.map(objectToObjectResumeResponseDTO)

    return response
  }

  public async findObjectsByTag(id: number): Promise<ObjectResumeResponseDTO[]> {
    var tag = await objectRepository.findTag(id)

    if(!tag)  throw new NotFoundException('tag not found')

    var objects = await objectRepository.findObjectsByTag(tag.id)

    var response = objects.map(objectToObjectResumeResponseDTO)

    return response
  }
}

export const objectService = new ObjectService()