'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const isClient = typeof window !== 'undefined';

interface Member {
	id: string;
	name: string;
	manittoId: string | null;
}
interface MemberState {
	member: Member | null;
	login: (member: Member) => void;
	logout: () => void;
	setManitto: (id: string) => void;
}
const useCurrentMember = create<MemberState>()(
	persist(
		(set, get) => ({
			member: null,
			login: (member: Member) => set({ member }),
			logout: () => set({ member: null }),

			setManitto: (id: string) => {
				const currentMember = get().member;
				if (currentMember) {
					const updatedMember = { ...currentMember, manittoId: id };
					set({ member: updatedMember });
				}
			},
		}),
		{
			name: 'current-memeber',
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);

export default useCurrentMember;
