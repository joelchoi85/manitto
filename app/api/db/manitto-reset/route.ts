import prisma from '@/lib/client/prisma';

export async function GET() {
	const result = await prisma.member.updateMany({
		data: {
			manittoId: null,
		},
	});

	// const members = await prisma.member.findMany();
	// const manittoList = members.map<{ memberId: string; manittoId: string }>(member => ({
	// 	memberId: member.id,
	// 	manittoId: '',
	// }));
	// const randomNumberList = new Set();
	// const transactions: { where: { id: string }; data: { manittoId: string } }[] = [];
	// manittoList.forEach(member => {
	// 	while (true) {
	// 		const randomNumber = Math.ceil(Math.random() * manittoList.length - 1);
	// 		if (manittoList[randomNumber].memberId === member.memberId) continue;
	// 		if (!randomNumberList.has(randomNumber)) {
	// 			randomNumberList.add(randomNumber);
	// 			member.manittoId = manittoList[randomNumber].memberId;
	// 			transactions.push({ where: { id: member.memberId }, data: { manittoId: member.manittoId } });
	// 			break;
	// 		}
	// 	}
	// });
	// const data = await prisma.$transaction(transactions.map(transaction => prisma.member.update(transaction)));

	return Response.json({ ok: true, ...result } /* data */);
}
