import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(){
    const Messengers = await prisma.communicationType.findMany()
    return Response.json(Messengers)
}