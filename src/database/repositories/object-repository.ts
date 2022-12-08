import { ObjectType, Object, ObjectStatus, prisma, Tag } from "@prisma/client";
import { Prisma } from "..";

class ObjectRepository {
  public async createObject(
    title: string, 
    description: string,
    location: string,
    type: ObjectType,
    tags: number[],
    ownerId?: number,
    discovererId?: number,
  ): Promise<Object> {
    var object = await Prisma.object.create({
      data: {
        title,
        description,
        location,
        type,
        status: ObjectStatus.ACTIVE,
        ownerId,
        discovererId,
        updatedAt: new Date(),
      }
    })

    for (let tag of tags) 
      await this.addTag(object.id, tag)

    return object
  }

  public async findObject(id: number) {
    var object = await Prisma.object.findFirst({
      where: { id: id },
      include: { images: true, messages: true, tags: {
        include: {
          tag: true
        }
      } }
    })

    var tags: Tag[] = []

    /* converte relação N:N entre Objetos:TagsOnObjects em um Object com um array de Tags */
    if(object && object.tags) tags = object.tags.map(tag => tag.tag)

    return object ? { ...object, tags: tags} : undefined
  }

  public async updateObject(object: Object) {
    return await Prisma.object.update({ where: {id: object.id}, data: {...object, tags: undefined, images: undefined, messages: undefined}})
  }

  public async findObjectsByUserId(id: number) {
    return await Prisma.object.findMany({
      where: {
        OR: [ {ownerId: id },{ discovererId: id } ]
      },
      include: {
        images: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    }) ?? []
  }

  public async deleteObject(id: number) {
    return await Prisma.object.delete({
      where: {
        id: id
      }
    })
  }

  private async addTag(objectId: number, tagId: number) {
    await Prisma.tagsOnObjects.create({
      data: {
        objectId,
        tagId
      }
    })
  }

  public async findTag(id: number) {
    return await Prisma.tag.findFirst({
      where: { id: id}
    })
  }

  public async findObjectsByTag(id: number) {
    return await Prisma.object.findMany({
      where: {
        tags: {
          some: {
            tagId: id
          }
        }
      },
      include: {
        images: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })
  }

  public async searchOnTags(search: string) {
    return await Prisma.tag.findMany({
      where: {
        title: { search: search },
        description: { search: search }
      }
    })
  }

  public async searchOnObjects(search: string) {
    return await Prisma.object.findMany({
      where: {
        title: { search: search },
        description: { search: search },
      },
      include: {
        images: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })
  }

  public async findAll() {
    var objects = await Prisma.object.findMany({
      include: {
        images: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    /* converte relação N:N entre Objetos:TagsOnObjects em um Object com um array de Tags */
    return objects.map(obj => {
      var tags = obj.tags.map(tag => tag.tag)
      return { ...obj, tags: tags}
    })
  }
}


export const objectRepository = new ObjectRepository()