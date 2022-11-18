import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const createDefaultUsers = async () => {
  var usersPersons = [
    {
      user: {
        ra: '1001001',
        password: '1001001',
        updatedAt: new Date()
      },
      person: {
        email: 'userOne@email.com',
        full_name: 'user One Full Name',
        updatedAt: new Date(),
        campus: 'Campo Mourão',
      }
    },
    {
      user: {
        ra: '1001002',
        password: '1001002',
        updatedAt: new Date()
      },
      person: {
        email: 'userTwo@email.com',
        full_name: 'user Two Full Name',
        updatedAt: new Date(),
        campus: 'Campo Mourão',
      }
    }
  ]

  for(let userPerson of usersPersons){
    await prisma.user.create({
      data: {
        ...userPerson.user, 
        Person: { create: {...userPerson.person} }
      }
    })
  }

}

const createDefaultTags = async () => {
  var tags = [
    {
      title: 'garrafinha',
      description: 'garrafinha de água, garrafinha de bebida, garrafinha de plástico, garrafinha de metal'
    },
    {
      title: 'celular',
      description: 'celular, telefone'
    },
    {
      title: 'material escolar',
      description: 'material escolar, mochila, caneta, borracha'
    }
  ]

  await prisma.tag.createMany({
    data: tags
  })
}

async function seed () {
  await createDefaultUsers()
  await createDefaultTags()
}

seed()
  .then(() => 
    console.log('\n[Prisma] database seeded successfully')
  )
  .catch((e) => {
    console.log('\n[Prisma] Error on seed database')
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });