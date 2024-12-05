'use client';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useActionState, useState } from 'react';
import { confirmMember, getAllMemberNames } from '@/app/actions/member';
// import { Badge } from './ui/badge';
import SlotMachine from './slot-machine2';

export default function MyManitto({ id }: { id?: string }) {
	const [isConfirmed, setIsConfirmed] = useState(false);
	// const [manitto, setManitto] = useState<string>();
	const [data, formAction /* isPending */] = useActionState(onSubmit, undefined);
	const [members, setMembers] = useState<string[]>([]);

	async function onSubmit(prevState: unknown, formData: FormData) {
		const { success, member } = await confirmMember(localStorage.getItem('uname')!, formData.get('password') as string);
		setIsConfirmed(success);

		if (member) {
			if (member.manitto) {
				// setManitto(member.manitto.name);
			} else {
				const { members: _members } = await getAllMemberNames();
				setMembers(_members);
			}
		}
		return { manitto: member && member.manitto ? member.manitto.name : undefined };
	}
	if (!id) return <></>;

	return (
		<Dialog>
			<DialogTrigger className="text-sm px-4 py-1 rounded-lg bg-black text-white">내 마니또 보기</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>내 마니또</DialogTitle>
					<DialogDescription>내 마니또는 다른 사람에게 보이면 안되죠</DialogDescription>
				</DialogHeader>
				{!isConfirmed && (
					<form action={formAction}>
						<Label htmlFor="password">비밀번호</Label>
						<Input id="password" type="password" name="password" placeholder="입장시 입력한 비밀번호를 입력하세요" />
					</form>
				)}
				{isConfirmed && (
					<div>
						<SlotMachine members={members} manitto={data?.manitto} />
					</div>
				)}
				<DialogFooter></DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
