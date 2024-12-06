import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import SlotMachine from './slot-machine2';
import { Button } from './ui/button';
import { EggFriedIcon } from 'lucide-react';

export default function MyManitto() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<EggFriedIcon />내 마니또 보기
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>내 마니또</DialogTitle>
					<DialogDescription>내 마니또는 다른 사람에게 보이면 안되죠</DialogDescription>
				</DialogHeader>

				<SlotMachine />

				<DialogFooter></DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
