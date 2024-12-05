import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formToObject(formData: FormData) {
	const object: { [key: string]: string | string[] } = {};
	for (const [key, value] of formData.entries()) {
		if (object[key]) {
			// 키가 이미 존재하면 배열로 변환
			if (Array.isArray(object[key])) {
				(object[key] as string[]).push(value as string);
			} else {
				object[key] = [object[key] as string, value as string];
			}
		} else {
			object[key] = value as string; // 새로운 키-값 쌍 추가
		}
	}
	return object;
}
