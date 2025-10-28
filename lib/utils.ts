import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSSのクラス名を安全に結合するユーティリティ関数
 * clsxとtailwind-mergeを組み合わせて重複するスタイルを適切に処理
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
