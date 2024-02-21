import prisma from "@/app/api/buttons/route";

export async function GET(request, {params}){

    const Buttons = await prisma.infoButton.findMany({
        where: {
            idCommunicationType: Number(params.id),
        },
    });

    return Response.json(Buttons)
}