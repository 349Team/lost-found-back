import { objectRepository } from "../database/repositories/object-repository"
import { BadRequestException, NotFoundException, UnsupportedMediaTypeException } from "../models/exception-http"
import { isObjectCreateRequestDTO, ObjectCreateRequestDTO, objectReponseDTOtoV2, ObjectResponseDTO, ObjectResponseDTO_V2, ObjectResumeResponseDTO, objectToObjectResponseDTO, objectToObjectResumeResponseDTO } from "../models/object-dtos"
import { ImageUse, Object, ObjectType, Tag, TagsOnObjects, Image, ObjectStatus, prisma } from "@prisma/client"
import { imageRepository } from "../database/repositories/image-repository"
import { userRepository } from "../database/repositories/user-repository"
import { imageService } from "./image-service"
import { SimpleResponse } from "../models/simple-response"
import { removeFile } from "../tools/files"

type ObjectWithImagesAndsTags = (Object & {
  images: Image[];
  tags: (TagsOnObjects & {
      tag: Tag;
  })[];
})[]


class ObjectService {

  /* criar um novo objeto */
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

  /* persistir as imagens e acomplar as referências das imagens à um determinado objeto */
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

  /* encontrar um determinado  */
  public async getObjectById(id: number): Promise<ObjectResponseDTO_V2> {
    var object = await objectRepository.findObject(id)
    if(!object)   throw new NotFoundException('object not found')

    var response = objectToObjectResponseDTO(object)
    return objectReponseDTOtoV2(response)
  }

  /* encontrar os objetos pertencentes a um determinado usuário */
  public async findObjectsByUserId(id: number): Promise<{ objects: ObjectResponseDTO_V2[], total: number}> {
    var objects = await objectRepository.findObjectsByUserId(id)


    var objectsAndTags: any[] = []

    for (var object of objects){
      var tags: Tag[] = []

      for (var tag of object.tags){
        var res = await objectRepository.findTag(tag.tagId)
        if(res) tags.push(res)
      }

       objectsAndTags.push({...object, tags: tags})
    }

    var response = objectsAndTags.map(objectToObjectResponseDTO).map(objectReponseDTOtoV2)
    return { objects: response, total: response.length }
  }

  /* deletar um determinado objeto */
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

 /* pesquisar por uma determinada palavra, a busca será realizada no objeto (title, description) e nas tags do objeto (title, description) */
  public async searchOnObjects(search: string): Promise<{ objects: ObjectResponseDTO_V2[], total: number}> {
    var objects: any[] = []

    var tagsFinded = await objectRepository.searchOnTags(search)

    if(tagsFinded.length)
      for(var tag of tagsFinded)
        objects = [ ...objects, ...(await objectRepository.findObjectsByTag(tag.id)) ]

    objects = [ ...objects, ...(await objectRepository.searchOnObjects(search)) ]

    var objectsAndTags: any[] = []

    for (var object of objects as ObjectWithImagesAndsTags){
      var tags: Tag[] = []

      for (var t of object.tags){
        var res = await objectRepository.findTag(t.tagId)
        if(res) tags.push(res)
      }

       objectsAndTags.push({...object, tags: tags})
    }

    var response = objectsAndTags.map(objectToObjectResponseDTO).map(objectReponseDTOtoV2)
    return { objects: response, total: response.length }
  }

  /* encontrar grupo de objetos que possuem uma determinada tag */
  public async findObjectsByTag(id: number): Promise<ObjectResponseDTO_V2[]> {
    var tag = await objectRepository.findTag(id)

    if(!tag)  throw new NotFoundException('tag not found')

    var objects = await objectRepository.findObjectsByTag(tag.id)

    var response = objects.map(objectToObjectResponseDTO).map(objectReponseDTOtoV2)

    return response
  }

  /* buscar todos os objetos no database */
  public async findAll(): Promise<{ objects: ObjectResponseDTO_V2[], total: number}> {
    var objects = await objectRepository.findAll()
    var response = await objects.map(objectToObjectResponseDTO)

    var responseConverted = response.map((obj) => objectReponseDTOtoV2(obj))
    return { objects: responseConverted, total: response.length}
  }

  public async finishObject(id: number): Promise<void> {
    var object = await objectRepository.findObject(id)

    if(!object) throw new NotFoundException('object not found')

    object.status = ObjectStatus.FINISHED
    
    await objectRepository.updateObject(object)
  }
}

export const objectService = new ObjectService()