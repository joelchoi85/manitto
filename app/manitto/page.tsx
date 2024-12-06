import ManittoMain from '@/components/manitto-main';
import { Suspense } from 'react';
// import { createClient } from '@/lib/server/supabase';
// import { Member } from '@prisma/client';
export default function Manitto() {
	// const supabase = await createClient();
	// const { data } = await supabase.from('Member').select();
	return (
		<Suspense fallback={<div>잠시만 기다려주세요...</div>}>
			<ManittoMain />;
		</Suspense>
	);
}
