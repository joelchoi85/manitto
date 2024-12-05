import { create } from 'zustand';
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
const useCurrentMember = create<MemberState>((set, get) => ({
	member: null,
	login: (member: Member) => set({ member }),
	logout: () => set({ member: null }),
	setManitto: (id: string) => {
		const member = get().member;
		if (member) {
			member.manittoId = id;
			set({ member });
		}
	},
}));

export default useCurrentMember;
