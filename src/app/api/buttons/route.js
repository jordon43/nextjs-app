import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, params){
    const Buttons = await prisma.infoButton.findMany()
    return Response.json(Buttons)
}

export async function POST(req){

    const data= await req.json()

    for (const button of data) {
        if(button.id === undefined){
            const post = await prisma.infoButton.create({
               data: {
                   displayMode: button.displayMode,
                   typeKeyboard: button.typeKeyboard,
                   textButton: button.textButton,
                   textLinkButton: button.textLinkButton,
                   idCommunicationType: Number(button.idCommunicationType),
               }
           })
        }
    }
    // const newButton = {
    //     displayMode: data.displayMode,
    //     typeKeyboard: data.typeKeyboard,
    //     textButton: data.textButton,
    //     textLinkButton: data.textLinkButton,
    //     idCommunicationType: Number(data.idCommunicationType),
    //
    // }
    // const post = await prisma.infoButton.create({data:newButton})

    const Buttons = await prisma.infoButton.findMany()
    return new Response(JSON.stringify(Buttons), {
        status: 200,
    })
}

export async function DELETE(req){

    const data= await req.json()
    const id = data.id

    const Buttons = await prisma.infoButton.delete({
        where:{
            id
        }
    })

    return Response.json({
        status: 200
    })
}



export async function PUT(req){

    const data= await req.json()
    const id = data.id

    const Buttons = await prisma.infoButton.update({
        where:{
            id
        },
        data:{
            displayMode: data.displayMode,
            typeKeyboard: data.typeKeyboard,
            textButton: data.textButton,
            textLinkButton: data.textLinkButton,
            idCommunicationType: Number(data.idCommunicationType),
        }
    })
    return Response.json(JSON.stringify(Buttons), {
        status: 200
    })
}



export default prisma