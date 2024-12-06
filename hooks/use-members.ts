'use client';
import { getAllMembers } from '@/app/actions/member';
import { create } from 'zustand';

// interface Member {
// 	id: string;
// 	name: string;
// 	manittoId: string | null;
// }
// interface MemberListState {
// 	members: Member[];
// 	initMembers: () => void;
// 	addMember: (member: Member) => void;
// 	removeMember: (id: string) => void;
// 	modifyMember: (member: Member) => void;
// }
// const useMemberStore = create<MemberListState>(set => ({
// 	members: [],
// 	initMembers: async () => {
// 		const { members } = await getAllMembers();
// 		set({ members });
// 	},
// 	addMember: member => set(state => ({ members: [...state.members, member] })),
// 	removeMember: id => set(state => ({ members: state.members.filter(member => member.id !== id) })),
// 	modifyMember: member =>
// 		set(state => ({
// 			members: state.members.splice(
// 				state.members.findIndex(x => x.id === member.id),
// 				1,
// 				member,
// 			),
// 		})),
// }));

// export default useMemberStore;

import { useEffect } from 'react';
// import create from 'zustand';

interface Member {
	id: string;
	name: string;
	manittoId: string | null;
}

interface MembersState {
	members: Member[];
	isLoading: boolean;
	fetchMembers: () => Promise<void>;
}

const useMembers = create<MembersState>(set => ({
	members: [],
	isLoading: false,
	fetchMembers: async () => {
		set({ isLoading: true });
		try {
			const { members } = await getAllMembers(); // 비동기 데이터 가져오기
			set({ members, isLoading: false });
		} catch (error) {
			console.error('Failed to fetch members:', error);
			set({ isLoading: false });
		}
	},
}));

// 멤버 관리를 위한 커스텀 훅
export const useMembersHook = () => {
	const { members, isLoading, fetchMembers } = useMembers();

	useEffect(() => {
		fetchMembers();
	}, [fetchMembers]);

	return { members, isLoading };
};
