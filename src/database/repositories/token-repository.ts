import { ExpiredToken } from "@prisma/client";
import { Prisma } from "..";

class TokenRepository {
  public async create(token: string, expireAt: Date): Promise<ExpiredToken> {
    return await Prisma.expiredToken.create({
      data: {
        token,
        expireAt
      }
    }) ?? null
  }

  public async search(token: string): Promise<ExpiredToken[]> {
    return await Prisma.expiredToken.findMany({
      where: {
        token: token
      }
    }) ?? []
  }

  public async clearExpireds(): Promise<void> {
    var x = await Prisma.expiredToken.deleteMany({
      where: {
        expireAt: {
          lte: new Date()
        }
      }
    })

    return
  }
}

export const tokenRepository = new TokenRepository() 