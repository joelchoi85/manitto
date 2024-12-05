import { launchMachine } from '@/app/actions/slot-machine';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ArrowUpIcon } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

const SYMBOL_HEIGHT = 60;
const SPIN_DURATION = 7000;
interface SlotMachineProps {
	manitto?: string;
	members: string[];
}
const SlotMachine = ({ members: SYMBOLS, manitto }: SlotMachineProps) => {
	const [isSpinning, setIsSpinning] = useState(false);
	const [didLaunch, setDidLaunch] = useState(false);
	const [result, setResult] = useState(0);
	const reelRef = useRef<HTMLDivElement>(null);
	const { toast } = useToast();

	const tripleSymbols = [...SYMBOLS, ...SYMBOLS, ...SYMBOLS];

	// 랜덤으로 정한 결과를 받는 함수
	const spin = async () => {
		if (isSpinning) {
			toast({ title: '이미 베팅하셨어요.', description: '베팅은 한 번 만 가능해요' });
			return;
		}
		setIsSpinning(true);
		// 랜덤 슬롯 실행
		const { error, manitto } = await launchMachine(localStorage.getItem('uid')!);
		error && toast({ title: 'ERROR', description: (error as Error).message });
		const newResult = tripleSymbols.findIndex(x => x === manitto);
		setResult(newResult);

		if (reelRef.current) {
			reelRef.current.style.transition = 'none';
			reelRef.current.style.transform = 'translateY(0)';
			//@ts-expect-error
			reelRef.current.offsetHeight;

			reelRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(.12,1.15,.94,.9)`;
			const finalPosition = SYMBOLS.length * SYMBOL_HEIGHT + newResult * SYMBOL_HEIGHT;
			reelRef.current.style.transform = `translateY(-${finalPosition}px)`;

			setTimeout(() => {
				if (reelRef.current) {
					setIsSpinning(false);
					setDidLaunch(true);
					reelRef.current.style.transition = 'none';
					reelRef.current.style.transform = `translateY(-${newResult * SYMBOL_HEIGHT}px)`;
				}
			}, SPIN_DURATION);
		}
	};

	useEffect(() => {
		if (reelRef.current) {
			reelRef.current.style.transform = `translateY(-${result * SYMBOL_HEIGHT}px)`;
		}
	}, []);

	return (
		<div
			className={cn(
				'pt-4 rounded-full flex flex-col items-center gap-4',
				didLaunch &&
					!isSpinning &&
					'bg-gradient-to-br from-fuchsia-500 to-emerald-300 border-sky-100 border-4 shadow-lg',
			)}
		>
			<div className="w-64 h-20 border-8 rounded-lg border-t-amber-400 border-l-amber-400 border-b-amber-500 border-r-amber-500 overflow-hidden relative">
				<div className="absolute inset-0 z-10 pointer-events-none">
					<div className="absolute top-0 h-1/4 w-full bg-gradient-to-b from-white to-transparent opacity-80" />
					<div className="absolute bottom-0 h-1/4 w-full bg-gradient-to-t from-white to-transparent opacity-80" />
				</div>

				<div className="relative h-full">
					{!manitto && !didLaunch && (
						<div className="fixed -translate-x-1/2 -translate-y-1/2 left-3/4 top-1/3 -z-10 cursor-pointer">
							<div
								className={cn(
									'ralative transition-all ease-in z-50 origin-bottom-left',
									isSpinning ? 'rotate-[125deg]' : 'rotate-[45deg]',
								)}
							>
								<div className="bg-gradient-to-br from-amber-500 to-emerald-200 rounded-full w-4 h-24 shadow-lg"></div>
								<div
									className="absolute -left-4 -top-2 rounded-full size-12 bg-gradient-to-br from-red-500 to-red-900 shadow-lg"
									onClick={spin}
								></div>
							</div>
						</div>
					)}
					<div
						ref={reelRef}
						className={`absolute w-full grid repeat-[${tripleSymbols.length}, ${SYMBOL_HEIGHT}px]`}
						// style={{
						// 	display: 'grid',
						// 	gridTemplateRows: `repeat(${tripleSymbols.length}, ${SYMBOL_HEIGHT}px)`,
						// }}
					>
						{tripleSymbols.length > 0 ? (
							tripleSymbols.map((symbol, index) => (
								<div
									key={index}
									className={
										'h-20 flex items-center justify-center text-4xl text-amber-600 font-black bg-gradient-to-br from-yellow-400 to-amber-400'
									}
									style={{ height: `${SYMBOL_HEIGHT}px` }}
								>
									{symbol}
								</div>
							))
						) : (
							<div
								className={
									'h-20 flex items-center justify-center text-4xl text-amber-600 font-black bg-gradient-to-br from-zinc-300 to-zinc-400'
								}
							>
								{manitto}
							</div>
						)}
					</div>
				</div>
			</div>
			{manitto ? (
				<div>이미 참여하셨어요</div>
			) : (
				!didLaunch &&
				!isSpinning && (
					<div className="fixed right-4 bottom-0 flex justify-end">
						<ArrowUpIcon className="text-rose-500 animate-bounce" size={60} />
					</div>
				)
			)}

			<div className="flex gap-2"></div>
		</div>
	);
};

export default SlotMachine;
