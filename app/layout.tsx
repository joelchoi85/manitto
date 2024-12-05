import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
/* 
const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
}); */

const pretendard = localFont({
	src: './fonts/PretendardVariable.woff2',
	variable: '--font-pretendard',
	display: 'swap',
});

export const metadata: Metadata = {
	title: '우리가족 마니또 게임',
	description: '룰루랄라 신나는 마니또',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			{/* <body className={`${pretendard.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}> */}
			<body className={`${pretendard.variable} antialiased`}>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
