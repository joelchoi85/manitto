'use client';
import { supadb } from '@/lib/client/supabase';
import { Member, Message } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { createId } from '@paralleldrive/cuid2';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import MessageBox from './message-box';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import MyManitto from './my-manitto';
import useMemberStore from '@/hooks/use-members';
import useCurrentMember from '@/hooks/use-current-member';

type MessageType = Message & { Member: { name: string } };
export default function ManittoMain() {
	const { initMembers, members } = useMemberStore();
	const { member } = useCurrentMember();
	const [viewportHeight, setViewportHeight] = useState(600);
	const messageEndRef = useRef<HTMLDivElement | null>(null); // 스크롤 내릴 참조
	const [collapse, setCollapse] = useState<boolean>(false);

	const buttonRef = useRef<HTMLButtonElement>(null);
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [input, setInput] = useState('');
	useEffect(() => {
		initMembers();
		const handleResize = () => {
			setViewportHeight(window.innerHeight);
		};

		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		const fetchMessages = async () => {
			const { data /* count, error, status, statusText */ } = await supadb
				.from('Message')
				.select('*, Member(name)')
				.order('createdAt', { ascending: true });
			if (data) setMessages(data);
		};

		fetchMessages();
		const channel = supadb
			.channel('message-channel')
			.on(
				'postgres_changes',
				{
					event: '*', // INSERT, UPDATE, DELETE, *
					schema: 'public',
					table: 'Message',
				},
				payload => {
					if (payload.new) {
						const object = payload.new as MessageType;
						const newMessage: MessageType = {
							message: object.message,
							id: object.id,
							memberId: object.memberId,
							createdAt: new Date(object.createdAt),
							Member: object.Member,
						};
						setMessages(prev => (Array.isArray(prev) ? [...prev, newMessage] : [newMessage]));
					}
				},
			)
			.subscribe();
		// 새 멤버 추가 사용해제
		// const membersChannel = supadb
		// 	.channel('member-channel')
		// 	.on(
		// 		'postgres_changes',
		// 		{
		// 			event: '*', // INSERT, UPDATE, DELETE, *
		// 			schema: 'public',
		// 			table: 'Member',
		// 		},
		// 		payload => {
		// 			if (payload.new) {
		// 				const object = payload.new as MemberType;
		// 				const newMember: MemberType = {
		// 					id: object.id,
		// 					name: object.name,
		// 					wanted: object.wanted,
		// 					manittoId: object.manittoId,
		// 					manitto: object.manitto,
		// 				};
		// 				setMembers(prev => (Array.isArray(prev) ? [...prev, newMember] : [newMember]));
		// 			}
		// 		},
		// 	)
		// 	.subscribe();
		return () => {
			channel.unsubscribe();
			// membersChannel.unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (messageEndRef.current) {
			messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);
	const sendMessage = async () => {
		if (input && member && member.id.length > 0) {
			try {
				await supadb.from('Message').insert([{ id: createId(), memberId: member.id, message: input }]);
				setInput('');
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<div className="font-pretendard relative bg-sky-600 h-screen w-screen overflow-hidden flex flex-col gap-4">
			{/* <div className="absolute w-full h-full -z-10">
				<Image
					alt="background"
					src="https://images.unsplash.com/photo-1563714193017-5a5fb60bc02b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					objectFit={'cover'}
					fill
					className="opacity-70"
				/>
			</div> */}
			<Card className="absolute">
				<CardHeader className={cn(collapse && 'hidden')}>
					<CardTitle>마니또 참여자</CardTitle>
					<CardDescription>마니또 참여자</CardDescription>
				</CardHeader>
				<CardContent className={cn(collapse && 'hidden')}>
					<div className="flex flex-wrap gap-2">
						{members.map(member => (
							<Badge key={member.id} variant={!!member.manittoId ? 'default' : 'secondary'}>
								{member.name}
							</Badge>
						))}
					</div>
				</CardContent>
				<CardFooter>
					<Badge variant={'outline'} onClick={() => setCollapse(prev => !prev)}>
						{collapse ? <ChevronDown /> : <ChevronUp />}
					</Badge>
					<MyManitto />
				</CardFooter>
			</Card>
			<div className="pt-16 px-4 overflow-y-scroll" style={{ minHeight: `${viewportHeight}px` }}>
				{messages.map(msg => (
					<div key={msg.id} className="my-2">
						{member?.id !== msg.memberId ? (
							<MessageBox name={msg.Member?.name || ''} msg={msg} itsMe={false} />
						) : (
							<MessageBox name={msg.Member?.name || ''} msg={msg} itsMe={true} />
						)}
					</div>
				))}
				<div ref={messageEndRef} className="pb-12"></div>
			</div>
			<div className="fixed w-full bottom-0 flex gap-0.5">
				<input
					className="flex-1 rounded-lg px-2 py-0.5"
					value={input}
					onKeyDown={e => e.key === 'Enter' && buttonRef.current?.click()}
					onChange={e => setInput(e.target.value)}
					placeholder="메시지를 입력하세요"
				/>
				<Button ref={buttonRef} type="submit" className="w-32" onClick={sendMessage}>
					전송
				</Button>
			</div>
		</div>
	);
}
