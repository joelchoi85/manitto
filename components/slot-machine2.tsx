'use client';
import { launchMachine } from '@/app/actions/slot-machine';
import useCurrentMember from '@/hooks/use-current-member';
import useMemberStore from '@/hooks/use-members';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpIcon } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { ko } from 'date-fns/locale';

const SYMBOL_HEIGHT = 60;
const SPIN_DURATION = 7000;
// interface SlotMachineProps {
// 	manitto?: string;
// 	memberNameList: string[];
// }
const SlotMachine = () => {
	const [isSpinning, setIsSpinning] = useState(false);
	const { member, setManitto } = useCurrentMember();
	const { members } = useMemberStore();
	const [didLaunch, setDidLaunch] = useState(false);
	const [result, setResult] = useState(0);
	const reelRef = useRef<HTMLDivElement>(null);
	const { toast } = useToast();
	const memberNames = members.map(member => member.name);
	const tripleSymbols = [...memberNames, ...memberNames, ...memberNames, ...memberNames];
	const theDay = new Date('2024-12-25 0:0:0');
	const [diff, setDiff] = useState<string>('');
	useEffect(() => {
		const interval = setInterval(() => {
			setDiff(formatDistanceToNow(theDay, { addSuffix: true, locale: ko }));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	// 랜덤으로 정한 결과를 받는 함수
	const spin = async () => {
		if (isSpinning) {
			toast({ title: '이미 베팅하셨어요.', description: '베팅은 한 번 만 가능해요' });
			return;
		}
		setIsSpinning(true);
		// 랜덤 슬롯 실행
		const { error, manitto } = await launchMachine(member!.id);
		if (manitto && manitto.id && manitto.name) {
			setManitto(manitto.id);
			if (error) toast({ title: 'ERROR', description: (error as Error).message });
			const newResult = tripleSymbols.findLastIndex(x => x === manitto.name);
			setResult(newResult);

			if (reelRef.current) {
				reelRef.current.style.transition = 'none';
				reelRef.current.style.transform = 'translateY(0)';
				//@ts-no-check
				reelRef.current.offsetHeight;

				reelRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(.12,1.15,.94,.9)`;
				const finalPosition = memberNames.length * SYMBOL_HEIGHT + newResult * SYMBOL_HEIGHT;
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
		}
	};

	useEffect(() => {
		if (reelRef.current) {
			reelRef.current.style.transform = `translateY(-${result * SYMBOL_HEIGHT}px)`;
		}
	}, [result]);

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
					{!didLaunch && !member?.manittoId && (
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
								{members.find(x => x.id === member?.manittoId)?.name}
							</div>
						)}
					</div>
				</div>
			</div>
			{member?.manittoId ? (
				<div>
					참여 완료! 미션을 시작하세요! 미션은 <span className="text-rose-600">{diff}</span>에 종료됩니다!{' '}
				</div>
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
