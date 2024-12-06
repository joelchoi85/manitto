'use client';
import { getAllMembers } from '@/app/actions/member';
import { create } from 'zustand';
interface Member {
	id: string;
	name: string;
	manittoId: string | null;
}
interface MemberListState {
	members: Member[];
	initMembers: () => void;
	addMember: (member: Member) => void;
	removeMember: (id: string) => void;
	modifyMember: (member: Member) => void;
}
const useMemberStore = create<MemberListState>(set => ({
	members: [],
	initMembers: async () => {
		const { members } = await getAllMembers();
		set({ members });
	},
	addMember: member => set(state => ({ members: [...state.members, member] })),
	removeMember: id => set(state => ({ members: state.members.filter(member => member.id !== id) })),
	modifyMember: member =>
		set(state => ({
			members: state.members.splice(
				state.members.findIndex(x => x.id === member.id),
				1,
				member,
			),
		})),
}));

export default useMemberStore;
