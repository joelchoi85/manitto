'use server';
import bcrypt from 'bcrypt';
// import { Member } from '../page';
import prisma from '@/lib/client/prisma';

// export async function addMember(member: Member) {
// 	try {
// 		const upsertedMember = await prisma.member.upsert({
// 			create: {
// 				name: member.name,
// 			},
// 			update: {
// 				name: member.name,
// 			},
// 			where: {
// 				name: member.name,
// 			},
// 		});
// 		return { member: upsertedMember };
// 	} catch (error) {
// 		if (error instanceof Error) return { error: error.toString() };
// 		else
// 			return {
// 				error: '알 수 없는 오류',
// 			};
// 	}
// }

export async function findMemberByName(name: string) {
	try {
		const member = await prisma.member.findFirst({
			where: {
				name,
			},
			select: {
				name: true,
				id: true,
				password: true,
				manittoId: true,
			},
		});
		if (member)
			return {
				id: member.id,
				name: member.name,
				manittoId: member.manittoId,
				isFirst: !member.password || member.password.length === 0,
			};
		return;
	} catch (error) {
		console.log(error);
		return;
	}
}

export async function changePassword(id: string, password: string) {
	try {
		let member: { id: string } | undefined = undefined;
		const saltRounds: string = process.env.SALT_ROUNDS!;
		const salt = await bcrypt.genSalt(+saltRounds);
		const hashedPassword = await bcrypt.hash(password, salt);

		member = await prisma.member.update({
			where: { id },
			data: {
				password: hashedPassword,
			},
			select: {
				id: true,
			},
		});

		return member;
	} catch (error) {
		console.log(error);
		return;
	}
}

export async function confirmMember(id: string, password: string) {
	try {
		const member = await prisma.member.findUnique({
			where: { id },
			select: {
				id: true,
				password: true,
				manitto: {
					select: { name: true },
				},
			},
		});
		if (!member || member.password === null) throw Error('멤버에 없거나 비밀번호를 지정하지 않은 멤버입니다');
		const match = await bcrypt.compare(password, member.password);
		return { success: match, member };
	} catch (error) {
		if (error instanceof Error) console.log(error.message);
		else console.log(error);
		return { success: false };
	}
}

export async function getAllMemberNames() {
	try {
		const members = await prisma.member.findMany({ select: { name: true } });
		return { members: members.map(member => member.name) };
	} catch (error) {
		console.log(error);
		return { members: [] };
	}
}

export async function getAllMembers() {
	try {
		const members = await prisma.member.findMany({ select: { name: true, id: true, manittoId: true } });
		return { members };
	} catch (error) {
		console.log(error);
		return { members: [] };
	}
}
