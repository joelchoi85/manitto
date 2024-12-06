import useCurrentMember from '@/hooks/use-current-member';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export default function Logout() {
	const { logout } = useCurrentMember();
	return (
		<Button variant={'ghost'} onClick={() => logout()}>
			<LogOut />
			나가기
		</Button>
	);
}
