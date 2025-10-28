import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface FormControlCardProps {
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
}

/**
 * 設定グループをまとめるカードコンポーネント
 * アイコン付きのタイトルと統一された背景スタイルを提供
 */
export function FormControlCard({
    title,
    icon: Icon,
    children,
}: FormControlCardProps) {
    return (
        <Card
            className="
            bg-white/5 dark:bg-gray-800/5
            backdrop-blur-xl 
            border border-white/10 dark:border-gray-700/10
            shadow-lg shadow-black/5
            text-white transition-all duration-300 hover:shadow-lg hover:shadow-fuchsia-500/10
        "
        >
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                    <div className="flex items-center gap-2 text-white">
                        <Icon size={20} className="text-fuchsia-300" />
                        {title}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}
