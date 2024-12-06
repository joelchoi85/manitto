import useCurrentMember from '@/hooks/use-current-member';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Logout() {
	const router = useRouter();
	const { logout } = useCurrentMember();
	return (
		<Button
			variant={'ghost'}
			onClick={() => {
				logout();
				router.replace('/');
			}}
		>
			<LogOut />
			나가기
		</Button>
	);
}
