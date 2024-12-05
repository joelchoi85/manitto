'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useActionState, useState } from 'react';
import { changePassword, confirmMember, findMemberByName } from './actions/member';
import { AddMember } from '@/schemas';
import { useRouter } from 'next/navigation';
// import { useFormState, useFormStatus } from 'react-dom';

export interface Member {
	name: string;
	manitto?: Member;
	password?: string;
}
export default function Home() {
	const initialState: Member = {
		name: '',
		password: undefined,
		manitto: undefined,
	};
	const { toast } = useToast();
	const router = useRouter();
	const [member, setMember] = useState<Member>(initialState);
	const [isFirst, setIsFirst] = useState<boolean>(false);
	const [isSetName, setIsSetName] = useState<boolean>(false);
	const onSubmit = async (currentState: Member, formData: FormData) => {
		const testData = {
			name: formData.get('name'),
			password: formData.get('password'),
		};
		const { success, data, error } = AddMember.safeParse(testData);
		// 입력파싱
		if (success) {
			// 비밀번호입력인가
			if (data.password) {
				if (isFirst) {
					const user = await changePassword(localStorage.getItem('uid')!, data.password);
					if (user && user.id) {
						toast({ title: '성공적으로 추가되었습니다!', description: '마니또에 참여하셨습니다.' });
						router.push('/manitto');
					}
				} else {
					const { success } = await confirmMember(member.name, data.password);
					if (success) router.push('/manitto');
					else {
						toast({ title: '로그인 오류', description: '비밀번호를 올바르게 입력해주세요' });
					}
				}
				// 이름 입력인가
			} else {
				const user = await findMemberByName(data.name!);
				if (user) {
					localStorage.setItem('uid', user.id);
					localStorage.setItem('uname', user.name);
					setMember(prev => ({ ...prev, name: user.name }));
					setIsSetName(true);
					setIsFirst(user.isFirst);
				}
			}
			//! 고정 멤버로 멤버추가기능 사용해제
			// 사용자 추가 로직
			// const { error: addError, member } = await addMember(data);
			// if (member) {
			// 	toast({ title: '성공적으로 추가되었습니다!', description: '마니또에 참여하셨습니다.' });
			// 	localStorage.setItem('uid', member.id);
			// 	router.push('/manitto');
			// } else {
			// 	toast({ title: '입력 오류', description: JSON.stringify(addError) });
			// }
		} else {
			toast({ title: '입력 오류', description: error.message });
		}
		return member;
	};
	const [state, formAction, isPending] = useActionState(onSubmit, initialState);
	// const { action, data, method, pending } = useFormStatus();
	return (
		<div className="font-pretendard relative bg-gradient-to-br from-fuchsia-700 to-emerald-500 h-screen w-screen flex justify-center items-center">
			<div className="absolute flex justify-center items-center rounded-sm overflow-hidden bg-white w-full h-full aspect-auto">
				<Image
					alt="background"
					src="https://images.unsplash.com/photo-1726616319695-5919d913818d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					fill={true}
					style={{ objectFit: 'cover' }}
				/>
			</div>
			<Card className="overflow-hidden z-10">
				<CardHeader>
					<CardTitle>마니또 게임</CardTitle>
					<CardDescription>{'참여하시는 분의 이름을 입력하세요'}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{isSetName && member.name && (
						<div className="text-zinc-500 font-semibold" onClick={() => setIsSetName(false)}>
							이름 : {state.name || member.name}
						</div>
					)}

					{!isSetName && (
						<form action={formAction} className="w-screen lg:w-96">
							<Label htmlFor="name" className="space-y-2">
								<div>이름</div>
								<div className="flex gap-2 justify-normal lg:justify-center">
									<Input type="text" name="name" id="name" className="max-w-72 text-2xl" />
									<Button disabled={isPending} type="submit">
										입장하기
									</Button>
								</div>
							</Label>
						</form>
					)}
					{isSetName && (
						<form action={formAction} className="w-screen lg:w-96">
							<Label htmlFor="password" className="space-y-2">
								<div>비밀번호</div>
								<div className="flex gap-2 justify-normal lg:justify-center">
									<Input type="password" name="password" id="password" className="max-w-72 text-2xl" />
									<Button disabled={isPending} type="submit">
										입장하기
									</Button>
								</div>
							</Label>
						</form>
					)}
				</CardContent>
				<CardFooter></CardFooter>
			</Card>
		</div>
	);
}
