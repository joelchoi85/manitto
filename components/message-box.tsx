import { Message } from '@prisma/client';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
interface MessageBoxProps {
	name: string;
	msg: Message & { Member: { name: string } };
	itsMe: boolean;
}
export default function MessageBox({ name, msg, itsMe }: MessageBoxProps) {
	const createdAt =
		msg.createdAt instanceof Date
			? new Date(msg.createdAt.getTime() + 9 * 60 * 60 * 1000)
			: new Date(new Date(msg.createdAt).getTime() + 9 * 60 * 60 * 1000);
	// createdAt.setHours(createdAt.getHours() + 9);

	return (
		<div className={cn('flex gap-2 items-center', itsMe && 'justify-end')}>
			{!itsMe && <Badge className="no-wrap">{name}</Badge>}
			<div className={cn('flex items-end gap-1', itsMe && 'flex-row-reverse')}>
				<div className={cn('min-w-8 max-w-56 rounded-xl px-2 py-0.5', itsMe ? 'bg-amber-300' : 'bg-white')}>
					{msg.message}
				</div>
				<div className="text-xs font-semibold text-zinc-700 -space-y-1">
					<div>{createdAt.toLocaleDateString('ko-KR')}</div>
					<div>{createdAt.toLocaleTimeString('ko-KR').substring(0, 7)}</div>
				</div>
			</div>
		</div>
	);
}
