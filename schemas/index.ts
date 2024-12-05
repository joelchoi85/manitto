import * as z from 'zod';

export const AddMember = z.object({
	name: z.string().min(1).nullable(),
	password: z.ostring().nullable(),
});

export type AddMemberType = z.infer<typeof AddMember>;
