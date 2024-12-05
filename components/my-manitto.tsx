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
import SlotMachine from './slot-machine2';
import useMemberStore from '@/hooks/use-members';
import useCurrentMember from '@/hooks/use-current-member';
import { redirect } from 'next/navigation';

export default function MyManitto() {
	const { member } = useCurrentMember();
	if (!member || !member.id) redirect('/');
	return (
		<Dialog>
			<DialogTrigger className="text-sm px-4 py-1 rounded-lg bg-black text-white">내 마니또 보기</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>내 마니또</DialogTitle>
					<DialogDescription>내 마니또는 다른 사람에게 보이면 안되죠</DialogDescription>
				</DialogHeader>

				<SlotMachine />

				<DialogFooter></DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
