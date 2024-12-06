import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StateCreator } from 'zustand';
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

type MemberStateCreator = StateCreator<MemberState, [], [['zustand/persist', unknown]], MemberState>;
const useCurrentMember = create<MemberState>()(
	(isClient ? persist : (f: MemberStateCreator) => f)(
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
