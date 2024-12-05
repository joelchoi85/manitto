import React, { useState, useEffect, useRef } from 'react';

const SYMBOL_HEIGHT = 60;
const SPIN_DURATION = 7000;

interface SlotMachineProps {
	members: string[];
}
export default function SlotMachine({ members: SYMBOLS }: SlotMachineProps) {
	const [isSpinning, setIsSpinning] = useState(false);
	const [result, setResult] = useState(0);
	const reelRef = useRef<HTMLDivElement>(null);

	// 심볼 3세트를 만들어서 연속적인 회전 효과를 줍니다
	const tripleSymbols = [...SYMBOLS, ...SYMBOLS, ...SYMBOLS];

	const spin = () => {
		if (isSpinning) return;

		setIsSpinning(true);
		const newResult = Math.floor(Math.random() * SYMBOLS.length);
		setResult(newResult);

		if (reelRef.current) {
			// 시작 위치로 즉시 이동 (트랜지션 없이)
			reelRef.current.style.transition = 'none';
			reelRef.current.style.transform = 'translateY(0)';

			// 리플로우를 강제로 발생시켜 위치 재설정이 적용되게 합니다
			reelRef.current.offsetHeight;

			// 회전 애니메이션 시작
			// reelRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
			reelRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(.12,1.15,.94,.9)`;
			const finalPosition = SYMBOLS.length * SYMBOL_HEIGHT + newResult * SYMBOL_HEIGHT;
			reelRef.current.style.transform = `translateY(-${finalPosition}px)`;

			setTimeout(() => {
				setIsSpinning(false);
				// 첫 번째 세트의 해당 위치로 즉시 이동
				if (reelRef.current) {
					reelRef.current.style.transition = 'none';
					reelRef.current.style.transform = `translateY(-${newResult * SYMBOL_HEIGHT}px)`;
				}
			}, SPIN_DURATION);
		}
	};

	// 초기 위치 설정
	useEffect(() => {
		if (reelRef.current) {
			reelRef.current.style.transform = `translateY(-${result * SYMBOL_HEIGHT}px)`;
		}
	}, []);

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="w-36 h-16 border-4 border-gray-800 rounded-lg overflow-hidden bg-white relative">
				{/* 마스크 효과를 위한 그라데이션 오버레이 */}
				<div className="absolute inset-0 z-10 pointer-events-none">
					<div className="absolute top-0 h-1/4 w-full bg-gradient-to-b from-white to-transparent opacity-80" />
					<div className="absolute bottom-0 h-1/4 w-full bg-gradient-to-t from-white to-transparent opacity-80" />
				</div>

				{/* 릴 */}
				<div className="relative h-full">
					<div
						ref={reelRef}
						className="absolute w-full"
						style={{
							display: 'grid',
							gridTemplateRows: `repeat(${tripleSymbols.length}, ${SYMBOL_HEIGHT}px)`,
						}}
					>
						{tripleSymbols.map((symbol, index) => (
							<div
								key={index}
								className="flex items-center justify-center text-4xl"
								style={{ height: `${SYMBOL_HEIGHT}px` }}
							>
								{symbol}
							</div>
						))}
					</div>
				</div>
			</div>

			<button
				onClick={spin}
				disabled={isSpinning}
				className={`px-6 py-2 text-white rounded-full ${
					isSpinning ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
				}`}
			>
				{isSpinning ? 'Spinning...' : 'SPIN!'}
			</button>
		</div>
	);
}
