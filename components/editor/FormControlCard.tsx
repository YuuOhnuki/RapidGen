import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface FormControlCardProps {
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
}

/**
 * 共通の背景とタイトルを持つ設定カードコンポーネント (Liquid Glass Style - シンプル版)
 */
export function FormControlCard({
    title,
    icon: Icon,
    children,
}: FormControlCardProps) {
    return (
        <Card
            className="
            bg-white/5 dark:bg-gray-800/5 // 透明度を下げ、背景とのコントラストを抑える
            backdrop-blur-xl 
            border border-white/10 dark:border-gray-700/10 // ボーダーの透明度を上げて目立たなくする
            shadow-lg shadow-black/5 // シャドウを控えめに
            text-white transition-all duration-300 hover:shadow-lg hover:shadow-fuchsia-500/10 // ホバーエフェクトも控えめに
        "
        >
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                    <div className="flex items-center gap-2 text-white">
                        {/* アイコンの色を統一し、シンプルに */}
                        <Icon size={20} className="text-fuchsia-300" />
                        {title}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}
