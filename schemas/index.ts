import * as z from 'zod';

export const AddMember = z.object({
	name: z.string().min(1).nullable(),
	password: z.string().min(1, { message: '적어도 1자는 입력해야돼요' }).nullable(),
});

export type AddMemberType = z.infer<typeof AddMember>;
