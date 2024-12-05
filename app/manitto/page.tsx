import ManittoMain from '@/components/manitto-main';
import { createClient } from '@/lib/server/supabase';
import { Member } from '@prisma/client';
export default async function Manitto() {
	const supabase = await createClient();
	const { data } = await supabase.from('Member').select();
	return <ManittoMain members={data as Member[]} />;
}
