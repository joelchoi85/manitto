'use server';

import prisma from '@/lib/client/prisma';

export async function launchMachine(id: string) {
	try {
		const whoHasManittoList = await prisma.member.findMany({
			where: {
				manittoId: { not: null },
			},
			select: {
				manittoId: true,
			},
		});
		const canManittoList = await prisma.member.findMany({
			where: {
				AND: [
					{
						id: {
							not: id,
						},
					},
					{
						id: {
							notIn: whoHasManittoList.map(member => member.manittoId!),
						},
					},
				],
			},
			select: {
				id: true,
				name: true,
			},
		});
		const determinedManittoMember = await prisma.member.update({
			where: { id },
			data: {
				manitto: {
					connect: {
						id: canManittoList[Math.ceil(Math.random() * canManittoList.length) - 1].id,
					},
				},
			},
			select: {
				manitto: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		return { manitto: determinedManittoMember.manitto?.name };
	} catch (error) {
		console.log(error);
		return { error };
	}
}
