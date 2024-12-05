import prisma from '@/lib/client/prisma';

export async function GET() {
	// 사용자 생성
	const alice = await prisma.member.create({
		data: {
			name: 'Alice',
		},
	});

	const bob = await prisma.member.create({
		data: {
			name: 'Bob',
		},
	});

	const charlie = await prisma.member.create({
		data: {
			name: 'Charlie',
		},
	});

	// 마니또 설정
	await prisma.member.update({
		where: { id: alice.id },
		data: { manittoId: bob.id }, // Alice의 마니또는 Bob
	});

	await prisma.member.update({
		where: { id: bob.id },
		data: { manittoId: charlie.id }, // Bob의 마니또는 Charlie
	});

	await prisma.member.update({
		where: { id: charlie.id },
		data: { manittoId: alice.id }, // Charlie의 마니또는 Alice
	});

	// 마니또 조회
	const memberWithManito = await prisma.member.findUnique({
		where: { id: alice.id },
		include: {
			manitto: true, // Alice의 마니또 포함
		},
	});
	return Response.json(memberWithManito);
}
