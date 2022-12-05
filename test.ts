// npx ts-node tests.ts
//https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/querying-the-database-typescript-postgres

import { PrismaClient } from '@prisma/client'
import { ConsoleBlue, ConsoleError, ConsoleSuccess } from './src/tools/console'

const prisma = new PrismaClient()

async function testUser() {
  ConsoleBlue("[ Testando create, select e delete User ]")

  var exists = !!await prisma.user.findFirst({
    where: {
      ra: "1001001"
    }
  })

  exists && await prisma.user.delete({where: {ra: "1001001"}}) && ConsoleSuccess("[ limpando ]")


  await prisma.user.create({
    data: {
      ra: '1001001',
      password: '1001001',
      updatedAt: new Date()
    },
  })
  
  ConsoleSuccess("[ criado ]");

  const user = await prisma.user.findFirst({
    where: {
      ra: "1001001"
    }
  })

  ConsoleSuccess("[ encontrado ]");

  (
    user?.ra == '1001001' &&
    user.password == '1001001'
  ) ? ConsoleSuccess("[ dados corretos ]") : ConsoleError("[ dados incorretos ]")

  await prisma.user.delete({
    where: {
      ra: "1001001"
    }
  })

  ConsoleSuccess("[ deletado ]");

  // const allUsers = await prisma.user.findMany({
  //   include: {
  //     Post: true,
  //     Profile: true,
  //   },
  // })

  // if(allUsers.length){
  //   ConsoleSuccess('[ OK ]');
  //   console.table(allUsers)
  //   // console.dir(allUsers, { depth: null })
  // } else ConsoleError('[ Error on user::findMany ]')

}

testUser()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })